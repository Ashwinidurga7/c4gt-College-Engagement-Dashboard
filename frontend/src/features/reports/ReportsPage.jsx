import { Download, FileBarChart, Play } from 'lucide-react'
import { useState } from 'react'
import { DataTable } from '@/components/common/DataTable'
import { PageHeader } from '@/components/common/PageHeader'
import { PreviewNotice } from '@/components/common/PreviewNotice'
import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { REPORTS } from '@/features/reports/reportDefinitions'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useReportSource } from '@/hooks/usePreview'
import { downloadText, toCsv } from '@/lib/csv'
import { formatNumber } from '@/lib/formatters'

const PREVIEW_ROWS = 25

function GeneratedReport({ report, source }) {
  const { columns, rows } = report.build(source)
  const tableColumns = columns.map((column) => ({ ...column, cell: column.format }))
  const today = new Date().toISOString().slice(0, 10)

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
        <Button variant="outline" size="lg" onClick={() => downloadText(`${report.id}-${today}.csv`, toCsv(columns, rows))} disabled={rows.length === 0}>
          <Download aria-hidden /> Download CSV
        </Button>
      </div>
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
        description={user.role === 'hod' ? `Reports for the ${user.department} department.` : 'Institution-wide reports across KIET, KIET+ and KIEW.'}
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
      {report && source.data && <GeneratedReport report={report} source={source.data} />}
      <PreviewNotice />
    </div>
  )
}
