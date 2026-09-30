import { Check, CloudOff, FileUser, History, Loader2, RotateCcw } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { StatGridSkeleton } from '@/components/common/Skeleton'
import { Button } from '@/components/ui/button'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { TEMPLATES } from '@/features/student/resume/pdf/resumeTheme'
import { createDraftActions } from '@/features/student/resume/resumeDraftActions'
import { ResumeHistory } from '@/features/student/resume/ResumeHistory'
import { ResumeWorkspace } from '@/features/student/resume/ResumeWorkspace'
import { useResumeData } from '@/features/student/resume/useResumeData'
import { useResumeDraft } from '@/features/student/resume/useResumeDraft'
import { useHistoryRecorder, useResumeVersions } from '@/features/student/resume/useResumeVersions'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { formatDateTime } from '@/lib/formatters'

function DraftStatus({ status }) {
  const content = {
    saving: [Loader2, 'Saving…', 'animate-spin'],
    saved: [Check, status.at ? `Saved to your account ${formatDateTime(status.at)}` : 'Saved to your account'],
    local: [CloudOff, 'Saved in this browser only. Your account copy updates with your next edit once the connection is back.'],
    unavailable: [CloudOff, 'Not saved: your account and this browser could not be reached'],
  }[status.state]
  if (!content) return null
  const [Icon, label, iconClass] = content
  return (
    <p aria-live="polite" className="text-muted-foreground flex items-center gap-1.5 text-xs">
      <Icon className={`size-3.5 ${iconClass ?? ''}`} aria-hidden /> {label}
    </p>
  )
}

/**
 * Resume Builder: reads the student's profile, academics and portfolio, lets them adjust it,
 * and produces a PDF. Edits are saved to the student's account as they go (see useResumeDraft),
 * and past resumes are kept in the student's history (see useResumeVersions): the resume as it was
 * before the first edit of each visit, each download or save, and before a restore or reset.
 */
export function ResumeBuilderPage() {
  useDocumentTitle('Resume Builder')
  const { user } = useAuth()
  const data = useResumeData()
  const { draft, update, reset, status } = useResumeDraft(user.id)
  const history = useResumeVersions()
  const [confirmReset, setConfirmReset] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)

  const { record, edit, restore } = useHistoryRecorder({ base: data.base, draft, update, snapshot: history.snapshot })
  const actions = useMemo(() => createDraftActions(edit), [edit])
  const onExported = useCallback((reason) => record(reason).catch(() => {}), [record])

  async function restoreVersion(version) {
    await restore(version)
    setHistoryOpen(false)
    toast.success(`Restored your resume from ${formatDateTime(version.createdAt)}. The one you had is kept in your history.`)
  }
  const template = draft.template ?? 'classic'

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Resume Builder"
        description="Built from your profile, results and portfolio. Review it, fill the gaps and download a PDF."
        icon={FileUser}
        actions={
          <div className="flex flex-col gap-2 sm:items-end">
            <div className="flex flex-wrap items-end gap-2">
              <div className="flex flex-col gap-1">
                <label htmlFor="resume-template" className="text-heading text-xs font-semibold">
                  Template
                </label>
                <NativeSelect id="resume-template" size="lg" value={template} onChange={(event) => actions.setTemplate(event.target.value)}>
                  {TEMPLATES.map((option) => (
                    <NativeSelectOption key={option.value} value={option.value}>
                      {option.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
              <Button variant="outline" size="lg" onClick={() => setHistoryOpen(true)}>
                <History aria-hidden /> History
              </Button>
              <Button variant="outline" size="lg" onClick={() => setConfirmReset(true)}>
                <RotateCcw aria-hidden /> Reset to profile data
              </Button>
            </div>
            <DraftStatus status={status} />
          </div>
        }
      />

      {data.isPending && <StatGridSkeleton />}
      {data.error && <ErrorState error={data.error} onRetry={data.retry} />}
      {data.failed.length > 0 && (
        <p role="alert" className="bg-warning-soft text-warning-text flex flex-wrap items-center gap-2 rounded-lg px-3 py-2 text-sm">
          Some records could not be loaded ({data.failed.join(', ')}), so those sections may be incomplete.
          <Button size="sm" variant="outline" onClick={data.retry}>
            Try again
          </Button>
        </p>
      )}
      {data.base && <ResumeWorkspace base={data.base} draft={draft} actions={actions} onExported={onExported} />}

      <ResumeHistory open={historyOpen} onOpenChange={setHistoryOpen} history={history} onSaveNow={() => record('manual')} onRestore={restoreVersion} />

      <ConfirmDialog
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title="Reset to profile data?"
        description="Your edits (skills, summary, school marks, links, bullet points, choices, section order and template) will be discarded. The current resume is kept in your history, so you can restore it. Your profile and portfolio are not changed."
        confirmLabel="Reset"
        onConfirm={() => {
          record('reset').catch(() => {})
          reset()
          setConfirmReset(false)
        }}
      />
    </div>
  )
}
