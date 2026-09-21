/** Attendance below this percentage is flagged. */
export const LOW_ATTENDANCE_THRESHOLD = 75

export function percentage(part, whole) {
  return whole > 0 ? Math.round((part / whole) * 1000) / 10 : 0
}

export function isLowAttendance(value) {
  return Number(value) < LOW_ATTENDANCE_THRESHOLD
}

/** Classes still to attend in a row to reach the threshold. */
export function classesNeeded(attended, conducted, threshold = LOW_ATTENDANCE_THRESHOLD) {
  const ratio = threshold / 100
  if (conducted === 0 || attended / conducted >= ratio) return 0
  return Math.ceil((ratio * conducted - attended) / (1 - ratio))
}

/** R23-style grading: total marks out of 100 to letter grade and grade points. */
const GRADE_SCALE = [
  { min: 90, grade: 'O', points: 10 },
  { min: 80, grade: 'A+', points: 9 },
  { min: 70, grade: 'A', points: 8 },
  { min: 60, grade: 'B+', points: 7 },
  { min: 50, grade: 'B', points: 6 },
  { min: 40, grade: 'C', points: 5 },
  { min: 0, grade: 'F', points: 0 },
]

export function gradeFor(total) {
  return GRADE_SCALE.find((step) => total >= step.min)
}

/** Credit-weighted grade point average, rounded to two decimals. */
export function weightedAverage(courses) {
  const credits = courses.reduce((sum, course) => sum + course.credits, 0)
  if (credits === 0) return 0
  const points = courses.reduce((sum, course) => sum + course.credits * course.gradePoints, 0)
  return Math.round((points / credits) * 100) / 100
}

export function semesterLabel(semester) {
  const suffix = ['th', 'st', 'nd', 'rd'][semester] ?? 'th'
  return `${semester}${suffix} semester`
}
