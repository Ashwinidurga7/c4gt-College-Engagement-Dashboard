import { Bell, CheckCheck } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { FilterChips } from '@/components/common/FilterChips'
import { PageHeader } from '@/components/common/PageHeader'
import { ListSkeleton } from '@/components/common/Skeleton'
import { TablePagination } from '@/components/common/TablePagination'
import { Button } from '@/components/ui/button'
import { NotificationItem } from '@/features/notifications/NotificationItem'
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications, useUnreadCount } from '@/hooks/useCampus'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useListQuery } from '@/hooks/useListQuery'

const VIEWS = [
  { value: '', label: 'All' },
  { value: 'true', label: 'Unread' },
]

export function NotificationsPage() {
  useDocumentTitle('Notifications')
  const list = useListQuery({ pageSize: 8, initialFilters: { unread: '' } })
  const query = useNotifications(list.query)
  const unread = useUnreadCount()
  const markRead = useMarkNotificationRead()
  const markAll = useMarkAllNotificationsRead()
  const data = query.data
  const unreadCount = unread.data ?? 0

  let body
  if (query.isPending) body = <div className="p-5"><ListSkeleton rows={4} /></div>
  else if (query.isError) body = <ErrorState error={query.error} onRetry={query.refetch} />
  else if (data.items.length === 0) {
    body = (
      <EmptyState
        icon={Bell}
        title={list.filters.unread ? 'You are all caught up' : 'No notifications yet'}
        description={list.filters.unread ? 'There are no unread notifications.' : 'Updates about events, certificates and clubs will appear here.'}
      />
    )
  } else {
    body = (
      <ul className="divide-y">
        {data.items.map((notification) => (
          <li key={notification.id}>
            <NotificationItem notification={notification} onMarkRead={(id) => markRead.mutate(id)} marking={markRead.isPending} />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Notifications"
        description={unreadCount > 0 ? `You have ${unreadCount} unread ${unreadCount === 1 ? 'notification' : 'notifications'}.` : 'You are all caught up.'}
        icon={Bell}
        actions={
          <Button variant="outline" size="lg" onClick={() => markAll.mutate()} disabled={unreadCount === 0 || markAll.isPending}>
            <CheckCheck aria-hidden /> Mark all as read
          </Button>
        }
      />
      <FilterChips label="Show" options={VIEWS} value={list.filters.unread} onChange={(value) => list.setFilter('unread', value)} />
      <div className="bg-card shadow-soft overflow-hidden rounded-xl border">
        <div aria-busy={query.isFetching || undefined} className={query.isFetching && !query.isPending ? 'opacity-70' : undefined}>
          {body}
        </div>
        {data && data.total > 0 && <TablePagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={list.setPage} />}
      </div>
    </div>
  )
}
