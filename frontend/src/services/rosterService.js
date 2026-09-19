import { env } from '@/lib/env'
import { toListParams, toPage } from '@/lib/listQuery'
import { rosterMock } from '@/mocks/rosterMock'
import { apiClient } from '@/services/apiClient'
import { toRosterStudent } from '@/services/rosterAdapters'

const SEARCH_KEYS = ['name', 'rollNumber', 'email']

/** GET /api/students: the backend scopes results to the caller (faculty, HOD, admin). */
export const rosterService = {
  async list(query = {}) {
    const raw = env.useMock ? await rosterMock.students(query) : await apiClient.get('/students', { params: toListParams(query) })
    return toPage(raw?.students ?? raw, query, toRosterStudent, { searchKeys: SEARCH_KEYS })
  },
}
