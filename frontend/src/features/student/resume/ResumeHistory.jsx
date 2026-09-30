import { Download, History, Loader2, RotateCcw, Save, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { renderResumePdf } from '@/features/student/resume/pdf/renderResumePdf'
import { TEMPLATES } from '@/features/student/resume/pdf/resumeTheme'
import { resumeFileName } from '@/features/student/resume/resumeFormat'
import { saveBlob } from '@/features/student/resume/saveBlob'
import { VERSION_REASONS } from '@/features/student/resume/useResumeVersions'
import { formatDateTime } from '@/lib/formatters'

const templateLabel = (value) => TEMPLATES.find((option) => option.value === value)?.label ?? 'Classic'

function VersionRow({ version, busy, onDownload, onRestore, onDelete }) {
  const name = version.printModel?.personal?.name
  return (
    <li className="flex flex-col gap-2 py-3">
      <div className="flex flex-col gap-0.5">
        <p className="text-heading text-sm font-semibold">{formatDateTime(version.createdAt)}</p>
        <p className="text-muted-foreground text-xs">
          {VERSION_REASONS[version.reason] ?? VERSION_REASONS.manual} · {templateLabel(version.draft.template)} template{name ? ` · ${name}` : ''}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={onRestore} disabled={busy}>
          <RotateCcw aria-hidden /> Restore
        </Button>
        <Button size="sm" variant="outline" onClick={onDownload} disabled={busy || !version.printModel}>
          {busy ? <Loader2 className="animate-spin" aria-hidden /> : <Download aria-hidden />} Download
        </Button>
        <Button size="sm" variant="ghost" className="text-danger-text ml-auto" onClick={onDelete} disabled={busy}>
          <Trash2 aria-hidden /> Delete<span className="sr-only"> version from {formatDateTime(version.createdAt)}</span>
        </Button>
      </div>
    </li>
  )
}

/**
 * The student's past resumes. Each can be downloaded exactly as it was, or restored into the builder;
 * restoring first saves the current resume as a version, so it can always be undone.
 */
export function ResumeHistory({ open, onOpenChange, history, onSaveNow, onRestore }) {
  const [busyId, setBusyId] = useState(null)
  const [saving, setSaving] = useState(false)

  async function download(version) {
    setBusyId(version.id)
    try {
      const { blob } = await renderResumePdf(version.printModel)
      saveBlob(blob, resumeFileName(version.printModel.personal.name))
    } catch {
      toast.error('That version could not be turned into a PDF. Restore it and download from the builder instead.')
    } finally {
      setBusyId(null)
    }
  }

  async function saveNow() {
    setSaving(true)
    try {
      const saved = await onSaveNow()
      toast.success(saved ? 'Current resume saved to your history.' : 'Your current resume is already the latest version in your history.')
    } catch (error) {
      toast.error(error.message ?? 'The version could not be saved.')
    } finally {
      setSaving(false)
    }
  }

  const remove = (version) =>
    history.remove.mutate(version.id, {
      onSuccess: () => toast.success('Version deleted.'),
      onError: (error) => toast.error(error.message),
    })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-background gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-md">
        <SheetHeader className="mb-3 border-b pr-12">
          <SheetTitle className="flex items-center gap-2 text-base font-semibold">
            <History className="text-brand size-5" strokeWidth={1.75} aria-hidden /> Resume history
          </SheetTitle>
          <SheetDescription className="text-muted-foreground text-sm">
            Saved to your account whenever you start editing, download or save a resume. Only you can see these.
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pb-4">
          <Button variant="outline" size="lg" onClick={saveNow} disabled={saving}>
            {saving ? <Loader2 className="animate-spin" aria-hidden /> : <Save aria-hidden />} Save current version
          </Button>

          {history.error ? (
            <ErrorState error={history.error} onRetry={history.retry} />
          ) : history.isPending ? (
            <p className="text-muted-foreground flex items-center gap-2 py-6 text-sm">
              <Loader2 className="size-4 animate-spin" aria-hidden /> Loading your history…
            </p>
          ) : history.versions.length === 0 ? (
            <EmptyState icon={History} title="No versions yet" description="Your first version is saved as soon as you edit, download or save your resume." />
          ) : (
            <ul className="divide-y">
              {history.versions.map((version) => (
                <VersionRow
                  key={version.id}
                  version={version}
                  busy={busyId === version.id}
                  onDownload={() => download(version)}
                  onRestore={() => onRestore(version)}
                  onDelete={() => remove(version)}
                />
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
