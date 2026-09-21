import { CalendarDays, Clock, DoorOpen, NotebookPen } from 'lucide-react'
import { DataTable } from '@/components/common/DataTable'
import { FilterBar } from '@/components/common/FilterBar'
import { PageHeader } from '@/components/common/PageHeader'
import { PreviewNotice } from '@/components/common/PreviewNotice'
import { SectionCard } from '@/components/common/SectionCard'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useListQuery } from '@/hooks/useListQuery'
import { useExams } from '@/hooks/usePreview'
import { DEPARTMENTS, YEARS } from '@/lib/colleges'
import { formatDate, formatTime } from '@/lib/formatters'

const weekday = new Intl.DateTimeFormat('en-IN', { weekday: 'long' })

const COLUMNS = [
  { key: 'subject', header: 'Subject', sortable: true, className: 'text-heading font-medium' },
  { key: 'date', header: 'Date', sortable: true, cell: (row) => `${formatDate(row.date)}, ${weekday.format(new Date(row.date)).slice(0, 3)}`, className: 'whitespace-nowrap' },
  { key: 'time', header: 'Time', cell: (row) => `${formatTime(row.startTime)} – ${formatTime(row.endTime)}`, className: 'whitespace-nowrap' },
  { key: 'department', header: 'Department', sortable: true, cell: (row) => `${row.department} · Year ${row.year}` },
  { key: 'room', header: 'Room', sortable: true },
]

function NextExam({ exam }) {
  return (
    <SectionCard title="Next exam" icon={NotebookPen}>
      {exam ? (
        <div className="flex items-center gap-4">
          <time dateTime={exam.date} className="bg-tone-blue text-tone-blue-fg flex w-16 shrink-0 flex-col items-center rounded-xl py-2">
            <span className="text-2xl font-bold">{new Date(exam.date).getDate()}</span>
            <span className="text-xs font-semibold uppercase">{new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(new Date(exam.date))}</span>
          </time>
          <div className="min-w-0">
            <p className="text-heading font-semibold">{exam.subject}</p>
            <p className="text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="size-4" aria-hidden /> {weekday.format(new Date(exam.date))}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-4" aria-hidden /> {formatTime(exam.startTime)} – {formatTime(exam.endTime)}
              </span>
              <span className="inline-flex items-center gap-1">
                <DoorOpen className="size-4" aria-hidden /> {exam.room}
              </span>
            </p>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">No upcoming exams.</p>
      )}
    </SectionCard>
  )
}

export function ExamsPage() {
  useDocumentTitle('Exams')
  const { user } = useAuth()
  const isStudent = user.role === 'student'
  const list = useListQuery({ pageSize: 10, initialFilters: { department: '', year: '' }, initialSort: { key: 'date', direction: 'asc' } })
  const query = useExams(list.query)
  const data = query.data

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Exam schedule"
        description={isStudent ? `Mid-term I for ${user.department}, Year ${user.year}.` : 'Mid-term I across all departments and years.'}
        icon={NotebookPen}
        preview
      />
      {isStudent && <NextExam exam={data?.items[0]} />}
      <DataTable
        caption="Exam schedule"
        columns={COLUMNS}
        rows={data?.items}
        isLoading={query.isPending}
        isFetching={query.isFetching && !query.isPending}
        error={query.error}
        onRetry={query.refetch}
        emptyTitle="No exams scheduled"
        sort={list.sort}
        onSortChange={list.setSort}
        minWidth={720}
        pagination={data && { page: data.page, pageSize: data.pageSize, total: data.total, onPageChange: list.setPage }}
        toolbar={
          !isStudent && (
            <FilterBar search={list.search} onSearchChange={list.setSearch} searchPlaceholder="Search subject or room" searchLabel="Search exams">
              <label htmlFor="exam-department" className="sr-only">
                Department
              </label>
              <NativeSelect id="exam-department" size="lg" className="w-full sm:w-40" value={list.filters.department} onChange={(event) => list.setFilter('department', event.target.value)}>
                <NativeSelectOption value="">All departments</NativeSelectOption>
                {DEPARTMENTS.map((department) => (
                  <NativeSelectOption key={department} value={department}>
                    {department}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              <label htmlFor="exam-year" className="sr-only">
                Year
              </label>
              <NativeSelect id="exam-year" size="lg" className="w-full sm:w-32" value={list.filters.year} onChange={(event) => list.setFilter('year', event.target.value)}>
                <NativeSelectOption value="">All years</NativeSelectOption>
                {YEARS.map((year) => (
                  <NativeSelectOption key={year} value={String(year)}>
                    Year {year}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </FilterBar>
          )
        }
      />
      <PreviewNotice />
    </div>
  )
}
