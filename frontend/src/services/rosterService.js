import { env } from '@/lib/env'
import { toListParams } from '@/lib/listQuery'
import { rosterMock } from '@/mocks/rosterMock'
import { apiClient } from '@/services/apiClient'
import { toRosterPage } from '@/services/rosterAdapters'

/** GET /api/students: the backend scopes results to the caller (faculty, HOD, admin). */
export const rosterService = {
  async list(query = {}) {
    const raw = env.useMock ? await rosterMock.students(query) : await apiClient.get('/students', { params: toListParams(query) })
    return toRosterPage(raw, query)
  },
}
