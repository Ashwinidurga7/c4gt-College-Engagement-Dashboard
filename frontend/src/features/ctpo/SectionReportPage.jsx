import { BarChart3, GraduationCap, Trophy } from 'lucide-react'
import { DataTable } from '@/components/common/DataTable'
import { PageHeader } from '@/components/common/PageHeader'
import { QueryView } from '@/components/common/QueryView'
import { ChartSkeleton, StatGridSkeleton } from '@/components/common/Skeleton'
import { BandChart } from '@/features/analytics/BandChart'
import { CohortStats } from '@/features/analytics/CohortStats'
import { StudentMiniList } from '@/features/analytics/StudentMiniList'
import { SgpaChart } from '@/features/student/report/SgpaChart'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useCtpoAcademicReport } from '@/hooks/useStaff'
import { formatNumber } from '@/lib/formatters'

function columnsFor(semesters) {
  return [
    { key: 'rank', header: '#', cell: (_, index) => index + 1, className: 'text-muted-foreground w-10' },
    {
      key: 'name',
      header: 'Student',
      cell: (row) => (
        <div>
          <p className="text-heading font-medium">{row.name}</p>
          <p className="text-muted-foreground text-xs">{row.rollNumber}</p>
        </div>
      ),
    },
    ...semesters.map((semester) => ({
      key: `sem${semester}`,
      header: `Sem ${semester}`,
      align: 'right',
      cell: (row) => row.sgpas[semester - 1]?.toFixed(2) ?? '—',
      className: 'tabular-nums',
    })),
    { key: 'cgpa', header: 'CGPA', align: 'right', cell: (row) => row.cgpa?.toFixed(2) ?? '—', className: 'tabular-nums text-heading font-semibold' },
    { key: 'backlogs', header: 'Backlogs', align: 'right', cell: (row) => formatNumber(row.backlogs), className: 'tabular-nums' },
  ]
}

export function SectionReportPage() {
  useDocumentTitle('Academic Report')
  const query = useCtpoAcademicReport()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Section academic report" description="Semester results and CGPA ranking for your section." icon={BarChart3} />
      <QueryView
        query={query}
        skeleton={
          <div className="flex flex-col gap-6">
            <StatGridSkeleton />
            <ChartSkeleton />
          </div>
        }
        isEmpty={(data) => data.students.length === 0}
        empty={{ icon: BarChart3, title: 'No results yet', description: 'The report appears after the first semester results are published.' }}
      >
        {(data) => {
          const ranked = [...data.students].sort((a, b) => (b.cgpa ?? 0) - (a.cgpa ?? 0))
          const semesters = data.sgpaTrend.map((entry) => entry.semester)
          return (
            <>
              <CohortStats summary={data.summary} links={{ students: '/ctpo/students', attendance: '/ctpo/attendance' }} />
              <div className="grid gap-6 lg:grid-cols-2">
                <SgpaChart semesters={data.sgpaTrend} title="Average SGPA by semester" description="Section average on a 10-point scale." />
                <BandChart title="CGPA distribution" description="Students in each CGPA range." icon={GraduationCap} bands={data.gradeBands} />
              </div>
              <div className="grid gap-6 lg:grid-cols-3">
                <section aria-labelledby="ranking-heading" className="flex min-w-0 flex-col gap-3 lg:col-span-2">
                  <h2 id="ranking-heading" className="text-lg font-semibold">
                    CGPA ranking
                  </h2>
                  <DataTable caption="Students ranked by CGPA" columns={columnsFor(semesters)} rows={ranked} minWidth={560 + semesters.length * 70} />
                </section>
                <StudentMiniList
                  title="Top performers"
                  icon={Trophy}
                  students={data.topPerformers}
                  emptyTitle="No results yet"
                  metric={(student) => <span className="text-heading text-sm font-semibold tabular-nums">{student.cgpa?.toFixed(2)}</span>}
                />
              </div>
            </>
          )
        }}
      </QueryView>
    </div>
  )
}
