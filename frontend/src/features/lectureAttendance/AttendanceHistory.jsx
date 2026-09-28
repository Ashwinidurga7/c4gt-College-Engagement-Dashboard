import { Download, History } from 'lucide-react'
import { DataTable } from '@/components/common/DataTable'
import { SectionCard } from '@/components/common/SectionCard'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { useAttendanceMonth } from '@/hooks/usePreview'
import { percentage } from '@/lib/academics'
import { downloadText, toCsv } from '@/lib/csv'
import { formatDate, formatMonth } from '@/lib/formatters'

const weekday = new Intl.DateTimeFormat('en-IN', { weekday: 'short', timeZone: 'UTC' })

/** Students down the side, one P/A column per day taken, then each student's totals. */
function downloadRegister(params, students, days) {
  const taken = days.filter((day) => day.record)
  const columns = [
    { key: 'rollNumber', header: 'Roll number' },
    { key: 'name', header: 'Name' },
    ...taken.map((day) => ({ key: day.date, header: day.date, csv: (row) => (day.record.absentees.includes(row.rollNumber) ? 'A' : 'P') })),
    { key: 'present', header: 'Days present' },
    { key: 'total', header: 'Working days' },
    { key: 'percentage', header: 'Attendance %' },
  ]
  const rows = students.map((student) => {
    const present = taken.filter((day) => !day.record.absentees.includes(student.rollNumber)).length
    return { ...student, present, total: taken.length, percentage: percentage(present, taken.length) }
  })
  downloadText(`attendance-register-${params.department}-${params.year}${params.section}-${params.month}.csv`, toCsv(columns, rows))
}

/** The month's working days for a section, with each day's totals and a button to open it. */
export function AttendanceHistory({ params, selectedDate, onOpenDay }) {
  const query = useAttendanceMonth(params)
  const students = query.data?.students ?? []
  const rows = [...(query.data?.days ?? [])].reverse().map((day) => ({
    ...day,
    total: students.length,
    absent: day.record?.absentees.length ?? null,
  }))

  const columns = [
    { key: 'date', header: 'Date', cell: (row) => formatDate(row.date), className: 'text-heading whitespace-nowrap font-medium' },
    { key: 'day', header: 'Day', cell: (row) => weekday.format(new Date(`${row.date}T00:00:00Z`)), className: 'text-muted-foreground' },
    { key: 'present', header: 'Present', align: 'right', cell: (row) => (row.record ? `${row.total - row.absent} of ${row.total}` : '—'), className: 'tabular-nums' },
    { key: 'status', header: 'Status', cell: (row) => (row.record ? <StatusBadge status="completed" label={row.record.corrected ? 'Corrected' : 'Taken'} /> : <StatusBadge status="pending" label="Not taken" />) },
    { key: 'takenBy', header: 'Taken by', cell: (row) => row.record?.takenBy ?? '—', className: 'text-muted-foreground' },
  ]

  return (
    <SectionCard
      title={`Attendance history · ${formatMonth(params.month)}`}
      description="Every working day this month. Open a day to review or correct it."
      icon={History}
      action={
        <Button variant="outline" size="lg" disabled={!query.data || rows.every((row) => !row.record)} onClick={() => downloadRegister(params, students, query.data.days)}>
          <Download aria-hidden /> Download register
        </Button>
      }
    >
      <DataTable
        caption={`Attendance history for ${formatMonth(params.month)}`}
        columns={columns}
        rows={rows}
        isLoading={query.isPending}
        error={query.error}
        onRetry={query.refetch}
        getRowKey={(row) => row.date}
        emptyTitle="No working days yet this month"
        minWidth={620}
        rowActions={(row) => (
          <Button variant={row.date === selectedDate ? 'secondary' : 'ghost'} size="lg" onClick={() => onOpenDay(row.date)} aria-current={row.date === selectedDate ? 'date' : undefined}>
            Open<span className="sr-only"> {formatDate(row.date)}</span>
          </Button>
        )}
      />
    </SectionCard>
  )
}
