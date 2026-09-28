import { isoDate, seededRandom } from '@/mocks/seededRandom'

/** Weekly schedule (0 = Sunday) for each theory course. */
const SCHEDULE = [
  { code: 'CS501', subject: 'AI & ML', days: [1, 3, 5] },
  { code: 'CS502', subject: 'DBMS', days: [1, 2, 4] },
  { code: 'CS503', subject: 'Web Development', days: [2, 4, 6] },
  { code: 'CS504', subject: 'Data Science', days: [3, 5] },
  { code: 'MA501', subject: 'Mathematics', days: [2, 6] },
]

/** Attendance is taken for the whole day, so a student is present or absent for every class that day. */
const DAY_ABSENCE = 0.14

const SEMESTER_START = '2026-07-01'
const LAST_CLASS_DAY = '2026-09-18'
const HOLIDAYS = new Set(['2026-08-15', '2026-09-14'])

function buildRecords() {
  const random = seededRandom(2026)
  const records = []
  const end = new Date(`${LAST_CLASS_DAY}T00:00:00Z`)
  for (let day = new Date(`${SEMESTER_START}T00:00:00Z`); day <= end; day.setUTCDate(day.getUTCDate() + 1)) {
    const date = isoDate(day)
    if (day.getUTCDay() === 0 || HOLIDAYS.has(date)) continue
    const status = random() < DAY_ABSENCE ? 'absent' : 'present'
    SCHEDULE.forEach((course) => {
      if (!course.days.includes(day.getUTCDay())) return
      records.push({ date, subjectCode: course.code, subject: course.subject, status })
    })
  }
  return records.reverse()
}

/** Every class held this semester, newest first. All attendance totals are derived from this list. */
export const attendanceRecords = buildRecords()
