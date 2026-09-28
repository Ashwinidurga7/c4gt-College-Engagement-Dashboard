import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { TONE_CLASSES } from '@/lib/tones'
import { cn } from '@/lib/utils'

/** Headline metric with an icon chip and an optional link to the detail page, or `onClick` to open details in place. */
export function StatCard({ label, value, icon: Icon, tone = 'blue', hint, to, onClick, linkLabel = 'View details', className }) {
  return (
    <div className={cn('glass-card-interactive glass-glow-subtle glass-sheen flex flex-col gap-3 rounded-2xl p-5', className)}>
      <div className="flex items-center gap-4">
        {Icon && (
          <span className={cn('flex size-12 shrink-0 items-center justify-center rounded-2xl glass-chip shadow-sm', TONE_CLASSES[tone])}>
            <Icon className="size-6" strokeWidth={1.75} aria-hidden />
          </span>
        )}
        <div className="min-w-0">
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
          <p className="text-heading text-2xl font-bold tracking-tight">{value ?? '—'}</p>
        </div>
      </div>
      {(hint || to || onClick) && (
        <div className="flex items-center justify-between gap-2 text-sm">
          {hint && <span className="text-muted-foreground">{hint}</span>}
          {to && (
            <Link to={to} className="text-link ml-auto inline-flex items-center gap-1 font-medium hover:underline">
              {linkLabel}
              <span className="sr-only"> for {label}</span>
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          )}
          {onClick && !to && (
            <button type="button" onClick={onClick} className="text-link ml-auto inline-flex items-center gap-1 font-medium hover:underline">
              {linkLabel}
              <span className="sr-only"> for {label}</span>
              <ArrowRight className="size-3.5" aria-hidden />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
