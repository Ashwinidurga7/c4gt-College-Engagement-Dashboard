import { ArrowRight, CalendarCheck, GraduationCap, UserCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ErrorState } from '@/components/common/ErrorState'
import { Skeleton, StatGridSkeleton } from '@/components/common/Skeleton'
import { BandChart } from '@/features/analytics/BandChart'
import { CohortStats } from '@/features/analytics/CohortStats'
import { GroupMetricChart } from '@/features/analytics/GroupMetricChart'
import { GroupTable } from '@/features/analytics/GroupTable'
import { StaffWelcome } from '@/features/roster/StaffWelcome'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useHodDashboard } from '@/hooks/useHod'
import { LOW_ATTENDANCE_THRESHOLD } from '@/lib/academics'
import { formatPercent } from '@/lib/formatters'

function PendingCtpoNotice({ count }) {
  if (!count) return null
  return (
    <div role="status" className="bg-warning-soft border-warning flex flex-col gap-3 rounded-xl border-l-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-heading flex items-center gap-2 text-sm font-semibold">
        <UserCheck className="text-warning-text size-5" aria-hidden />
        {count} CTPO {count === 1 ? 'registration is' : 'registrations are'} waiting for your approval.
      </p>
      <Link to="/hod/ctpo-approvals" className="text-link inline-flex items-center gap-1 text-sm font-semibold hover:underline">
        Review now <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  )
}

export function HodDashboardPage() {
  useDocumentTitle('Dashboard')
  const { user } = useAuth()
  const query = useHodDashboard()

  if (query.isPending) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-28 rounded-xl" />
        <StatGridSkeleton />
      </div>
    )
  }
  if (query.isError) return <ErrorState error={query.error} onRetry={query.refetch} />

  const data = query.data
  const department = data.department?.department ?? user.department
  return (
    <div className="flex flex-col gap-6">
      <StaffWelcome name={user.name} role="Head of Department" college={data.department?.college ?? user.college} details={[department && `Department of ${department}`]} />
      <PendingCtpoNotice count={data.pendingCtpos} />
      <CohortStats summary={data.summary} links={{ students: '/hod/students', attendance: '/hod/attendance', report: '/hod/academic-report' }} />
      <div className="grid gap-6 lg:grid-cols-2">
        <GroupMetricChart
          title="Attendance by year"
          description={`Average attendance; dashed line marks ${LOW_ATTENDANCE_THRESHOLD}%.`}
          icon={CalendarCheck}
          groups={data.byYear}
          metric="averageAttendance"
          metricLabel="Average attendance"
          format={(value) => formatPercent(value)}
          domain={[0, 100]}
          threshold={LOW_ATTENDANCE_THRESHOLD}
        />
        <BandChart title="CGPA distribution" description="Students in each CGPA range." icon={GraduationCap} bands={data.gradeBands} />
      </div>
      <GroupTable title="Year-wise summary" groups={data.byYear} />
    </div>
  )
}
