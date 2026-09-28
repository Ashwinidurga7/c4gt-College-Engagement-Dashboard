import { CalendarOff, Check, Download, Loader2, Pencil, UsersRound, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { SectionCard } from '@/components/common/SectionCard'
import { ListSkeleton } from '@/components/common/Skeleton'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { useAttendanceDay, useSaveAttendanceDay } from '@/hooks/usePreview'
import { downloadText, toCsv } from '@/lib/csv'
import { formatDate, formatDateTime } from '@/lib/formatters'
import { cn } from '@/lib/utils'

const CSV_COLUMNS = [
  { key: 'rollNumber', header: 'Roll number' },
  { key: 'name', header: 'Name' },
  { key: 'status', header: 'Status' },
]

export function classLabel({ department, year, section }) {
  return `${department} · Year ${year} · Section ${section}`
}

function downloadDay(params, students, absentees) {
  const rows = students.map((student) => ({ ...student, status: absentees.has(student.rollNumber) ? 'Absent' : 'Present' }))
  downloadText(`attendance-${params.department}-${params.year}${params.section}-${params.date}.csv`, toCsv(CSV_COLUMNS, rows))
}

function StudentToggle({ student, absent, onToggle }) {
  return (
    <button
      type="button"
      aria-pressed={absent}
      onClick={onToggle}
      className={cn('flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors', absent ? 'bg-danger-soft border-danger' : 'hover:bg-muted')}
    >
      <span className={cn('flex size-7 shrink-0 items-center justify-center rounded-full', absent ? 'bg-danger text-primary-foreground' : 'bg-success-soft text-success-text')}>
        {absent ? <X className="size-4" aria-hidden /> : <Check className="size-4" aria-hidden />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="text-heading block truncate text-sm font-medium">{student.name}</span>
        <span className="text-muted-foreground block text-xs">{student.rollNumber}</span>
      </span>
      <span className={cn('text-xs font-semibold', absent ? 'text-danger-text' : 'text-success-text')}>{absent ? 'Absent' : 'Present'}</span>
    </button>
  )
}

/**
 * The day's register for one section. A saved register opens read-only with Edit and Download;
 * a new one starts with everyone present and the faculty member taps the absentees.
 */
export function AttendanceSheet({ params }) {
  const query = useAttendanceDay(params)
  const save = useSaveAttendanceDay()
  const [draft, setDraft] = useState(null)

  if (query.isPending) return <ListSkeleton rows={5} />
  if (query.isError) return <ErrorState error={query.error} onRetry={query.refetch} />

  const { students, record, workingDay } = query.data
  if (!workingDay) {
    return (
      <SectionCard>
        <EmptyState icon={CalendarOff} title="Not a working day" description="Sundays and holidays have no classes. Pick another date." />
      </SectionCard>
    )
  }
  if (students.length === 0) {
    return (
      <SectionCard>
        <EmptyState icon={UsersRound} title="No students in this section" description="Pick another branch, year or section." />
      </SectionCard>
    )
  }

  const editing = draft !== null || !record
  const absentees = draft ?? new Set(record?.absentees ?? [])
  const present = students.length - absentees.size

  const toggle = (rollNumber) => {
    const next = new Set(absentees)
    if (next.has(rollNumber)) next.delete(rollNumber)
    else next.add(rollNumber)
    setDraft(next)
  }

  function submit() {
    save.mutate({ ...params, absentees: [...absentees] }, { onSuccess: () => setDraft(null), onError: (error) => toast.error(error.message) })
  }

  const status = record ? `Taken by ${record.takenBy} · ${record.corrected ? 'corrected' : 'saved'} ${formatDateTime(record.submittedAt)}` : 'Not taken yet. Everyone starts as present; tap a student to mark them absent.'

  return (
    <SectionCard
      title={`${classLabel(params)} · ${formatDate(params.date)}`}
      description={`${present} of ${students.length} present. ${status}`}
      action={
        editing ? (
          <div className="flex flex-wrap gap-2">
            {record && (
              <Button variant="outline" size="lg" onClick={() => setDraft(null)}>
                Cancel
              </Button>
            )}
            <Button variant="outline" size="lg" onClick={() => setDraft(new Set())}>
              All present
            </Button>
            <Button size="lg" onClick={submit} disabled={save.isPending}>
              {save.isPending && <Loader2 className="animate-spin" aria-hidden />}
              {record ? 'Save correction' : 'Save attendance'}
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="lg" onClick={() => downloadDay(params, students, absentees)}>
              <Download aria-hidden /> Download
            </Button>
            <Button size="lg" onClick={() => setDraft(new Set(record.absentees))}>
              <Pencil aria-hidden /> Edit
            </Button>
          </div>
        )
      }
    >
      {editing ? (
        <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {students.map((student) => (
            <li key={student.rollNumber}>
              <StudentToggle student={student} absent={absentees.has(student.rollNumber)} onToggle={() => toggle(student.rollNumber)} />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="grid gap-x-6 sm:grid-cols-2 xl:grid-cols-3">
          {students.map((student) => (
            <li key={student.rollNumber} className="flex items-center justify-between gap-3 border-b py-2 text-sm">
              <span className="min-w-0">
                <span className="text-heading block truncate font-medium">{student.name}</span>
                <span className="text-muted-foreground block text-xs">{student.rollNumber}</span>
              </span>
              <StatusBadge status={absentees.has(student.rollNumber) ? 'absent' : 'present'} />
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  )
}
