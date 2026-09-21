import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

/**
 * Label, control and inline error wired together for screen readers.
 * The child control should use `id`, `aria-invalid` and `aria-describedby` from `fieldProps(id, error)`.
 */
export function FormField({ id, label, error, hint, className, children }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={id} className="text-heading text-sm font-semibold">
        {label}
      </Label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-muted-foreground text-xs">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-danger-text text-xs font-medium">
          {error}
        </p>
      )}
    </div>
  )
}
