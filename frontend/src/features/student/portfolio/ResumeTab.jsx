import { Eye, FileText, Loader2, Star, Trash2, Upload } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { FilePicker } from '@/components/common/FilePicker'
import { Button } from '@/components/ui/button'
import { resumeFileSchema } from '@/features/student/portfolio/portfolioSchemas'
import { TabSection } from '@/features/student/portfolio/TabSection'
import { useConfirmAction } from '@/hooks/useConfirmAction'
import { useDeleteResume, useResumes, useSetPrimaryResume, useUploadResume } from '@/hooks/usePortfolio'
import { formatFileSize } from '@/lib/files'
import { formatDateTime } from '@/lib/formatters'

function ResumeUploader() {
  const upload = useUploadResume()
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)

  function submit(event) {
    event.preventDefault()
    const result = resumeFileSchema.safeParse(file)
    if (!result.success) {
      setError(result.error.issues[0].message)
      return
    }
    upload.mutate(file, { onSuccess: () => setFile(null), onError: (err) => setError(err.message) })
  }

  return (
    <form onSubmit={submit} noValidate className="bg-card shadow-soft flex flex-col gap-3 rounded-xl border p-5">
      <h3 id="resume-upload-label" className="font-semibold">
        Upload a new resume
      </h3>
      <FilePicker
        id="resume-file"
        value={file}
        onChange={(next) => {
          setFile(next)
          setError(null)
        }}
        accept="application/pdf"
        hint="PDF only, up to 5 MB"
        invalid={Boolean(error)}
        describedBy={error ? 'resume-file-error' : 'resume-upload-label'}
      />
      {error && (
        <p id="resume-file-error" role="alert" className="text-danger-text text-xs font-medium">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" className="self-start" disabled={upload.isPending}>
        {upload.isPending ? <Loader2 className="animate-spin" aria-hidden /> : <Upload aria-hidden />}
        {upload.isPending ? 'Uploading…' : 'Upload resume'}
      </Button>
    </form>
  )
}

export function ResumeTab() {
  const query = useResumes()
  const setPrimary = useSetPrimaryResume()
  const remove = useConfirmAction(useDeleteResume())

  return (
    <TabSection
      title="Resume"
      description="Your primary resume is the one shared with placement officers."
      count={query.data?.length}
      query={query}
      toolbar={<ResumeUploader />}
      isEmpty={(resumes) => resumes.length === 0}
      empty={{ icon: FileText, title: 'No resume uploaded', description: 'Upload a PDF resume so it is ready for placement drives.' }}
      render={(resumes) => (
        <ul className="bg-card shadow-soft divide-y rounded-xl border">
          {resumes.map((resume) => (
            <li key={resume.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="bg-danger-soft text-danger-text flex size-10 shrink-0 items-center justify-center rounded-lg">
                  <FileText className="size-5" strokeWidth={1.75} aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-heading flex flex-wrap items-center gap-2 font-medium">
                    <span className="truncate">{resume.fileName}</span>
                    {resume.isPrimary && (
                      <span className="bg-success-soft text-success-text inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold">
                        <Star className="size-3 fill-current" aria-hidden /> Primary
                      </span>
                    )}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {formatFileSize(resume.size)} · Uploaded {formatDateTime(resume.uploadedAt)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1">
                {resume.fileUrl && (
                  <Button asChild variant="ghost" size="lg">
                    <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Eye aria-hidden /> View<span className="sr-only"> {resume.fileName} (opens in a new tab)</span>
                    </a>
                  </Button>
                )}
                {!resume.isPrimary && (
                  <Button
                    variant="outline"
                    size="lg"
                    disabled={setPrimary.isPending}
                    onClick={() => setPrimary.mutate(resume.id, { onError: (error) => toast.error(error.message) })}
                  >
                    <Star aria-hidden /> Set as primary<span className="sr-only">: {resume.fileName}</span>
                  </Button>
                )}
                <Button variant="ghost" size="icon-lg" className="text-danger-text" aria-label={`Delete ${resume.fileName}`} onClick={() => remove.request(resume)}>
                  <Trash2 />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    >
      <ConfirmDialog
        {...remove.dialogProps}
        title="Delete this resume?"
        description={
          remove.target &&
          `${remove.target.fileName} will be deleted.${remove.target.isPrimary ? ' It is your primary resume, so set another one as primary afterwards.' : ''}`
        }
        confirmLabel="Delete"
        pendingLabel="Deleting…"
      />
    </TabSection>
  )
}
