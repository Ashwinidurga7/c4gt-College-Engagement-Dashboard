import { summarizeStudents } from '@/lib/analytics'
import { applyListQuery } from '@/lib/listQuery'
import { pendingUsers, setApproval } from '@/mocks/authMock'
import { MOCK_TODAY, campusEvents } from '@/mocks/campusData'
import { clubsMock } from '@/mocks/campusMock'
import { directoryUsers } from '@/mocks/directoryData'
import { mockError, mockResponse } from '@/mocks/mockUtils'
import { certificatesMock } from '@/mocks/portfolioMock'
import { rosterStudents } from '@/mocks/rosterData'

const APPROVED_BY_ADMIN = ['faculty', 'hod']

function countRole(users, role) {
  return users.filter((user) => user.role === role && user.approvalStatus === 'approved').length
}

/** Admin endpoints in mock mode. Counts derive from the same directory, clubs, events and certificates the other pages use. */
export const adminMock = {
  dashboard() {
    const users = directoryUsers()
    const colleges = ['KIET', 'KIET+', 'KIEW'].map((college) => {
      const students = rosterStudents.filter((student) => student.college === college)
      return { college, label: college, ...summarizeStudents(students) }
    })
    return mockResponse({
      totals: {
        students: countRole(users, 'student'),
        faculty: countRole(users, 'faculty'),
        hods: countRole(users, 'hod'),
        ctpos: countRole(users, 'ctpo'),
        activeClubs: clubsMock.all().filter((club) => club.status === 'active').length,
        upcomingEvents: campusEvents.filter((event) => event.date >= MOCK_TODAY).length,
        pendingApprovals: pendingUsers((user) => APPROVED_BY_ADMIN.includes(user.role)).length,
        pendingVerifications: certificatesMock.all().filter((item) => item.status === 'pending').length,
      },
      byCollege: colleges,
      recentRegistrations: pendingUsers((user) => APPROVED_BY_ADMIN.includes(user.role)).slice(0, 5),
    })
  },

  users({ filters = {}, ...query } = {}) {
    const page = applyListQuery(directoryUsers(), {
      ...query,
      filters,
      searchKeys: ['name', 'email', 'department'],
      sort: query.sort ?? { key: 'name', direction: 'asc' },
    })
    return mockResponse({ ...page, limit: page.pageSize })
  },

  pending(role) {
    return mockResponse(pendingUsers((user) => user.role === role))
  },

  decide(role, id, decision) {
    if (!pendingUsers((user) => user.role === role).some((user) => user.id === id)) {
      return mockError('This registration is not pending.', 404)
    }
    return setApproval(id, decision)
  },

  /** Pending certificate verifications across the institution. */
  verifications({ filters = {}, ...query } = {}) {
    const pending = certificatesMock.all().filter((item) => (filters.status ? item.status === filters.status : true))
    const page = applyListQuery(pending, {
      ...query,
      filters: { category: filters.category ?? '' },
      searchKeys: ['title', 'issuedBy', 'category'],
      sort: query.sort ?? { key: 'date', direction: 'desc' },
    })
    return mockResponse({ ...page, limit: page.pageSize })
  },
}
