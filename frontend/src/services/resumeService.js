import { env } from '@/lib/env'
import { toList } from '@/services/adapterUtils'
import { resumesMock } from '@/mocks/portfolioMock'
import { apiClient } from '@/services/apiClient'
import { toResume } from '@/services/portfolioAdapters'
import { toFormData } from '@/services/resourceService'

export const resumeService = {
  async list() {
    const raw = env.useMock ? (await resumesMock.list({ pageSize: 50 })).items : await apiClient.get('/resumes')
    return toList(raw?.resumes ?? raw?.items ?? raw).map(toResume)
  },

  async upload(file) {
    if (env.useMock) {
      return toResume(await resumesMock.create({ fileName: file.name, size: file.size, uploadedAt: new Date().toISOString(), fileUrl: URL.createObjectURL(file) }))
    }
    return toResume(await apiClient.post('/resumes', toFormData({}, file, 'resume')))
  },

  async setPrimary(id) {
    return toResume(env.useMock ? await resumesMock.setPrimary(id) : await apiClient.patch(`/resumes/${id}/primary`))
  },

  async remove(id) {
    if (env.useMock) await resumesMock.remove(id)
    else await apiClient.delete(`/resumes/${id}`)
    return id
  },
}
