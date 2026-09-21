import { CalendarCheck, TriangleAlert } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { QueryView } from '@/components/common/QueryView'
import { ChartSkeleton, StatGridSkeleton } from '@/components/common/Skeleton'
import { ValueBadge } from '@/components/common/StatusBadge'
import { BandChart } from '@/features/analytics/BandChart'
import { CohortStats } from '@/features/analytics/CohortStats'
import { GroupMetricChart } from '@/features/analytics/GroupMetricChart'
import { GroupTable } from '@/features/analytics/GroupTable'
import { StudentMiniList } from '@/features/analytics/StudentMiniList'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useHodAttendance } from '@/hooks/useHod'
import { LOW_ATTENDANCE_THRESHOLD } from '@/lib/academics'
import { formatPercent } from '@/lib/formatters'

export function AttendanceAnalyticsPage() {
  useDocumentTitle('Attendance Analytics')
  const query = useHodAttendance()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Attendance analytics" description="Department attendance by year and section this semester." icon={CalendarCheck} />
      <QueryView
        query={query}
        skeleton={
          <div className="flex flex-col gap-6">
            <StatGridSkeleton />
            <ChartSkeleton />
          </div>
        }
        isEmpty={(data) => data.summary.total === 0}
        empty={{ icon: CalendarCheck, title: 'No attendance recorded yet' }}
      >
        {(data) => (
          <>
            <CohortStats summary={data.summary} links={{ students: '/hod/students' }} />
            <div className="grid gap-6 lg:grid-cols-3">
              <GroupMetricChart
                title="Average attendance by section"
                description={`Bars are year and section (3A = Year 3, Section A). Dashed line marks ${LOW_ATTENDANCE_THRESHOLD}%.`}
                icon={CalendarCheck}
                groups={data.bySection}
                metric="averageAttendance"
                metricLabel="Average attendance"
                format={(value) => formatPercent(value)}
                domain={[0, 100]}
                threshold={LOW_ATTENDANCE_THRESHOLD}
                className="lg:col-span-2"
              />
              <StudentMiniList
                title="Lowest attendance"
                icon={TriangleAlert}
                students={data.lowAttendanceStudents}
                emptyTitle="Everyone is above 75%"
                metric={(student) => <ValueBadge value={formatPercent(student.attendancePercentage)} warn />}
              />
            </div>
            <BandChart title="Attendance spread" description="Students in each attendance range across the department." icon={CalendarCheck} bands={data.attendanceBands} />
            <GroupTable title="Section-wise attendance" groups={data.bySection} />
          </>
        )}
      </QueryView>
    </div>
  )
}
