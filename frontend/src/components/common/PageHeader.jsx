import { PreviewBadge } from '@/components/common/PreviewBadge'
import { cn } from '@/lib/utils'

export function PageHeader({ title, description, icon: Icon, preview = false, actions, className }) {
  return (
    <header className={cn('flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between', className)}>
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <span className="bg-tone-blue text-tone-blue-fg mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-lg">
            <Icon className="size-6" strokeWidth={1.75} aria-hidden />
          </span>
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-[1.75rem]">{title}</h1>
            {preview && <PreviewBadge />}
          </div>
          {description && <p className="text-muted-foreground mt-1 text-sm sm:text-base">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}
