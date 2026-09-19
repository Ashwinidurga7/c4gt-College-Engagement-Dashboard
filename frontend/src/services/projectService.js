import { projectsMock } from '@/mocks/portfolioMock'
import { toProject, toProjectPayload } from '@/services/portfolioAdapters'
import { createResourceService } from '@/services/resourceService'

export const projectService = createResourceService({
  path: '/projects',
  mock: projectsMock,
  toItem: toProject,
  toPayload: toProjectPayload,
  listKey: 'projects',
  searchKeys: ['title', 'description'],
})
