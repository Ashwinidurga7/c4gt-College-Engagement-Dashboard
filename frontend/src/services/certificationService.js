import { certificationsMock } from '@/mocks/portfolioMock'
import { toCertification, toCertificationPayload } from '@/services/portfolioAdapters'
import { createResourceService } from '@/services/resourceService'

export const certificationService = createResourceService({
  path: '/certifications',
  mock: certificationsMock,
  toItem: toCertification,
  toPayload: toCertificationPayload,
  listKey: 'certifications',
  searchKeys: ['name', 'issuer', 'credentialId'],
})
