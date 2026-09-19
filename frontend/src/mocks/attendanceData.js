import { isoDate, seededRandom } from '@/mocks/seededRandom'

/** Weekly schedule (0 = Sunday) and absence likelihood for each theory course. */
const SCHEDULE = [
  { code: 'CS501', subject: 'AI & ML', days: [1, 3, 5], absence: 0.12 },
  { code: 'CS502', subject: 'DBMS', days: [1, 2, 4], absence: 0.15 },
  { code: 'CS503', subject: 'Web Development', days: [2, 4, 6], absence: 0.17 },
  { code: 'CS504', subject: 'Data Science', days: [3, 5], absence: 0.19 },
  { code: 'MA501', subject: 'Mathematics', days: [2, 6], absence: 0.3 },
]

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
    SCHEDULE.forEach((course) => {
      if (!course.days.includes(day.getUTCDay())) return
      records.push({
        date,
        subjectCode: course.code,
        subject: course.subject,
        status: random() < course.absence ? 'absent' : 'present',
      })
    })
  }
  return records.reverse()
}

/** Every class held this semester, newest first. All attendance totals are derived from this list. */
export const attendanceRecords = buildRecords()

export const attendanceSubjects = SCHEDULE.map(({ code, subject }) => ({ code, subject }))
