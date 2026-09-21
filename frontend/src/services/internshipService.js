import { internshipsMock } from '@/mocks/portfolioMock'
import { toInternship, toInternshipPayload } from '@/services/portfolioAdapters'
import { createResourceService } from '@/services/resourceService'

const base = createResourceService({
  path: '/internships',
  mock: internshipsMock,
  toItem: toInternship,
  toPayload: toInternshipPayload,
  listKey: 'internships',
  searchKeys: ['company', 'role'],
})

/** The API supports list, add and delete only. */
export const internshipService = {
  list: base.list,
  create: base.create,
  remove: base.remove,
}
