import { Check, CloudOff, FileUser, Loader2, RotateCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { StatGridSkeleton } from '@/components/common/Skeleton'
import { Button } from '@/components/ui/button'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { TEMPLATES } from '@/features/student/resume/pdf/resumeTheme'
import { createDraftActions } from '@/features/student/resume/resumeDraftActions'
import { ResumeWorkspace } from '@/features/student/resume/ResumeWorkspace'
import { useResumeData } from '@/features/student/resume/useResumeData'
import { useResumeDraft } from '@/features/student/resume/useResumeDraft'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { formatDateTime } from '@/lib/formatters'

function DraftStatus({ status }) {
  const content = {
    saving: [Loader2, 'Saving draft…', 'animate-spin'],
    saved: [Check, status.at ? `Draft saved ${formatDateTime(status.at)}` : 'Draft saved'],
    unavailable: [CloudOff, 'Draft not saved: browser storage is unavailable'],
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
 * and produces a PDF. Local edits live in a browser draft (see useResumeDraft).
 */
export function ResumeBuilderPage() {
  useDocumentTitle('Resume Builder')
  const { user } = useAuth()
  const data = useResumeData()
  const { draft, update, reset, status } = useResumeDraft(user.id)
  const actions = useMemo(() => createDraftActions(update), [update])
  const [confirmReset, setConfirmReset] = useState(false)
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
      {data.base && <ResumeWorkspace base={data.base} draft={draft} actions={actions} />}

      <ConfirmDialog
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title="Reset to profile data?"
        description="Your local edits (skills, summary, school marks, links, bullet points, choices, section order and template) will be discarded. Your profile and portfolio are not changed."
        confirmLabel="Reset"
        onConfirm={() => {
          reset()
          setConfirmReset(false)
        }}
      />
    </div>
  )
}
