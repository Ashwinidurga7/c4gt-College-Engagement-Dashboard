import { CloudUpload, Download, Loader2, ShieldAlert, Star } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { renderResumePdf } from '@/features/student/resume/pdf/renderResumePdf'
import { resumeFileName } from '@/features/student/resume/resumeFormat'
import { useSetPrimaryResume, useUploadResume } from '@/hooks/usePortfolio'

function saveBlob(blob, fileName) {
  const url = URL.createObjectURL(blob)
  const link = Object.assign(document.createElement('a'), { href: url, download: fileName })
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}

/**
 * Download (always available) and "Save to my resumes" (uploads to POST /api/resumes). A failed
 * upload never affects downloading. `ensureValid` shows the name and email errors when missing.
 */
export function ResumeActions({ printModel, ensureValid, onSaved }) {
  const [busy, setBusy] = useState(null)
  const [saved, setSaved] = useState(null)
  const upload = useUploadResume()
  const setPrimary = useSetPrimaryResume()
  const fileName = resumeFileName(printModel.personal.name)

  async function build() {
    const { blob } = await renderResumePdf(printModel)
    return blob
  }

  async function download() {
    if (!ensureValid()) return
    setBusy('download')
    try {
      saveBlob(await build(), fileName)
      toast.success(`Downloaded ${fileName}`)
    } catch {
      toast.error('The PDF could not be created. Please try again.')
    } finally {
      setBusy(null)
    }
  }

  async function saveToResumes() {
    if (!ensureValid()) return
    setBusy('save')
    try {
      const file = new File([await build()], fileName, { type: 'application/pdf' })
      const resume = await upload.mutateAsync(file)
      setSaved(resume)
      onSaved(resume.id)
    } catch (error) {
      toast.error(`${error.message ?? 'The resume could not be saved.'} You can still download the PDF.`)
    } finally {
      setBusy(null)
    }
  }

  return (
    <section aria-label="Download or save" className="bg-card shadow-soft flex flex-col gap-3 rounded-xl border p-4">
      <div className="flex flex-wrap gap-2">
        <Button size="lg" onClick={download} disabled={busy !== null}>
          {busy === 'download' ? <Loader2 className="animate-spin" aria-hidden /> : <Download aria-hidden />}
          {busy === 'download' ? 'Creating PDF…' : 'Download PDF'}
        </Button>
        <Button size="lg" variant="outline" onClick={saveToResumes} disabled={busy !== null}>
          {busy === 'save' ? <Loader2 className="animate-spin" aria-hidden /> : <CloudUpload aria-hidden />}
          {busy === 'save' ? 'Saving…' : 'Save to my resumes'}
        </Button>
      </div>
      <p className="text-muted-foreground text-xs">
        File name: <span className="text-heading font-medium">{fileName}</span>
      </p>

      {saved && (
        <div role="status" className="bg-success-soft text-success-text flex flex-wrap items-center gap-2 rounded-lg px-3 py-2 text-sm">
          <span className="font-medium">Saved to your resumes.</span>
          {saved.isPrimary ? (
            <span>It is your primary resume.</span>
          ) : (
            <Button
              size="sm"
              variant="outline"
              disabled={setPrimary.isPending}
              onClick={() => setPrimary.mutate(saved.id, { onSuccess: () => setSaved({ ...saved, isPrimary: true }), onError: (error) => toast.error(error.message) })}
            >
              <Star aria-hidden /> Set as primary
            </Button>
          )}
          <Link to="/student/portfolio?tab=resume" className="text-link font-medium hover:underline">
            View in Resume tab
          </Link>
        </div>
      )}

      <p className="text-muted-foreground flex items-start gap-2 text-xs">
        <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
        This PDF includes your phone number and email. Share it only with recruiters and placement officers you trust.
      </p>
    </section>
  )
}
