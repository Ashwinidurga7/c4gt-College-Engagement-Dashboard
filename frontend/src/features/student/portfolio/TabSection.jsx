import { QueryView } from '@/components/common/QueryView'
import { ListSkeleton } from '@/components/common/Skeleton'

/**
 * Header (title, count, action) plus loading/error/empty handling for a portfolio tab.
 * `render(data)` draws the list; `children` holds dialogs that live outside the data states.
 */
export function TabSection({ title, description, count, action, toolbar, query, isEmpty, empty, render, children }) {
  return (
    <section aria-label={title} className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {title}
            {count != null && <span className="text-muted-foreground ml-2 text-sm font-medium">({count})</span>}
          </h2>
          {description && <p className="text-muted-foreground text-sm">{description}</p>}
        </div>
        {action}
      </div>
      {toolbar}
      <QueryView
        query={query}
        skeleton={
          <div className="bg-card rounded-xl border p-5">
            <ListSkeleton rows={3} />
          </div>
        }
        isEmpty={isEmpty}
        empty={empty}
      >
        {render}
      </QueryView>
      {children}
    </section>
  )
}
