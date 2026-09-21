import { ExternalLink, FileWarning, Loader2, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ResumeThumbnail } from '@/features/student/resume/ResumeThumbnail'

function PageLengthNotice({ pages }) {
  if (pages <= 1) return null
  const tooLong = pages > 2
  return (
    <p role="status" className="bg-warning-soft text-warning-text flex items-start gap-2 rounded-lg px-3 py-2 text-sm">
      <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>
        Your resume runs to {pages} pages. Fresher resumes work best on one page
        {tooLong ? ', and two is the most recruiters expect. Try leaving out older items.' : '. Two pages are fine if every item earns its place.'}
      </span>
    </p>
  )
}

/**
 * Live preview of the actual PDF. Tablets and desktops embed it; phones show a page thumbnail
 * and open the PDF in a new tab, because embedded PDF viewers are unreliable on phones.
 */
export function ResumePreview({ preview, resume }) {
  const ready = Boolean(preview.url)
  const updating = preview.status === 'updating' || preview.status === 'pending'

  return (
    <section aria-labelledby="resume-preview-title" className="bg-card shadow-soft flex flex-col gap-3 rounded-xl border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="resume-preview-title" className="text-base font-semibold">
          Preview <span className="text-muted-foreground text-sm font-normal">(PDF{preview.pages ? `, ${preview.pages} ${preview.pages === 1 ? 'page' : 'pages'}` : ''})</span>
        </h2>
        <p aria-live="polite" className="text-muted-foreground flex items-center gap-1.5 text-xs">
          {updating && (
            <>
              <Loader2 className="size-3.5 animate-spin" aria-hidden /> Updating preview…
            </>
          )}
        </p>
      </div>

      <PageLengthNotice pages={preview.pages} />
      {preview.unicode && (
        <p className="text-muted-foreground text-xs">Some characters need an extended font, so this PDF uses Noto Sans instead of the template font.</p>
      )}
      {preview.status === 'error' && (
        <p role="alert" className="bg-danger-soft text-danger-text flex items-center gap-2 rounded-lg px-3 py-2 text-sm">
          <FileWarning className="size-4 shrink-0" aria-hidden /> The preview could not be created. Your last edit may contain an unusual character.
        </p>
      )}

      {ready ? (
        <>
          <iframe
            src={`${preview.url}#view=FitH&navpanes=0`}
            title="Resume preview (PDF)"
            className="bg-sunken hidden aspect-[210/297] w-full rounded-lg border md:block lg:aspect-auto lg:h-[calc(100dvh-19rem)] lg:min-h-[420px]"
          />
          <div className="md:hidden">
            <ResumeThumbnail resume={resume} />
          </div>
          <Button asChild variant="outline" size="lg" className="self-center">
            <a href={preview.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink aria-hidden /> Open full preview<span className="sr-only"> of the PDF (opens in a new tab)</span>
            </a>
          </Button>
        </>
      ) : (
        <div className="bg-sunken flex aspect-[210/297] w-full max-w-[240px] items-center justify-center self-center rounded-lg border md:max-w-none">
          <Loader2 className="text-muted-foreground size-6 animate-spin" aria-hidden />
          <span className="sr-only">Creating the PDF preview</span>
        </div>
      )}
    </section>
  )
}
