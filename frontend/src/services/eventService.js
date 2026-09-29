import { env } from '@/lib/env'
import { toListParams, toPage } from '@/lib/listQuery'
import { appendPhotos, toMockPhotos } from '@/lib/photos'
import { eventsMock } from '@/mocks/campusMock'
import { apiClient } from '@/services/apiClient'
import { toEvent } from '@/services/studentAdapters'

/** Only fields the admin edits; empty optional fields go as null so an edit can clear them. */
function toEventFields(values) {
  const optional = (value) => (value.trim() === '' ? null : value.trim())
  return {
    title: values.title.trim(),
    category: values.category,
    college: optional(values.college),
    clubId: optional(values.clubId),
    organizer: values.organizer.trim(),
    date: values.date,
    startTime: optional(values.startTime),
    endTime: optional(values.endTime),
    registrationDeadline: optional(values.registrationDeadline),
    venue: values.venue.trim(),
    description: values.description.trim(),
  }
}

/** Multipart body for the API: the event fields plus its photos (see ASSUMPTIONS.md). */
function toEventForm(values) {
  const form = new FormData()
  Object.entries(toEventFields(values)).forEach(([key, value]) => form.append(key, value ?? ''))
  return appendPhotos(form, values.images)
}

export const eventService = {
  async list(query = {}) {
    const raw = env.useMock ? await eventsMock.list(query) : await apiClient.get('/events', { params: toListParams(query) })
    return toPage(raw?.events ?? raw, query, toEvent, { searchKeys: ['title', 'organizer', 'venue', 'category'] })
  },

  async get(id) {
    return toEvent(env.useMock ? await eventsMock.get(id) : await apiClient.get(`/events/${id}`))
  },

  /** Create, edit and delete are admin-only on the backend. */
  async create(values) {
    const data = env.useMock
      ? await eventsMock.create({ ...toEventFields(values), images: toMockPhotos(values.images) })
      : await apiClient.post('/events', toEventForm(values))
    return toEvent(data)
  },

  async update(id, values) {
    const data = env.useMock
      ? await eventsMock.update(id, { ...toEventFields(values), images: toMockPhotos(values.images) })
      : await apiClient.put(`/events/${id}`, toEventForm(values))
    return toEvent(data)
  },

  async remove(id) {
    if (env.useMock) await eventsMock.remove(id)
    else await apiClient.delete(`/events/${id}`)
    return id
  },
}
