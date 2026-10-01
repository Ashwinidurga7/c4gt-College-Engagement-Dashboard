import { env } from '@/lib/env'
import { toList } from '@/services/adapterUtils'
import { fileToDataUrl } from '@/mocks/mockUtils'
import { resumesMock } from '@/mocks/portfolioMock'
import { apiClient } from '@/services/apiClient'
import { toResume } from '@/services/portfolioAdapters'
import { toFormData } from '@/services/resourceService'

const mocked = env.useMockFor('resume')

export const resumeService = {
  async list() {
    const raw = mocked ? (await resumesMock.list({ pageSize: 50 })).items : await apiClient.get('/resumes')
    return toList(raw?.resumes ?? raw?.items ?? raw).map(toResume)
  },

  async upload(file) {
    if (mocked) {
      return toResume(await resumesMock.create({ fileName: file.name, size: file.size, uploadedAt: new Date().toISOString(), fileUrl: await fileToDataUrl(file) }))
    }
    return toResume(await apiClient.post('/resumes', toFormData({}, file, 'resume')))
  },

  async setPrimary(id) {
    return toResume(mocked ? await resumesMock.setPrimary(id) : await apiClient.patch(`/resumes/${id}/primary`))
  },

  async remove(id) {
    if (mocked) await resumesMock.remove(id)
    else await apiClient.delete(`/resumes/${id}`)
    return id
  },
}
