import { Briefcase, CalendarCheck, CalendarDays, GraduationCap, IndianRupee, PieChart, TriangleAlert, UserRound } from 'lucide-react'
import { gradeBands, summarizeStudents } from '@/lib/analytics'
import { formatCurrency, formatDate, formatNumber, formatPercent } from '@/lib/formatters'
import { eligibilityGaps } from '@/lib/placement'
import { queryStudents } from '@/lib/rosterQuery'

/** Every student matching the chosen branch, year, semester and CGPA filters. */
function filtered(students, filters) {
  const { department = '', year = '', semester = '', cgpaBand = '' } = filters
  return queryStudents(students, { filters: { department, year, semester, cgpaBand }, page: 1, pageSize: Math.max(students.length, 1) }).items
}

/** Groups students by the given fields, e.g. branch and year, with a summary for each group. */
function groupBy(students, fields) {
  const groups = new Map()
  students.forEach((student) => {
    const key = fields.map((field) => student[field]).join('|')
    groups.set(key, [...(groups.get(key) ?? []), student])
  })
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b, 'en-IN', { numeric: true }))
    .map(([key, members]) => ({ id: key, ...Object.fromEntries(fields.map((field) => [field, members[0][field]])), members, ...summarizeStudents(members) }))
}

const optionsOf = (values, label = (value) => value) => [...new Set(values.filter((value) => value != null && value !== ''))].sort((a, b) => String(a).localeCompare(String(b), 'en-IN', { numeric: true })).map((value) => ({ value: String(value), label: label(value) }))

/** Filter definitions; `options(source)` lists the values present in the data. */
const FILTERS = {
  department: { label: 'Branch', allLabel: 'All branches', options: ({ students }) => optionsOf(students.map((student) => student.department)) },
  year: { label: 'Year', allLabel: 'All years', options: ({ students }) => optionsOf(students.map((student) => student.year), (value) => `Year ${value}`) },
  semester: { label: 'Semester', allLabel: 'All semesters', options: ({ students }) => optionsOf(students.map((student) => student.semester), (value) => `Semester ${value}`) },
  cgpaBand: {
    label: 'CGPA',
    allLabel: 'Any CGPA',
    options: () => [
      { value: '9-', label: 'CGPA 9 and above' },
      { value: '8-9', label: 'CGPA 8 – 8.99' },
      { value: '7-8', label: 'CGPA 7 – 7.99' },
      { value: '6-7', label: 'CGPA 6 – 6.99' },
      { value: '-6', label: 'CGPA below 6' },
    ],
  },
  subject: {
    label: 'Subject',
    allLabel: 'All subjects',
    options: ({ students }) => optionsOf(students.flatMap((student) => student.backlogSubjects.map((subject) => subject.code))).map((option) => ({
      ...option,
      label: `${option.value} · ${students.flatMap((student) => student.backlogSubjects).find((subject) => subject.code === option.value)?.name ?? ''}`,
    })),
  },
  company: { label: 'Company', allLabel: 'All companies', options: ({ drives }) => drives.map((drive) => ({ value: drive.id, label: drive.company })) },
  graduationYear: { label: 'Graduation year', allLabel: 'All graduation years', options: ({ students }) => optionsOf(students.filter((student) => student.year >= 3).map((student) => student.graduationYear)) },
  event: { label: 'Event', allLabel: 'All events', options: ({ events }) => events.map((event) => ({ value: event.id, label: event.title })) },
}

export function filterDefinition(key) {
  return { key, ...FILTERS[key] }
}

/**
 * Report templates. `build(source, filters)` returns `{ summary, columns, rows }`: `summary` is a few headline
 * figures for the filtered data, and each column may carry `format` for display and `csv` for export.
 * `filters` lists the filter keys the report accepts; admin-only reports set `roles`.
 */
export const REPORTS = [
  {
    id: 'attendance',
    title: 'Attendance',
    description: 'Average attendance and students below 75% and 65%, by branch, year and section.',
    icon: CalendarCheck,
    filters: ['department', 'year', 'semester'],
    build: ({ students }, filters) => {
      const pool = filtered(students, filters)
      const overall = summarizeStudents(pool)
      return {
        summary: [
          { label: 'Students', value: formatNumber(overall.total) },
          { label: 'Average attendance', value: formatPercent(overall.averageAttendance) },
          { label: 'Below 75%', value: formatNumber(overall.lowAttendance) },
        ],
        columns: [
          { key: 'college', header: 'College' },
          { key: 'department', header: 'Branch' },
          { key: 'year', header: 'Year' },
          { key: 'section', header: 'Section' },
          { key: 'total', header: 'Students' },
          { key: 'averageAttendance', header: 'Average attendance', format: (row) => formatPercent(row.averageAttendance) },
          { key: 'lowAttendance', header: 'Below 75%' },
          { key: 'critical', header: 'Below 65%' },
        ],
        rows: groupBy(pool, ['college', 'department', 'year', 'section']).map((row) => ({ ...row, critical: row.members.filter((student) => student.attendancePercentage < 65).length })),
      }
    },
  },
  {
    id: 'low-attendance',
    title: 'Critical attendance list',
    description: 'Students below 65% attendance, lowest first, for counselling and parent contact.',
    icon: TriangleAlert,
    filters: ['department', 'year'],
    build: ({ students }, filters) => {
      const rows = filtered(students, filters)
        .filter((student) => student.attendancePercentage < 65)
        .sort((a, b) => a.attendancePercentage - b.attendancePercentage)
      return {
        summary: [{ label: 'Students below 65%', value: formatNumber(rows.length) }],
        columns: [
          { key: 'rollNumber', header: 'Roll number' },
          { key: 'name', header: 'Name' },
          { key: 'department', header: 'Branch', format: (row) => `${row.college} ${row.department}`, csv: (row) => `${row.college} ${row.department}` },
          { key: 'year', header: 'Year · Section', format: (row) => `${row.year} · ${row.section}`, csv: (row) => `${row.year}${row.section}` },
          { key: 'attendancePercentage', header: 'Attendance', format: (row) => formatPercent(row.attendancePercentage) },
        ],
        rows,
      }
    },
  },
  {
    id: 'academic-performance',
    title: 'Academic performance',
    description: 'Average CGPA, latest SGPA, distinctions and backlogs by branch and year.',
    icon: GraduationCap,
    filters: ['department', 'year', 'semester'],
    build: ({ students }, filters) => {
      const pool = filtered(students, filters).filter((student) => student.cgpa != null)
      const overall = summarizeStudents(pool)
      const latestSgpa = (members) => {
        const values = members.map((student) => student.sgpas.at(-1)).filter(Number.isFinite)
        return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null
      }
      return {
        summary: [
          { label: 'Students with results', value: formatNumber(overall.total) },
          { label: 'Average CGPA', value: overall.averageCgpa?.toFixed(2) ?? '—' },
          { label: 'With backlogs', value: formatNumber(overall.withBacklogs) },
        ],
        columns: [
          { key: 'college', header: 'College' },
          { key: 'department', header: 'Branch' },
          { key: 'year', header: 'Year' },
          { key: 'total', header: 'Students' },
          { key: 'averageCgpa', header: 'Average CGPA', format: (row) => row.averageCgpa?.toFixed(2) ?? '—' },
          { key: 'latestSgpa', header: 'Average latest SGPA', format: (row) => row.latestSgpa?.toFixed(2) ?? '—', csv: (row) => row.latestSgpa?.toFixed(2) },
          { key: 'distinction', header: 'CGPA 8 and above' },
          { key: 'withBacklogs', header: 'With backlogs' },
        ],
        rows: groupBy(pool, ['college', 'department', 'year']).map((row) => ({
          ...row,
          latestSgpa: latestSgpa(row.members),
          distinction: row.members.filter((student) => student.cgpa >= 8).length,
        })),
      }
    },
  },
  {
    id: 'backlogs',
    title: 'Backlog report',
    description: 'Every failed subject by student, active and cleared, by branch, year and subject.',
    icon: TriangleAlert,
    filters: ['department', 'year', 'subject'],
    build: ({ students }, filters) => {
      const rows = filtered(students, filters)
        .flatMap((student) => student.backlogSubjects.map((subject) => ({ ...subject, student })))
        .filter((row) => !filters.subject || row.code === filters.subject)
        .sort((a, b) => (a.status === b.status ? a.student.rollNumber.localeCompare(b.student.rollNumber) : a.status === 'active' ? -1 : 1))
        .map(({ student, ...subject }) => ({
          id: `${student.rollNumber}-${subject.code}`,
          rollNumber: student.rollNumber,
          studentName: student.name,
          department: student.department,
          year: student.year,
          code: subject.code,
          subject: subject.name,
          semester: subject.semester,
          status: subject.status,
          clearedOn: subject.clearedOn,
        }))
      const active = rows.filter((row) => row.status === 'active')
      return {
        summary: [
          { label: 'Active backlogs', value: formatNumber(active.length) },
          { label: 'Students with active backlogs', value: formatNumber(new Set(active.map((row) => row.rollNumber)).size) },
          { label: 'Cleared', value: formatNumber(rows.length - active.length) },
        ],
        columns: [
          { key: 'rollNumber', header: 'Roll number' },
          { key: 'studentName', header: 'Name' },
          { key: 'department', header: 'Branch' },
          { key: 'year', header: 'Year' },
          { key: 'code', header: 'Subject code' },
          { key: 'subject', header: 'Subject' },
          { key: 'semester', header: 'Semester' },
          { key: 'status', header: 'Status', format: (row) => (row.status === 'active' ? 'Active' : 'Cleared'), csv: (row) => (row.status === 'active' ? 'Active' : 'Cleared') },
          { key: 'clearedOn', header: 'Cleared on', format: (row) => (row.clearedOn ? formatDate(row.clearedOn) : '—') },
        ],
        rows,
      }
    },
  },
  {
    id: 'grade-distribution',
    title: 'Grade distribution',
    description: 'Students in each CGPA band, by branch, year and semester.',
    icon: PieChart,
    filters: ['department', 'year', 'semester'],
    build: ({ students }, filters) => {
      const bands = gradeBands(filtered(students, filters))
      const total = bands.reduce((sum, band) => sum + band.count, 0)
      return {
        summary: [{ label: 'Students with results', value: formatNumber(total) }],
        columns: [
          { key: 'label', header: 'CGPA band' },
          { key: 'grade', header: 'Grade' },
          { key: 'count', header: 'Students' },
          { key: 'share', header: 'Share', format: (row) => formatPercent(row.share), csv: (row) => row.share },
        ],
        rows: bands.map((band) => ({ ...band, id: band.key, share: total ? Math.round((band.count / total) * 1000) / 10 : 0 })),
      }
    },
  },
  {
    id: 'placements',
    title: 'Placement report',
    description: 'Eligible, applied, shortlisted and selected students for each company, by branch and graduation year.',
    icon: Briefcase,
    filters: ['company', 'department', 'graduationYear'],
    build: ({ students, drives }, filters) => {
      const pool = students.filter(
        (student) =>
          student.year >= 3 &&
          (!filters.department || student.department === filters.department) &&
          (!filters.graduationYear || student.graduationYear === Number(filters.graduationYear)),
      )
      const rows = drives
        .filter((drive) => !filters.company || drive.id === filters.company)
        .flatMap((drive) =>
          [...new Set(pool.map((student) => student.department))].sort().map((department) => {
            const members = pool.filter((student) => student.department === department && student.college === drive.college)
            const status = (value) => members.filter((student) => drive.applications[student.rollNumber] === value).length
            return {
              id: `${drive.id}-${department}`,
              company: drive.company,
              college: drive.college,
              department,
              eligible: members.filter((student) => eligibilityGaps(student, drive.criteria).length === 0).length,
              applied: members.filter((student) => drive.applications[student.rollNumber]).length,
              shortlisted: status('shortlisted'),
              selected: status('selected'),
            }
          }),
        )
        .filter((row) => row.eligible || row.applied)
      const sum = (key) => rows.reduce((total, row) => total + row[key], 0)
      return {
        summary: [
          { label: 'Applications', value: formatNumber(sum('applied')) },
          { label: 'Shortlisted', value: formatNumber(sum('shortlisted')) },
          { label: 'Selected', value: formatNumber(sum('selected')) },
        ],
        columns: [
          { key: 'company', header: 'Company' },
          { key: 'college', header: 'College' },
          { key: 'department', header: 'Branch' },
          { key: 'eligible', header: 'Eligible' },
          { key: 'applied', header: 'Applied' },
          { key: 'shortlisted', header: 'Shortlisted' },
          { key: 'selected', header: 'Selected' },
        ],
        rows,
      }
    },
  },
  {
    id: 'student-performance',
    title: 'Student performance',
    description: 'Each student’s CGPA, attendance and backlogs, highest CGPA first.',
    icon: UserRound,
    filters: ['department', 'year', 'cgpaBand'],
    build: ({ students }, filters) => {
      const rows = filtered(students, filters)
        .filter((student) => student.cgpa != null)
        .sort((a, b) => b.cgpa - a.cgpa)
      const overall = summarizeStudents(rows)
      return {
        summary: [
          { label: 'Students', value: formatNumber(overall.total) },
          { label: 'Average CGPA', value: overall.averageCgpa?.toFixed(2) ?? '—' },
          { label: 'Average attendance', value: formatPercent(overall.averageAttendance) },
        ],
        columns: [
          { key: 'rollNumber', header: 'Roll number' },
          { key: 'name', header: 'Name' },
          { key: 'department', header: 'Branch' },
          { key: 'year', header: 'Year · Section', format: (row) => `${row.year} · ${row.section}`, csv: (row) => `${row.year}${row.section}` },
          { key: 'cgpa', header: 'CGPA', format: (row) => row.cgpa.toFixed(2) },
          { key: 'attendancePercentage', header: 'Attendance', format: (row) => formatPercent(row.attendancePercentage) },
          { key: 'backlogs', header: 'Active backlogs' },
        ],
        rows,
      }
    },
  },
  {
    id: 'event-participation',
    title: 'Event participation',
    description: 'Registrations and attendance for each event, by department and year.',
    icon: CalendarDays,
    filters: ['event', 'department', 'year'],
    build: ({ students, events, participation }, filters) => {
      const byRoll = new Map(filtered(students, filters).map((student) => [student.rollNumber, student]))
      const groups = new Map()
      participation
        .filter((entry) => byRoll.has(entry.rollNumber) && (!filters.event || entry.eventId === filters.event))
        .forEach((entry) => {
          const student = byRoll.get(entry.rollNumber)
          const key = `${entry.eventId}|${student.department}|${student.year}`
          const group = groups.get(key) ?? { id: key, event: events.find((event) => event.id === entry.eventId), department: student.department, year: student.year, registered: 0, attended: 0, upcoming: 0 }
          group.registered += 1
          group.attended += entry.attended ? 1 : 0
          // Attendance is null until the event has happened.
          group.upcoming += entry.attended === null ? 1 : 0
          groups.set(key, group)
        })
      const rows = [...groups.values()].sort((a, b) => b.event.date.localeCompare(a.event.date) || a.department.localeCompare(b.department) || a.year - b.year)
      return {
        summary: [
          { label: 'Registrations', value: formatNumber(rows.reduce((sum, row) => sum + row.registered, 0)) },
          { label: 'Attended', value: formatNumber(rows.reduce((sum, row) => sum + row.attended, 0)) },
          { label: 'Events', value: formatNumber(new Set(rows.map((row) => row.event.id)).size) },
        ],
        columns: [
          { key: 'event', header: 'Event', format: (row) => row.event.title, csv: (row) => row.event.title },
          { key: 'date', header: 'Date', format: (row) => formatDate(row.event.date), csv: (row) => row.event.date },
          { key: 'category', header: 'Category', format: (row) => row.event.category, csv: (row) => row.event.category },
          { key: 'department', header: 'Department' },
          { key: 'year', header: 'Year' },
          { key: 'registered', header: 'Registered' },
          { key: 'attended', header: 'Attended', format: (row) => (row.upcoming === row.registered ? 'Upcoming' : row.attended), csv: (row) => (row.upcoming === row.registered ? '' : row.attended) },
        ],
        rows,
      }
    },
  },
  {
    id: 'fee-collection',
    title: 'Fee collection',
    description: 'Semester tuition billed, collected, pending and overdue by college.',
    icon: IndianRupee,
    roles: ['admin'],
    filters: [],
    build: ({ payments }) => {
      const rows = ['KIET', 'KIET+', 'KIEW'].map((college) => {
        const own = payments.filter((payment) => payment.college === college)
        const sum = (status) => own.filter((payment) => !status || payment.status === status).reduce((total, payment) => total + payment.amount, 0)
        return { id: college, college, billed: sum(), collected: sum('paid'), pending: sum('pending'), overdue: sum('overdue') }
      })
      return {
        summary: [
          { label: 'Billed', value: formatCurrency(rows.reduce((sum, row) => sum + row.billed, 0)) },
          { label: 'Collected', value: formatCurrency(rows.reduce((sum, row) => sum + row.collected, 0)) },
        ],
        columns: ['billed', 'collected', 'pending', 'overdue'].reduce(
          (columns, key) => [...columns, { key, header: key[0].toUpperCase() + key.slice(1), format: (row) => formatCurrency(row[key]) }],
          [{ key: 'college', header: 'College' }],
        ),
        rows,
      }
    },
  },
]
