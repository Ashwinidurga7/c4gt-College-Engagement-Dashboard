import { Building2 } from 'lucide-react'
import { useState } from 'react'
import { CollegeBadge } from '@/components/common/CollegeBadge'
import { DataTable } from '@/components/common/DataTable'
import { FilterChips } from '@/components/common/FilterChips'
import { PageHeader } from '@/components/common/PageHeader'
import { PreviewNotice } from '@/components/common/PreviewNotice'
import { ValueBadge } from '@/components/common/StatusBadge'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useDepartments } from '@/hooks/usePreview'
import { isLowAttendance } from '@/lib/academics'
import { COLLEGES } from '@/lib/colleges'
import { formatNumber, formatPercent } from '@/lib/formatters'

const COLUMNS = [
  {
    key: 'department',
    header: 'Department',
    cell: (row) => (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-heading font-semibold">{row.department}</span>
        <CollegeBadge college={row.college} />
      </div>
    ),
  },
  { key: 'hod', header: 'HOD', cell: (row) => row.hod ?? <span className="text-warning-text">Vacant</span> },
  { key: 'faculty', header: 'Faculty', align: 'right', cell: (row) => formatNumber(row.faculty), className: 'tabular-nums' },
  { key: 'ctpos', header: 'CTPOs', align: 'right', cell: (row) => formatNumber(row.ctpos), className: 'tabular-nums' },
  { key: 'total', header: 'Students', align: 'right', cell: (row) => formatNumber(row.total), className: 'tabular-nums' },
  {
    key: 'averageAttendance',
    header: 'Avg attendance',
    align: 'right',
    cell: (row) => <ValueBadge value={formatPercent(row.averageAttendance)} warn={isLowAttendance(row.averageAttendance)} />,
  },
  { key: 'averageCgpa', header: 'Avg CGPA', align: 'right', cell: (row) => row.averageCgpa?.toFixed(2) ?? '—', className: 'tabular-nums' },
]

const COLLEGE_OPTIONS = [{ value: '', label: 'All colleges' }, ...COLLEGES.map((college) => ({ value: college, label: college }))]

/** Departments across the three colleges; a small, fixed list, so it is filtered locally. */
export function DepartmentsPage() {
  useDocumentTitle('Departments')
  const query = useDepartments()
  const [college, setCollege] = useState('')
  const rows = (query.data ?? []).filter((row) => !college || row.college === college)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Departments" description="Heads, staffing and student figures for every department." icon={Building2} preview />
      <FilterChips label="College" options={COLLEGE_OPTIONS} value={college} onChange={setCollege} />
      <DataTable
        caption="Departments"
        columns={COLUMNS}
        rows={rows}
        isLoading={query.isPending}
        error={query.error}
        onRetry={query.refetch}
        emptyTitle="No departments"
        minWidth={860}
      />
      <PreviewNotice />
    </div>
  )
}
