import { env } from '@/lib/env'
import { toListParams, toPage } from '@/lib/listQuery'
import { eventsMock } from '@/mocks/campusMock'
import { apiClient } from '@/services/apiClient'
import { toEvent } from '@/services/studentAdapters'

export const eventService = {
  async list(query = {}) {
    const raw = env.useMock ? await eventsMock.list(query) : await apiClient.get('/events', { params: toListParams(query) })
    return toPage(raw?.events ?? raw, query, toEvent, { searchKeys: ['title', 'organizer', 'venue', 'category'] })
  },

  async get(id) {
    return toEvent(env.useMock ? await eventsMock.get(id) : await apiClient.get(`/events/${id}`))
  },
}
