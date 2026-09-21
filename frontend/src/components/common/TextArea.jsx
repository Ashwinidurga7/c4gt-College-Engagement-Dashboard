import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const TextArea = forwardRef(function TextArea({ className, rows = 3, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        'bg-card border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive w-full rounded-lg border px-3 py-2 text-sm outline-none focus-visible:ring-3',
        className,
      )}
      {...props}
    />
  )
})
