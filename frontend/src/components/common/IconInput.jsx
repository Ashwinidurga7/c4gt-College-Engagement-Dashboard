import { forwardRef } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

/** Input with a leading decorative icon and an optional trailing control. */
export const IconInput = forwardRef(function IconInput({ icon: Icon, trailing, className, ...props }, ref) {
  return (
    <div className="relative">
      {Icon && (
        <Icon
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-[18px] -translate-y-1/2"
          strokeWidth={1.75}
          aria-hidden
        />
      )}
      <Input ref={ref} className={cn('h-11 bg-card', Icon && 'pl-10', trailing && 'pr-11', className)} {...props} />
      {trailing && <div className="absolute top-1/2 right-1.5 -translate-y-1/2">{trailing}</div>}
    </div>
  )
})
