import { DataTable } from '@/components/common/DataTable'
import { ValueBadge } from '@/components/common/StatusBadge'
import { isLowAttendance } from '@/lib/academics'
import { formatNumber, formatPercent } from '@/lib/formatters'

const COLUMNS = [
  { key: 'label', header: 'Group', className: 'text-heading font-medium whitespace-nowrap' },
  { key: 'total', header: 'Students', align: 'right', cell: (row) => formatNumber(row.total), className: 'tabular-nums' },
  {
    key: 'averageAttendance',
    header: 'Avg attendance',
    align: 'right',
    cell: (row) => (row.averageAttendance == null ? '—' : <ValueBadge value={formatPercent(row.averageAttendance)} warn={isLowAttendance(row.averageAttendance)} />),
  },
  { key: 'averageCgpa', header: 'Avg CGPA', align: 'right', cell: (row) => row.averageCgpa?.toFixed(2) ?? '—', className: 'tabular-nums' },
  { key: 'lowAttendance', header: 'Below 75%', align: 'right', cell: (row) => formatNumber(row.lowAttendance), className: 'tabular-nums' },
  { key: 'withBacklogs', header: 'With backlogs', align: 'right', cell: (row) => formatNumber(row.withBacklogs), className: 'tabular-nums' },
]

/** Per-year or per-section summary rows for department analytics. */
export function GroupTable({ title, groups, caption }) {
  return (
    <section aria-label={title} className="flex min-w-0 flex-col gap-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <DataTable caption={caption ?? title} columns={COLUMNS} rows={groups} getRowKey={(row) => row.key} emptyTitle="No groups to show" minWidth={620} />
    </section>
  )
}
