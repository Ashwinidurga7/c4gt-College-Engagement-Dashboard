import { ClipboardCheck, History } from 'lucide-react'
import { useState } from 'react'
import { EmptyState } from '@/components/common/EmptyState'
import { FormField } from '@/components/common/FormField'
import { PageHeader } from '@/components/common/PageHeader'
import { PreviewNotice } from '@/components/common/PreviewNotice'
import { QueryView } from '@/components/common/QueryView'
import { SectionCard } from '@/components/common/SectionCard'
import { ListSkeleton } from '@/components/common/Skeleton'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { AttendanceSheet } from '@/features/lectureAttendance/AttendanceSheet'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useAttendanceSessions, useFacultyClasses } from '@/hooks/usePreview'
import { formatDate, formatDateTime } from '@/lib/formatters'
import { DAYS } from '@/lib/timetable'

function todayIso() {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

/** Faculty lecture attendance: pick a scheduled class, mark students, submit. */
export function TakeAttendancePage() {
  useDocumentTitle('Take Attendance')
  const classes = useFacultyClasses()
  const sessions = useAttendanceSessions()
  const [classId, setClassId] = useState('')
  const [date, setDate] = useState(todayIso)

  const weekday = DAYS[(new Date(`${date}T00:00:00`).getDay() + 6) % 7]
  const selected = classes.data?.find((entry) => entry.id === classId)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Take attendance" description="Mark attendance for a class from your timetable." icon={ClipboardCheck} preview />
      <QueryView
        query={classes}
        skeleton={<ListSkeleton rows={2} />}
        isEmpty={(items) => items.length === 0}
        empty={{ icon: ClipboardCheck, title: 'No classes in your timetable', description: 'Classes assigned to you appear here.' }}
      >
        {(items) => {
          const sorted = [...items].sort((a, b) => (a.day === weekday ? -1 : 0) - (b.day === weekday ? -1 : 0) || DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || a.slot.localeCompare(b.slot))
          return (
            <SectionCard title="Class" icon={ClipboardCheck}>
              <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
                <FormField id="attendance-class" label="Scheduled class">
                  <NativeSelect id="attendance-class" size="lg" className="w-full" value={classId} onChange={(event) => setClassId(event.target.value)}>
                    <NativeSelectOption value="">Choose a class</NativeSelectOption>
                    {sorted.map((entry) => (
                      <NativeSelectOption key={entry.id} value={entry.id}>
                        {entry.day === weekday ? 'Today · ' : `${entry.day} · `}
                        {entry.slot} · {entry.subject} · Section {entry.section}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </FormField>
                <FormField id="attendance-date" label="Date">
                  <Input id="attendance-date" type="date" className="bg-card h-11" value={date} max={todayIso()} onChange={(event) => setDate(event.target.value)} />
                </FormField>
              </div>
            </SectionCard>
          )
        }}
      </QueryView>
      {selected && <AttendanceSheet key={`${selected.id}-${date}`} entry={selected} date={date} onDone={() => setClassId('')} />}
      <SectionCard title="Submitted sessions" icon={History}>
        {sessions.data?.length ? (
          <ul className="divide-y">
            {sessions.data.map((session) => (
              <li key={session.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm first:pt-0 last:pb-0">
                <span className="text-heading font-medium">
                  {session.subject} · Section {session.section} · {formatDate(session.date)} {session.slot}
                </span>
                <span className="text-muted-foreground">
                  {session.present}/{session.total} present · saved {formatDateTime(session.submittedAt)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={History} title="No attendance submitted yet" className="py-6" />
        )}
      </SectionCard>
      <PreviewNotice>Attendance entered here is kept in this preview and is not yet sent to student records.</PreviewNotice>
    </div>
  )
}
