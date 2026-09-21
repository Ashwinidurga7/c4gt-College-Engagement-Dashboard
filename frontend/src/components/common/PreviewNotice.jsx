import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Footnote for preview modules, as in the reference's "sample data" note. */
export function PreviewNotice({ children, className }) {
  return (
    <p className={cn('bg-info-soft text-body flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm', className)}>
      <Info className="text-info-text mt-0.5 size-4 shrink-0" aria-hidden />
      <span>{children ?? 'This module shows sample data for demonstration. It will use live college data once its service is available.'}</span>
    </p>
  )
}
