import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatNumber } from '@/lib/formatters'

export function TablePagination({ page, pageSize, total, onPageChange }) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <nav aria-label="Table pagination" className="flex flex-col gap-3 border-t px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-muted-foreground" aria-live="polite">
        Showing <span className="text-heading font-semibold">{formatNumber(from)}</span>–
        <span className="text-heading font-semibold">{formatNumber(to)}</span> of{' '}
        <span className="text-heading font-semibold">{formatNumber(total)}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="lg" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          <ChevronLeft aria-hidden /> Previous
        </Button>
        <span className="text-muted-foreground px-1 whitespace-nowrap">
          Page {page} of {pages}
        </span>
        <Button variant="outline" size="lg" onClick={() => onPageChange(page + 1)} disabled={page >= pages}>
          Next <ChevronRight aria-hidden />
        </Button>
      </div>
    </nav>
  )
}
