import { cn } from '@/lib/utils'

/** Label/value pairs in a responsive grid. Missing values show an em dash. */
export function DetailList({ items, columns = 2, className }) {
  return (
    <dl className={cn('grid gap-x-6 gap-y-4', columns === 2 && 'sm:grid-cols-2', columns === 3 && 'sm:grid-cols-2 lg:grid-cols-3', className)}>
      {items.map((item) => (
        <div key={item.label} className={cn('min-w-0', item.wide && 'sm:col-span-full')}>
          <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{item.label}</dt>
          <dd className="text-heading mt-1 text-sm font-medium break-words">{item.value || item.value === 0 ? item.value : '—'}</dd>
        </div>
      ))}
    </dl>
  )
}
