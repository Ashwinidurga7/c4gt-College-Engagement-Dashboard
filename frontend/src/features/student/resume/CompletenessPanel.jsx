import { CircleCheck, ListChecks } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { resumeCompleteness } from '@/features/student/resume/resumeCompleteness'

function MissingItem({ check, onJump }) {
  return (
    <li className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-sm">{check.label}</span>
      {check.target ? (
        <Button type="button" variant="outline" size="sm" onClick={() => onJump(check.target)}>
          Add<span className="sr-only"> {check.label}</span>
        </Button>
      ) : (
        <Button asChild variant="ghost" size="sm" className="text-link">
          <Link to={check.link}>
            {check.linkLabel}
            <span className="sr-only">: {check.label}</span>
          </Link>
        </Button>
      )}
    </li>
  )
}

/** Percentage plus the missing items, each with a one-click way to fix it. */
export function CompletenessPanel({ model, onJump }) {
  const { percent, missing } = resumeCompleteness(model)
  const required = missing.filter((check) => !check.optional)
  const optional = missing.filter((check) => check.optional)

  return (
    <section aria-labelledby="resume-completeness-title" className="bg-card shadow-soft flex flex-col gap-3 rounded-xl border p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 id="resume-completeness-title" className="flex items-center gap-2 text-base font-semibold">
          <ListChecks className="text-brand size-5" strokeWidth={1.75} aria-hidden />
          Resume completeness
        </h2>
        <span className="text-heading text-lg font-bold">{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-label="Resume completeness"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="bg-sunken h-2 overflow-hidden rounded-full"
      >
        <div className={percent === 100 ? 'bg-success h-full' : 'bg-primary h-full'} style={{ width: `${percent}%` }} />
      </div>

      {required.length === 0 ? (
        <p className="text-success-text flex items-center gap-2 text-sm font-medium">
          <CircleCheck className="size-4" aria-hidden /> Every key section is filled in.
        </p>
      ) : (
        <div>
          <p className="text-muted-foreground text-sm">Missing from your resume:</p>
          <ul className="divide-y">
            {required.map((check) => (
              <MissingItem key={check.id} check={check} onJump={onJump} />
            ))}
          </ul>
        </div>
      )}
      {optional.length > 0 && (
        <div>
          <p className="text-muted-foreground text-sm">Optional, and they do not lower your score:</p>
          <ul className="divide-y">
            {optional.map((check) => (
              <MissingItem key={check.id} check={check} onJump={onJump} />
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
