import { Eye } from 'lucide-react'
import { useState } from 'react'
import { CollegeBadge } from '@/components/common/CollegeBadge'
import { DataTable } from '@/components/common/DataTable'
import { FilterBar } from '@/components/common/FilterBar'
import { ValueBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { StudentDetailDialog } from '@/features/roster/StudentDetailDialog'
import { isLowAttendance } from '@/lib/academics'
import { formatNumber, formatPercent } from '@/lib/formatters'

function buildColumns(showScope) {
  return [
    {
      key: 'name',
      header: 'Student',
      sortable: true,
      cell: (row) => (
        <div className="min-w-0">
          <p className="text-heading font-medium">{row.name}</p>
          <p className="text-muted-foreground text-xs">{row.rollNumber}</p>
        </div>
      ),
    },
    ...(showScope
      ? [
          { key: 'college', header: 'College', sortable: true, cell: (row) => <CollegeBadge college={row.college} /> },
          { key: 'department', header: 'Dept', sortable: true },
        ]
      : []),
    { key: 'year', header: 'Year · Sec', sortable: true, cell: (row) => `${row.year ?? '—'} · ${row.section ?? '—'}`, className: 'whitespace-nowrap' },
    {
      key: 'attendancePercentage',
      header: 'Attendance',
      sortable: true,
      align: 'right',
      cell: (row) => (row.attendancePercentage == null ? '—' : <ValueBadge value={formatPercent(row.attendancePercentage)} warn={isLowAttendance(row.attendancePercentage)} />),
    },
    { key: 'cgpa', header: 'CGPA', sortable: true, align: 'right', cell: (row) => row.cgpa?.toFixed(2) ?? '—', className: 'tabular-nums text-heading font-medium' },
    { key: 'backlogs', header: 'Backlogs', sortable: true, align: 'right', cell: (row) => formatNumber(row.backlogs), className: 'tabular-nums' },
  ]
}

function Select({ id, label, value, options, allLabel, onChange }) {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <NativeSelect id={id} size="lg" className="w-full sm:w-40" value={value ?? ''} onChange={(event) => onChange(event.target.value)}>
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
 * Server-driven student table. `filterOptions` lists the dropdowns to show
 * (each `{ key, label, allLabel, options }`); `showScope` adds college and department columns.
 */
export function RosterTable({ list, query, filterOptions = [], showScope = false, caption = 'Students' }) {
  const [selected, setSelected] = useState(null)
  const data = query.data

  return (
    <>
      <DataTable
        caption={caption}
        columns={buildColumns(showScope)}
        rows={data?.items}
        isLoading={query.isPending}
        isFetching={query.isFetching && !query.isPending}
        error={query.error}
        onRetry={query.refetch}
        emptyTitle="No students match"
        emptyDescription="Try a different search or clear the filters."
        sort={list.sort}
        onSortChange={list.setSort}
        minWidth={showScope ? 860 : 700}
        pagination={data && { page: data.page, pageSize: data.pageSize, total: data.total, onPageChange: list.setPage }}
        rowActions={(row) => (
          <Button variant="ghost" size="lg" onClick={() => setSelected(row)}>
            <Eye aria-hidden /> View<span className="sr-only"> {row.name}</span>
          </Button>
        )}
        toolbar={
          <FilterBar search={list.search} onSearchChange={list.setSearch} searchPlaceholder="Search name, roll number or email" searchLabel="Search students">
            {filterOptions.map((filter) => (
              <Select
                key={filter.key}
                id={`roster-${filter.key}`}
                label={filter.label}
                allLabel={filter.allLabel}
                options={filter.options}
                value={list.filters[filter.key]}
                onChange={(value) => list.setFilter(filter.key, value)}
              />
            ))}
          </FilterBar>
        }
      />
      {selected && <StudentDetailDialog student={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
