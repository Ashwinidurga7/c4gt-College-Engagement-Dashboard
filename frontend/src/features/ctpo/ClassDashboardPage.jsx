import { CalendarCheck, GraduationCap, Trophy, TriangleAlert } from 'lucide-react'
import { ErrorState } from '@/components/common/ErrorState'
import { Skeleton, StatGridSkeleton } from '@/components/common/Skeleton'
import { ValueBadge } from '@/components/common/StatusBadge'
import { BandChart } from '@/features/analytics/BandChart'
import { CohortStats } from '@/features/analytics/CohortStats'
import { StudentMiniList } from '@/features/analytics/StudentMiniList'
import { sectionLabel } from '@/features/ctpo/sectionLabel'
import { StaffWelcome } from '@/features/roster/StaffWelcome'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useCtpoDashboard } from '@/hooks/useStaff'
import { formatPercent } from '@/lib/formatters'

export function ClassDashboardPage() {
  useDocumentTitle('Class Dashboard')
  const { user } = useAuth()
  const query = useCtpoDashboard()

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
  const section = data.section ?? user
  return (
    <div className="flex flex-col gap-6">
      <StaffWelcome name={user.name} role="Class Teacher and Placement Officer" college={section.college} details={[sectionLabel(section)]} />
      <CohortStats summary={data.summary} links={{ students: '/ctpo/students', attendance: '/ctpo/attendance', report: '/ctpo/academic-report' }} />
      <div className="grid gap-6 lg:grid-cols-3">
        <BandChart
          title="Attendance spread"
          description="Students in each attendance range."
          icon={CalendarCheck}
          bands={data.attendanceBands}
          className="lg:col-span-2"
        />
        <StudentMiniList
          title="Below 75% attendance"
          icon={TriangleAlert}
          students={data.lowAttendanceStudents}
          emptyTitle="Everyone is above 75%"
          metric={(student) => <ValueBadge value={formatPercent(student.attendancePercentage)} warn />}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <BandChart title="CGPA distribution" description="Students in each CGPA range." icon={GraduationCap} bands={data.gradeBands} className="lg:col-span-2" />
        <StudentMiniList
          title="Top performers"
          icon={Trophy}
          students={data.topPerformers}
          emptyTitle="No results yet"
          metric={(student) => <span className="text-heading text-sm font-semibold tabular-nums">{student.cgpa?.toFixed(2)}</span>}
        />
      </div>
    </div>
  )
}
