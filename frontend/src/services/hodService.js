import { env } from '@/lib/env'
import { toListParams, toPage } from '@/lib/listQuery'
import { hodMock } from '@/mocks/hodMock'
import { rosterMock } from '@/mocks/rosterMock'
import { toList } from '@/services/adapterUtils'
import { apiClient } from '@/services/apiClient'
import { toDepartmentAnalytics, toPendingRegistration, toRosterStudent } from '@/services/rosterAdapters'

const SEARCH_KEYS = ['name', 'rollNumber', 'email']

/** Endpoints scoped by the backend to the HOD's college and department. */
export const hodService = {
  async dashboard() {
    return toDepartmentAnalytics(env.useMock ? await hodMock.dashboard() : await apiClient.get('/hod/dashboard'))
  },

  async students(query = {}) {
    const raw = env.useMock ? await rosterMock.students(query) : await apiClient.get('/hod/students', { params: toListParams(query) })
    return toPage(raw?.students ?? raw, query, toRosterStudent, { searchKeys: SEARCH_KEYS })
  },

  async attendance() {
    return toDepartmentAnalytics(env.useMock ? await hodMock.attendance() : await apiClient.get('/hod/attendance'))
  },

  async academicReport() {
    return toDepartmentAnalytics(env.useMock ? await hodMock.academicReport() : await apiClient.get('/hod/academic-report'))
  },

  async pendingCtpos() {
    const raw = env.useMock ? await hodMock.pendingCtpos() : await apiClient.get('/hod/ctpos/pending')
    return toList(raw?.ctpos ?? raw?.items ?? raw).map(toPendingRegistration)
  },

  async approveCtpo(id) {
    return toPendingRegistration(env.useMock ? await hodMock.decideCtpo(id, 'approved') : await apiClient.put(`/hod/ctpos/${id}/approve`))
  },

  async rejectCtpo(id) {
    return toPendingRegistration(env.useMock ? await hodMock.decideCtpo(id, 'rejected') : await apiClient.put(`/hod/ctpos/${id}/reject`))
  },
}
