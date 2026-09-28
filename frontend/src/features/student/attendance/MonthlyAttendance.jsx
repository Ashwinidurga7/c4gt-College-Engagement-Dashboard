import { CalendarDays, CalendarRange, UserRoundCheck, UserRoundX } from 'lucide-react'
import { useState } from 'react'
import { DataTable } from '@/components/common/DataTable'
import { SectionCard } from '@/components/common/SectionCard'
import { StatusBadge } from '@/components/common/StatusBadge'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { summarizeMonth } from '@/lib/attendanceSummary'
import { formatDate, formatNumber } from '@/lib/formatters'
import { TONE_CLASSES } from '@/lib/tones'
import { cn } from '@/lib/utils'

const weekday = new Intl.DateTimeFormat('en-IN', { weekday: 'long', timeZone: 'UTC' })
const monthName = new Intl.DateTimeFormat('en-IN', { month: 'long', timeZone: 'UTC' })

const dayOf = (date) => weekday.format(new Date(`${date}T00:00:00Z`))
const nameOfMonth = (month) => monthName.format(new Date(Date.UTC(2000, month - 1, 1)))

const DAY_COLUMNS = [
  { key: 'date', header: 'Date', cell: (row) => formatDate(row.date), className: 'text-heading whitespace-nowrap font-medium' },
  { key: 'day', header: 'Day', cell: (row) => dayOf(row.date), className: 'text-muted-foreground' },
  { key: 'classes', header: 'Classes attended', align: 'right', cell: (row) => `${row.attended} of ${row.classes}`, className: 'tabular-nums' },
  { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
]

function Tile({ icon: Icon, label, value, tone }) {
  return (
    <div className="bg-card flex items-center gap-3 rounded-lg border p-4">
      <span className={cn('flex size-11 shrink-0 items-center justify-center rounded-full', TONE_CLASSES[tone])}>
        <Icon className="size-5" strokeWidth={1.75} aria-hidden />
      </span>
      <div>
        <p className="text-heading text-2xl font-bold tabular-nums">{formatNumber(value)}</p>
        <p className="text-muted-foreground text-sm">{label}</p>
      </div>
    </div>
  )
}

/** Month and year picker over the student's working days, with that month's totals and day-wise status. */
export function MonthlyAttendance({ days }) {
  // `days` is newest first, so the first entry holds the latest month with classes.
  const months = [...new Set(days.map((day) => day.date.slice(0, 7)))]
  const [selected, setSelected] = useState(months[0] ?? '')
  const [year, month] = selected.split('-')
  const years = [...new Set(months.map((key) => key.slice(0, 4)))]
  const monthsInYear = months.filter((key) => key.startsWith(year))
  const summary = summarizeMonth(days, selected)

  // Switching year keeps the same month when that year has it, otherwise jumps to the year's latest month.
  const changeYear = (nextYear) => {
    const sameMonth = `${nextYear}-${month}`
    setSelected(months.includes(sameMonth) ? sameMonth : months.find((key) => key.startsWith(nextYear)))
  }

  return (
    <SectionCard
      title="Monthly attendance"
      description="Pick a month to see its working days and your status on each day."
      icon={CalendarRange}
      action={
        <div className="flex gap-2">
          <label htmlFor="attendance-month" className="sr-only">
            Month
          </label>
          <NativeSelect id="attendance-month" size="lg" className="w-36" value={selected} onChange={(event) => setSelected(event.target.value)}>
            {monthsInYear.map((key) => (
              <NativeSelectOption key={key} value={key}>
                {nameOfMonth(Number(key.slice(5)))}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <label htmlFor="attendance-year" className="sr-only">
            Year
          </label>
          <NativeSelect id="attendance-year" size="lg" className="w-28" value={year} onChange={(event) => changeYear(event.target.value)}>
            {years.map((key) => (
              <NativeSelectOption key={key} value={key}>
                {key}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      }
      bodyClassName="flex flex-col gap-5"
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <Tile icon={CalendarDays} label="Working days" value={summary.working} tone="blue" />
        <Tile icon={UserRoundCheck} label="Present days" value={summary.present} tone="green" />
        <Tile icon={UserRoundX} label="Absent days" value={summary.absent} tone="red" />
      </div>
      {summary.partial > 0 && (
        <p className="text-muted-foreground text-sm">
          {summary.partial} {summary.partial === 1 ? 'day was' : 'days were'} partial: you missed some of that day&apos;s classes.
        </p>
      )}
      <DataTable
        caption={`Day-wise attendance for ${nameOfMonth(Number(month))} ${year}`}
        columns={DAY_COLUMNS}
        rows={summary.days}
        getRowKey={(row) => row.date}
        emptyTitle="No working days recorded this month"
        minWidth={480}
      />
    </SectionCard>
  )
}
