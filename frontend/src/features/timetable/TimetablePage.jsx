import { CalendarClock, ScanSearch } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { PreviewNotice } from '@/components/common/PreviewNotice'
import { EmptyState } from '@/components/common/EmptyState'
import { QueryView } from '@/components/common/QueryView'
import { TableSkeleton } from '@/components/common/Skeleton'
import { Button } from '@/components/ui/button'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { ConflictPanel } from '@/features/timetable/ConflictPanel'
import { TimetableGrid } from '@/features/timetable/TimetableGrid'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useTimetable } from '@/hooks/usePreview'
import { detectConflicts } from '@/lib/timetable'

const MANAGERS = ['hod', 'admin', 'ctpo']

/** Which classes a role sees by default: own section, own teaching, or a chosen section. */
function initialView(user) {
  if (user.role === 'faculty') return 'mine'
  if ((user.role === 'student' || user.role === 'ctpo') && user.year && user.section) return `${user.year}${user.section}`
  return '3A'
}

export function TimetablePage() {
  useDocumentTitle('Timetable')
  const { user } = useAuth()
  const query = useTimetable()
  const [view, setView] = useState(() => initialView(user))
  const [checked, setChecked] = useState(false)
  const canManage = MANAGERS.includes(user.role)
  const canChooseSection = user.role === 'hod' || user.role === 'admin'

  const entries = useMemo(() => query.data?.entries ?? [], [query.data])
  const visible = useMemo(() => (view === 'mine' ? entries.filter((entry) => entry.faculty === user.name) : entries.filter((entry) => entry.section === view)), [entries, view, user.name])
  const conflicts = useMemo(() => {
    if (!checked) return []
    const ids = new Set(visible.map((entry) => entry.id))
    return detectConflicts(entries).filter((conflict) => conflict.entries.some((entry) => ids.has(entry.id)))
  }, [checked, entries, visible])
  const conflictIds = useMemo(() => new Set(conflicts.flatMap((conflict) => conflict.entries.map((entry) => entry.id))), [conflicts])
  const sectionLabel = query.data?.sections.find((section) => section.value === view)?.label

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Timetable"
        description={view === 'mine' ? 'Your weekly teaching schedule.' : `Weekly timetable for ${sectionLabel ?? 'the section'}.`}
        icon={CalendarClock}
        preview
        actions={
          canManage && (
            <Button size="lg" onClick={() => setChecked(true)}>
              <ScanSearch aria-hidden /> Detect conflicts
            </Button>
          )
        }
      />
      <QueryView query={query} skeleton={<TableSkeleton rows={8} columns={7} />}>
        {(data) => (
          <>
            {canChooseSection && (
              <div className="flex flex-col gap-1.5 sm:w-72">
                <label htmlFor="timetable-section" className="text-heading text-sm font-semibold">
                  Section
                </label>
                <NativeSelect id="timetable-section" size="lg" className="w-full" value={view} onChange={(event) => setView(event.target.value)}>
                  {data.sections.map((section) => (
                    <NativeSelectOption key={section.value} value={section.value}>
                      {section.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
            )}
            {canManage && checked && <ConflictPanel conflicts={conflicts} entries={entries} preferredSection={view === 'mine' ? undefined : view} />}
            {visible.length ? (
              <TimetableGrid entries={visible} conflictIds={conflictIds} showSection={view === 'mine'} caption={view === 'mine' ? 'My teaching schedule' : `Timetable for ${sectionLabel}`} />
            ) : (
              <EmptyState
                icon={CalendarClock}
                className="bg-card rounded-xl border"
                title={view === 'mine' ? 'No classes assigned to you' : 'No classes scheduled'}
                description={view === 'mine' ? 'Your teaching schedule appears here once the department assigns your classes.' : 'This section has no timetable yet.'}
              />
            )}
          </>
        )}
      </QueryView>
      <PreviewNotice />
    </div>
  )
}
