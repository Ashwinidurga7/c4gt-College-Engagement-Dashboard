import { env } from '@/lib/env'
import { currentMockUser } from '@/mocks/authMock'
import { certificatesMock } from '@/mocks/portfolioMock'
import { apiClient } from '@/services/apiClient'
import { toCertificate } from '@/services/portfolioAdapters'
import { createResourceService, toFormData } from '@/services/resourceService'

const base = createResourceService({
  path: '/certificates',
  mock: certificatesMock,
  toItem: toCertificate,
  listKey: 'certificates',
  searchKeys: ['title', 'issuedBy', 'category'],
})

export const certificateService = {
  list: base.list,
  get: base.get,
  remove: base.remove,

  /** Uploads a certificate file; it starts as pending until a faculty member verifies it. */
  async upload({ file, ...fields }) {
    if (env.useMock) {
      const created = await certificatesMock.create({
        ...fields,
        status: 'pending',
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
      })
      return toCertificate(created)
    }
    return toCertificate(await apiClient.post('/certificates', toFormData(fields, file, 'certificate')))
  },

  /** `decision` is `{ status: 'verified' | 'rejected', remarks }`; see ASSUMPTIONS.md for the body shape. */
  async verify(id, decision = { status: 'verified' }) {
    const data = env.useMock
      ? await certificatesMock.update(id, { status: decision.status, remarks: decision.remarks ?? null, verifiedBy: currentMockUser()?.name ?? null })
      : await apiClient.put(`/certificates/${id}/verify`, decision)
    return toCertificate(data)
  },
}
