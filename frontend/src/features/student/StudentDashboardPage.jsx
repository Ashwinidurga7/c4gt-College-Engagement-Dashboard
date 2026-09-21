import { CalendarCheck, CalendarDays, GraduationCap, UsersRound } from 'lucide-react'
import { ErrorState } from '@/components/common/ErrorState'
import { Skeleton, StatGridSkeleton } from '@/components/common/Skeleton'
import { StatCard } from '@/components/common/StatCard'
import { AttendanceSummaryCard } from '@/features/student/dashboard/AttendanceSummaryCard'
import { CampusUpdates } from '@/features/student/dashboard/CampusUpdates'
import { RecentActivities } from '@/features/student/dashboard/RecentActivities'
import { UpcomingEventsCard } from '@/features/student/dashboard/UpcomingEventsCard'
import { WelcomeBanner } from '@/features/student/dashboard/WelcomeBanner'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useStudentDashboard } from '@/hooks/useStudent'
import { isLowAttendance } from '@/lib/academics'
import { formatNumber, formatPercent } from '@/lib/formatters'

export function StudentDashboardPage() {
  useDocumentTitle('Dashboard')
  const query = useStudentDashboard()

  if (query.isPending) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-28 rounded-xl" />
        <StatGridSkeleton />
      </div>
    )
  }
  if (query.isError) {
    return (
      <div className="bg-card rounded-xl border">
        <ErrorState error={query.error} onRetry={query.refetch} />
      </div>
    )
  }

  const { student, stats, recentActivities, announcements } = query.data
  const lowAttendance = stats.attendancePercentage != null && isLowAttendance(stats.attendancePercentage)

  return (
    <div className="flex flex-col gap-6">
      <WelcomeBanner student={student} />

      <section aria-label="Summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Attendance"
          value={stats.attendancePercentage != null ? formatPercent(stats.attendancePercentage) : null}
          icon={CalendarCheck}
          tone={lowAttendance ? 'orange' : 'green'}
          hint={lowAttendance ? 'Below 75%' : 'On track'}
          to="/student/attendance"
        />
        <StatCard
          label="CGPA"
          value={stats.cgpa != null ? stats.cgpa.toFixed(2) : null}
          icon={GraduationCap}
          tone="blue"
          to="/student/academic-report"
          linkLabel="View results"
        />
        <StatCard label="Active clubs" value={formatNumber(stats.activeClubs)} icon={UsersRound} tone="purple" to="/student/clubs" linkLabel="View clubs" />
        <StatCard
          label="Upcoming events"
          value={formatNumber(stats.upcomingEvents)}
          icon={CalendarDays}
          tone="teal"
          to="/student/events"
          linkLabel="View events"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <AttendanceSummaryCard />
        <RecentActivities activities={recentActivities} className="lg:col-span-2" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <UpcomingEventsCard className="lg:col-span-2" />
        <CampusUpdates announcements={announcements} />
      </div>
    </div>
  )
}
