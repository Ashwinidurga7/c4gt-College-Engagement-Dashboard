import { env } from '@/lib/env'
import { resumeDraftMock } from '@/mocks/resumeDraftMock'
import { apiClient } from '@/services/apiClient'

/**
 * The resume builder draft stored against the student's account, so edits follow them across
 * sign-outs, refreshes and devices. `GET/PUT /api/resumes/builder-draft` is not on the backend yet.
 */
export const resumeDraftService = {
  async get() {
    const raw = env.useMock ? await resumeDraftMock.get() : await apiClient.get('/resumes/builder-draft')
    return raw?.draft ?? raw ?? null
  },

  async save(draft) {
    return env.useMock ? resumeDraftMock.save(draft) : apiClient.put('/resumes/builder-draft', { draft })
  },
}
