import { toPage } from '@/lib/listQuery'
import { withPlacementFields } from '@/lib/placement'
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

  async attendanceDay(params) {
    const raw = await previewMock.attendanceDay(params)
    return { students: raw.students.map(toRosterStudent), record: raw.record, workingDay: raw.workingDay !== false }
  },
  saveAttendanceDay: (values) => previewMock.saveAttendanceDay(values),
  async attendanceMonth(params) {
    const raw = await previewMock.attendanceMonth(params)
    return { students: raw.students.map(toRosterStudent), days: raw.days }
  },

  placementPool: async () => (await previewMock.placementPool()).map((raw) => withPlacementFields({ ...toRosterStudent(raw), recordsVerified: raw.recordsVerified, resumeSubmitted: raw.resumeSubmitted })),
  placementDrives: () => previewMock.placementDrives(),
  saveDriveCriteria: (values) => previewMock.saveDriveCriteria(values),
  setApplicationStatus: (values) => previewMock.setApplicationStatus(values),

  institutionSettings: () => previewMock.institutionSettings(),
  saveInstitutionSettings: (values) => previewMock.saveInstitutionSettings(values),
}
