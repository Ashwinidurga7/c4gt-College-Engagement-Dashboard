import { createMockCollection } from '@/mocks/mockStore'
import { mockResponse } from '@/mocks/mockUtils'
import {
  achievementsData,
  activitiesData,
  certificatesData,
  certificationsData,
  internshipsData,
  projectsData,
  resumesData,
} from '@/mocks/portfolioData'

const newestFirst = { key: 'date', direction: 'desc' }

export const certificationsMock = createMockCollection(certificationsData, {
  prefix: 'cert',
  searchKeys: ['name', 'issuer', 'credentialId'],
  defaultSort: { key: 'issueDate', direction: 'desc' },
})

export const certificatesMock = createMockCollection(certificatesData, {
  prefix: 'crt',
  searchKeys: ['title', 'issuedBy', 'category'],
  defaultSort: newestFirst,
})

export const projectsMock = createMockCollection(projectsData, {
  prefix: 'proj',
  searchKeys: ['title', 'description'],
  defaultSort: { key: 'startDate', direction: 'desc' },
})

export const internshipsMock = createMockCollection(internshipsData, {
  prefix: 'intern',
  searchKeys: ['company', 'role'],
  defaultSort: { key: 'startDate', direction: 'desc' },
})

export const achievementsMock = createMockCollection(achievementsData, { prefix: 'ach', defaultSort: newestFirst })
export const activitiesMock = createMockCollection(activitiesData, { prefix: 'actv', defaultSort: newestFirst })

const resumes = createMockCollection(resumesData, { prefix: 'res', defaultSort: { key: 'uploadedAt', direction: 'desc' } })

export const resumesMock = {
  ...resumes,
  /** The first upload becomes primary automatically. */
  create(data) {
    return resumes.create({ ...data, isPrimary: resumes.all().length === 0 })
  },
  async setPrimary(id) {
    await resumes.updateAll((entry) => ({ isPrimary: entry._id === id }))
    return mockResponse(resumes.all().find((entry) => entry._id === id))
  },
}
