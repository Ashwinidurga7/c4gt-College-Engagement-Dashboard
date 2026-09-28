import { percentage } from '@/lib/academics'

/**
 * Derives subject-wise, monthly and overall totals from individual class records
 * (`{ date, subjectCode, subject, status }`), so every figure agrees with the records.
 */
export function summarizeAttendance(records) {
  const subjects = new Map()
  const months = new Map()

  records.forEach((record) => {
    const present = record.status === 'present' ? 1 : 0
    const subjectKey = record.subjectCode ?? record.subject
    const subject = subjects.get(subjectKey) ?? { code: record.subjectCode, subject: record.subject, conducted: 0, attended: 0 }
    subject.conducted += 1
    subject.attended += present
    subjects.set(subjectKey, subject)

    const monthKey = record.date.slice(0, 7)
    const month = months.get(monthKey) ?? { month: monthKey, conducted: 0, attended: 0 }
    month.conducted += 1
    month.attended += present
    months.set(monthKey, month)
  })

  const withPercent = (entry) => ({ ...entry, percentage: percentage(entry.attended, entry.conducted) })
  const subjectList = [...subjects.values()].map(withPercent)
  const conducted = subjectList.reduce((sum, entry) => sum + entry.conducted, 0)
  const attended = subjectList.reduce((sum, entry) => sum + entry.attended, 0)

  return {
    conducted,
    attended,
    absent: conducted - attended,
    percentage: percentage(attended, conducted),
    subjects: subjectList,
    monthly: [...months.values()].sort((a, b) => a.month.localeCompare(b.month)).map(withPercent),
  }
}

/**
 * Groups class records into working days, newest first. A day is present when every class was attended,
 * absent when none was, and partial otherwise.
 */
export function summarizeDays(records) {
  const days = new Map()
  records.forEach((record) => {
    const day = days.get(record.date) ?? { date: record.date, classes: 0, attended: 0 }
    day.classes += 1
    day.attended += record.status === 'present' ? 1 : 0
    days.set(record.date, day)
  })
  return [...days.values()]
    .map((day) => ({ ...day, status: day.attended === day.classes ? 'present' : day.attended === 0 ? 'absent' : 'partial' }))
    .sort((a, b) => b.date.localeCompare(a.date))
}

/** Working, present, absent and partial day counts for one month (`YYYY-MM`) of `summarizeDays` output. */
export function summarizeMonth(days, month) {
  const inMonth = days.filter((day) => day.date.startsWith(month))
  const count = (status) => inMonth.filter((day) => day.status === status).length
  return { days: inMonth, working: inMonth.length, present: count('present'), absent: count('absent'), partial: count('partial') }
}
