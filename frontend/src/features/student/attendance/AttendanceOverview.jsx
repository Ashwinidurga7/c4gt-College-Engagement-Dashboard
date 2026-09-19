import { CalendarDays, UserRoundCheck, UserRoundX } from 'lucide-react'
import { ProgressRing } from '@/components/common/ProgressRing'
import { isLowAttendance } from '@/lib/academics'
import { formatNumber, formatPercent } from '@/lib/formatters'
import { TONE_CLASSES } from '@/lib/tones'
import { cn } from '@/lib/utils'

function Tile({ icon: Icon, label, value, tone }) {
  return (
    <div className="bg-card flex items-center gap-3 rounded-lg border p-4">
      <span className={cn('flex size-11 shrink-0 items-center justify-center rounded-full', TONE_CLASSES[tone])}>
        <Icon className="size-5" strokeWidth={1.75} aria-hidden />
      </span>
      <div>
        <p className="text-heading text-2xl font-bold tabular-nums">{value}</p>
        <p className="text-muted-foreground text-sm">{label}</p>
      </div>
    </div>
  )
}

export function AttendanceOverview({ attendance }) {
  const low = isLowAttendance(attendance.percentage)

  return (
    <section aria-label="Attendance overview" className="bg-card shadow-soft rounded-xl border">
      <div className="bg-info-soft rounded-t-xl border-b px-5 py-4">
        <h2 className="text-lg font-semibold">Attendance overview</h2>
        <p className="text-muted-foreground text-sm">All theory classes held this semester.</p>
      </div>
      <div className="grid gap-4 p-5 xl:grid-cols-[auto_1fr] xl:items-center">
        <div className="flex items-center gap-4">
          <ProgressRing value={attendance.percentage} warn={low} size={112} label={`Overall attendance ${formatPercent(attendance.percentage)}`}>
            <span className="text-heading text-xl font-bold">{formatPercent(attendance.percentage)}</span>
          </ProgressRing>
          <div>
            <p className="text-heading font-semibold">Overall attendance</p>
            <p className="text-muted-foreground text-sm">{low ? 'Below the 75% requirement' : 'Meets the 75% requirement'}</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Tile icon={UserRoundCheck} label="Present" value={formatNumber(attendance.attended)} tone="green" />
          <Tile icon={UserRoundX} label="Absent" value={formatNumber(attendance.conducted - attendance.attended)} tone="red" />
          <Tile icon={CalendarDays} label="Classes held" value={formatNumber(attendance.conducted)} tone="blue" />
        </div>
      </div>
    </section>
  )
}
