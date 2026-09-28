import { DataTable } from '@/components/common/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDate } from '@/lib/formatters'

const COLUMNS = [
  { key: 'code', header: 'Code', className: 'text-muted-foreground whitespace-nowrap' },
  { key: 'name', header: 'Subject', className: 'text-heading font-medium' },
  { key: 'semester', header: 'Semester', align: 'center', className: 'tabular-nums' },
  { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status === 'active' ? 'backlog' : 'cleared'} /> },
  { key: 'clearedOn', header: 'Cleared on', cell: (row) => (row.clearedOn ? formatDate(row.clearedOn) : '—'), className: 'whitespace-nowrap' },
]

/** Active backlogs first, then cleared ones, each in semester order. */
function sortBacklogs(subjects) {
  return [...subjects].sort((a, b) => (a.status === b.status ? a.semester - b.semester : a.status === 'active' ? -1 : 1))
}

/** Every course a student has failed, active and cleared, as returned in `backlogSubjects`. */
export function BacklogDialog({ subjects, studentName, onClose }) {
  const active = subjects.filter((subject) => subject.status === 'active').length
  const cleared = subjects.length - active

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-heading text-xl">{studentName ? `Backlogs: ${studentName}` : 'Backlog subjects'}</DialogTitle>
          <DialogDescription>
            {active} active, {cleared} cleared. Active backlogs must be passed in a supplementary exam.
          </DialogDescription>
        </DialogHeader>
        <DataTable
          caption="Backlog subjects"
          columns={COLUMNS}
          rows={sortBacklogs(subjects)}
          getRowKey={(row) => `${row.semester}-${row.code}`}
          emptyTitle="No backlogs"
          minWidth={560}
        />
      </DialogContent>
    </Dialog>
  )
}
