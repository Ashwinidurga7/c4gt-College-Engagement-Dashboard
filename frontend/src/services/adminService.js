import { env } from '@/lib/env'
import { toListParams, toPage } from '@/lib/listQuery'
import { isRole } from '@/lib/roles'
import { adminMock } from '@/mocks/adminMock'
import { pick, toId, toList, toNumber } from '@/services/adapterUtils'
import { apiClient } from '@/services/apiClient'
import { toCertificate } from '@/services/portfolioAdapters'
import { toPendingRegistration } from '@/services/rosterAdapters'

/** Admin approves faculty and HOD registrations; the path segment differs per role. */
const APPROVAL_PATHS = { faculty: 'faculty', hod: 'hods' }

function toDirectoryUser(raw = {}) {
  return {
    id: toId(raw),
    name: pick(raw.name, 'User'),
    email: raw.email ?? null,
    role: isRole(raw.role) ? raw.role : null,
    college: raw.college ?? null,
    department: raw.department ?? null,
    approvalStatus: String(pick(raw.approvalStatus, raw.status, 'approved')).toLowerCase(),
    createdAt: pick(raw.createdAt, raw.joinedOn),
  }
}

function toAdminDashboard(raw = {}) {
  const totals = raw.totals ?? raw.stats ?? raw
  const number = (...keys) => toNumber(pick(...keys.map((key) => totals[key])), null)
  return {
    totals: {
      students: number('students', 'totalStudents'),
      faculty: number('faculty', 'totalFaculty'),
      hods: number('hods', 'totalHods'),
      ctpos: number('ctpos', 'totalCtpos'),
      activeClubs: number('activeClubs', 'clubs'),
      upcomingEvents: number('upcomingEvents', 'events'),
      pendingApprovals: number('pendingApprovals', 'pending'),
      pendingVerifications: number('pendingVerifications', 'verifications'),
    },
    byCollege: toList(raw.byCollege).map((entry) => ({
      college: entry.college,
      label: pick(entry.label, entry.college),
      total: toNumber(pick(entry.total, entry.students), 0),
      averageAttendance: toNumber(entry.averageAttendance),
      averageCgpa: toNumber(entry.averageCgpa),
      lowAttendance: toNumber(entry.lowAttendance, 0),
      withBacklogs: toNumber(entry.withBacklogs, 0),
    })),
    recentRegistrations: toList(raw.recentRegistrations).map(toPendingRegistration),
  }
}

export const adminService = {
  async dashboard() {
    return toAdminDashboard(env.useMock ? await adminMock.dashboard() : await apiClient.get('/admin/dashboard'))
  },

  async users(query = {}) {
    const raw = env.useMock ? await adminMock.users(query) : await apiClient.get('/admin/users', { params: toListParams(query) })
    return toPage(raw?.users ?? raw, query, toDirectoryUser, { searchKeys: ['name', 'email', 'department'] })
  },

  async pending(role) {
    const raw = env.useMock ? await adminMock.pending(role) : await apiClient.get(`/admin/${APPROVAL_PATHS[role]}/pending`)
    return toList(raw?.[APPROVAL_PATHS[role]] ?? raw?.items ?? raw).map(toPendingRegistration)
  },

  async decide(role, id, decision) {
    const action = decision === 'approved' ? 'approve' : 'reject'
    const raw = env.useMock ? await adminMock.decide(role, id, decision) : await apiClient.put(`/admin/${APPROVAL_PATHS[role]}/${id}/${action}`)
    return toPendingRegistration(raw)
  },

  /** GET /api/admin/pending is treated as the institution-wide verification queue. */
  async verifications(query = {}) {
    const raw = env.useMock ? await adminMock.verifications(query) : await apiClient.get('/admin/pending', { params: toListParams(query) })
    return toPage(raw?.certificates ?? raw?.pending ?? raw, query, toCertificate, { searchKeys: ['title', 'issuedBy', 'category'] })
  },
}
