import { env } from '@/lib/env'
import { clubsMock } from '@/mocks/campusMock'
import { apiClient } from '@/services/apiClient'
import { toClub } from '@/services/campusAdapters'
import { createResourceService } from '@/services/resourceService'

/** Only fields the admin edits are sent; focus areas arrive as a comma-separated string. */
export function toClubPayload(values) {
  return {
    name: values.name.trim(),
    fullName: values.fullName.trim(),
    tagline: values.tagline.trim(),
    category: values.category,
    college: values.college,
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

/** Read access for every role; create, edit, delete and status changes are admin-only on the backend. */
export const clubService = {
  list: base.list,
  get: base.get,
  create: (values) => base.create(values),
  update: (id, values) => base.update(id, values),
  remove: base.remove,

  async setActive(id, active) {
    const status = active ? 'active' : 'inactive'
    const data = env.useMock
      ? await clubsMock.update(id, { status })
      : await apiClient.put(`/clubs/${id}/${active ? 'activate' : 'deactivate'}`)
    return toClub(data)
  },
}
