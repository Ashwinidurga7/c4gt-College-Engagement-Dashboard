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
  // Registrations awaiting approval (HOD approves CTPOs; admin approves faculty and HODs).
  { _id: 'u-ctpo-p1', name: 'P. Madhavi Latha', email: 'madhavi.latha@kiet.edu', role: 'ctpo', college: 'KIET', department: 'CSE', year: 2, section: 'B', approvalStatus: 'pending', createdAt: '2026-09-16T11:20:00+05:30' },
  { _id: 'u-ctpo-p2', name: 'G. Naresh Kumar', email: 'naresh.kumar@kiet.edu', role: 'ctpo', college: 'KIET', department: 'CSE', year: 4, section: 'A', approvalStatus: 'pending', createdAt: '2026-09-18T09:05:00+05:30' },
  { _id: 'u-ctpo-p3', name: 'S. Ravi Teja', email: 'ravi.teja@kiet.edu', role: 'ctpo', college: 'KIET', department: 'ECE', year: 3, section: 'A', approvalStatus: 'pending', createdAt: '2026-09-17T15:40:00+05:30' },
  { _id: 'u-faculty-p1', name: 'Mrs. A. Sowjanya', email: 'sowjanya.a@kiet.edu', role: 'faculty', college: 'KIET', department: 'IT', assignedYears: [1, 2], approvalStatus: 'pending', createdAt: '2026-09-15T10:00:00+05:30' },
  { _id: 'u-faculty-p2', name: 'Mr. T. Prakash', email: 'prakash.t@kiew.edu', role: 'faculty', college: 'KIEW', department: 'CSE-AI', assignedYears: [3], approvalStatus: 'pending', createdAt: '2026-09-18T12:30:00+05:30' },
  { _id: 'u-hod-p1', name: 'Dr. V. Ramana Murthy', email: 'hod.mech@kietplus.edu', role: 'hod', college: 'KIET+', department: 'MECH', academicYear: '2026-27', approvalStatus: 'pending', createdAt: '2026-09-14T16:45:00+05:30' },
]

export const MOCK_ACCOUNTS = users.filter((user) => user.approvalStatus === 'approved').map(({ email, role }) => ({ email, role }))

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
  if (user.approvalStatus === 'rejected') {
    return mockError('Your registration was not approved. Contact the college admin office.', 403)
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
  const user = { _id: `u-${payload.role}-${users.length + 1}`, ...payload, approvalStatus, createdAt: new Date().toISOString() }
  users.push(user)
  return mockResponse({ user: publicUser(user), approvalStatus })
}

/** Pending registrations matching `predicate`, newest first (used by HOD and admin approval mocks). */
export function pendingUsers(predicate) {
  return users
    .filter((user) => user.approvalStatus === 'pending' && predicate(user))
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    .map(publicUser)
}

export function setApproval(id, approvalStatus) {
  const user = users.find((entry) => entry._id === id)
  if (!user) return mockError('This registration could not be found.', 404)
  if (user.approvalStatus !== 'pending') return mockError('This registration has already been processed.', 409)
  user.approvalStatus = approvalStatus
  return mockResponse(publicUser(user))
}
