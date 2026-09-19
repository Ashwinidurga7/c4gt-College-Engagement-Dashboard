import { CalendarCheck, GraduationCap, IndianRupee, TriangleAlert } from 'lucide-react'
import { summarizeStudents } from '@/lib/analytics'
import { formatCurrency, formatPercent } from '@/lib/formatters'

function byDepartment(students) {
  const groups = new Map()
  students.forEach((student) => {
    const key = `${student.college}|${student.department}`
    groups.set(key, [...(groups.get(key) ?? []), student])
  })
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, members]) => {
    const [college, department] = key.split('|')
    return { id: key, college, department, members, ...summarizeStudents(members) }
  })
}

/**
 * Report templates. `build(source)` returns `{ columns, rows }`; each column may carry
 * `format` for display and `csv` for export. Admin-only reports set `roles`.
 */
export const REPORTS = [
  {
    id: 'attendance-summary',
    title: 'Attendance summary',
    description: 'Average attendance and students below 75% for each department.',
    icon: CalendarCheck,
    build: ({ students }) => ({
      columns: [
        { key: 'college', header: 'College' },
        { key: 'department', header: 'Department' },
        { key: 'total', header: 'Students' },
        { key: 'averageAttendance', header: 'Average attendance', format: (row) => formatPercent(row.averageAttendance) },
        { key: 'lowAttendance', header: 'Below 75%' },
      ],
      rows: byDepartment(students),
    }),
  },
  {
    id: 'low-attendance',
    title: 'Critical attendance list',
    description: 'Students below 65% attendance, lowest first, for counselling and parent contact.',
    icon: TriangleAlert,
    build: ({ students }) => ({
      columns: [
        { key: 'rollNumber', header: 'Roll number' },
        { key: 'name', header: 'Name' },
        { key: 'department', header: 'Department', format: (row) => `${row.college} ${row.department}`, csv: (row) => `${row.college} ${row.department}` },
        { key: 'year', header: 'Year · Section', format: (row) => `${row.year} · ${row.section}`, csv: (row) => `${row.year}${row.section}` },
        { key: 'attendancePercentage', header: 'Attendance', format: (row) => formatPercent(row.attendancePercentage) },
      ],
      rows: students.filter((student) => student.attendancePercentage < 65).sort((a, b) => a.attendancePercentage - b.attendancePercentage),
    }),
  },
  {
    id: 'results-analysis',
    title: 'Results analysis',
    description: 'Average CGPA, distinction counts and backlogs by department.',
    icon: GraduationCap,
    build: ({ students }) => ({
      columns: [
        { key: 'college', header: 'College' },
        { key: 'department', header: 'Department' },
        { key: 'averageCgpa', header: 'Average CGPA', format: (row) => row.averageCgpa?.toFixed(2) ?? '—' },
        { key: 'distinction', header: 'CGPA 8 and above' },
        { key: 'withBacklogs', header: 'Students with backlogs' },
      ],
      rows: byDepartment(students).map((row) => ({ ...row, distinction: row.members.filter((student) => student.cgpa >= 8).length })),
    }),
  },
  {
    id: 'fee-collection',
    title: 'Fee collection',
    description: 'Semester tuition billed, collected, pending and overdue by college.',
    icon: IndianRupee,
    roles: ['admin'],
    build: ({ payments }) => ({
      columns: ['billed', 'collected', 'pending', 'overdue'].reduce(
        (columns, key) => [...columns, { key, header: key[0].toUpperCase() + key.slice(1), format: (row) => formatCurrency(row[key]) }],
        [{ key: 'college', header: 'College' }],
      ),
      rows: ['KIET', 'KIET+', 'KIEW'].map((college) => {
        const own = payments.filter((payment) => payment.college === college)
        const sum = (status) => own.filter((payment) => !status || payment.status === status).reduce((total, payment) => total + payment.amount, 0)
        return { id: college, college, billed: sum(), collected: sum('paid'), pending: sum('pending'), overdue: sum('overdue') }
      }),
    }),
  },
]
