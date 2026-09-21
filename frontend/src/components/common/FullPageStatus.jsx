import { CloudOff, Loader2 } from 'lucide-react'
import { BrandLogo } from '@/components/common/BrandLogo'
import { Button } from '@/components/ui/button'

export function FullPageLoader({ label = 'Loading your portal' }) {
  return (
    <div role="status" aria-live="polite" className="bg-canvas flex min-h-dvh flex-col items-center justify-center gap-5">
      <BrandLogo className="text-3xl" />
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Loader2 className="text-brand size-4 animate-spin" aria-hidden />
        {label}
      </div>
    </div>
  )
}

export function FullPageError({ title, message, onRetry, onSignOut }) {
  return (
    <div role="alert" className="bg-canvas flex min-h-dvh items-center justify-center p-4">
      <div className="bg-card shadow-soft w-full max-w-md rounded-xl border p-8 text-center">
        <span className="bg-danger-soft text-danger-text mx-auto flex size-12 items-center justify-center rounded-full">
          <CloudOff className="size-6" strokeWidth={1.75} aria-hidden />
        </span>
        <h1 className="mt-4 text-xl font-semibold">{title}</h1>
        <p className="text-muted-foreground mt-2 text-sm">{message}</p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          {onRetry && (
            <Button size="lg" onClick={onRetry}>
              Try again
            </Button>
          )}
          {onSignOut && (
            <Button size="lg" variant="outline" onClick={onSignOut}>
              Sign out
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
