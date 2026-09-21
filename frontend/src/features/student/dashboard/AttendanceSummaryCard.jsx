import { CalendarCheck, CircleCheck, CircleX, TriangleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProgressRing } from '@/components/common/ProgressRing'
import { SectionCard } from '@/components/common/SectionCard'
import { ChartSkeleton } from '@/components/common/Skeleton'
import { QueryView } from '@/components/common/QueryView'
import { useStudentAttendance } from '@/hooks/useStudent'
import { isLowAttendance, LOW_ATTENDANCE_THRESHOLD } from '@/lib/academics'
import { formatNumber, formatPercent } from '@/lib/formatters'

export function AttendanceSummaryCard() {
  const query = useStudentAttendance()

  return (
    <SectionCard
      title="Attendance"
      icon={CalendarCheck}
      action={
        <Link to="/student/attendance" className="text-link text-sm font-medium hover:underline">
          View details
        </Link>
      }
    >
      <QueryView
        query={query}
        skeleton={<ChartSkeleton className="h-40" />}
        isEmpty={(data) => data.conducted === 0}
        empty={{ title: 'No classes recorded yet', description: 'Attendance appears once classes begin.' }}
      >
        {(data) => {
          const low = isLowAttendance(data.percentage)
          return (
            <div className="flex flex-col items-center gap-5 sm:flex-row lg:flex-col">
              <ProgressRing value={data.percentage} warn={low} label={`Overall attendance ${formatPercent(data.percentage)}`}>
                <span className="text-heading text-2xl font-bold">{formatPercent(data.percentage)}</span>
                <span className="text-muted-foreground text-xs">Overall</span>
              </ProgressRing>
              <dl className="grid w-full flex-1 gap-2 text-sm">
                <div className="bg-success-soft flex items-center justify-between gap-3 rounded-lg px-3 py-2">
                  <dt className="text-success-text inline-flex items-center gap-2 font-medium">
                    <CircleCheck className="size-4" aria-hidden /> Present
                  </dt>
                  <dd className="text-heading font-semibold">{formatNumber(data.attended)}</dd>
                </div>
                <div className="bg-danger-soft flex items-center justify-between gap-3 rounded-lg px-3 py-2">
                  <dt className="text-danger-text inline-flex items-center gap-2 font-medium">
                    <CircleX className="size-4" aria-hidden /> Absent
                  </dt>
                  <dd className="text-heading font-semibold">{formatNumber(data.conducted - data.attended)}</dd>
                </div>
                <div className="bg-sunken flex items-center justify-between gap-3 rounded-lg px-3 py-2">
                  <dt className="text-muted-foreground font-medium">Classes held</dt>
                  <dd className="text-heading font-semibold">{formatNumber(data.conducted)}</dd>
                </div>
                {low && (
                  <p className="text-warning-text inline-flex items-center gap-1.5 text-xs font-medium">
                    <TriangleAlert className="size-3.5" aria-hidden /> Below the {LOW_ATTENDANCE_THRESHOLD}% requirement
                  </p>
                )}
              </dl>
            </div>
          )
        }}
      </QueryView>
    </SectionCard>
  )
}
