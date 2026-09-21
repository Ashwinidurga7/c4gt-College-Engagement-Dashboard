import { cn } from '@/lib/utils'

/** White card with a titled header; the base for chart, list and table sections. */
export function SectionCard({ title, description, icon: Icon, action, className, bodyClassName, children }) {
  return (
    <section className={cn('bg-card shadow-soft flex min-w-0 flex-col rounded-xl border', className)}>
      {(title || action) && (
        <header className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5">
          <div className="flex min-w-0 items-start gap-3">
            {Icon && <Icon className="text-brand mt-0.5 size-5 shrink-0" strokeWidth={1.75} aria-hidden />}
            <div className="min-w-0">
              <h2 className="text-lg font-semibold">{title}</h2>
              {description && <p className="text-muted-foreground mt-0.5 text-sm">{description}</p>}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div className={cn('flex-1 p-5', bodyClassName)}>{children}</div>
    </section>
  )
}
