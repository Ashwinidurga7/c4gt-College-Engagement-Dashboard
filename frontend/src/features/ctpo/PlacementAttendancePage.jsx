import { CalendarCheck } from 'lucide-react'
import { useState } from 'react'
import { DataTable } from '@/components/common/DataTable'
import { FilterBar } from '@/components/common/FilterBar'
import { FilterChips } from '@/components/common/FilterChips'
import { PageHeader } from '@/components/common/PageHeader'
import { QueryView } from '@/components/common/QueryView'
import { ChartSkeleton, StatGridSkeleton } from '@/components/common/Skeleton'
import { ValueBadge } from '@/components/common/StatusBadge'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { BandChart } from '@/features/analytics/BandChart'
import { CohortStats } from '@/features/analytics/CohortStats'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { usePlacementPool } from '@/hooks/usePreview'
import { isLowAttendance } from '@/lib/academics'
import { attendanceBands, summarizeStudents } from '@/lib/analytics'
import { formatPercent } from '@/lib/formatters'

const VIEWS = [
  { value: 'all', label: 'All students' },
  { value: 'low', label: 'Below 75%' },
]

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
  { key: 'department', header: 'Branch · Year · Sec', cell: (row) => `${row.department} · ${row.year} · ${row.section}`, className: 'whitespace-nowrap' },
  { key: 'graduationYear', header: 'Graduates', align: 'center', className: 'tabular-nums' },
  {
    key: 'attendancePercentage',
    header: 'Attendance',
    align: 'right',
    cell: (row) => <ValueBadge value={formatPercent(row.attendancePercentage)} warn={isLowAttendance(row.attendancePercentage)} />,
  },
]

function Filter({ id, label, value, onChange, options, allLabel }) {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <NativeSelect id={id} size="lg" className="w-full sm:w-40" value={value} onChange={(event) => onChange(event.target.value)}>
        <NativeSelectOption value="">{allLabel}</NativeSelectOption>
        {options.map((option) => (
          <NativeSelectOption key={option.value} value={option.value}>
            {option.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </>
  )
}

/**
 * Overall attendance of the pre-final and final years, which placement eligibility is checked against.
 * Starts on the CTPO's own branch and year.
 */
export function PlacementAttendancePage() {
  useDocumentTitle('Attendance')
  const { user } = useAuth()
  const query = usePlacementPool()
  const [branch, setBranch] = useState(user?.department ?? '')
  const [year, setYear] = useState(user?.year ? String(user.year) : '')
  const [view, setView] = useState('all')
  const [search, setSearch] = useState('')

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Attendance" description="Overall attendance of the pre-final and final years, as placement drives check it." icon={CalendarCheck} preview />
      <QueryView
        query={query}
        skeleton={
          <div className="flex flex-col gap-6">
            <StatGridSkeleton />
            <ChartSkeleton />
          </div>
        }
        isEmpty={(students) => students.length === 0}
        empty={{ icon: CalendarCheck, title: 'No attendance recorded yet', description: 'Figures appear once classes are marked.' }}
      >
        {(students) => {
          const branches = [...new Set(students.map((student) => student.department))].sort().map((code) => ({ value: code, label: code }))
          const years = [...new Set(students.map((student) => student.year))].sort().map((value) => ({ value: String(value), label: `Year ${value}` }))
          const term = search.trim().toLowerCase()
          const scoped = students.filter((student) => (!branch || student.department === branch) && (!year || student.year === Number(year)))
          const rows = scoped
            .filter((student) => view === 'all' || isLowAttendance(student.attendancePercentage))
            .filter((student) => !term || `${student.name} ${student.rollNumber}`.toLowerCase().includes(term))
            .sort((a, b) => a.attendancePercentage - b.attendancePercentage)
          return (
            <>
              <CohortStats summary={summarizeStudents(scoped)} />
              <BandChart title="Attendance spread" description="Students in each attendance range." icon={CalendarCheck} bands={attendanceBands(scoped)} />
              <DataTable
                caption="Students sorted by attendance, lowest first"
                columns={COLUMNS}
                rows={rows}
                getRowKey={(row) => row.rollNumber}
                emptyTitle="No students match"
                minWidth={560}
                toolbar={
                  <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Search name or roll number" searchLabel="Search students">
                    <Filter id="attendance-branch" label="Branch" value={branch} onChange={setBranch} options={branches} allLabel="All branches" />
                    <Filter id="attendance-year" label="Year" value={year} onChange={setYear} options={years} allLabel="Years 3 and 4" />
                    <FilterChips label="Show" options={VIEWS} value={view} onChange={setView} />
                  </FilterBar>
                }
              />
            </>
          )
        }}
      </QueryView>
    </div>
  )
}
