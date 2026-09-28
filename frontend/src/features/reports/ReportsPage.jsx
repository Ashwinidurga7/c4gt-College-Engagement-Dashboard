import { Download, FileBarChart, Play } from 'lucide-react'
import { useState } from 'react'
import { DataTable } from '@/components/common/DataTable'
import { PageHeader } from '@/components/common/PageHeader'
import { PreviewNotice } from '@/components/common/PreviewNotice'
import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { filterDefinition, REPORTS } from '@/features/reports/reportDefinitions'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useReportSource } from '@/hooks/usePreview'
import { branchesOf } from '@/lib/colleges'
import { downloadText, toCsv } from '@/lib/csv'
import { formatNumber } from '@/lib/formatters'

const PREVIEW_ROWS = 25

function ReportFilters({ report, source, filters, onChange }) {
  if (report.filters.length === 0) return null
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      {report.filters.map(filterDefinition).map((filter) => (
        <span key={filter.key} className="contents">
          <label htmlFor={`report-${filter.key}`} className="sr-only">
            {filter.label}
          </label>
          <NativeSelect
            id={`report-${filter.key}`}
            size="lg"
            className="w-full sm:w-48"
            value={filters[filter.key] ?? ''}
            onChange={(event) => onChange({ ...filters, [filter.key]: event.target.value })}
          >
            <NativeSelectOption value="">{filter.allLabel}</NativeSelectOption>
            {filter.options(source).map((option) => (
              <NativeSelectOption key={option.value} value={option.value}>
                {option.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </span>
      ))}
    </div>
  )
}

/** A report over the whole scope by default; the filters narrow the summary, table and download together. */
function GeneratedReport({ report, source }) {
  const [filters, setFilters] = useState({})
  const { summary, columns, rows } = report.build(source, filters)
  const tableColumns = columns.map((column) => ({ ...column, cell: column.format }))
  const today = new Date().toISOString().slice(0, 10)
  const filtered = Object.values(filters).some(Boolean)

  return (
    <section aria-labelledby="report-result" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="report-result" className="text-lg font-semibold">
            {report.title}
          </h2>
          <p className="text-muted-foreground text-sm">
            {formatNumber(rows.length)} rows{rows.length > PREVIEW_ROWS && `, first ${PREVIEW_ROWS} shown. Download for the full list`}.
          </p>
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={() => downloadText(`${[report.id, ...Object.values(filters).filter(Boolean), today].join('-')}.csv`, toCsv(columns, rows))}
          disabled={rows.length === 0}
        >
          <Download aria-hidden /> Download CSV
        </Button>
      </div>
      <ReportFilters report={report} source={source} filters={filters} onChange={setFilters} />
      <dl className="grid gap-3 sm:grid-cols-3">
        {summary.map((item) => (
          <div key={item.label} className="bg-card rounded-lg border p-4">
            <dt className="text-muted-foreground text-sm">
              {item.label}
              {!filtered && ' (overall)'}
            </dt>
            <dd className="text-heading text-2xl font-bold tabular-nums">{item.value}</dd>
          </div>
        ))}
      </dl>
      <DataTable caption={report.title} columns={tableColumns} rows={rows.slice(0, PREVIEW_ROWS)} getRowKey={(row, index) => row.id ?? `${row.rollNumber}-${index}`} emptyTitle="Nothing to report" minWidth={640} />
    </section>
  )
}

export function ReportsPage() {
  useDocumentTitle('Reports')
  const { user } = useAuth()
  const source = useReportSource()
  const [selected, setSelected] = useState(null)
  const reports = REPORTS.filter((report) => !report.roles || report.roles.includes(user.role))
  const report = reports.find((entry) => entry.id === selected)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reports"
        description={
          user.role === 'hod'
            ? `Overall and filtered reports for ${branchesOf(user.department).join(', ')}.`
            : 'Overall and filtered reports across KIET, KIET+ and KIEW.'
        }
        icon={FileBarChart}
        preview
      />
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {reports.map((entry) => (
          <li key={entry.id} className="bg-card shadow-soft flex flex-col gap-3 rounded-xl border p-5">
            <span className="bg-tone-blue text-tone-blue-fg flex size-11 items-center justify-center rounded-lg">
              <entry.icon className="size-5" strokeWidth={1.75} aria-hidden />
            </span>
            <div className="flex-1">
              <h2 className="font-semibold">{entry.title}</h2>
              <p className="text-muted-foreground mt-1 text-sm">{entry.description}</p>
            </div>
            <Button size="lg" variant={selected === entry.id ? 'default' : 'outline'} aria-pressed={selected === entry.id} onClick={() => setSelected(entry.id)} disabled={source.isPending}>
              <Play aria-hidden /> Generate<span className="sr-only"> {entry.title}</span>
            </Button>
          </li>
        ))}
      </ul>
      {source.isError && <ErrorState error={source.error} onRetry={source.refetch} />}
      {report && source.data && <GeneratedReport key={report.id} report={report} source={source.data} />}
      <PreviewNotice />
    </div>
  )
}
