import { BookOpen } from 'lucide-react'
import { DataTable } from '@/components/common/DataTable'
import { FilterBar } from '@/components/common/FilterBar'
import { PageHeader } from '@/components/common/PageHeader'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useListQuery } from '@/hooks/useListQuery'
import { useStudentCourses } from '@/hooks/useStudent'
import { TONE_CLASSES } from '@/lib/tones'
import { cn } from '@/lib/utils'

const TYPE_TONES = { Theory: 'blue', Lab: 'green', Skill: 'purple' }

const COLUMNS = [
  { key: 'code', header: 'Code', sortable: true, className: 'font-semibold text-heading whitespace-nowrap' },
  { key: 'name', header: 'Course', sortable: true },
  {
    key: 'type',
    header: 'Type',
    sortable: true,
    cell: (course) => (
      <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', TONE_CLASSES[TYPE_TONES[course.type] ?? 'blue'])}>
        {course.type}
      </span>
    ),
  },
  { key: 'credits', header: 'Credits', sortable: true, align: 'right', className: 'tabular-nums' },
  { key: 'faculty', header: 'Faculty', sortable: true },
]

export function CoursesPage() {
  useDocumentTitle('Courses')
  const list = useListQuery({ initialSort: { key: 'code', direction: 'asc' } })
  const query = useStudentCourses(list.query)
  const data = query.data

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Courses" description="Courses you are registered for this semester." icon={BookOpen} />
      <DataTable
        caption="Registered courses"
        columns={COLUMNS}
        rows={data?.items}
        isLoading={query.isPending}
        isFetching={query.isFetching && !query.isPending}
        error={query.error}
        onRetry={query.refetch}
        emptyTitle={list.query.search || list.filters.type ? 'No courses match' : 'No courses registered'}
        emptyDescription={list.query.search || list.filters.type ? 'Try a different search or filter.' : 'Registered courses appear here once enrolment opens.'}
        sort={list.sort}
        onSortChange={list.setSort}
        pagination={data && { page: data.page, pageSize: data.pageSize, total: data.total, onPageChange: list.setPage }}
        toolbar={
          <FilterBar search={list.search} onSearchChange={list.setSearch} searchPlaceholder="Search by code, course or faculty" searchLabel="Search courses">
            <label htmlFor="course-type" className="sr-only">
              Course type
            </label>
            <NativeSelect id="course-type" value={list.filters.type ?? ''} onChange={(event) => list.setFilter('type', event.target.value)} size="lg" className="w-full sm:w-44">
              <NativeSelectOption value="">All types</NativeSelectOption>
              <NativeSelectOption value="Theory">Theory</NativeSelectOption>
              <NativeSelectOption value="Lab">Lab</NativeSelectOption>
              <NativeSelectOption value="Skill">Skill</NativeSelectOption>
            </NativeSelect>
          </FilterBar>
        }
      />
    </div>
  )
}
