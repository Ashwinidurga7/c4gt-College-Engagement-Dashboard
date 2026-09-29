import { BellRing, CalendarClock, ExternalLink, Megaphone, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { FilterChips } from '@/components/common/FilterChips'
import { PageHeader } from '@/components/common/PageHeader'
import { PreviewNotice } from '@/components/common/PreviewNotice'
import { QueryView } from '@/components/common/QueryView'
import { ListSkeleton } from '@/components/common/Skeleton'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { NoticeFormModal } from '@/features/exams/NoticeFormModal'
import { NOTICE_CATEGORIES } from '@/features/exams/noticeCategories'
import { useAuth } from '@/hooks/useAuth'
import { useConfirmAction } from '@/hooks/useConfirmAction'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useDeleteExamNotice, useExamNotices } from '@/hooks/usePreview'
import { useStudentAcademic } from '@/hooks/useStudent'
import { formatDate } from '@/lib/formatters'

/** Every student here is on the B.Tech programme; other programmes appear under All notices. */
const STUDENT_COURSE = 'B.Tech'

/**
 * A notice concerns the student when it is for their course and regulation and for their current semester,
 * the results of the semester just finished, or a semester where they still have a backlog to clear.
 * Circulars for everyone always do.
 */
function isRelevant(notice, academic) {
  if (notice.course === 'All') return true
  if (notice.course !== STUDENT_COURSE || (notice.regulation && notice.regulation !== academic.regulation)) return false
  const backlogSemesters = academic.backlogSubjects.filter((subject) => subject.status === 'active').map((subject) => subject.semester)
  return (
    notice.semester === academic.currentSemester ||
    (notice.category === 'results' && notice.semester === academic.currentSemester - 1) ||
    (notice.examType === 'Supplementary' && backlogSemesters.includes(notice.semester))
  )
}

function relevanceNote(notice, academic) {
  return notice.examType === 'Supplementary' && notice.semester !== academic.currentSemester ? 'You have a backlog in this semester' : null
}

function Filter({ id, label, value, onChange, options, allLabel, format = (value) => value }) {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <NativeSelect id={id} size="lg" className="w-full sm:w-40" value={value} onChange={(event) => onChange(event.target.value)}>
        <NativeSelectOption value="">{allLabel}</NativeSelectOption>
        {options.map((option) => (
          <NativeSelectOption key={option} value={String(option)}>
            {format(option)}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </>
  )
}

const unique = (values) => [...new Set(values.filter((value) => value != null))].sort((a, b) => String(a).localeCompare(String(b), 'en-IN', { numeric: true }))

function NoticeList({ notices, academic }) {
  const [scope, setScope] = useState('mine')
  const [filters, setFilters] = useState({ category: '', course: '', regulation: '', semester: '', examType: '' })
  const set = (key) => (value) => setFilters((current) => ({ ...current, [key]: value }))

  const visible = notices.filter(
    (notice) =>
      (scope === 'all' || isRelevant(notice, academic)) &&
      (!filters.category || notice.category === filters.category) &&
      (!filters.course || notice.course === filters.course) &&
      (!filters.regulation || notice.regulation === filters.regulation) &&
      (!filters.semester || notice.semester === Number(filters.semester)) &&
      (!filters.examType || notice.examType === filters.examType),
  )
  const fresh = notices.filter((notice) => notice.isNew && isRelevant(notice, academic))

  return (
    <>
      {fresh.length > 0 && (
        <div role="status" className="bg-info-soft border-info flex gap-3 rounded-xl border-l-4 p-4">
          <BellRing className="text-info-text mt-0.5 size-5 shrink-0" aria-hidden />
          <p className="text-heading text-sm font-semibold">
            {fresh.length} new {fresh.length === 1 ? 'notice concerns' : 'notices concern'} you this week: {fresh.map((notice) => NOTICE_CATEGORIES[notice.category].toLowerCase()).join(', ')}.
          </p>
        </div>
      )}
      <div className="flex flex-col gap-3">
        <FilterChips
          label="Show"
          options={[
            { value: 'mine', label: `For ${academic.regulation ?? 'my regulation'}, semester ${academic.currentSemester ?? ''}` },
            { value: 'all', label: 'All notices' },
          ]}
          value={scope}
          onChange={setScope}
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Filter id="notice-category" label="Type" value={filters.category} onChange={set('category')} options={Object.keys(NOTICE_CATEGORIES)} allLabel="All types" format={(key) => NOTICE_CATEGORIES[key]} />
          <Filter id="notice-course" label="Course" value={filters.course} onChange={set('course')} options={unique(notices.map((notice) => notice.course))} allLabel="All courses" />
          <Filter id="notice-regulation" label="Regulation" value={filters.regulation} onChange={set('regulation')} options={unique(notices.map((notice) => notice.regulation))} allLabel="All regulations" />
          <Filter id="notice-semester" label="Semester" value={filters.semester} onChange={set('semester')} options={unique(notices.map((notice) => notice.semester))} allLabel="All semesters" format={(value) => `Semester ${value}`} />
          <Filter id="notice-exam-type" label="Examination" value={filters.examType} onChange={set('examType')} options={unique(notices.map((notice) => notice.examType))} allLabel="Regular and supplementary" />
        </div>
      </div>
      {visible.length === 0 ? (
        <EmptyState icon={Megaphone} title="No notices match" description="Try All notices or clear a filter." />
      ) : (
        <ul className="bg-card shadow-soft divide-y rounded-xl border">
          {visible.map((notice) => (
            <li key={notice.id} className="flex flex-wrap items-start gap-4 p-4 sm:p-5">
              <div className="min-w-60 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status="important" label={NOTICE_CATEGORIES[notice.category]} />
                  {notice.isNew && <StatusBadge status="urgent" label="New" />}
                  {relevanceNote(notice, academic) && isRelevant(notice, academic) && <span className="text-warning-text text-xs font-semibold">{relevanceNote(notice, academic)}</span>}
                </div>
                <h2 className="text-heading mt-2 text-sm font-semibold">{notice.title}</h2>
                {notice.summary && <p className="text-body mt-1 text-sm">{notice.summary}</p>}
                <p className="text-muted-foreground mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  <span>Published {formatDate(notice.publishedOn)}</span>
                  {notice.deadline && (
                    <span className="text-danger-text inline-flex items-center gap-1 font-semibold">
                      <CalendarClock className="size-3.5" aria-hidden /> Last date {formatDate(notice.deadline)}
                    </span>
                  )}
                </p>
              </div>
              <Button asChild variant="outline" size="lg">
                <a href={notice.sourceUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink aria-hidden /> Official notice<span className="sr-only"> on the JNTUK website (opens in a new tab)</span>
                </a>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

/** Who a notice is for, as the admin list shows it. */
function audience(notice) {
  return [notice.course === 'All' ? 'All courses' : notice.course, notice.regulation, notice.semester && `Semester ${notice.semester}`, notice.examType].filter(Boolean).join(' · ')
}

/** Every notice, newest first, with add, edit and delete. */
function AdminNotices() {
  const notices = useExamNotices()
  const [editor, setEditor] = useState(null)
  const remove = useConfirmAction(useDeleteExamNotice(), (notice) => notice)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="JNTUK exam notices"
        description="Add, edit and remove the examination notices students see. Each student sees the ones for their course, regulation and semester first."
        icon={Megaphone}
        preview
        actions={
          <Button size="lg" onClick={() => setEditor({ notice: null })}>
            <Plus aria-hidden /> Add notice
          </Button>
        }
      />
      <QueryView query={notices} skeleton={<ListSkeleton rows={4} />} isEmpty={(items) => items.length === 0} empty={{ icon: Megaphone, title: 'No notices yet', description: 'Add one and students see it straight away.' }}>
        {(items) => (
          <ul className="bg-card shadow-soft divide-y rounded-xl border">
            {items.map((notice) => (
              <li key={notice.id} className="flex flex-wrap items-start gap-4 p-4 sm:p-5">
                <div className="min-w-60 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status="important" label={NOTICE_CATEGORIES[notice.category]} />
                    <span className="text-muted-foreground text-xs">{audience(notice)}</span>
                  </div>
                  <h2 className="text-heading mt-2 text-sm font-semibold">{notice.title}</h2>
                  <p className="text-muted-foreground mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <span>Published {formatDate(notice.publishedOn)}</span>
                    {notice.deadline && <span>Last date {formatDate(notice.deadline)}</span>}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="lg" onClick={() => setEditor({ notice })}>
                    <Pencil aria-hidden /> Edit<span className="sr-only">: {notice.title}</span>
                  </Button>
                  <Button variant="ghost" size="icon-lg" className="text-danger-text" aria-label={`Delete ${notice.title}`} onClick={() => remove.request(notice)}>
                    <Trash2 />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </QueryView>
      {editor && <NoticeFormModal notice={editor.notice} open onOpenChange={(open) => !open && setEditor(null)} />}
      <ConfirmDialog
        {...remove.dialogProps}
        title="Delete this notice?"
        description={remove.target && `"${remove.target.title}" is removed for every student.`}
        confirmLabel="Delete"
        pendingLabel="Deleting…"
      />
    </div>
  )
}

/** JNTUK examination notices, narrowed to the student's course, regulation, semester and backlogs by default. */
export function ExamNoticesPage() {
  useDocumentTitle('Exam Notices')
  return useAuth().user?.role === 'admin' ? <AdminNotices /> : <StudentNotices />
}

function StudentNotices() {
  const notices = useExamNotices()
  const academic = useStudentAcademic()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="JNTUK exam notices" description="Timetables, fee dates, hall tickets, results and circulars from the university, in one place." icon={Megaphone} preview />
      <QueryView query={notices} skeleton={<ListSkeleton rows={4} />} isEmpty={(items) => items.length === 0} empty={{ icon: Megaphone, title: 'No notices yet' }}>
        {(items) =>
          academic.isError ? (
            <ErrorState error={academic.error} onRetry={academic.refetch} />
          ) : academic.data ? (
            <NoticeList notices={items} academic={academic.data} />
          ) : (
            <ListSkeleton rows={4} />
          )
        }
      </QueryView>
      <PreviewNotice>
        These are sample notices. Once the backend collects notices from jntuk.edu.in, the real ones appear here and email alerts follow your notification settings.
      </PreviewNotice>
    </div>
  )
}
