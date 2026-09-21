import { Search } from 'lucide-react'
import { useId } from 'react'
import { cn } from '@/lib/utils'

/** Search box plus optional filter controls and actions, placed above a DataTable. */
export function FilterBar({ search, onSearchChange, searchPlaceholder = 'Search', searchLabel = 'Search', children, actions, className }) {
  const id = useId()

  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center', className)}>
      {onSearchChange && (
        <div className="relative w-full sm:max-w-xs">
          <label htmlFor={id} className="sr-only">
            {searchLabel}
          </label>
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" aria-hidden />
          <input
            id={id}
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="bg-card border-input placeholder:text-muted-foreground focus-visible:border-ring h-11 w-full rounded-lg border pr-3 pl-9 text-sm outline-none"
          />
        </div>
      )}
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
      {actions && <div className="flex flex-wrap items-center gap-2 sm:ml-auto">{actions}</div>}
    </div>
  )
}
