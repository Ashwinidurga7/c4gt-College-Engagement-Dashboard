import { Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useUnreadCount } from '@/hooks/useCampus'

/** Topbar bell with the unread count; the count is also in the accessible name. */
export function NotificationBell({ role }) {
  const { data: count = 0 } = useUnreadCount()
  const label = count > 0 ? `Notifications, ${count} unread` : 'Notifications'
  const shown = count > 99 ? '99+' : count

  return (
    <Button asChild variant="ghost" size="icon-lg" className="text-brand relative">
      <Link to={`/${role}/notifications`} aria-label={label} title={label}>
        <Bell className="size-5" strokeWidth={1.75} />
        {count > 0 && (
          <span aria-hidden className="bg-count-badge text-primary-foreground absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[10px] leading-none font-bold">
            {shown}
          </span>
        )}
      </Link>
    </Button>
  )
}
