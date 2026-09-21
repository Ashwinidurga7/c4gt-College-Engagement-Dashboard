import { School } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CollegeBadge({ college, className }) {
  if (!college) return null
  return (
    <span
      className={cn(
        'bg-tone-blue text-tone-blue-fg inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
        className,
      )}
    >
      <School className="size-3" strokeWidth={2} aria-hidden />
      <span className="sr-only">College: </span>
      {college}
    </span>
  )
}
