import { applyListQuery } from '@/lib/listQuery'
import { campusEvents, clubMemberships, MOCK_TODAY } from '@/mocks/campusData'
import { clubsData } from '@/mocks/clubsData'
import { createMockCollection } from '@/mocks/mockStore'
import { mockError, mockResponse } from '@/mocks/mockUtils'
import { notificationsData } from '@/mocks/notificationsData'

const clubs = createMockCollection(clubsData, {
  prefix: 'club',
  searchKeys: ['name', 'fullName', 'tagline', 'category'],
  defaultSort: { key: 'name', direction: 'asc' },
})

/** Clubs the mock student belongs to; the mock has one student, so membership is not per user. */
const memberOf = new Set(clubMemberships.map((entry) => entry.clubId))

async function withMembership(request) {
  const data = await request
  if (Array.isArray(data?.items)) return { ...data, items: data.items.map((club) => ({ ...club, isMember: memberOf.has(club._id) })) }
  return data && data._id ? { ...data, isMember: memberOf.has(data._id) } : data
}

/** New clubs start active with no members, as the admin creates them. */
export const clubsMock = {
  ...clubs,
  list: (query) => withMembership(clubs.list(query)),
  get: (id) => withMembership(clubs.get(id)),
  create: (data) => clubs.create({ status: 'active', membersCount: 0, stats: { projects: 0, workshops: 0, hackathons: 0 }, socials: {}, ...data }),
}

/** Events filter by `when` (upcoming/past), category, college and club. */
export const eventsMock = {
  list({ filters = {}, ...query } = {}) {
    const { when, ...exact } = filters
    let items = campusEvents
    if (when === 'upcoming') items = items.filter((event) => event.date >= MOCK_TODAY)
    if (when === 'past') items = items.filter((event) => event.date < MOCK_TODAY)
    const sort = query.sort ?? { key: 'date', direction: when === 'past' ? 'desc' : 'asc' }
    const page = applyListQuery(items, { ...query, sort, filters: exact, searchKeys: ['title', 'organizer', 'venue', 'category'] })
    const withRegistration = page.items.map((event) => ({ ...event, registrationOpen: (event.registrationDeadline ?? event.date) >= MOCK_TODAY }))
    return mockResponse({ ...page, items: withRegistration, limit: page.pageSize })
  },
  get(id) {
    const event = campusEvents.find((entry) => entry._id === id)
    return event ? mockResponse(event) : mockError('This event could not be found.', 404)
  },

  // Edits change `campusEvents` in place so the dashboard, club pages and registrations see them too.
  create(data) {
    const event = { _id: `ev-${Date.now().toString(36)}`, createdAt: new Date().toISOString(), ...data }
    campusEvents.unshift(event)
    return mockResponse(event)
  },
  update(id, changes) {
    const index = campusEvents.findIndex((entry) => entry._id === id)
    if (index === -1) return mockError('This event could not be found.', 404)
    campusEvents[index] = { ...campusEvents[index], ...changes, updatedAt: new Date().toISOString() }
    return mockResponse(campusEvents[index])
  },
  remove(id) {
    const index = campusEvents.findIndex((entry) => entry._id === id)
    if (index === -1) return mockError('This event could not be found.', 404)
    campusEvents.splice(index, 1)
    return mockResponse({ _id: id })
  },
}

const notifications = createMockCollection(notificationsData, {
  prefix: 'ntf',
  defaultSort: { key: 'createdAt', direction: 'desc' },
})

export const notificationsMock = {
  list({ filters = {}, ...query } = {}) {
    const items = filters.unread ? notifications.all().filter((entry) => !entry.read) : notifications.all()
    const page = applyListQuery(items, { ...query, sort: { key: 'createdAt', direction: 'desc' } })
    return mockResponse({ ...page, limit: page.pageSize })
  },
  unread() {
    return mockResponse({ count: notifications.all().filter((entry) => !entry.read).length })
  },
  markRead(id) {
    return notifications.update(id, { read: true })
  },
  markAllRead() {
    return notifications.updateAll(() => ({ read: true }))
  },
}
