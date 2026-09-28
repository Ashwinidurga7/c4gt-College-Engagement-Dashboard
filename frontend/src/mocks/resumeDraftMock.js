import { currentMockUser } from '@/mocks/authMock'
import { mockError, mockResponse } from '@/mocks/mockUtils'

/**
 * The server copy of each student's resume builder draft. Mock mode keeps it in localStorage under its own
 * key, apart from the builder's local cache, so it behaves like the database: it outlives sign-out and refresh.
 */
const serverKey = (userId) => `mock.resumeDraft:${userId}`

export const resumeDraftMock = {
  get() {
    const user = currentMockUser()
    if (!user) return mockError('Your session has expired. Please sign in again.', 401)
    try {
      return mockResponse(JSON.parse(window.localStorage.getItem(serverKey(user.id)) ?? 'null'))
    } catch {
      return mockResponse(null)
    }
  },

  save(draft) {
    const user = currentMockUser()
    if (!user) return mockError('Your session has expired. Please sign in again.', 401)
    try {
      window.localStorage.setItem(serverKey(user.id), JSON.stringify(draft))
    } catch {
      return mockError('The draft could not be saved.', 500)
    }
    return mockResponse(draft, 150)
  },
}
