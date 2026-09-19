import { tokenStorage } from '@/lib/tokenStorage'
import { mockError, mockResponse } from '@/mocks/mockUtils'

/** Shared demo password for every mock account. Mock mode only; never used against the real API. */
export const MOCK_PASSWORD = 'Kiet@2026'

const users = [
  {
    _id: 'u-student-01',
    name: 'B. Ashwini Durga',
    email: 'ashwini.durga@kiet.edu',
    role: 'student',
    college: 'KIET',
    department: 'CSE',
    rollNumber: '24JN1A0534',
    year: 3,
    section: 'A',
    approvalStatus: 'approved',
  },
  {
    _id: 'u-faculty-01',
    name: 'Dr. Ramesh Varma',
    email: 'ramesh.varma@kiet.edu',
    role: 'faculty',
    college: 'KIET',
    department: 'CSE',
    assignedYears: [2, 3],
    approvalStatus: 'approved',
  },
  {
    _id: 'u-hod-01',
    name: 'Dr. Lakshmi Prasanna',
    email: 'hod.cse@kiet.edu',
    role: 'hod',
    college: 'KIET',
    department: 'CSE',
    academicYear: '2026-27',
    approvalStatus: 'approved',
  },
  {
    _id: 'u-ctpo-01',
    name: 'K. Srinivasa Rao',
    email: 'srinivasa.rao@kiet.edu',
    role: 'ctpo',
    college: 'KIET',
    department: 'CSE',
    year: 3,
    section: 'A',
    approvalStatus: 'approved',
  },
  {
    _id: 'u-admin-01',
    name: 'M. Suresh Babu',
    email: 'admin@kiet.edu',
    role: 'admin',
    college: 'KIET',
    approvalStatus: 'approved',
  },
]

export const MOCK_ACCOUNTS = users.map(({ email, role }) => ({ email, role }))

const TOKEN_PREFIX = 'mock.'

function publicUser({ _id, password: _password, ...rest }) {
  return { id: _id, ...rest }
}

export function mockLogin({ email, password }) {
  const user = users.find((entry) => entry.email.toLowerCase() === email.trim().toLowerCase())
  if (!user || password !== (user.password ?? MOCK_PASSWORD)) {
    return mockError('Invalid email or password.', 401)
  }
  if (user.approvalStatus === 'pending') {
    return mockError('Your account is awaiting approval.', 403)
  }
  return mockResponse({ user: publicUser(user), token: `${TOKEN_PREFIX}${user._id}` })
}

/** The signed-in mock user, used by other mocks to scope data by role. */
export function currentMockUser() {
  const token = tokenStorage.get()
  const user = users.find((entry) => `${TOKEN_PREFIX}${entry._id}` === token)
  return user ? publicUser(user) : null
}

export function mockMe(token) {
  const user = users.find((entry) => `${TOKEN_PREFIX}${entry._id}` === token)
  return user ? mockResponse(publicUser(user)) : mockError('Your session has expired. Please sign in again.', 401)
}

export function mockRegister(payload) {
  if (users.some((entry) => entry.email.toLowerCase() === payload.email.toLowerCase())) {
    return mockError('An account with this email already exists.', 409)
  }
  const approvalStatus = payload.role === 'student' ? 'approved' : 'pending'
  const user = { _id: `u-${payload.role}-${users.length + 1}`, ...payload, approvalStatus }
  users.push(user)
  return mockResponse({ user: publicUser(user), approvalStatus })
}
