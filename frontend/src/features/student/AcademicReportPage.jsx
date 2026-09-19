import { Award, BarChart3, ListChecks, Trophy } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { QueryView } from '@/components/common/QueryView'
import { ChartSkeleton, StatGridSkeleton } from '@/components/common/Skeleton'
import { StatCard } from '@/components/common/StatCard'
import { SemesterGrades } from '@/features/student/report/SemesterGrades'
import { SgpaChart } from '@/features/student/report/SgpaChart'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useStudentAcademicReport } from '@/hooks/useStudent'
import { formatNumber } from '@/lib/formatters'

export function AcademicReportPage() {
  useDocumentTitle('Results')
  const query = useStudentAcademicReport()
  const [selected, setSelected] = useState(null)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Academic report" description="Semester results, grade points and your cumulative GPA." icon={BarChart3} />
      <QueryView
        query={query}
        skeleton={
          <div className="flex flex-col gap-6">
            <StatGridSkeleton count={3} />
            <ChartSkeleton />
          </div>
        }
        isEmpty={(report) => report.semesters.length === 0}
        empty={{ icon: Award, title: 'No results published yet', description: 'Results appear here after the first semester examinations.' }}
      >
        {(report) => {
          const best = report.semesters.reduce((top, entry) => (entry.sgpa > top.sgpa ? entry : top), report.semesters[0])
          const credits = report.semesters.reduce((sum, entry) => sum + entry.credits, 0)
          return (
            <>
              <section aria-label="Results summary" className="grid gap-4 sm:grid-cols-3">
                <StatCard label="CGPA" value={report.cgpa.toFixed(2)} icon={Award} tone="blue" hint="Out of 10" />
                <StatCard label="Best SGPA" value={best.sgpa.toFixed(2)} icon={Trophy} tone="orange" hint={`Semester ${best.semester}`} />
                <StatCard label="Credits completed" value={formatNumber(credits)} icon={ListChecks} tone="green" hint={`${report.semesters.length} semesters`} />
              </section>
              <SgpaChart semesters={report.semesters} />
              <SemesterGrades semesters={report.semesters} selected={selected} onSelect={setSelected} />
            </>
          )
        }}
      </QueryView>
    </div>
  )
}
