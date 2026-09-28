import { summarizeDays } from '@/lib/attendanceSummary'
import { attendanceRecords } from '@/mocks/attendanceData'
import { rosterStudents } from '@/mocks/rosterData'
import { hashString, seededRandom } from '@/mocks/seededRandom'
import { studentProfile } from '@/mocks/studentProfileData'

const SEMESTER_START = '2026-07-01'
/** Attendance before this date is already on record; later days are still to be taken. */
const RECORDED_UNTIL = '2026-09-18'
const HOLIDAYS = new Set(['2026-08-15', '2026-09-14'])

/** Days the demo student missed, so her own attendance page and the faculty register agree. */
const demoAbsences = new Set(summarizeDays(attendanceRecords).filter((day) => day.status !== 'present').map((day) => day.date))

/** Faculty member who took each seeded day, by weekday (Monday first). */
const TAKEN_BY = ['Dr. P. Venkata Rao', 'Mrs. K. Lakshmi', 'Mr. S. Ravi Kumar', 'Dr. P. Venkata Rao', 'Mrs. K. Lakshmi', 'Mr. S. Ravi Kumar']

export function sectionKey({ college, department, year, section }) {
  return `${college}|${department}|${year}|${section}`
}

export function sectionStudents({ college, department, year, section }) {
  return rosterStudents
    .filter((student) => student.college === college && student.department === department && student.year === Number(year) && student.section === section)
    .sort((a, b) => a.rollNumber.localeCompare(b.rollNumber))
}

export function isWorkingDay(date) {
  return new Date(`${date}T00:00:00Z`).getUTCDay() !== 0 && !HOLIDAYS.has(date)
}

/**
 * The register for a section on a past working day, as if a faculty member had taken it.
 * Each student is absent with a chance that matches their attendance percentage.
 */
export function seededDay(section, date) {
  if (date < SEMESTER_START || date > RECORDED_UNTIL || !isWorkingDay(date)) return null
  const students = sectionStudents(section)
  if (students.length === 0) return null
  const random = seededRandom(hashString(`${sectionKey(section)}|${date}`))
  const absentees = students
    .filter((student) => {
      const roll = random()
      if (student.rollNumber === studentProfile.rollNumber) return demoAbsences.has(date)
      return roll > (student.attendancePercentage ?? 85) / 100
    })
    .map((student) => student.rollNumber)
  const weekday = (new Date(`${date}T00:00:00Z`).getUTCDay() + 6) % 7
  return { ...section, date, absentees, takenBy: TAKEN_BY[weekday], submittedAt: `${date}T16:30:00+05:30` }
}

/** Every working day of a month (`YYYY-MM`) up to `until`, oldest first. */
export function workingDaysIn(month, until) {
  const [year, monthIndex] = month.split('-').map(Number)
  const days = []
  for (let day = new Date(Date.UTC(year, monthIndex - 1, 1)); day.getUTCMonth() === monthIndex - 1; day.setUTCDate(day.getUTCDate() + 1)) {
    const date = day.toISOString().slice(0, 10)
    if (date > until) break
    if (date >= SEMESTER_START && isWorkingDay(date)) days.push(date)
  }
  return days
}
