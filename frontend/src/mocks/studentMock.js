import { weightedAverage } from '@/lib/academics'
import { summarizeAttendance } from '@/lib/attendanceSummary'
import { applyListQuery } from '@/lib/listQuery'
import { attendanceRecords } from '@/mocks/attendanceData'
import { campusAnnouncements, campusEvents, clubMemberships, MOCK_TODAY, recentActivities } from '@/mocks/campusData'
import { mockResponse } from '@/mocks/mockUtils'
import { semesterResults } from '@/mocks/resultsData'
import { currentCourses, studentProfile } from '@/mocks/studentProfileData'

/** Student endpoints in mock mode. Responses mimic the backend's `data` payload before adaptation. */

const TOTAL_PROGRAMME_CREDITS = 160
let profile = { ...studentProfile }

function reportPayload() {
  const semesters = semesterResults.map((entry) => ({
    ...entry,
    credits: entry.courses.reduce((sum, course) => sum + course.credits, 0),
    sgpa: weightedAverage(entry.courses),
  }))
  return { cgpa: weightedAverage(semesterResults.flatMap((entry) => entry.courses)), semesters }
}

function attendancePayload() {
  const summary = summarizeAttendance(attendanceRecords)
  return {
    overallPercentage: summary.percentage,
    totalClasses: summary.conducted,
    attendedClasses: summary.attended,
    subjects: summary.subjects,
    monthly: summary.monthly,
    records: attendanceRecords.slice(0, 40),
  }
}

function upcomingEvents() {
  return campusEvents.filter((event) => event.date >= MOCK_TODAY).sort((a, b) => a.date.localeCompare(b.date))
}

export const studentMock = {
  dashboard() {
    return mockResponse({
      student: profile,
      stats: {
        attendancePercentage: attendancePayload().overallPercentage,
        cgpa: reportPayload().cgpa,
        activeClubs: clubMemberships.length,
        upcomingEvents: upcomingEvents().length,
      },
      recentActivities,
      announcements: campusAnnouncements,
    })
  },

  profile() {
    return mockResponse(profile)
  },

  updateProfile(changes) {
    profile = { ...profile, ...changes }
    return mockResponse(profile)
  },

  academic() {
    const earned = semesterResults
      .flatMap((entry) => entry.courses)
      .filter((course) => course.gradePoints > 0)
      .reduce((sum, course) => sum + course.credits, 0)
    const backlogs = semesterResults.flatMap((entry) => entry.courses).filter((course) => course.gradePoints === 0).length
    return mockResponse({
      batch: profile.batch,
      regulation: profile.regulation,
      currentSemester: profile.currentSemester,
      year: profile.year,
      section: profile.section,
      department: profile.department,
      college: profile.college,
      admissionType: profile.admissionType,
      mentor: profile.mentor,
      cgpa: reportPayload().cgpa,
      creditsEarned: earned,
      totalCredits: TOTAL_PROGRAMME_CREDITS,
      backlogs,
    })
  },

  courses(query) {
    const page = applyListQuery(currentCourses, { ...query, searchKeys: ['code', 'name', 'faculty', 'type'] })
    return mockResponse({ ...page, limit: page.pageSize })
  },

  attendance() {
    return mockResponse(attendancePayload())
  },

  academicReport() {
    return mockResponse(reportPayload())
  },

  upcomingEvents() {
    return mockResponse(upcomingEvents())
  },
}
