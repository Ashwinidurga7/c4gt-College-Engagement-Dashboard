import { summarizeStudents } from '@/lib/analytics'
import { applyListQuery } from '@/lib/listQuery'
import { currentMockUser } from '@/mocks/authMock'
import { directoryUsers } from '@/mocks/directoryData'
import { mockError, mockResponse } from '@/mocks/mockUtils'
import { courseCatalog, examSchedule } from '@/mocks/preview/academicsData'
import { busPass, facilities } from '@/mocks/preview/campusServicesData'
import { feePayments, studentFeeAccount } from '@/mocks/preview/feesData'
import { buildTimetable, TIMETABLE_SECTIONS } from '@/mocks/preview/timetableData'
import { rosterStudents } from '@/mocks/rosterData'
import { scopedStudents } from '@/mocks/rosterMock'

let timetable = buildTimetable()
let attendanceSessions = []
let institutionSettings = { academicYear: '2026-27', semesterStart: '2026-07-01', semesterEnd: '2026-12-19', attendanceThreshold: 75, feeDueDate: '2026-09-30' }

function pageOf(items, query, searchKeys, defaultSort) {
  const page = applyListQuery(items, { ...query, searchKeys, sort: query?.sort ?? defaultSort })
  return { ...page, limit: page.pageSize }
}

const list = (...args) => mockResponse(pageOf(...args))

function feeTotals(payments) {
  const sum = (status) => payments.filter((payment) => !status || payment.status === status).reduce((total, payment) => total + payment.amount, 0)
  return { total: sum(), collected: sum('paid'), pending: sum('pending'), overdue: sum('overdue'), count: payments.length }
}

/** Mock-only modules. They stay on this layer even when VITE_USE_MOCK=false. */
export const previewMock = {
  timetable() {
    return mockResponse({ sections: TIMETABLE_SECTIONS, entries: timetable })
  },

  moveTimetableEntry(id, { day, slot }) {
    const entry = timetable.find((item) => item.id === id)
    if (!entry) return mockError('This class could not be found.', 404)
    const clash = timetable.some(
      (other) => other.id !== id && other.day === day && other.slot === slot && (other.section === entry.section || other.faculty === entry.faculty || other.room === entry.room),
    )
    if (clash) return mockError('That slot is no longer free. Detect conflicts again for a new suggestion.', 409)
    timetable = timetable.map((item) => (item.id === id ? { ...item, day, slot } : item))
    return mockResponse(timetable.find((item) => item.id === id))
  },

  fees(query) {
    return mockResponse({ totals: feeTotals(feePayments), page: pageOf(feePayments, query, ['student', 'rollNumber'], { key: 'student', direction: 'asc' }) })
  },

  studentFees() {
    return mockResponse(studentFeeAccount)
  },

  exams(query = {}) {
    const user = currentMockUser()
    const scoped = user?.role === 'student' ? examSchedule.filter((exam) => exam.department === user.department && exam.year === user.year) : examSchedule
    return list(scoped, query, ['subject', 'room'], { key: 'date', direction: 'asc' })
  },

  departments() {
    const users = directoryUsers()
    const rows = [...new Set(rosterStudents.map((student) => `${student.college}|${student.department}`))].map((key) => {
      const [college, department] = key.split('|')
      const inDept = (user) => user.college === college && user.department === department && user.approvalStatus === 'approved'
      const students = rosterStudents.filter((student) => student.college === college && student.department === department)
      return {
        id: key,
        college,
        department,
        hod: users.find((user) => user.role === 'hod' && inDept(user))?.name ?? null,
        faculty: users.filter((user) => user.role === 'faculty' && inDept(user)).length,
        ctpos: users.filter((user) => user.role === 'ctpo' && inDept(user)).length,
        ...summarizeStudents(students),
      }
    })
    return mockResponse(rows)
  },

  catalog(query = {}) {
    const user = currentMockUser()
    const scoped = user?.role === 'hod' ? courseCatalog.filter((course) => course.department === user.department) : courseCatalog
    return list(scoped, query, ['code', 'name'], { key: 'code', direction: 'asc' })
  },

  facilities(query) {
    return list(facilities, query, ['name', 'location', 'category'], { key: 'name', direction: 'asc' })
  },

  busPass() {
    return mockResponse(busPass)
  },

  reportSource() {
    const user = currentMockUser()
    return mockResponse({ students: user?.role === 'hod' ? scopedStudents(user) : rosterStudents, payments: feePayments })
  },

  facultyClasses() {
    const user = currentMockUser()
    return mockResponse(timetable.filter((entry) => entry.faculty === user?.name))
  },

  sectionStudents(sectionKey) {
    const section = TIMETABLE_SECTIONS.find((item) => item.value === sectionKey)
    if (!section) return mockError('Unknown section.', 404)
    return mockResponse(
      rosterStudents.filter((student) => student.college === 'KIET' && student.department === 'CSE' && student.year === section.year && student.section === section.section),
    )
  },

  submitAttendance(session) {
    const saved = { ...session, id: `session-${attendanceSessions.length + 1}`, submittedAt: new Date().toISOString() }
    attendanceSessions = [saved, ...attendanceSessions]
    return mockResponse(saved)
  },

  attendanceSessions() {
    return mockResponse(attendanceSessions)
  },

  institutionSettings() {
    return mockResponse(institutionSettings)
  },

  saveInstitutionSettings(values) {
    institutionSettings = { ...institutionSettings, ...values }
    return mockResponse(institutionSettings)
  },
}
