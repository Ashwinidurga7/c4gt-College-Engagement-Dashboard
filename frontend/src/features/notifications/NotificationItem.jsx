import { Bell, CalendarDays, Check, FileBadge, FolderKanban, GraduationCap, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/lib/formatters'
import { TONE_CLASSES } from '@/lib/tones'
import { cn } from '@/lib/utils'

const TYPES = {
  event: { icon: CalendarDays, tone: 'orange' },
  certificate: { icon: FileBadge, tone: 'teal' },
  club: { icon: UsersRound, tone: 'purple' },
  project: { icon: FolderKanban, tone: 'green' },
  academic: { icon: GraduationCap, tone: 'blue' },
}

export function NotificationItem({ notification, onMarkRead, marking }) {
  const type = TYPES[notification.type] ?? { icon: Bell, tone: 'blue' }
  const unread = !notification.read

  return (
    <article className={cn('flex gap-3 p-4 sm:p-5', unread && 'bg-info-soft/60')}>
      <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-full', TONE_CLASSES[type.tone])}>
        <type.icon className="size-5" strokeWidth={1.75} aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={cn('text-sm', unread ? 'font-bold' : 'font-medium')}>{notification.title}</h3>
          {unread && (
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase">New</span>
          )}
        </div>
        {notification.message && <p className="text-muted-foreground mt-0.5 text-sm">{notification.message}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <time dateTime={notification.createdAt} className="text-muted-foreground">
            {formatDateTime(notification.createdAt)}
          </time>
          {notification.link && (
            <Link to={notification.link} className="text-link font-semibold hover:underline" onClick={() => unread && onMarkRead(notification.id)}>
              Open<span className="sr-only">: {notification.title}</span>
            </Link>
          )}
        </div>
      </div>
      {unread && (
        <Button variant="ghost" size="icon-lg" className="text-link shrink-0" aria-label={`Mark "${notification.title}" as read`} onClick={() => onMarkRead(notification.id)} disabled={marking}>
          <Check />
        </Button>
      )}
    </article>
  )
}
