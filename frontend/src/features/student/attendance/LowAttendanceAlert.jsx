import { TriangleAlert } from 'lucide-react'
import { classesNeeded, isLowAttendance, LOW_ATTENDANCE_THRESHOLD } from '@/lib/academics'
import { formatPercent } from '@/lib/formatters'

/** Warns when overall attendance is below the threshold, with a recovery target. */
export function LowAttendanceAlert({ attendance }) {
  if (!isLowAttendance(attendance.percentage)) return null

  return (
    <div role="alert" className="bg-warning-soft border-warning flex gap-3 rounded-xl border-l-4 p-4">
      <TriangleAlert className="text-warning-text mt-0.5 size-5 shrink-0" aria-hidden />
      <p className="text-heading text-sm font-semibold">
        Your overall attendance is {formatPercent(attendance.percentage)}, below the required {LOW_ATTENDANCE_THRESHOLD}%. Attend the next{' '}
        {classesNeeded(attendance.attended, attendance.conducted)} classes in a row to reach {LOW_ATTENDANCE_THRESHOLD}%.
      </p>
    </div>
  )
}
