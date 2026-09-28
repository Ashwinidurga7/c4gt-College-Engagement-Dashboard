import { academicYearStart } from '@/lib/colleges'

export const APPLICATION_STATUSES = ['not-applied', 'applied', 'shortlisted', 'selected', 'rejected']

/** A student in year 1 of a four-year programme this academic year graduates four summers later. */
export function graduationYear(student, currentStart = academicYearStart()) {
  return student.year ? currentStart + 5 - student.year : null
}

/** Roster student plus the fields placement screens rank and filter on. */
export function withPlacementFields(student) {
  return {
    ...student,
    graduationYear: graduationYear(student),
    clearedBacklogs: (student.backlogSubjects ?? []).filter((subject) => subject.status === 'cleared').length,
    recordsVerified: student.recordsVerified !== false,
    resumeSubmitted: Boolean(student.resumeSubmitted),
  }
}

/**
 * Why a student does not meet a company's criteria; an empty list means eligible.
 * Zero active backlogs alone never makes a student eligible: every configured rule is checked.
 */
export function eligibilityGaps(student, criteria) {
  const gaps = []
  if (!student.recordsVerified) gaps.push('Academic records not verified')
  if (criteria.branches?.length && !criteria.branches.includes(student.department)) gaps.push(`${student.department} not eligible`)
  if (criteria.graduationYear && student.graduationYear !== Number(criteria.graduationYear)) gaps.push(`Graduates in ${student.graduationYear}`)
  if (criteria.minCgpa && !(student.cgpa >= Number(criteria.minCgpa))) gaps.push(`CGPA below ${criteria.minCgpa}`)
  if (student.backlogs > Number(criteria.maxActiveBacklogs ?? 0)) gaps.push(`${student.backlogs} active ${student.backlogs === 1 ? 'backlog' : 'backlogs'}`)
  if (!criteria.allowClearedBacklogs && student.clearedBacklogs > 0) gaps.push('Has cleared backlogs')
  if (criteria.minAttendance && student.attendancePercentage < Number(criteria.minAttendance)) gaps.push(`Attendance below ${criteria.minAttendance}%`)
  return gaps
}
