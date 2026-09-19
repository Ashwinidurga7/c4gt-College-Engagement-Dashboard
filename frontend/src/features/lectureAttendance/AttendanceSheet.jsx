import { Check, Loader2, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { ErrorState } from '@/components/common/ErrorState'
import { SectionCard } from '@/components/common/SectionCard'
import { ListSkeleton } from '@/components/common/Skeleton'
import { Button } from '@/components/ui/button'
import { useSectionStudents, useSubmitAttendance } from '@/hooks/usePreview'
import { cn } from '@/lib/utils'

/** Everyone starts present; tap a student to toggle. Status is shown as text and icon, not colour alone. */
export function AttendanceSheet({ entry, date, onDone }) {
  const students = useSectionStudents(entry.section)
  const submit = useSubmitAttendance()
  const [absent, setAbsent] = useState(() => new Set())

  if (students.isPending) return <ListSkeleton rows={5} />
  if (students.isError) return <ErrorState error={students.error} onRetry={students.refetch} />

  const list = students.data
  const present = list.length - absent.size
  const toggle = (id) =>
    setAbsent((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  function save() {
    submit.mutate(
      { section: entry.section, subject: entry.subject, slot: entry.slot, date, present, absent: absent.size, total: list.length, absentees: [...absent] },
      { onSuccess: onDone, onError: (error) => toast.error(error.message) },
    )
  }

  return (
    <SectionCard
      title={`${entry.subject} · Section ${entry.section}`}
      description={`${list.length} students. Marked absent: ${absent.size}.`}
      action={
        <div className="flex gap-2">
          <Button variant="outline" size="lg" onClick={() => setAbsent(new Set())}>
            All present
          </Button>
          <Button size="lg" onClick={save} disabled={submit.isPending}>
            {submit.isPending && <Loader2 className="animate-spin" aria-hidden />}
            Submit ({present}/{list.length})
          </Button>
        </div>
      }
    >
      <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((student) => {
          const isAbsent = absent.has(student.id)
          return (
            <li key={student.id}>
              <button
                type="button"
                aria-pressed={isAbsent}
                onClick={() => toggle(student.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors',
                  isAbsent ? 'bg-danger-soft border-danger' : 'hover:bg-muted',
                )}
              >
                <span className={cn('flex size-7 shrink-0 items-center justify-center rounded-full', isAbsent ? 'bg-danger text-primary-foreground' : 'bg-success-soft text-success-text')}>
                  {isAbsent ? <X className="size-4" aria-hidden /> : <Check className="size-4" aria-hidden />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-heading block truncate text-sm font-medium">{student.name}</span>
                  <span className="text-muted-foreground block text-xs">{student.rollNumber}</span>
                </span>
                <span className={cn('text-xs font-semibold', isAbsent ? 'text-danger-text' : 'text-success-text')}>{isAbsent ? 'Absent' : 'Present'}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </SectionCard>
  )
}
