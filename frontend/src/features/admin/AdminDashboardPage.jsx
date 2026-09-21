import { CalendarCheck, CalendarDays, ClipboardList, FileCheck2, GraduationCap, UserCheck, UserRoundCog, Users, UsersRound } from 'lucide-react'
import { ErrorState } from '@/components/common/ErrorState'
import { Skeleton, StatGridSkeleton } from '@/components/common/Skeleton'
import { StatCard } from '@/components/common/StatCard'
import { RecentRegistrations } from '@/features/admin/RecentRegistrations'
import { GroupMetricChart } from '@/features/analytics/GroupMetricChart'
import { GroupTable } from '@/features/analytics/GroupTable'
import { StaffWelcome } from '@/features/roster/StaffWelcome'
import { useAdminDashboard } from '@/hooks/useAdmin'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { LOW_ATTENDANCE_THRESHOLD } from '@/lib/academics'
import { formatNumber, formatPercent } from '@/lib/formatters'

export function AdminDashboardPage() {
  useDocumentTitle('Dashboard')
  const { user } = useAuth()
  const query = useAdminDashboard()

  if (query.isPending) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-28 rounded-xl" />
        <StatGridSkeleton />
        <StatGridSkeleton />
      </div>
    )
  }
  if (query.isError) return <ErrorState error={query.error} onRetry={query.refetch} />

  const { totals, byCollege, recentRegistrations } = query.data
  return (
    <div className="flex flex-col gap-6">
      <StaffWelcome name={user.name} role="Administrator" college={user.college} details={['KIET · KIET+ · KIEW']} />

      <section aria-label="People" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Students" value={formatNumber(totals.students)} icon={GraduationCap} tone="blue" to="/admin/users" linkLabel="View users" />
        <StatCard label="Faculty" value={formatNumber(totals.faculty)} icon={Users} tone="green" />
        <StatCard label="HODs" value={formatNumber(totals.hods)} icon={UserRoundCog} tone="purple" />
        <StatCard label="CTPOs" value={formatNumber(totals.ctpos)} icon={ClipboardList} tone="teal" />
      </section>
      <section aria-label="Work queues and campus" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Pending approvals"
          value={formatNumber(totals.pendingApprovals)}
          icon={UserCheck}
          tone={totals.pendingApprovals > 0 ? 'orange' : 'green'}
          to="/admin/approvals"
          linkLabel="Review"
        />
        <StatCard
          label="Pending verifications"
          value={formatNumber(totals.pendingVerifications)}
          icon={FileCheck2}
          tone={totals.pendingVerifications > 0 ? 'orange' : 'green'}
          to="/admin/verifications"
          linkLabel="Review"
        />
        <StatCard label="Active clubs" value={formatNumber(totals.activeClubs)} icon={UsersRound} tone="purple" to="/admin/clubs" linkLabel="Manage clubs" />
        <StatCard label="Upcoming events" value={formatNumber(totals.upcomingEvents)} icon={CalendarDays} tone="blue" to="/admin/events" linkLabel="View events" />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <GroupMetricChart
          title="Attendance by college"
          description={`Average student attendance; dashed line marks ${LOW_ATTENDANCE_THRESHOLD}%.`}
          icon={CalendarCheck}
          groups={byCollege}
          metric="averageAttendance"
          metricLabel="Average attendance"
          format={(value) => formatPercent(value)}
          domain={[0, 100]}
          threshold={LOW_ATTENDANCE_THRESHOLD}
          className="lg:col-span-2"
        />
        <RecentRegistrations registrations={recentRegistrations} />
      </div>
      <GroupTable title="College-wise summary" groups={byCollege.map((entry) => ({ ...entry, key: entry.college }))} />
    </div>
  )
}
