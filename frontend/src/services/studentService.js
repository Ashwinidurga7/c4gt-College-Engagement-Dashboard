import { env } from '@/lib/env'
import { toListParams, toPage } from '@/lib/listQuery'
import { achievementsMock, activitiesMock } from '@/mocks/portfolioMock'
import { studentMock } from '@/mocks/studentMock'
import { apiClient } from '@/services/apiClient'
import {
  toAcademic,
  toAcademicReport,
  toAttendance,
  toCourse,
  toDashboard,
  toEvent,
  toProfile,
  toProfilePayload,
} from '@/services/studentAdapters'
import { toList } from '@/services/adapterUtils'
import { toAchievement, toPortfolioActivity } from '@/services/portfolioAdapters'

function get(path, params) {
  return apiClient.get(`/students/${path}`, { params })
}

export const studentService = {
  async dashboard() {
    return toDashboard(env.useMock ? await studentMock.dashboard() : await get('dashboard'))
  },

  async profile() {
    return toProfile(env.useMock ? await studentMock.profile() : await get('profile'))
  },

  async updateProfile(values) {
    const payload = toProfilePayload(values)
    return toProfile(env.useMock ? await studentMock.updateProfile(payload) : await apiClient.put('/students/profile', payload))
  },

  async academic() {
    return toAcademic(env.useMock ? await studentMock.academic() : await get('academic'))
  },

  /** Search, sort and paging are sent to the API; a bare-array response is paged locally as a fallback. */
  async courses(query) {
    const raw = env.useMock ? await studentMock.courses(query) : await get('courses', toListParams(query))
    return toPage(raw?.courses ?? raw, query, toCourse, { searchKeys: ['code', 'name', 'faculty', 'type'] })
  },

  async attendance() {
    return toAttendance(env.useMock ? await studentMock.attendance() : await get('attendance'))
  },

  async academicReport() {
    return toAcademicReport(env.useMock ? await studentMock.academicReport() : await get('academic-report'))
  },

  async achievements(query = {}) {
    const raw = env.useMock ? await achievementsMock.list(query) : await get('achievements', toListParams(query))
    return toPage(raw?.achievements ?? raw, query, toAchievement, { searchKeys: ['title', 'category'] })
  },

  async activities(query = {}) {
    const raw = env.useMock ? await activitiesMock.list(query) : await get('activities', toListParams(query))
    return toPage(raw?.activities ?? raw, query, toPortfolioActivity, { searchKeys: ['title', 'type', 'organizer'] })
  },

  async upcomingEvents() {
    const raw = env.useMock ? await studentMock.upcomingEvents() : await get('upcoming-events')
    return toList(raw?.events ?? raw).map(toEvent)
  },
}
