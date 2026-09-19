import { env } from '@/lib/env'
import { rosterMock } from '@/mocks/rosterMock'
import { apiClient } from '@/services/apiClient'
import { toFacultyProfile } from '@/services/rosterAdapters'

export const facultyService = {
  async me() {
    return toFacultyProfile(env.useMock ? await rosterMock.facultyMe() : await apiClient.get('/faculty/me'))
  },
}
