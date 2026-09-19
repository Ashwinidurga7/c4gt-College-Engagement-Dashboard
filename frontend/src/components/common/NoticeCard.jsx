import { StatusBadge } from '@/components/common/StatusBadge'
import { formatDate } from '@/lib/formatters'
import { cn } from '@/lib/utils'

export function NoticeCard({ notice, className }) {
  const urgent = String(notice.category).toLowerCase() === 'urgent'

  return (
    <article
      className={cn('bg-card rounded-lg border p-4', urgent && 'border-l-brand-red border-l-4', className)}
      aria-label={notice.title}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <StatusBadge status={notice.category} />
        <time dateTime={notice.date} className="text-muted-foreground text-xs">
          {formatDate(notice.date)}
        </time>
      </div>
      <h3 className="mt-2 text-sm font-semibold">{notice.title}</h3>
      {notice.body && <p className="text-muted-foreground mt-1 text-sm">{notice.body}</p>}
    </article>
  )
}
