import { Award, BookOpenCheck, GraduationCap, Layers, ListChecks, TriangleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DetailList } from '@/components/common/DetailList'
import { PageHeader } from '@/components/common/PageHeader'
import { QueryView } from '@/components/common/QueryView'
import { SectionCard } from '@/components/common/SectionCard'
import { StatGridSkeleton } from '@/components/common/Skeleton'
import { StatCard } from '@/components/common/StatCard'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useStudentAcademic } from '@/hooks/useStudent'
import { semesterLabel } from '@/lib/academics'
import { formatNumber } from '@/lib/formatters'

const TOTAL_SEMESTERS = 8

function ProgrammeProgress({ semester, creditsEarned, totalCredits }) {
  const semesterPercent = semester ? Math.round(((semester - 1) / TOTAL_SEMESTERS) * 100) : 0
  const creditPercent = totalCredits ? Math.round((creditsEarned / totalCredits) * 100) : 0
  const bars = [
    { label: 'Semesters completed', value: semesterPercent, text: `${semester ? semester - 1 : 0} of ${TOTAL_SEMESTERS}` },
    { label: 'Credits earned', value: creditPercent, text: `${formatNumber(creditsEarned)} of ${formatNumber(totalCredits)}` },
  ]

  return (
    <div className="flex flex-col gap-5">
      {bars.map((bar) => (
        <div key={bar.label}>
          <div className="flex items-center justify-between text-sm">
            <span className="text-heading font-medium">{bar.label}</span>
            <span className="text-muted-foreground">{bar.text}</span>
          </div>
          <div
            role="progressbar"
            aria-label={bar.label}
            aria-valuenow={bar.value}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={bar.text}
            className="bg-muted mt-2 h-2.5 overflow-hidden rounded-full"
          >
            <div className="bg-primary h-full rounded-full" style={{ width: `${bar.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function AcademicPage() {
  useDocumentTitle('Academic Info')
  const query = useStudentAcademic()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Academic information" description="Your programme, regulation and progress at a glance." icon={GraduationCap} />

      <QueryView query={query} skeleton={<StatGridSkeleton />}>
        {(academic) => (
          <>
            <section aria-label="Academic summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="CGPA" value={academic.cgpa?.toFixed(2)} icon={Award} tone="blue" to="/student/academic-report" linkLabel="View results" />
              <StatCard label="Current semester" value={academic.currentSemester} icon={Layers} tone="purple" hint={academic.year && `Year ${academic.year}`} />
              <StatCard label="Credits earned" value={formatNumber(academic.creditsEarned)} icon={ListChecks} tone="green" hint={academic.totalCredits && `of ${academic.totalCredits} required`} />
              <StatCard
                label="Backlogs"
                value={formatNumber(academic.backlogs)}
                icon={academic.backlogs > 0 ? TriangleAlert : BookOpenCheck}
                tone={academic.backlogs > 0 ? 'red' : 'teal'}
                hint={academic.backlogs > 0 ? 'Clear before final year' : 'All clear'}
              />
            </section>

            <div className="grid gap-6 lg:grid-cols-3">
              <SectionCard title="Programme details" icon={GraduationCap} className="lg:col-span-2">
                <DetailList
                  columns={3}
                  items={[
                    { label: 'College', value: academic.college },
                    { label: 'Department', value: academic.department },
                    { label: 'Batch', value: academic.batch },
                    { label: 'Regulation', value: academic.regulation },
                    { label: 'Semester', value: academic.currentSemester && semesterLabel(academic.currentSemester) },
                    { label: 'Section', value: academic.section },
                    { label: 'Mentor', value: academic.mentor },
                    { label: 'Admission type', value: academic.admissionType },
                  ]}
                />
              </SectionCard>
              <SectionCard
                title="Progress"
                icon={ListChecks}
                action={
                  <Link to="/student/courses" className="text-link text-sm font-medium hover:underline">
                    Current courses
                  </Link>
                }
              >
                <ProgrammeProgress
                  semester={academic.currentSemester}
                  creditsEarned={academic.creditsEarned}
                  totalCredits={academic.totalCredits}
                />
              </SectionCard>
            </div>
          </>
        )}
      </QueryView>
    </div>
  )
}
