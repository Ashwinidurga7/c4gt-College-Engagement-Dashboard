import { summarizeStudents } from '@/lib/analytics'
import { applyListQuery } from '@/lib/listQuery'
import { eligibilityGaps, withPlacementFields } from '@/lib/placement'
import { currentMockUser } from '@/mocks/authMock'
import { campusEvents, MOCK_TODAY } from '@/mocks/campusData'
import { directoryUsers } from '@/mocks/directoryData'
import { mockError, mockResponse } from '@/mocks/mockUtils'
import { courseCatalog, examSchedule } from '@/mocks/preview/academicsData'
import { busPass, facilities } from '@/mocks/preview/campusServicesData'
import { feePayments, studentFeeAccount } from '@/mocks/preview/feesData'
import { placementDrives } from '@/mocks/preview/placementData'
import { isWorkingDay, sectionKey, sectionStudents, seededDay, workingDaysIn } from '@/mocks/preview/sectionAttendanceData'
import { buildTimetable, TIMETABLE_SECTIONS } from '@/mocks/preview/timetableData'
import { rosterStudents } from '@/mocks/rosterData'
import { scopedStudents } from '@/mocks/rosterMock'
import { hashString } from '@/mocks/seededRandom'
import { studentProfile } from '@/mocks/studentProfileData'

let timetable = buildTimetable()
/** Registers faculty saved in this session, keyed by section and date; they override the seeded history. */
const savedDays = new Map()
let institutionSettings = { academicYear: '2026-27', semesterStart: '2026-07-01', semesterEnd: '2026-12-19', attendanceThreshold: 75, feeDueDate: '2026-09-30' }

function pageOf(items, query, searchKeys, defaultSort) {
  const page = applyListQuery(items, { ...query, searchKeys, sort: query?.sort ?? defaultSort })
  return { ...page, limit: page.pageSize }
}

const list = (...args) => mockResponse(pageOf(...args))

/** Pre-final and final years of the signed-in user's college: the students placement drives draw from. */
function placementPool() {
  const college = currentMockUser()?.college
  return rosterStudents
    .filter((student) => student.college === college && student.year >= 3)
    .map((student) => ({
      ...student,
      // A few records are still waiting on the exam cell, and not everyone has uploaded a resume.
      recordsVerified: !student.rollNumber.endsWith('07'),
      resumeSubmitted: student.rollNumber === studentProfile.rollNumber || hashString(student.rollNumber) % 10 < 7,
    }))
}

let drives = placementDrives.map((drive) => ({ ...drive, applications: {} }))
let drivesSeeded = false

/** Some eligible students have already applied; drives that have happened have results. */
function seedApplications() {
  if (drivesSeeded) return
  drivesSeeded = true
  const pool = placementPool().map(withPlacementFields)
  const today = new Date().toISOString().slice(0, 10)
  drives = drives.map((drive) => {
    const applications = {}
    pool
      .filter((student) => eligibilityGaps(student, drive.criteria).length === 0)
      .forEach((student) => {
        const roll = hashString(`${drive.id}${student.rollNumber}`) % 6
        if (roll > 3) return
        applications[student.rollNumber] = drive.driveDate < today ? (roll === 0 ? 'selected' : roll === 1 ? 'shortlisted' : 'rejected') : roll === 0 ? 'shortlisted' : 'applied'
      })
    return { ...drive, applications }
  })
}

/** Each student's event registrations by event id; the demo student has some history already. */
const eventRegistrations = new Map([
  [
    studentProfile._id,
    {
      'ev-prompt-workshop': { registeredAt: '2026-08-01T11:00:00+05:30', attended: false },
      'ev-code-sprint': { registeredAt: '2026-08-20T18:30:00+05:30', attended: true },
      'ev-nss-plantation': { registeredAt: '2026-09-02T09:40:00+05:30', attended: true },
      'ev-webdev-workshop': { registeredAt: '2026-09-15T20:10:00+05:30', attended: null },
    },
  ],
])

function registrationsOf(user) {
  if (!eventRegistrations.has(user.id)) eventRegistrations.set(user.id, {})
  return eventRegistrations.get(user.id)
}

/** A section in the signed-in faculty member's college. */
function facultySection({ department, year, section }) {
  const college = currentMockUser()?.college
  return college && department && year && section ? { college, department, year: Number(year), section } : null
}

function recordFor(section, date) {
  return savedDays.get(`${sectionKey(section)}|${date}`) ?? seededDay(section, date)
}

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

  /** One section's register for a day: saved by a faculty member here, seeded for past days, or not taken yet. */
  attendanceDay({ date, ...params }) {
    const section = facultySection(params)
    if (!section) return mockError('Choose a branch, year and section.', 400)
    return mockResponse({ students: sectionStudents(section), record: recordFor(section, date), workingDay: isWorkingDay(date) })
  },

  saveAttendanceDay({ date, absentees, ...params }) {
    const section = facultySection(params)
    if (!section) return mockError('Choose a branch, year and section.', 400)
    if (!isWorkingDay(date)) return mockError('Attendance can only be taken on working days.', 400)
    const previous = recordFor(section, date)
    const user = currentMockUser()
    const record = { ...section, date, absentees, takenBy: user?.name ?? 'Faculty', submittedAt: new Date().toISOString(), corrected: Boolean(previous) }
    savedDays.set(`${sectionKey(section)}|${date}`, record)
    return mockResponse({ ...record, total: sectionStudents(section).length })
  },

  /** Every working day of the month so far, each with its record or `null` when attendance was not taken. */
  attendanceMonth({ month, ...params }) {
    const section = facultySection(params)
    if (!section) return mockError('Choose a branch, year and section.', 400)
    const today = new Date().toISOString().slice(0, 10)
    return mockResponse({
      students: sectionStudents(section),
      days: workingDaysIn(month, today).map((date) => ({ date, record: recordFor(section, date) })),
    })
  },

  /** The student's registrations, newest event first: `upcoming`, or `attended` / `absent` once the event is over. */
  eventRegistrations() {
    const user = currentMockUser()
    if (user?.role !== 'student') return mockError('Only students register for events.', 403)
    const rows = Object.entries(registrationsOf(user))
      .map(([eventId, registration]) => ({ ...registration, event: campusEvents.find((event) => event._id === eventId) }))
      .filter((row) => row.event)
      .map((row) => ({ ...row, status: row.event.date >= MOCK_TODAY ? 'upcoming' : row.attended ? 'attended' : 'absent' }))
      .sort((a, b) => b.event.date.localeCompare(a.event.date))
    return mockResponse(rows)
  },

  registerForEvent(eventId) {
    const user = currentMockUser()
    const event = campusEvents.find((entry) => entry._id === eventId)
    if (user?.role !== 'student') return mockError('Only students register for events.', 403)
    if (!event) return mockError('This event could not be found.', 404)
    if ((event.registrationDeadline ?? event.date) < MOCK_TODAY) return mockError('Registration for this event has closed.', 409)
    const registrations = registrationsOf(user)
    if (registrations[eventId]) return mockError('You are already registered for this event.', 409)
    registrations[eventId] = { registeredAt: new Date().toISOString(), attended: null }
    return mockResponse({ event, ...registrations[eventId] })
  },

  cancelEventRegistration(eventId) {
    const user = currentMockUser()
    const event = campusEvents.find((entry) => entry._id === eventId)
    const registrations = user ? registrationsOf(user) : {}
    if (!event || !registrations[eventId]) return mockError('You are not registered for this event.', 404)
    if (event.date < MOCK_TODAY) return mockError('This event is over, so the registration cannot be cancelled.', 409)
    delete registrations[eventId]
    return mockResponse({ event })
  },

  placementPool() {
    return mockResponse(placementPool())
  },

  placementDrives() {
    seedApplications()
    return mockResponse(drives)
  },

  saveDriveCriteria({ id, criteria }) {
    seedApplications()
    if (!drives.some((drive) => drive.id === id)) return mockError('This drive could not be found.', 404)
    drives = drives.map((drive) => (drive.id === id ? { ...drive, criteria } : drive))
    return mockResponse(drives.find((drive) => drive.id === id))
  },

  setApplicationStatus({ driveId, rollNumber, status }) {
    seedApplications()
    const drive = drives.find((entry) => entry.id === driveId)
    if (!drive) return mockError('This drive could not be found.', 404)
    const applications = { ...drive.applications }
    if (status === 'not-applied') delete applications[rollNumber]
    else applications[rollNumber] = status
    drives = drives.map((entry) => (entry.id === driveId ? { ...entry, applications } : entry))
    return mockResponse({ driveId, rollNumber, status })
  },

  institutionSettings() {
    return mockResponse(institutionSettings)
  },

  saveInstitutionSettings(values) {
    institutionSettings = { ...institutionSettings, ...values }
    return mockResponse(institutionSettings)
  },
}
