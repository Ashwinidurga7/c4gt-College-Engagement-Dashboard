import { CloudOff, RotateCw, SearchX, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function describe(error) {
  if (error?.status === 403) {
    return { icon: ShieldAlert, title: 'You do not have access to this information', retryable: false }
  }
  if (error?.status === 404) {
    return { icon: SearchX, title: 'This information could not be found', retryable: false }
  }
  return { icon: CloudOff, title: 'Something went wrong while loading', retryable: true }
}

/** Inline, retryable error for a data view. 401s are handled globally by ending the session. */
export function ErrorState({ error, onRetry, className }) {
  const { icon: Icon, title, retryable } = describe(error)

  return (
    <div role="alert" className={cn('flex flex-col items-center justify-center px-6 py-10 text-center', className)}>
      <span className="bg-danger-soft text-danger-text flex size-12 items-center justify-center rounded-full">
        <Icon className="size-6" strokeWidth={1.75} aria-hidden />
      </span>
      <p className="text-heading mt-4 font-semibold">{title}</p>
      {error?.message && <p className="text-muted-foreground mt-1 max-w-sm text-sm">{error.message}</p>}
      {retryable && onRetry && (
        <Button variant="outline" size="lg" className="mt-4" onClick={() => onRetry()}>
          <RotateCw aria-hidden /> Try again
        </Button>
      )}
    </div>
  )
}
