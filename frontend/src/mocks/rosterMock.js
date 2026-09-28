import { attendanceBands, gradeBands, sgpaTrend, subjectAverages, summarizeStudents, topBy } from '@/lib/analytics'
import { branchesOf } from '@/lib/colleges'
import { queryStudents } from '@/lib/rosterQuery'
import { currentMockUser } from '@/mocks/authMock'
import { mockError, mockResponse } from '@/mocks/mockUtils'
import { rosterStudents } from '@/mocks/rosterData'

/** Students the signed-in mock user may see, mirroring backend scoping. */
export function scopedStudents(user = currentMockUser()) {
  if (!user) return []
  switch (user.role) {
    case 'admin':
      return rosterStudents
    case 'hod':
      return rosterStudents.filter((student) => student.college === user.college && branchesOf(user.department).includes(student.department))
    case 'ctpo':
      return rosterStudents.filter(
        (student) =>
          student.college === user.college && student.department === user.department && student.year === user.year && student.section === user.section,
      )
    case 'faculty':
      return rosterStudents.filter(
        // Faculty teach across branches (CSE, CAI, CSM, AID and so on) in the years assigned to them.
        (student) => student.college === user.college && (user.assignedYears ?? []).includes(student.year),
      )
    default:
      return []
  }
}

function listStudents(students, query) {
  const page = queryStudents(students, query)
  return { ...page, limit: page.pageSize }
}

function sectionOf(user) {
  return { college: user.college, department: user.department, year: user.year, section: user.section }
}

export const rosterMock = {
  students(query) {
    const user = currentMockUser()
    if (!user || user.role === 'student') return mockError('You do not have permission to view the student roster.', 403)
    return mockResponse(listStudents(scopedStudents(user), query))
  },

  facultyMe() {
    const user = currentMockUser()
    if (user?.role !== 'faculty') return mockError('Faculty profile not found.', 404)
    return mockResponse({ ...user, designation: 'Associate Professor', employeeId: 'KIET-F-0412', joinedOn: '2014-06-16' })
  },

  ctpoDashboard() {
    const user = currentMockUser()
    const students = scopedStudents(user)
    return mockResponse({
      section: sectionOf(user),
      summary: summarizeStudents(students),
      attendanceBands: attendanceBands(students),
      gradeBands: gradeBands(students),
      lowAttendanceStudents: topBy(students, 'attendancePercentage', 5, 'asc').filter((student) => student.attendancePercentage < 75),
      topPerformers: topBy(students, 'cgpa', 5),
    })
  },

  ctpoAttendance() {
    const students = scopedStudents()
    return mockResponse({
      summary: summarizeStudents(students),
      subjects: subjectAverages(students),
      attendanceBands: attendanceBands(students),
      students,
    })
  },

  ctpoAcademicReport() {
    const students = scopedStudents()
    return mockResponse({
      summary: summarizeStudents(students),
      sgpaTrend: sgpaTrend(students),
      gradeBands: gradeBands(students),
      topPerformers: topBy(students, 'cgpa', 5),
      students,
    })
  },
}
