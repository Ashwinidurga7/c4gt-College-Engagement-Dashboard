import { LOW_ATTENDANCE_THRESHOLD, percentage } from '@/lib/academics'

/** Attendance bands used by CTPO/HOD charts; the 75% line splits "at risk" from "on track". */
export const ATTENDANCE_BANDS = [
  { key: 'critical', label: 'Below 65%', min: 0, max: 65, tone: 'danger' },
  { key: 'low', label: '65–75%', min: 65, max: LOW_ATTENDANCE_THRESHOLD, tone: 'warning' },
  { key: 'good', label: '75–85%', min: LOW_ATTENDANCE_THRESHOLD, max: 85, tone: 'primary' },
  { key: 'excellent', label: '85% and above', min: 85, max: 101, tone: 'success' },
]

/** CGPA bands aligned with the grade scale (O, A+, A, B+, B and below). */
export const GRADE_BANDS = [
  { key: 'o', label: '9 and above', grade: 'O', min: 9, max: 11 },
  { key: 'aplus', label: '8 – 8.99', grade: 'A+', min: 8, max: 9 },
  { key: 'a', label: '7 – 7.99', grade: 'A', min: 7, max: 8 },
  { key: 'bplus', label: '6 – 6.99', grade: 'B+', min: 6, max: 7 },
  { key: 'below', label: 'Below 6', grade: 'B and below', min: 0, max: 6 },
]

function average(values) {
  const list = values.filter((value) => Number.isFinite(value))
  return list.length ? Math.round((list.reduce((sum, value) => sum + value, 0) / list.length) * 100) / 100 : null
}

export function attendanceBands(students) {
  return ATTENDANCE_BANDS.map((band) => ({
    ...band,
    count: students.filter((student) => student.attendancePercentage >= band.min && student.attendancePercentage < band.max).length,
  }))
}

export function gradeBands(students) {
  const graded = students.filter((student) => Number.isFinite(student.cgpa))
  return GRADE_BANDS.map((band) => ({
    ...band,
    count: graded.filter((student) => student.cgpa >= band.min && student.cgpa < band.max).length,
  }))
}

export function summarizeStudents(students) {
  return {
    total: students.length,
    averageAttendance: average(students.map((student) => student.attendancePercentage)),
    averageCgpa: average(students.map((student) => student.cgpa)),
    lowAttendance: students.filter((student) => student.attendancePercentage < LOW_ATTENDANCE_THRESHOLD).length,
    withBacklogs: students.filter((student) => student.backlogs > 0).length,
  }
}

/** Mean attendance per subject across students that carry subject-level data. */
export function subjectAverages(students) {
  const totals = new Map()
  students.forEach((student) =>
    (student.subjects ?? []).forEach((subject) => {
      const entry = totals.get(subject.subject) ?? { subject: subject.subject, code: subject.code, conducted: 0, attended: 0 }
      entry.conducted += subject.conducted
      entry.attended += subject.attended
      totals.set(subject.subject, entry)
    }),
  )
  return [...totals.values()].map((entry) => ({ ...entry, percentage: percentage(entry.attended, entry.conducted) }))
}

/** Average SGPA for each completed semester. */
export function sgpaTrend(students) {
  const longest = Math.max(0, ...students.map((student) => student.sgpas?.length ?? 0))
  return Array.from({ length: longest }, (_, index) => ({
    semester: index + 1,
    sgpa: average(students.map((student) => student.sgpas?.[index])),
  }))
}

export function topBy(students, key, count = 5, direction = 'desc') {
  const factor = direction === 'desc' ? -1 : 1
  return [...students].filter((student) => Number.isFinite(student[key])).sort((a, b) => (a[key] - b[key]) * factor).slice(0, count)
}
