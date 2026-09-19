import { cn } from '@/lib/utils'

/**
 * Static loading placeholders. They do not pulse: the design system limits motion to
 * hover/focus transitions and the drawer slide.
 */
export function Skeleton({ className, style }) {
  return <span aria-hidden style={style} className={cn('bg-muted block rounded-md', className)} />
}

function LoadingRegion({ label = 'Loading', className, children }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  )
}

function StatCardSkeleton() {
  return (
    <div className="bg-card shadow-soft flex items-center gap-4 rounded-xl border p-5">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  )
}

export function StatGridSkeleton({ count = 4 }) {
  return (
    <LoadingRegion label="Loading summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </LoadingRegion>
  )
}

export function ChartSkeleton({ className }) {
  return (
    <LoadingRegion label="Loading chart" className={cn('flex h-64 items-end gap-3 px-2', className)}>
      {[45, 70, 55, 85, 65, 75].map((height) => (
        <Skeleton key={height} className="flex-1 rounded-b-none" style={{ height: `${height}%` }} />
      ))}
    </LoadingRegion>
  )
}

export function ListSkeleton({ rows = 4 }) {
  return (
    <LoadingRegion label="Loading list" className="flex flex-col gap-4">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </LoadingRegion>
  )
}

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <LoadingRegion label="Loading table" className="flex flex-col gap-3 p-4">
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }, (_, column) => (
            <Skeleton key={column} className="h-4" />
          ))}
        </div>
      ))}
    </LoadingRegion>
  )
}
