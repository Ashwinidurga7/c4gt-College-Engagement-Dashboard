import { attendanceBands, gradeBands, groupStudents, summarizeStudents, topBy } from '@/lib/analytics'
import { currentMockUser, pendingUsers, setApproval } from '@/mocks/authMock'
import { mockError, mockResponse } from '@/mocks/mockUtils'
import { scopedStudents } from '@/mocks/rosterMock'

function hodScope() {
  const user = currentMockUser()
  return { user, students: scopedStudents(user) }
}

function inDepartment(user) {
  return (candidate) => candidate.role === 'ctpo' && candidate.college === user.college && candidate.department === user.department
}

/** HOD endpoints in mock mode; every figure is derived from the department's students. */
export const hodMock = {
  dashboard() {
    const { user, students } = hodScope()
    return mockResponse({
      department: { college: user.college, department: user.department },
      summary: summarizeStudents(students),
      byYear: groupStudents(students, ['year']),
      attendanceBands: attendanceBands(students),
      gradeBands: gradeBands(students),
      pendingCtpos: pendingUsers(inDepartment(user)).length,
    })
  },

  attendance() {
    const { students } = hodScope()
    return mockResponse({
      summary: summarizeStudents(students),
      byYear: groupStudents(students, ['year']),
      bySection: groupStudents(students, ['year', 'section']),
      attendanceBands: attendanceBands(students),
      lowAttendanceStudents: topBy(students, 'attendancePercentage', 10, 'asc').filter((student) => student.attendancePercentage < 75),
    })
  },

  academicReport() {
    const { students } = hodScope()
    return mockResponse({
      summary: summarizeStudents(students),
      byYear: groupStudents(students.filter((student) => student.cgpa != null), ['year']),
      bySection: groupStudents(students.filter((student) => student.cgpa != null), ['year', 'section']),
      gradeBands: gradeBands(students),
      topPerformers: topBy(students, 'cgpa', 10),
    })
  },

  pendingCtpos() {
    const { user } = hodScope()
    return mockResponse(pendingUsers(inDepartment(user)))
  },

  decideCtpo(id, decision) {
    const { user } = hodScope()
    if (!pendingUsers(inDepartment(user)).some((candidate) => candidate.id === id)) {
      return mockError('This CTPO registration is not in your department.', 403)
    }
    return setApproval(id, decision)
  },
}
