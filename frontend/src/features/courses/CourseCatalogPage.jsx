import { Library } from 'lucide-react'
import { DataTable } from '@/components/common/DataTable'
import { FilterBar } from '@/components/common/FilterBar'
import { PageHeader } from '@/components/common/PageHeader'
import { PreviewNotice } from '@/components/common/PreviewNotice'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useListQuery } from '@/hooks/useListQuery'
import { useCourseCatalog } from '@/hooks/usePreview'
import { DEPARTMENTS } from '@/lib/colleges'
import { TONE_CLASSES } from '@/lib/tones'
import { cn } from '@/lib/utils'

const TYPE_TONES = { Theory: 'blue', Lab: 'green', Humanities: 'purple' }

const COLUMNS = [
  { key: 'code', header: 'Code', sortable: true, className: 'text-heading font-semibold whitespace-nowrap' },
  { key: 'name', header: 'Course', sortable: true },
  { key: 'semester', header: 'Semester', sortable: true, align: 'right', className: 'tabular-nums' },
  { key: 'credits', header: 'Credits', sortable: true, align: 'right', className: 'tabular-nums' },
  {
    key: 'type',
    header: 'Type',
    cell: (row) => <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold', TONE_CLASSES[TYPE_TONES[row.type]])}>{row.type}</span>,
  },
  { key: 'department', header: 'Department', sortable: true },
]

function FilterSelect({ id, label, value, onChange, options, allLabel }) {
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

export function CourseCatalogPage() {
  useDocumentTitle('Course Catalog')
  const { user } = useAuth()
  const isAdmin = user.role === 'admin'
  const list = useListQuery({ initialFilters: { department: '', semester: '', type: '' }, initialSort: { key: 'semester', direction: 'asc' } })
  const query = useCourseCatalog(list.query)
  const data = query.data

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Course catalog"
        description={isAdmin ? 'R23 courses offered by every department.' : `R23 courses offered by ${user.department}.`}
        icon={Library}
        preview
      />
      <DataTable
        caption="Course catalog"
        columns={COLUMNS}
        rows={data?.items}
        isLoading={query.isPending}
        isFetching={query.isFetching && !query.isPending}
        error={query.error}
        onRetry={query.refetch}
        emptyTitle="No courses match"
        emptyDescription="Only first-year courses are loaded for departments other than CSE in this preview."
        sort={list.sort}
        onSortChange={list.setSort}
        minWidth={720}
        pagination={data && { page: data.page, pageSize: data.pageSize, total: data.total, onPageChange: list.setPage }}
        toolbar={
          <FilterBar search={list.search} onSearchChange={list.setSearch} searchPlaceholder="Search code or course" searchLabel="Search courses">
            {isAdmin && (
              <FilterSelect id="catalog-department" label="Department" value={list.filters.department} onChange={(value) => list.setFilter('department', value)} options={DEPARTMENTS.map((value) => ({ value, label: value }))} allLabel="All departments" />
            )}
            <FilterSelect id="catalog-semester" label="Semester" value={list.filters.semester} onChange={(value) => list.setFilter('semester', value)} options={[1, 2, 3, 4, 5, 6].map((value) => ({ value: String(value), label: `Semester ${value}` }))} allLabel="All semesters" />
            <FilterSelect id="catalog-type" label="Type" value={list.filters.type} onChange={(value) => list.setFilter('type', value)} options={['Theory', 'Lab', 'Humanities'].map((value) => ({ value, label: value }))} allLabel="All types" />
          </FilterBar>
        }
      />
      <PreviewNotice />
    </div>
  )
}
