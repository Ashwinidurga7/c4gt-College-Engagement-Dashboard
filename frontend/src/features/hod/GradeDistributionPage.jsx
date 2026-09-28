import { GraduationCap, PieChart } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { QueryView } from '@/components/common/QueryView'
import { ChartSkeleton, StatGridSkeleton } from '@/components/common/Skeleton'
import { BandChart } from '@/features/analytics/BandChart'
import { CohortStats } from '@/features/analytics/CohortStats'
import { GroupMetricChart } from '@/features/analytics/GroupMetricChart'
import { GroupTable } from '@/features/analytics/GroupTable'
import { DepartmentToppers } from '@/features/hod/DepartmentToppers'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useHodAcademicReport } from '@/hooks/useHod'
import { branchesOf } from '@/lib/colleges'

export function GradeDistributionPage() {
  useDocumentTitle('Grade Distribution')
  const query = useHodAcademicReport()
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Grade distribution" description="CGPA spread and averages across the department. First-year students appear once results are published." icon={PieChart} />
      <QueryView
        query={query}
        skeleton={
          <div className="flex flex-col gap-6">
            <StatGridSkeleton />
            <ChartSkeleton />
          </div>
        }
        isEmpty={(data) => data.summary.total === 0}
        empty={{ icon: PieChart, title: 'No results published yet' }}
      >
        {(data) => (
          <>
            <CohortStats summary={data.summary} links={{ students: '/hod/students', attendance: '/hod/attendance' }} />
            <div className="grid gap-6 lg:grid-cols-2">
              <BandChart title="CGPA distribution" description="Students in each CGPA range." icon={GraduationCap} bands={data.gradeBands} />
              <GroupMetricChart
                title="Average CGPA by year"
                description="On a 10-point scale."
                icon={GraduationCap}
                groups={data.byYear}
                metric="averageCgpa"
                metricLabel="Average CGPA"
                format={(value) => Number(value).toFixed(2)}
                domain={[0, 10]}
              />
            </div>
            <DepartmentToppers students={data.students} branches={user.department ? branchesOf(user.department) : []} />
            <GroupTable title="Section-wise results" groups={data.bySection} />
          </>
        )}
      </QueryView>
    </div>
  )
}
