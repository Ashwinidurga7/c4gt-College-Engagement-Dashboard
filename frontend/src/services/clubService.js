import { clubsMock } from '@/mocks/campusMock'
import { toClub } from '@/services/campusAdapters'
import { createResourceService } from '@/services/resourceService'

const base = createResourceService({
  path: '/clubs',
  mock: clubsMock,
  toItem: toClub,
  listKey: 'clubs',
  searchKeys: ['name', 'fullName', 'tagline', 'category'],
})

/** Read access for every role. Admin-only mutations are added in Phase 5. */
export const clubService = {
  list: base.list,
  get: base.get,
}
