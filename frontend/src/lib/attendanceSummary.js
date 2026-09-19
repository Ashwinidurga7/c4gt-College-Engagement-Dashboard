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
