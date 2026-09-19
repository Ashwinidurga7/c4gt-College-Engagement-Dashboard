import { percentage } from '@/lib/academics'
import { attendanceBands, gradeBands, sgpaTrend, subjectAverages, summarizeStudents, topBy } from '@/lib/analytics'
import { nameOf, pick, toId, toList, toNumber } from '@/services/adapterUtils'

export function toRosterStudent(raw = {}) {
  const user = raw.user ?? {}
  const subjects = toList(raw.subjects).map((subject) => {
    const conducted = toNumber(pick(subject.conducted, subject.total), 0)
    const attended = toNumber(pick(subject.attended, subject.present), 0)
    return { code: subject.code ?? null, subject: pick(subject.subject, subject.name, 'Subject'), conducted, attended, percentage: toNumber(subject.percentage, percentage(attended, conducted)) }
  })
  return {
    id: toId(raw, user._id),
    name: pick(raw.name, user.name, 'Student'),
    rollNumber: pick(raw.rollNumber, raw.rollNo, raw.registrationNumber),
    email: pick(raw.email, user.email),
    college: raw.college ?? null,
    department: raw.department ?? null,
    year: toNumber(raw.year),
    section: raw.section ?? null,
    semester: toNumber(pick(raw.semester, raw.currentSemester)),
    attendancePercentage: toNumber(pick(raw.attendancePercentage, raw.attendance?.percentage, raw.attendance)),
    cgpa: toNumber(pick(raw.cgpa, raw.CGPA)),
    sgpas: toList(raw.sgpas).map((value) => toNumber(value)),
    backlogs: toNumber(raw.backlogs, 0),
    subjects,
  }
}

export function toFacultyProfile(raw = {}) {
  const source = raw.faculty ?? raw
  const user = source.user ?? {}
  return {
    id: toId(source, user._id),
    name: pick(source.name, user.name, 'Faculty member'),
    email: pick(source.email, user.email),
    department: pick(source.department, user.department),
    college: pick(source.college, user.college),
    designation: source.designation ?? null,
    employeeId: pick(source.employeeId, source.facultyId),
    assignedYears: toList(source.assignedYears).map((value) => toNumber(value)).filter(Boolean),
    joinedOn: source.joinedOn ?? null,
  }
}

function toBandCounts(rawBands, fallback) {
  if (!Array.isArray(rawBands) || rawBands.length === 0) return fallback
  return fallback.map((band) => {
    const match = rawBands.find((entry) => entry.key === band.key || entry.label === band.label)
    return { ...band, count: toNumber(match?.count, band.count) }
  })
}

/**
 * Class/department analytics. Summary figures from the API win; anything missing is derived
 * from the student list so the page still works with a thinner response.
 */
export function toCohortAnalytics(raw = {}) {
  const students = toList(pick(raw.students, raw.roster)).map(toRosterStudent)
  const derived = summarizeStudents(students)
  const summary = raw.summary ?? raw
  return {
    section: raw.section ?? null,
    summary: {
      total: toNumber(pick(summary.total, summary.totalStudents), derived.total),
      averageAttendance: toNumber(pick(summary.averageAttendance, summary.avgAttendance), derived.averageAttendance),
      averageCgpa: toNumber(pick(summary.averageCgpa, summary.avgCgpa), derived.averageCgpa),
      lowAttendance: toNumber(pick(summary.lowAttendance, summary.lowAttendanceCount), derived.lowAttendance),
      withBacklogs: toNumber(summary.withBacklogs, derived.withBacklogs),
    },
    attendanceBands: toBandCounts(raw.attendanceBands, attendanceBands(students)),
    gradeBands: toBandCounts(raw.gradeBands, gradeBands(students)),
    subjects: raw.subjects?.length
      ? raw.subjects.map((entry) => ({ subject: pick(entry.subject, entry.name), percentage: toNumber(entry.percentage, 0) }))
      : subjectAverages(students),
    sgpaTrend: raw.sgpaTrend?.length ? raw.sgpaTrend.map((entry) => ({ semester: toNumber(entry.semester), sgpa: toNumber(entry.sgpa) })) : sgpaTrend(students),
    lowAttendanceStudents: raw.lowAttendanceStudents
      ? toList(raw.lowAttendanceStudents).map(toRosterStudent)
      : topBy(students, 'attendancePercentage', 5, 'asc').filter((student) => student.attendancePercentage < 75),
    topPerformers: raw.topPerformers ? toList(raw.topPerformers).map(toRosterStudent) : topBy(students, 'cgpa', 5),
    students,
    coordinator: nameOf(raw.ctpo ?? raw.coordinator),
  }
}
