import { currentMockUser } from '@/mocks/authMock'
import { mockError, mockResponse } from '@/mocks/mockUtils'

/** Oldest versions beyond this are dropped, as the backend is expected to do. */
export const MAX_RESUME_VERSIONS = 30

/**
 * The server copy of each student's resume history. Mock mode keeps it in localStorage per user, so like the
 * database it outlives sign-out and refresh, and one student never sees another's versions.
 */
const serverKey = (userId) => `mock.resumeVersions:${userId}`

function read(userId) {
  try {
    return JSON.parse(window.localStorage.getItem(serverKey(userId)) ?? '[]')
  } catch {
    return []
  }
}

function write(userId, versions) {
  try {
    window.localStorage.setItem(serverKey(userId), JSON.stringify(versions))
    return true
  } catch {
    return false
  }
}

const expired = () => mockError('Your session has expired. Please sign in again.', 401)

export const resumeVersionMock = {
  list() {
    const user = currentMockUser()
    return user ? mockResponse(read(user.id), 200) : expired()
  },

  create(version) {
    const user = currentMockUser()
    if (!user) return expired()
    const created = { ...version, _id: `rv-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`, createdAt: new Date().toISOString() }
    const next = [created, ...read(user.id)].slice(0, MAX_RESUME_VERSIONS)
    return write(user.id, next) ? mockResponse(created, 150) : mockError('The version could not be saved.', 500)
  },

  remove(id) {
    const user = currentMockUser()
    if (!user) return expired()
    write(user.id, read(user.id).filter((version) => version._id !== id))
    return mockResponse({ _id: id }, 150)
  },
}
