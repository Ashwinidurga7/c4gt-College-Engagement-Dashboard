import { ChevronDown, CircleCheck, ListChecks } from 'lucide-react'
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

function MissingList({ title, checks, onJump }) {
  if (checks.length === 0) return null
  return (
    <div>
      <p className="text-muted-foreground text-sm">{title}</p>
      <ul className="divide-y">
        {checks.map((check) => (
          <MissingItem key={check.id} check={check} onJump={onJump} />
        ))}
      </ul>
    </div>
  )
}

/**
 * Percentage plus the missing items, each with a one-click way to fix it. `collapsible` folds the list
 * behind a toggle (on phones), so it does not push the editor below the fold.
 */
export function CompletenessPanel({ model, onJump, collapsible = false }) {
  const { percent, missing } = resumeCompleteness(model)
  const required = missing.filter((check) => !check.optional)
  const optional = missing.filter((check) => check.optional)

  const lists = (
    <>
      <MissingList title="Missing from your resume:" checks={required} onJump={onJump} />
      <MissingList title="Optional, and they do not lower your score:" checks={optional} onJump={onJump} />
    </>
  )

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

      {required.length === 0 && (
        <p className="text-success-text flex items-center gap-2 text-sm font-medium">
          <CircleCheck className="size-4" aria-hidden /> Every key section is filled in.
        </p>
      )}
      {missing.length > 0 &&
        (collapsible ? (
          <details className="group">
            <summary className="text-link flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium [&::-webkit-details-marker]:hidden">
              {missing.length} {missing.length === 1 ? 'item' : 'items'} to add
              <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <div className="flex flex-col gap-3 pt-1">{lists}</div>
          </details>
        ) : (
          lists
        ))}
    </section>
  )
}
