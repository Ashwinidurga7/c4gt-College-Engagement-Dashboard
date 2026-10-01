import { env } from '@/lib/env'
import { resumeVersionMock } from '@/mocks/resumeVersionMock'
import { toList } from '@/services/adapterUtils'
import { apiClient } from '@/services/apiClient'

const mocked = env.useMockFor('resume')

const toVersion = (raw) => ({
  id: raw._id ?? raw.id,
  reason: raw.reason ?? 'manual',
  createdAt: raw.createdAt,
  draft: raw.draft ?? {},
  printModel: raw.printModel ?? null,
})

/**
 * The student's resume history: snapshots of the builder draft (to restore) with the resume as printed at
 * that moment (to download). Newest first; the backend keeps the latest 30
 * (`GET/POST /api/resumes/builder-versions`, `DELETE /api/resumes/builder-versions/:id`).
 */
export const resumeVersionService = {
  async list() {
    const raw = mocked ? await resumeVersionMock.list() : await apiClient.get('/resumes/builder-versions')
    return toList(raw?.versions ?? raw).map(toVersion)
  },

  async create(version) {
    return toVersion(mocked ? await resumeVersionMock.create(version) : await apiClient.post('/resumes/builder-versions', version))
  },

  async remove(id) {
    if (mocked) await resumeVersionMock.remove(id)
    else await apiClient.delete(`/resumes/builder-versions/${id}`)
    return id
  },
}
