import { env } from '@/lib/env'
import { appendPhotos, toMockPhotos } from '@/lib/photos'
import { clubsMock } from '@/mocks/campusMock'
import { apiClient } from '@/services/apiClient'
import { toClub } from '@/services/campusAdapters'
import { createResourceService } from '@/services/resourceService'

/** Only fields the admin edits are sent; focus areas arrive as a comma-separated string. */
function toClubPayload(values) {
  return {
    name: values.name.trim(),
    fullName: values.fullName.trim(),
    tagline: values.tagline.trim(),
    category: values.category,
    coordinator: values.coordinator.trim(),
    email: values.email.trim(),
    founded: values.founded === '' ? null : Number(values.founded),
    description: values.description.trim(),
    focusAreas: values.focusAreas.split(',').map((item) => item.trim()).filter(Boolean),
  }
}

const base = createResourceService({
  path: '/clubs',
  mock: clubsMock,
  toItem: toClub,
  toPayload: toClubPayload,
  listKey: 'clubs',
  searchKeys: ['name', 'fullName', 'tagline', 'category'],
})

/**
 * Gallery photos go to their own multipart endpoint, so the club's JSON payload is unchanged
 * (see ASSUMPTIONS.md). Returns the club as saved after the upload.
 */
async function savePhotos(id, photos) {
  const data = env.useMock ? await clubsMock.update(id, { photos: toMockPhotos(photos) }) : await apiClient.put(`/clubs/${id}/photos`, appendPhotos(new FormData(), photos))
  return toClub(data)
}

/** Read access for every role; create, edit, delete and status changes are admin-only on the backend. */
export const clubService = {
  list: base.list,
  get: base.get,
  remove: base.remove,

  async create(values) {
    const club = await base.create(values)
    return values.photos?.length ? savePhotos(club.id, values.photos) : club
  },

  /** `photosChanged` skips the photo upload when only the club's details were edited. */
  async update(id, values, { photosChanged = false } = {}) {
    const club = await base.update(id, values)
    return photosChanged ? savePhotos(id, values.photos) : club
  },

  async setActive(id, active) {
    const status = active ? 'active' : 'inactive'
    const data = env.useMock
      ? await clubsMock.update(id, { status })
      : await apiClient.put(`/clubs/${id}/${active ? 'activate' : 'deactivate'}`)
    return toClub(data)
  },
}
