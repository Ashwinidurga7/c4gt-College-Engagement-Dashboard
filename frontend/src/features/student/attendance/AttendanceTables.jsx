import { DataTable } from '@/components/common/DataTable'
import { StatusBadge, ValueBadge } from '@/components/common/StatusBadge'
import { isLowAttendance } from '@/lib/academics'
import { formatDate, formatNumber, formatPercent } from '@/lib/formatters'

const weekday = new Intl.DateTimeFormat('en-IN', { weekday: 'short' })

const SUBJECT_COLUMNS = [
  { key: 'index', header: '#', cell: (_, index) => index + 1, className: 'text-muted-foreground w-12' },
  { key: 'subject', header: 'Subject', className: 'text-heading font-medium' },
  { key: 'conducted', header: 'Conducted', align: 'right', cell: (row) => formatNumber(row.conducted), className: 'tabular-nums' },
  { key: 'attended', header: 'Present', align: 'right', cell: (row) => formatNumber(row.attended), className: 'tabular-nums' },
  { key: 'absent', header: 'Absent', align: 'right', cell: (row) => formatNumber(row.conducted - row.attended), className: 'tabular-nums' },
  {
    key: 'percentage',
    header: 'Attendance',
    align: 'right',
    cell: (row) => <ValueBadge value={formatPercent(row.percentage)} warn={isLowAttendance(row.percentage)} />,
  },
]

const RECORD_COLUMNS = [
  { key: 'date', header: 'Date', cell: (row) => formatDate(row.date), className: 'whitespace-nowrap' },
  { key: 'day', header: 'Day', cell: (row) => weekday.format(new Date(row.date)), className: 'text-muted-foreground' },
  { key: 'subject', header: 'Subject', className: 'text-heading font-medium' },
  { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
]

export function SubjectAttendanceTable({ subjects }) {
  return (
    <section aria-labelledby="subject-attendance-heading" className="flex flex-col gap-3">
      <h2 id="subject-attendance-heading" className="text-lg font-semibold">
        Subject-wise attendance
      </h2>
      <DataTable
        caption="Attendance by subject"
        columns={SUBJECT_COLUMNS}
        rows={subjects}
        getRowKey={(row) => row.code ?? row.subject}
        emptyTitle="No subjects recorded"
        minWidth={520}
      />
    </section>
  )
}

export function RecentAttendanceTable({ records, limit = 10 }) {
  return (
    <section aria-labelledby="recent-attendance-heading" className="flex flex-col gap-3">
      <h2 id="recent-attendance-heading" className="text-lg font-semibold">
        Recent classes
      </h2>
      <DataTable
        caption="Most recent classes"
        columns={RECORD_COLUMNS}
        rows={records.slice(0, limit)}
        getRowKey={(row, index) => `${row.date}-${row.subjectCode ?? row.subject}-${index}`}
        emptyTitle="No classes recorded yet"
        minWidth={480}
      />
    </section>
  )
}
