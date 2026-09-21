import { env } from '@/lib/env'
import { toListParams, toPage } from '@/lib/listQuery'
import { rosterMock } from '@/mocks/rosterMock'
import { apiClient } from '@/services/apiClient'
import { toCohortAnalytics, toRosterStudent } from '@/services/rosterAdapters'

const SEARCH_KEYS = ['name', 'rollNumber', 'email']

/** Endpoints scoped by the backend to the CTPO's college, department, year and section. */
export const ctpoService = {
  async dashboard() {
    return toCohortAnalytics(env.useMock ? await rosterMock.ctpoDashboard() : await apiClient.get('/ctpo/dashboard'))
  },

  async students(query = {}) {
    const raw = env.useMock ? await rosterMock.students(query) : await apiClient.get('/ctpo/students', { params: toListParams(query) })
    return toPage(raw?.students ?? raw, query, toRosterStudent, { searchKeys: SEARCH_KEYS })
  },

  async attendance() {
    return toCohortAnalytics(env.useMock ? await rosterMock.ctpoAttendance() : await apiClient.get('/ctpo/attendance'))
  },

  async academicReport() {
    return toCohortAnalytics(env.useMock ? await rosterMock.ctpoAcademicReport() : await apiClient.get('/ctpo/academic-report'))
  },
}
