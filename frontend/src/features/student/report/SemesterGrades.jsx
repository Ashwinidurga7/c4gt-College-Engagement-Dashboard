import { ClipboardList } from 'lucide-react'
import { DataTable } from '@/components/common/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { semesterLabel } from '@/lib/academics'
import { formatDate, formatNumber } from '@/lib/formatters'

const COLUMNS = [
  { key: 'code', header: 'Code', className: 'text-heading font-semibold whitespace-nowrap' },
  { key: 'name', header: 'Course' },
  { key: 'credits', header: 'Credits', align: 'right', className: 'tabular-nums' },
  { key: 'internal', header: 'Internal', align: 'right', cell: (row) => formatNumber(row.internal), className: 'tabular-nums' },
  { key: 'external', header: 'External', align: 'right', cell: (row) => formatNumber(row.external), className: 'tabular-nums' },
  { key: 'total', header: 'Total', align: 'right', cell: (row) => formatNumber(row.total), className: 'tabular-nums font-semibold text-heading' },
  { key: 'grade', header: 'Grade', align: 'center', className: 'font-bold text-heading' },
  { key: 'result', header: 'Result', cell: (row) => <StatusBadge status={row.gradePoints > 0 ? 'pass' : 'fail'} /> },
]

export function SemesterGrades({ semesters, selected, onSelect }) {
  const current = semesters.find((entry) => entry.semester === selected) ?? semesters[semesters.length - 1]

  return (
    <section aria-labelledby="grades-heading" className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="grades-heading" className="flex items-center gap-2 text-lg font-semibold">
            <ClipboardList className="text-brand size-5" strokeWidth={1.75} aria-hidden />
            Course grades
          </h2>
          <p className="text-muted-foreground text-sm">
            {semesterLabel(current.semester)} · SGPA <span className="text-heading font-semibold">{current.sgpa.toFixed(2)}</span> ·{' '}
            {formatNumber(current.credits)} credits
            {current.publishedOn && ` · Published ${formatDate(current.publishedOn)}`}
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="report-semester" className="text-heading text-sm font-semibold">
            Semester
          </label>
          <NativeSelect id="report-semester" size="lg" className="w-full sm:w-48" value={current.semester} onChange={(event) => onSelect(Number(event.target.value))}>
            {semesters.map((entry) => (
              <NativeSelectOption key={entry.semester} value={entry.semester}>
                {semesterLabel(entry.semester)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      </div>
      <DataTable caption={`Grades for ${semesterLabel(current.semester)}`} columns={COLUMNS} rows={current.courses} getRowKey={(row) => row.code} minWidth={720} />
    </section>
  )
}
