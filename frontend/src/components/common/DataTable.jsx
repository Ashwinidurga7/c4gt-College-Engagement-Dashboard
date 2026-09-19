import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { TableSkeleton } from '@/components/common/Skeleton'
import { TablePagination } from '@/components/common/TablePagination'
import { cn } from '@/lib/utils'

const ALIGN = { left: 'text-left', right: 'text-right', center: 'text-center' }

function SortHeader({ column, sort, onSortChange }) {
  const active = sort?.key === column.key
  const direction = active ? sort.direction : null
  const Icon = direction === 'asc' ? ArrowUp : direction === 'desc' ? ArrowDown : ArrowUpDown
  const next = active && direction === 'asc' ? 'desc' : 'asc'

  return (
    <button
      type="button"
      onClick={() => onSortChange({ key: column.key, direction: next })}
      className="hover:text-link inline-flex items-center gap-1 rounded-sm font-semibold"
    >
      {column.header}
      <Icon className={cn('size-3.5', !active && 'text-muted-foreground')} aria-hidden />
      <span className="sr-only">, sort {next === 'asc' ? 'ascending' : 'descending'}</span>
    </button>
  )
}

/**
 * Table for server-driven lists. Search, filters, sort and page live in the parent
 * (see useListQuery) and travel to the API as query parameters.
 */
export function DataTable({
  columns,
  rows,
  getRowKey = (row) => row.id,
  caption,
  toolbar,
  isLoading,
  isFetching,
  error,
  onRetry,
  emptyTitle = 'Nothing to show yet',
  emptyDescription,
  sort,
  onSortChange,
  pagination,
  rowActions,
  minWidth = 640,
  className,
}) {
  let body
  if (error) body = <ErrorState error={error} onRetry={onRetry} />
  else if (isLoading) body = <TableSkeleton columns={Math.min(columns.length, 5)} />
  else if (!rows?.length) body = <EmptyState title={emptyTitle} description={emptyDescription} />
  else {
    body = (
      // Focusable so keyboard users can scroll wide tables (WCAG 2.1.1).
      <div tabIndex={0} role="region" aria-label={caption ?? 'Table'} className={cn('relative overflow-x-auto', isFetching && 'opacity-70')}>
        <table style={{ minWidth }} className="w-full border-collapse text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="bg-sunken text-heading">
            <tr>
              {columns.map((column) => {
                const sortable = column.sortable && onSortChange
                const ariaSort =
                  sort?.key === column.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : sortable ? 'none' : undefined
                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={ariaSort}
                    className={cn('px-4 py-3 font-semibold whitespace-nowrap', ALIGN[column.align ?? 'left'], column.headerClassName)}
                  >
                    {sortable ? <SortHeader column={column} sort={sort} onSortChange={onSortChange} /> : column.header}
                  </th>
                )
              })}
              {rowActions && (
                <th scope="col" className="px-4 py-3 text-right">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={getRowKey(row, index)} className="hover:bg-sunken/60 border-t transition-colors">
                {columns.map((column) => (
                  <td key={column.key} className={cn('text-body px-4 py-3', ALIGN[column.align ?? 'left'], column.className)}>
                    {column.cell ? column.cell(row, index) : (row[column.key] ?? '—')}
                  </td>
                ))}
                {rowActions && <td className="px-4 py-3 text-right whitespace-nowrap">{rowActions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className={cn('bg-card shadow-soft min-w-0 overflow-hidden rounded-xl border', className)}>
      {toolbar && <div className="border-b p-4">{toolbar}</div>}
      <div aria-busy={isFetching || isLoading || undefined}>{body}</div>
      {pagination && !error && !isLoading && pagination.total > 0 && <TablePagination {...pagination} />}
    </div>
  )
}
