import { toPage } from '@/lib/listQuery'
import { withPlacementFields } from '@/lib/placement'
import { previewMock } from '@/mocks/preview/previewMock'
import { toRosterStudent } from '@/services/rosterAdapters'
import { toEvent } from '@/services/studentAdapters'

const identity = (item) => item

const toPlacementStudent = (raw) => withPlacementFields({ ...toRosterStudent(raw), recordsVerified: raw.recordsVerified, resumeSubmitted: raw.resumeSubmitted })

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

  examNotices: () => previewMock.examNotices(),
  exams: async (query) => toPage(await previewMock.exams(query), query, identity),
  departments: () => previewMock.departments(),
  catalog: async (query) => toPage(await previewMock.catalog(query), query, identity),
  facilities: async (query) => toPage(await previewMock.facilities(query), query, identity),
  busPass: () => previewMock.busPass(),

  async reportSource() {
    const raw = await previewMock.reportSource()
    return {
      students: raw.students.map(toPlacementStudent),
      payments: raw.payments,
      drives: raw.drives,
      events: raw.events.map(toEvent),
      participation: raw.participation,
    }
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

  async eventRegistrations() {
    return (await previewMock.eventRegistrations()).map((row) => ({ ...row, event: toEvent(row.event) }))
  },
  registerForEvent: async (eventId) => {
    const raw = await previewMock.registerForEvent(eventId)
    return { ...raw, event: toEvent(raw.event) }
  },
  cancelEventRegistration: async (eventId) => toEvent((await previewMock.cancelEventRegistration(eventId)).event),

  placementPool: async () => (await previewMock.placementPool()).map(toPlacementStudent),
  placementDrives: () => previewMock.placementDrives(),
  saveDriveCriteria: (values) => previewMock.saveDriveCriteria(values),
  setApplicationStatus: (values) => previewMock.setApplicationStatus(values),

  notificationPreferences: () => previewMock.notificationPreferences(),
  saveNotificationPreferences: (preferences) => previewMock.saveNotificationPreferences(preferences),

  institutionSettings: () => previewMock.institutionSettings(),
  saveInstitutionSettings: (values) => previewMock.saveInstitutionSettings(values),
}
