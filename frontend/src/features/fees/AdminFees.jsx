import { AlarmClock, CircleCheck, Hourglass, IndianRupee } from 'lucide-react'
import { DataTable } from '@/components/common/DataTable'
import { FilterBar } from '@/components/common/FilterBar'
import { StatCard } from '@/components/common/StatCard'
import { StatusBadge } from '@/components/common/StatusBadge'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { useListQuery } from '@/hooks/useListQuery'
import { useFees } from '@/hooks/usePreview'
import { COLLEGES } from '@/lib/colleges'
import { formatCurrency, formatDate, formatNumber } from '@/lib/formatters'

const COLUMNS = [
  {
    key: 'student',
    header: 'Student',
    sortable: true,
    cell: (row) => (
      <div>
        <p className="text-heading font-medium">{row.student}</p>
        <p className="text-muted-foreground text-xs">
          {row.rollNumber} · {row.college} · {row.department}
        </p>
      </div>
    ),
  },
  { key: 'amount', header: 'Amount', sortable: true, align: 'right', cell: (row) => formatCurrency(row.amount), className: 'tabular-nums text-heading font-medium' },
  { key: 'date', header: 'Paid on', sortable: true, cell: (row) => (row.date ? formatDate(row.date) : `Due ${formatDate(row.dueDate)}`), className: 'whitespace-nowrap' },
  { key: 'method', header: 'Method', cell: (row) => row.method ?? '—' },
  { key: 'status', header: 'Status', sortable: true, cell: (row) => <StatusBadge status={row.status} label={{ paid: 'Paid', overdue: 'Overdue' }[row.status]} /> },
]

function Select({ id, label, value, onChange, children }) {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <NativeSelect id={id} size="lg" className="w-full sm:w-40" value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </NativeSelect>
    </>
  )
}

/** Institution fee collection. Stat cards and the table come from the same payment records. */
export function AdminFees() {
  const list = useListQuery({ initialFilters: { status: '', college: '' }, initialSort: { key: 'student', direction: 'asc' } })
  const query = useFees(list.query)
  const totals = query.data?.totals
  const page = query.data?.page

  return (
    <>
      <section aria-label="Fee totals" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total billed" value={totals ? formatCurrency(totals.total) : '…'} icon={IndianRupee} tone="blue" hint={totals && `${formatNumber(totals.count)} students`} />
        <StatCard label="Collected" value={totals ? formatCurrency(totals.collected) : '…'} icon={CircleCheck} tone="green" />
        <StatCard label="Pending" value={totals ? formatCurrency(totals.pending) : '…'} icon={Hourglass} tone="orange" hint="Due 30 Sept" />
        <StatCard label="Overdue" value={totals ? formatCurrency(totals.overdue) : '…'} icon={AlarmClock} tone="red" hint="Due date passed" />
      </section>
      <DataTable
        caption="Semester fee payments"
        columns={COLUMNS}
        rows={page?.items}
        isLoading={query.isPending}
        isFetching={query.isFetching && !query.isPending}
        error={query.error}
        onRetry={query.refetch}
        emptyTitle="No payments match"
        sort={list.sort}
        onSortChange={list.setSort}
        minWidth={760}
        pagination={page && { page: page.page, pageSize: page.pageSize, total: page.total, onPageChange: list.setPage }}
        toolbar={
          <FilterBar search={list.search} onSearchChange={list.setSearch} searchPlaceholder="Search student or roll number" searchLabel="Search payments">
            <Select id="fees-status" label="Status" value={list.filters.status} onChange={(value) => list.setFilter('status', value)}>
              <NativeSelectOption value="">Any status</NativeSelectOption>
              <NativeSelectOption value="paid">Paid</NativeSelectOption>
              <NativeSelectOption value="pending">Pending</NativeSelectOption>
              <NativeSelectOption value="overdue">Overdue</NativeSelectOption>
            </Select>
            <Select id="fees-college" label="College" value={list.filters.college} onChange={(value) => list.setFilter('college', value)}>
              <NativeSelectOption value="">All colleges</NativeSelectOption>
              {COLLEGES.map((college) => (
                <NativeSelectOption key={college} value={college}>
                  {college}
                </NativeSelectOption>
              ))}
            </Select>
          </FilterBar>
        }
      />
    </>
  )
}
