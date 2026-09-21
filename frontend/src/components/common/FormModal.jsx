import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useReturnFocus } from '@/hooks/useReturnFocus'

/**
 * Dialog wrapping a form. Focus is trapped and Escape closes it (Radix Dialog).
 * The parent owns the form state; `onSubmit` is the form's submit handler.
 */
export function FormModal({
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
  submitLabel = 'Save changes',
  isSubmitting = false,
  error,
  size = 'sm:max-w-lg',
  children,
}) {
  const returnFocus = useReturnFocus(open)
  return (
    <Dialog open={open} onOpenChange={(next) => !isSubmitting && onOpenChange(next)}>
      <DialogContent className={`max-h-[90dvh] overflow-y-auto ${size}`} onCloseAutoFocus={returnFocus}>
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle className="text-heading text-lg">{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          {error && (
            <p role="alert" className="bg-danger-soft text-danger-text rounded-lg px-3.5 py-3 text-sm">
              {error.message}
            </p>
          )}
          {children}
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" size="lg" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" aria-hidden />}
              {isSubmitting ? 'Saving…' : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
