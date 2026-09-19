import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { queryKeys } from '@/lib/queryKeys'
import { clubService } from '@/services/clubService'
import { eventService } from '@/services/eventService'
import { notificationService } from '@/services/notificationService'

const UNREAD_POLL_MS = 60 * 1000

function useRole() {
  return useAuth().user?.role ?? 'guest'
}

export function useClubs(query) {
  const role = useRole()
  return useQuery({ queryKey: queryKeys.clubs(role, query), queryFn: () => clubService.list(query), placeholderData: keepPreviousData })
}

export function useClub(id) {
  const role = useRole()
  return useQuery({ queryKey: queryKeys.club(role, id), queryFn: () => clubService.get(id), enabled: Boolean(id) })
}

export function useEvents(query) {
  const role = useRole()
  return useQuery({ queryKey: queryKeys.events(role, query), queryFn: () => eventService.list(query), placeholderData: keepPreviousData })
}

export function useEvent(id) {
  const role = useRole()
  return useQuery({ queryKey: queryKeys.event(role, id), queryFn: () => eventService.get(id), enabled: Boolean(id) })
}

export function useNotifications(query) {
  const role = useRole()
  return useQuery({
    queryKey: queryKeys.notifications(role, query),
    queryFn: () => notificationService.list(query),
    placeholderData: keepPreviousData,
  })
}

/** Polled so the topbar bell stays current while the portal is open. */
export function useUnreadCount({ enabled = true } = {}) {
  const role = useRole()
  return useQuery({
    queryKey: queryKeys.unreadCount(role),
    queryFn: notificationService.unreadCount,
    enabled,
    refetchInterval: UNREAD_POLL_MS,
  })
}

function useNotificationMutation(mutationFn, successMessage) {
  const role = useRole()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications(role) })
      if (successMessage) toast.success(successMessage)
    },
    onError: (error) => toast.error(error.message),
  })
}

export const useMarkNotificationRead = () => useNotificationMutation(notificationService.markRead)
export const useMarkAllNotificationsRead = () => useNotificationMutation(notificationService.markAllRead, 'All notifications marked as read')
