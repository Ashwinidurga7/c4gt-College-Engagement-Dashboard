import { env } from '@/lib/env'
import { toListParams, toPage } from '@/lib/listQuery'
import { notificationsMock } from '@/mocks/campusMock'
import { apiClient } from '@/services/apiClient'
import { toNotification, toUnreadCount } from '@/services/campusAdapters'

export const notificationService = {
  /** `filters.unread` narrows to unread items (sent as `unread=true`). */
  async list(query = {}) {
    const raw = env.useMock ? await notificationsMock.list(query) : await apiClient.get('/notifications', { params: toListParams(query) })
    return toPage(raw?.notifications ?? raw, query, toNotification)
  },

  async unreadCount() {
    return toUnreadCount(env.useMock ? await notificationsMock.unread() : await apiClient.get('/notifications/unread'))
  },

  async markRead(id) {
    return toNotification(env.useMock ? await notificationsMock.markRead(id) : await apiClient.put(`/notifications/${id}/read`))
  },

  async markAllRead() {
    if (env.useMock) await notificationsMock.markAllRead()
    else await apiClient.put('/notifications/read-all')
  },
}
