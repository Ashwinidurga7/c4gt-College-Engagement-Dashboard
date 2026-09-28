import { Briefcase, Download, Pencil } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { DataTable } from '@/components/common/DataTable'
import { DetailList } from '@/components/common/DetailList'
import { ErrorState } from '@/components/common/ErrorState'
import { FilterBar } from '@/components/common/FilterBar'
import { FilterChips } from '@/components/common/FilterChips'
import { PageHeader } from '@/components/common/PageHeader'
import { PreviewNotice } from '@/components/common/PreviewNotice'
import { QueryView } from '@/components/common/QueryView'
import { SectionCard } from '@/components/common/SectionCard'
import { ListSkeleton } from '@/components/common/Skeleton'
import { StatCard } from '@/components/common/StatCard'
import { StatusBadge, ValueBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { CriteriaModal } from '@/features/ctpo/CriteriaModal'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { usePlacementDrives, usePlacementPool, useSetApplicationStatus } from '@/hooks/usePreview'
import { isLowAttendance } from '@/lib/academics'
import { downloadText, toCsv } from '@/lib/csv'
import { formatDate, formatNumber, formatPercent } from '@/lib/formatters'
import { APPLICATION_STATUSES, eligibilityGaps } from '@/lib/placement'

const STATUS_LABELS = { 'not-applied': 'Not applied', applied: 'Applied', shortlisted: 'Shortlisted', selected: 'Selected', rejected: 'Rejected' }

/** Views over the pool; only "Eligible" applies the company's criteria. */
const VIEWS = [
  { value: 'eligible', label: 'Eligible', test: (row) => row.gaps.length === 0 },
  { value: 'zero', label: 'Zero active backlogs', test: (row) => row.recordsVerified && row.backlogs === 0 },
  { value: 'active', label: 'Active backlogs', test: (row) => row.backlogs > 0 },
  { value: 'cleared', label: 'Cleared backlogs', test: (row) => row.clearedBacklogs > 0 },
  { value: 'unverified', label: 'Unverified records', test: (row) => !row.recordsVerified },
  { value: 'all', label: 'Everyone', test: () => true },
]

const CSV_COLUMNS = [
  { key: 'rollNumber', header: 'Roll number' },
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'department', header: 'Branch' },
  { key: 'graduationYear', header: 'Graduation year' },
  { key: 'cgpa', header: 'CGPA' },
  { key: 'backlogs', header: 'Active backlogs' },
  { key: 'clearedBacklogs', header: 'Cleared backlogs' },
  { key: 'attendancePercentage', header: 'Attendance %' },
  { key: 'resume', header: 'Resume', csv: (row) => (row.resumeSubmitted ? 'Submitted' : 'Missing') },
  { key: 'eligibility', header: 'Eligibility', csv: (row) => (row.gaps.length ? row.gaps.join('; ') : 'Eligible') },
  { key: 'status', header: 'Application status', csv: (row) => STATUS_LABELS[row.status] },
]

function criteriaItems(criteria) {
  return [
    { label: 'Minimum CGPA', value: criteria.minCgpa || 'Any' },
    { label: 'Active backlogs allowed', value: formatNumber(criteria.maxActiveBacklogs ?? 0) },
    { label: 'Cleared backlogs', value: criteria.allowClearedBacklogs ? 'Allowed' : 'Not allowed' },
    { label: 'Minimum attendance', value: criteria.minAttendance ? `${criteria.minAttendance}%` : 'Any' },
    { label: 'Graduation year', value: criteria.graduationYear ?? 'Any' },
    { label: 'Branches', value: criteria.branches?.length ? criteria.branches.join(', ') : 'All' },
  ]
}

function StatusSelect({ drive, row }) {
  const setStatus = useSetApplicationStatus()
  // Ineligible students cannot be put forward, but an existing application can still be updated.
  if (row.gaps.length > 0 && row.status === 'not-applied') return <span className="text-muted-foreground text-xs">{row.gaps.join(' · ')}</span>
  return (
    <>
      <label htmlFor={`status-${row.rollNumber}`} className="sr-only">
        Application status for {row.name}
      </label>
      <NativeSelect
        id={`status-${row.rollNumber}`}
        className="w-36"
        value={row.status}
        disabled={setStatus.isPending}
        onChange={(event) =>
          setStatus.mutate({ driveId: drive.id, rollNumber: row.rollNumber, status: event.target.value }, { onError: (error) => toast.error(error.message) })
        }
      >
        {APPLICATION_STATUSES.map((status) => (
          <NativeSelectOption key={status} value={status}>
            {STATUS_LABELS[status]}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </>
  )
}

function DriveView({ drive, pool }) {
  const [view, setView] = useState('eligible')
  const [branch, setBranch] = useState('')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(false)

  const rows = pool.map((student) => ({ ...student, gaps: eligibilityGaps(student, drive.criteria), status: drive.applications[student.rollNumber] ?? 'not-applied' }))
  const count = (status) => Object.values(drive.applications).filter((value) => value === status).length
  const term = search.trim().toLowerCase()
  const visible = rows
    .filter(VIEWS.find((entry) => entry.value === view).test)
    .filter((row) => !branch || row.department === branch)
    .filter((row) => !term || `${row.name} ${row.rollNumber} ${row.email ?? ''}`.toLowerCase().includes(term))
    .sort((a, b) => (b.cgpa ?? 0) - (a.cgpa ?? 0))
  const branches = [...new Set(pool.map((student) => student.department))].sort()
  const graduationYears = [...new Set(pool.map((student) => student.graduationYear))].sort()

  const columns = [
    {
      key: 'name',
      header: 'Student',
      cell: (row) => (
        <div>
          <p className="text-heading font-medium">{row.name}</p>
          <p className="text-muted-foreground text-xs">
            {row.rollNumber} · {row.department} · graduates {row.graduationYear}
          </p>
        </div>
      ),
    },
    { key: 'cgpa', header: 'CGPA', align: 'right', cell: (row) => row.cgpa?.toFixed(2) ?? '—', className: 'text-heading tabular-nums font-medium' },
    {
      key: 'backlogs',
      header: 'Backlogs',
      cell: (row) => (
        <div className="flex flex-col items-start gap-1">
          {row.backlogs > 0 ? <StatusBadge status="backlog" label={`${row.backlogs} active`} /> : <StatusBadge status="cleared" label="None active" />}
          {row.clearedBacklogs > 0 && <span className="text-muted-foreground text-xs">{row.clearedBacklogs} cleared earlier</span>}
          {!row.recordsVerified && <StatusBadge status="pending" label="Unverified" />}
        </div>
      ),
    },
    { key: 'attendancePercentage', header: 'Attendance', align: 'right', cell: (row) => <ValueBadge value={formatPercent(row.attendancePercentage)} warn={isLowAttendance(row.attendancePercentage)} /> },
    { key: 'resume', header: 'Resume', cell: (row) => (row.resumeSubmitted ? <StatusBadge status="completed" label="Submitted" /> : <StatusBadge status="pending" label="Missing" />) },
    { key: 'status', header: 'Application', cell: (row) => <StatusSelect drive={drive} row={row} /> },
  ]

  return (
    <>
      <section aria-label={`${drive.company} summary`} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Eligible" value={formatNumber(rows.filter((row) => row.gaps.length === 0).length)} icon={Briefcase} tone="blue" hint={`of ${formatNumber(rows.length)} in the pool`} />
        <StatCard label="Applied" value={formatNumber(count('applied') + count('shortlisted') + count('selected') + count('rejected'))} icon={Briefcase} tone="purple" />
        <StatCard label="Shortlisted" value={formatNumber(count('shortlisted'))} icon={Briefcase} tone="orange" />
        <StatCard label="Selected" value={formatNumber(count('selected'))} icon={Briefcase} tone="green" />
      </section>
      <SectionCard
        title={`${drive.company} · ${drive.role}`}
        description={`${drive.package} · drive on ${formatDate(drive.driveDate)}`}
        icon={Briefcase}
        action={
          <Button variant="outline" size="lg" onClick={() => setEditing(true)}>
            <Pencil aria-hidden /> Edit criteria
          </Button>
        }
      >
        <DetailList columns={3} items={criteriaItems(drive.criteria)} />
      </SectionCard>
      <DataTable
        caption={`Students for ${drive.company}`}
        columns={columns}
        rows={visible}
        getRowKey={(row) => row.rollNumber}
        emptyTitle="No students in this view"
        emptyDescription="Try another view, branch or search."
        minWidth={860}
        toolbar={
          <div className="flex flex-col gap-3">
            <FilterChips label="Show" options={VIEWS} value={view} onChange={setView} />
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search name, roll number or email"
              searchLabel="Search students"
              actions={
                <Button variant="outline" size="lg" disabled={visible.length === 0} onClick={() => downloadText(`${drive.id}-${view}.csv`, toCsv(CSV_COLUMNS, visible))}>
                  <Download aria-hidden /> Export list
                </Button>
              }
            >
              <label htmlFor="drive-branch" className="sr-only">
                Branch
              </label>
              <NativeSelect id="drive-branch" size="lg" className="w-full sm:w-40" value={branch} onChange={(event) => setBranch(event.target.value)}>
                <NativeSelectOption value="">All branches</NativeSelectOption>
                {branches.map((code) => (
                  <NativeSelectOption key={code} value={code}>
                    {code}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </FilterBar>
          </div>
        }
      />
      {editing && <CriteriaModal drive={drive} graduationYears={graduationYears} onClose={() => setEditing(false)} />}
    </>
  )
}

/** Company drives: each company's criteria, the students who meet them, and where each application stands. */
export function PlacementDrivesPage() {
  useDocumentTitle('Placement Drives')
  const drives = usePlacementDrives()
  const pool = usePlacementPool()
  const [selected, setSelected] = useState(null)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Placement drives" description="Set each company's criteria, see who qualifies, and track applications." icon={Briefcase} preview />
      <QueryView
        query={drives}
        skeleton={<ListSkeleton rows={3} />}
        isEmpty={(items) => items.length === 0}
        empty={{ icon: Briefcase, title: 'No drives scheduled' }}
      >
        {(items) => {
          const drive = items.find((entry) => entry.id === selected) ?? items[0]
          return (
            <>
              <FilterChips
                label="Company"
                options={[...items].sort((a, b) => a.driveDate.localeCompare(b.driveDate)).map((entry) => ({ value: entry.id, label: `${entry.company} · ${formatDate(entry.driveDate)}` }))}
                value={drive.id}
                onChange={setSelected}
              />
              {pool.isError ? <ErrorState error={pool.error} onRetry={pool.refetch} /> : pool.data ? <DriveView key={drive.id} drive={drive} pool={pool.data} /> : <ListSkeleton rows={4} />}
            </>
          )
        }}
      </QueryView>
      <PreviewNotice>Drives, criteria and application statuses are kept in this preview. Exports are CSV files that open in Excel.</PreviewNotice>
    </div>
  )
}
