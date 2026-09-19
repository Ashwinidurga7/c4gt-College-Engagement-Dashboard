import { CalendarCheck } from 'lucide-react'
import { useState } from 'react'
import { DataTable } from '@/components/common/DataTable'
import { FilterChips } from '@/components/common/FilterChips'
import { PageHeader } from '@/components/common/PageHeader'
import { QueryView } from '@/components/common/QueryView'
import { ChartSkeleton, StatGridSkeleton } from '@/components/common/Skeleton'
import { ValueBadge } from '@/components/common/StatusBadge'
import { BandChart } from '@/features/analytics/BandChart'
import { CohortStats } from '@/features/analytics/CohortStats'
import { SubjectAttendanceChart } from '@/features/analytics/SubjectAttendanceChart'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useCtpoAttendance } from '@/hooks/useStaff'
import { classesNeeded, isLowAttendance } from '@/lib/academics'
import { formatPercent } from '@/lib/formatters'

const VIEWS = [
  { value: 'all', label: 'All students' },
  { value: 'low', label: 'Below 75%' },
]

function totals(student) {
  const conducted = student.subjects.reduce((sum, subject) => sum + subject.conducted, 0)
  const attended = student.subjects.reduce((sum, subject) => sum + subject.attended, 0)
  return { conducted, attended }
}

const COLUMNS = [
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
  {
    key: 'attendancePercentage',
    header: 'Overall',
    align: 'right',
    cell: (row) => <ValueBadge value={formatPercent(row.attendancePercentage)} warn={isLowAttendance(row.attendancePercentage)} />,
  },
  {
    key: 'recovery',
    header: 'To reach 75%',
    align: 'right',
    cell: (row) => {
      if (!isLowAttendance(row.attendancePercentage) || row.subjects.length === 0) return <span className="text-muted-foreground">—</span>
      const { conducted, attended } = totals(row)
      return `${classesNeeded(attended, conducted)} classes in a row`
    },
    className: 'whitespace-nowrap',
  },
]

/** Section attendance (GET /api/ctpo/attendance). The section is small, so the table is sorted and filtered locally. */
export function SectionAttendancePage() {
  useDocumentTitle('Section Attendance')
  const query = useCtpoAttendance()
  const [view, setView] = useState('all')

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Section attendance" description="Attendance across your section this semester." icon={CalendarCheck} />
      <QueryView
        query={query}
        skeleton={
          <div className="flex flex-col gap-6">
            <StatGridSkeleton />
            <ChartSkeleton />
          </div>
        }
        isEmpty={(data) => data.students.length === 0}
        empty={{ icon: CalendarCheck, title: 'No attendance recorded yet', description: 'Figures appear once classes are marked.' }}
      >
        {(data) => {
          const rows = [...data.students]
            .filter((student) => view === 'all' || isLowAttendance(student.attendancePercentage))
            .sort((a, b) => a.attendancePercentage - b.attendancePercentage)
          return (
            <>
              <CohortStats summary={data.summary} links={{ students: '/ctpo/students' }} />
              <div className="grid gap-6 lg:grid-cols-2">
                {data.subjects.length > 0 && <SubjectAttendanceChart subjects={data.subjects} />}
                <BandChart title="Attendance spread" description="Students in each attendance range." icon={CalendarCheck} bands={data.attendanceBands} />
              </div>
              <section aria-labelledby="section-attendance-table" className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 id="section-attendance-table" className="text-lg font-semibold">
                    Students by attendance
                  </h2>
                  <FilterChips label="Show" options={VIEWS} value={view} onChange={setView} />
                </div>
                <DataTable caption="Students sorted by attendance, lowest first" columns={COLUMNS} rows={rows} emptyTitle="No students below 75%" minWidth={480} />
              </section>
            </>
          )
        }}
      </QueryView>
    </div>
  )
}
