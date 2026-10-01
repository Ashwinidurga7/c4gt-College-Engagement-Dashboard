import { env } from '@/lib/env'
import { resumeDraftMock } from '@/mocks/resumeDraftMock'
import { apiClient } from '@/services/apiClient'

const mocked = env.useMockFor('resume')

/**
 * The resume builder draft stored against the student's account, so edits follow them across
 * sign-outs, refreshes and devices (`GET/PUT /api/resumes/builder-draft`).
 */
export const resumeDraftService = {
  async get() {
    const raw = mocked ? await resumeDraftMock.get() : await apiClient.get('/resumes/builder-draft')
    return raw?.draft ?? raw ?? null
  },

  async save(draft) {
    return mocked ? resumeDraftMock.save(draft) : apiClient.put('/resumes/builder-draft', { draft })
  },
}
