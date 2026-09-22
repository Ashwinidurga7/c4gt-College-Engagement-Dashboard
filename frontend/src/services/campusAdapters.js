import { nameOf, pick, toId, toList, toNumber } from '@/services/adapterUtils'

export function toClub(raw = {}) {
  const status = pick(raw.status, raw.isActive === false ? 'inactive' : raw.isActive === true ? 'active' : null, 'active')
  return {
    id: toId(raw),
    name: pick(raw.name, 'Club'),
    fullName: pick(raw.fullName, raw.name),
    tagline: pick(raw.tagline, raw.motto),
    category: raw.category ?? null,
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
      placements: toNumber(raw.stats?.placements),
      internships: toNumber(raw.stats?.internships),
    },
    // A social entry may be a bare URL or { url, label }; the label is the handle shown on the card.
    socials: Object.fromEntries(
      Object.entries(raw.socials ?? {})
        .map(([network, value]) => [network, typeof value === 'string' ? { url: value, label: '' } : { url: pick(value?.url, value?.href), label: value?.label ?? '' }])
        .filter(([, value]) => value.url),
    ),
    website: pick(raw.website, raw.site),
    highlights: toList(raw.highlights).map((item, index) => ({
      id: pick(item?.id, `highlight-${index}`),
      category: item?.category ?? null,
      title: pick(item?.title, item?.name, ''),
      description: item?.description ?? '',
      date: item?.date ?? null,
    })),
    logoUrl: pick(raw.logoUrl, raw.logo),
    // A photo may arrive as a bare URL string or as { url, caption }.
    photos: toList(pick(raw.photos, raw.gallery, raw.images))
      .map((photo) => (typeof photo === 'string' ? { url: photo, caption: '' } : { url: pick(photo?.url, photo?.src), caption: photo?.caption ?? '' }))
      .filter((photo) => photo.url),
    projects: toList(raw.projects).map((item, index) => ({
      id: pick(item?.id, item?._id, `project-${index}`),
      name: pick(item?.name, item?.title, 'Untitled project'),
      academicYear: pick(item?.academicYear, item?.year),
      description: item?.description ?? '',
      team: toList(pick(item?.team, item?.teamMembers, item?.members)).map(nameOf).filter(Boolean),
      deployUrl: pick(item?.deployUrl, item?.liveUrl, item?.url),
      repoUrl: pick(item?.repoUrl, item?.sourceUrl, item?.github),
    })),
    // Whether the signed-in student belongs to the club. The backend does not send this yet,
    // so against the real API every student sees the non-member view until it does.
    isMember: Boolean(pick(raw.isMember, raw.membership)),
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
