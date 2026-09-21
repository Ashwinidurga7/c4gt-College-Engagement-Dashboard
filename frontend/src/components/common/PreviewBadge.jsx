import { FlaskConical } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Marks a module that runs on sample data because no backend endpoint exists yet. */
export function PreviewBadge({ compact = false, className }) {
  return (
    <span
      title="Preview module: sample data until the backend endpoint is available"
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-full font-semibold',
        compact
          ? 'bg-nav-hover text-nav-text px-1.5 py-0.5 text-[10px] tracking-wide uppercase'
          : 'bg-tone-purple text-tone-purple-fg px-2.5 py-1 text-xs',
        className,
      )}
    >
      <FlaskConical className={compact ? 'size-3' : 'size-3.5'} strokeWidth={2} aria-hidden />
      Preview
    </span>
  )
}
