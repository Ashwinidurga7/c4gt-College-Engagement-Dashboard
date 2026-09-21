import { FilePen, FileUser } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/formatters'

export const BUILDER_PATH = '/student/resume/builder'

/** Entry point to the Resume Builder; offers to continue when a draft exists in this browser. */
export function ResumeBuilderCard({ draft }) {
  const editing = Boolean(draft?.updatedAt)
  return (
    <div className="bg-card shadow-soft flex flex-col gap-3 rounded-xl border p-5">
      <div className="flex items-start gap-3">
        <span className="bg-tone-blue text-tone-blue-fg flex size-10 shrink-0 items-center justify-center rounded-lg">
          <FileUser className="size-5" strokeWidth={1.75} aria-hidden />
        </span>
        <div>
          <h3 className="font-semibold">Resume builder</h3>
          <p className="text-muted-foreground text-sm">
            {editing
              ? `You have a resume in progress, last edited ${formatDateTime(draft.updatedAt)}. Pick up where you left off.`
              : 'Build a resume from your profile, results and portfolio, then download it as a PDF.'}
          </p>
        </div>
      </div>
      <Button asChild size="lg" className="self-start">
        <Link to={BUILDER_PATH}>
          {editing ? <FilePen aria-hidden /> : <FileUser aria-hidden />}
          {editing ? 'Edit resume' : 'Create with builder'}
        </Link>
      </Button>
    </div>
  )
}
