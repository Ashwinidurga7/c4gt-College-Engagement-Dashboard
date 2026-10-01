import { env } from '@/lib/env'
import { toListParams, toPage } from '@/lib/listQuery'
import { appendPhotos, toMockPhotos } from '@/lib/photos'
import { eventsMock } from '@/mocks/campusMock'
import { toList } from '@/services/adapterUtils'
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

const SEARCH_KEYS = ['title', 'organizer', 'venue', 'category']

/** Today as YYYY-MM-DD in local time, the format event dates are stored in. */
const today = () => new Date().toLocaleDateString('en-CA')

/** The API returns every visible event; the upcoming/past split and "registration open" are worked out here by date. */
function byWhen(events, when) {
  const now = today()
  const marked = events.map((event) => ({ ...event, registrationOpen: event.registrationOpen ?? (event.registrationDeadline ?? event.date) >= now }))
  if (when === 'upcoming') return marked.filter((event) => event.date >= now)
  if (when === 'past') return marked.filter((event) => event.date < now)
  return marked
}

export const eventService = {
  async list(query = {}) {
    if (env.useMock) return toPage(await eventsMock.list(query), query, toEvent, { searchKeys: SEARCH_KEYS })
    const { when, ...filters } = query.filters ?? {}
    const raw = await apiClient.get('/events', { params: toListParams({ ...query, filters }) })
    const events = byWhen(toList(raw?.events ?? raw), when)
    const sort = query.sort ?? { key: 'date', direction: when === 'past' ? 'desc' : 'asc' }
    return toPage(events, { ...query, filters, sort }, toEvent, { searchKeys: SEARCH_KEYS })
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
