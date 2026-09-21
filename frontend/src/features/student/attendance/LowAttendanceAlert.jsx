import { TriangleAlert } from 'lucide-react'
import { classesNeeded, isLowAttendance, LOW_ATTENDANCE_THRESHOLD } from '@/lib/academics'
import { formatPercent } from '@/lib/formatters'

/** Warns when overall or any subject's attendance is below the threshold, with a recovery target. */
export function LowAttendanceAlert({ attendance }) {
  const lowSubjects = attendance.subjects.filter((subject) => isLowAttendance(subject.percentage))
  const overallLow = isLowAttendance(attendance.percentage)
  if (!overallLow && lowSubjects.length === 0) return null

  return (
    <div role="alert" className="bg-warning-soft border-warning flex gap-3 rounded-xl border-l-4 p-4">
      <TriangleAlert className="text-warning-text mt-0.5 size-5 shrink-0" aria-hidden />
      <div className="text-sm">
        <p className="text-heading font-semibold">
          {overallLow
            ? `Your overall attendance is ${formatPercent(attendance.percentage)}, below the required ${LOW_ATTENDANCE_THRESHOLD}%.`
            : `Attendance is below ${LOW_ATTENDANCE_THRESHOLD}% in ${lowSubjects.length} ${lowSubjects.length === 1 ? 'subject' : 'subjects'}.`}
        </p>
        {lowSubjects.length > 0 && (
          <ul className="text-body mt-2 flex flex-col gap-1">
            {lowSubjects.map((subject) => (
              <li key={subject.code ?? subject.subject}>
                <span className="font-semibold">{subject.subject}</span>: {formatPercent(subject.percentage)}. Attend the next{' '}
                {classesNeeded(subject.attended, subject.conducted)} classes in a row to reach {LOW_ATTENDANCE_THRESHOLD}%.
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
