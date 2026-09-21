import { toPage } from '@/lib/listQuery'
import { previewMock } from '@/mocks/preview/previewMock'
import { toRosterStudent } from '@/services/rosterAdapters'

const identity = (item) => item

/**
 * Modules with no backend endpoint (plan section 11). They always use the mock layer,
 * even when VITE_USE_MOCK=false, and every page using them shows a Preview badge.
 * When an endpoint ships, swap the mock call here for apiClient and keep the same shapes.
 */
export const previewService = {
  timetable: () => previewMock.timetable(),
  moveTimetableEntry: ({ id, day, slot }) => previewMock.moveTimetableEntry(id, { day, slot }),

  async fees(query) {
    const raw = await previewMock.fees(query)
    return { totals: raw.totals, page: toPage(raw.page, query, identity) }
  },
  studentFees: () => previewMock.studentFees(),

  exams: async (query) => toPage(await previewMock.exams(query), query, identity),
  departments: () => previewMock.departments(),
  catalog: async (query) => toPage(await previewMock.catalog(query), query, identity),
  facilities: async (query) => toPage(await previewMock.facilities(query), query, identity),
  busPass: () => previewMock.busPass(),

  async reportSource() {
    const raw = await previewMock.reportSource()
    return { students: raw.students.map(toRosterStudent), payments: raw.payments }
  },

  facultyClasses: () => previewMock.facultyClasses(),
  sectionStudents: async (section) => (await previewMock.sectionStudents(section)).map(toRosterStudent),
  submitAttendance: (session) => previewMock.submitAttendance(session),
  attendanceSessions: () => previewMock.attendanceSessions(),

  institutionSettings: () => previewMock.institutionSettings(),
  saveInstitutionSettings: (values) => previewMock.saveInstitutionSettings(values),
}
