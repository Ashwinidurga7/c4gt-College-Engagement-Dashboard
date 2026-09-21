import { env } from '@/lib/env'
import { isRole } from '@/lib/roles'
import { mockLogin, mockMe, mockRegister } from '@/mocks/authMock'
import { nameOf } from '@/services/adapterUtils'
import { apiClient, ApiError } from '@/services/apiClient'

/** Maps any backend user shape to the one the UI consumes. */
function toUser(raw) {
  const source = raw?.user ?? raw
  if (!source || typeof source !== 'object') return null
  return {
    id: source.id ?? source._id ?? null,
    name: source.name ?? source.fullName ?? 'KIET member',
    email: source.email ?? '',
    role: isRole(source.role) ? source.role : null,
    college: source.college ?? null,
    department: nameOf(source.department),
    year: source.year ?? null,
    section: source.section ?? null,
    rollNumber: source.rollNumber ?? source.rollNo ?? null,
    approvalStatus: source.approvalStatus ?? 'approved',
  }
}

function toSession(data) {
  // The backend returns the user's fields beside the token, not nested under `user`.
  const user = toUser(data?.user ?? data)
  if (!data?.token || !user?.role) {
    throw new ApiError('Sign-in response was incomplete. Please try again.', { status: 500 })
  }
  return { user, token: data.token }
}

function toRegistration(data) {
  const user = toUser(data?.user ?? data)
  return { user, approvalStatus: data?.approvalStatus ?? user?.approvalStatus ?? 'approved' }
}

const REGISTER_PATHS = {
  student: '/auth/register',
  faculty: '/auth/register',
  hod: '/auth/register/hod',
  ctpo: '/auth/register/ctpo',
}

export const authService = {
  async login(credentials) {
    const data = env.useMock ? await mockLogin(credentials) : await apiClient.post('/auth/login', credentials)
    return toSession(data)
  },

  async me(token) {
    const data = env.useMock ? await mockMe(token) : await apiClient.get('/auth/me')
    const user = toUser(data)
    if (!user?.role) throw new ApiError('Could not restore your session.', { status: 401 })
    return user
  },

  async register(payload) {
    const path = REGISTER_PATHS[payload.role]
    if (!path) throw new ApiError('Registration is not available for this role.', { status: 400 })
    // Dedicated HOD and CTPO endpoints imply the role, so it is only sent to the shared endpoint.
    const { role, ...fields } = payload
    const body = path === REGISTER_PATHS.student ? payload : fields
    const data = env.useMock ? await mockRegister({ role, ...fields }) : await apiClient.post(path, body)
    return toRegistration(data)
  },
}
