import { nameOf, pick, toId, toList, toNumber } from '@/services/adapterUtils'

export function toClub(raw = {}) {
  const status = pick(raw.status, raw.isActive === false ? 'inactive' : raw.isActive === true ? 'active' : null, 'active')
  return {
    id: toId(raw),
    name: pick(raw.name, 'Club'),
    fullName: pick(raw.fullName, raw.name),
    tagline: pick(raw.tagline, raw.motto),
    category: raw.category ?? null,
    college: raw.college ?? null,
    status: String(status).toLowerCase(),
    membersCount: toNumber(pick(raw.membersCount, raw.memberCount, raw.members?.length)),
    founded: toNumber(raw.founded),
    coordinator: pick(nameOf(raw.coordinator), nameOf(raw.facultyCoordinator)),
    president: nameOf(raw.president),
    email: pick(raw.email, raw.contactEmail),
    description: pick(raw.description, ''),
    focusAreas: toList(raw.focusAreas),
    stats: {
      projects: toNumber(raw.stats?.projects),
      workshops: toNumber(raw.stats?.workshops),
      hackathons: toNumber(raw.stats?.hackathons),
    },
    socials: raw.socials ?? {},
    logoUrl: pick(raw.logoUrl, raw.logo),
  }
}

export function toNotification(raw = {}) {
  return {
    id: toId(raw),
    type: pick(raw.type, raw.category, 'system'),
    title: pick(raw.title, raw.subject, 'Notification'),
    message: pick(raw.message, raw.body, ''),
    read: Boolean(raw.read ?? raw.isRead),
    createdAt: pick(raw.createdAt, raw.date),
    link: raw.link ?? null,
  }
}

/** `/notifications/unread` may return a count, `{ count }` or the unread list itself. */
export function toUnreadCount(raw) {
  if (typeof raw === 'number') return raw
  if (Array.isArray(raw)) return raw.length
  return toNumber(pick(raw?.count, raw?.unreadCount, raw?.total), toList(raw?.notifications).length)
}
