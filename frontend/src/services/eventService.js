import { env } from '@/lib/env'
import { toListParams, toPage } from '@/lib/listQuery'
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

/**
 * `values.images` mixes photos already on the event ({ url }) with new ones ({ file }).
 * Mock mode keeps new photos as object URLs, so they last until the page reloads.
 * The API gets multipart: the event fields, the kept URLs as JSON in `keepImages`,
 * and each new file under `images` (see ASSUMPTIONS.md).
 */
function toMockImages(images) {
  return images.map((image) => ({ url: image.file ? URL.createObjectURL(image.file) : image.url, caption: image.caption ?? '' }))
}

function toEventForm(values) {
  const form = new FormData()
  Object.entries(toEventFields(values)).forEach(([key, value]) => form.append(key, value ?? ''))
  form.append('keepImages', JSON.stringify(values.images.filter((image) => !image.file).map((image) => image.url)))
  values.images.filter((image) => image.file).forEach((image) => form.append('images', image.file))
  return form
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
      ? await eventsMock.create({ ...toEventFields(values), images: toMockImages(values.images) })
      : await apiClient.post('/events', toEventForm(values))
    return toEvent(data)
  },

  async update(id, values) {
    const data = env.useMock
      ? await eventsMock.update(id, { ...toEventFields(values), images: toMockImages(values.images) })
      : await apiClient.put(`/events/${id}`, toEventForm(values))
    return toEvent(data)
  },

  async remove(id) {
    if (env.useMock) await eventsMock.remove(id)
    else await apiClient.delete(`/events/${id}`)
    return id
  },
}
