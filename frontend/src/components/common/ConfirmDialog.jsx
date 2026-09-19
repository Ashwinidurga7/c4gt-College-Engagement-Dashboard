import { Loader2, TriangleAlert } from 'lucide-react'
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
import { cn } from '@/lib/utils'

/**
 * Confirmation for irreversible or consequential actions. Focus is trapped and Escape
 * cancels. `tone="danger"` styles the confirm button as destructive.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  pendingLabel = 'Working…',
  tone = 'danger',
  isPending = false,
  onConfirm,
  children,
}) {
  const danger = tone === 'danger'

  return (
    <Dialog open={open} onOpenChange={(next) => !isPending && onOpenChange(next)}>
      <DialogContent role="alertdialog" className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <span
            className={cn(
              'mb-2 flex size-11 items-center justify-center rounded-full',
              danger ? 'bg-danger-soft text-danger-text' : 'bg-tone-blue text-tone-blue-fg',
            )}
          >
            <TriangleAlert className="size-5" strokeWidth={1.75} aria-hidden />
          </span>
          <DialogTitle className="text-heading text-lg">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" size="lg" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            size="lg"
            onClick={onConfirm}
            disabled={isPending}
            className={danger ? 'bg-danger text-primary-foreground hover:bg-danger-text' : undefined}
          >
            {isPending && <Loader2 className="animate-spin" aria-hidden />}
            {isPending ? pendingLabel : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
