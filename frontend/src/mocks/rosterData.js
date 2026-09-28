import { percentage, weightedAverage } from '@/lib/academics'
import { summarizeAttendance } from '@/lib/attendanceSummary'
import { attendanceRecords } from '@/mocks/attendanceData'
import { resultBacklogs, semesterResults } from '@/mocks/resultsData'
import { randomInt, seededRandom } from '@/mocks/seededRandom'
import { pastSemesterCourses, studentProfile } from '@/mocks/studentProfileData'

const FIRST_NAMES = [
  'Sai Teja', 'Harshitha', 'Rohith', 'Sravani', 'Manoj', 'Divya Sri', 'Karthik', 'Lakshmi Prasanna', 'Venkatesh', 'Pavani',
  'Naveen', 'Keerthana', 'Surya', 'Bhavya', 'Charan', 'Meghana', 'Vamsi Krishna', 'Sahithi', 'Anil', 'Tejaswini',
  'Praveen', 'Jahnavi', 'Ganesh', 'Likhitha', 'Mahesh', 'Sindhu', 'Rakesh', 'Harika', 'Srinivas', 'Deepika',
]
const INITIALS = ['A', 'B', 'Ch', 'D', 'G', 'K', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'Y']

/** Departments offered at each college. */
const OFFERINGS = {
  KIET: ['CSE', 'CAI', 'CSM', 'AID', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'],
  'KIET+': ['CSE', 'CSM', 'ECE', 'EEE', 'MECH'],
  KIEW: ['CSE', 'CAI', 'CSM', 'IT', 'ECE'],
}
const BRANCH_CODES = { CSE: '05', CAI: '43', CSM: '42', AID: '54', IT: '12', ECE: '04', EEE: '02', MECH: '03', CIVIL: '01' }
const COLLEGE_CODES = { KIET: 'JN', 'KIET+': 'JP', KIEW: 'JW' }
/** Academic year 2026-27: first years joined in 2026. */
const JOIN_YEAR = { 1: 26, 2: 25, 3: 24, 4: 23 }
const SECTIONS = ['A', 'B']

/** Theory classes held this semester for CSE year 3; the same timetable applies to every section. */
const SECTION_SUBJECTS = summarizeAttendance(attendanceRecords).subjects.map(({ code, subject, conducted }) => ({ code, subject, conducted }))

function sectionSize(college, department, year) {
  return college === 'KIET' && department === 'CSE' && year === 3 ? 20 : 8
}

/** Supplementary exams are held a few months after each semester's results. */
const SUPPLEMENTARY_ON = { 1: '2025-06-20', 2: '2025-11-14', 3: '2026-06-18', 4: '2026-11-20' }

/**
 * `active` failed courses still to clear, plus up to one course cleared in a supplementary exam.
 * Only semesters with a known course list (1 to 4) are drawn from.
 */
function backlogSubjectsFor(random, completed, active, cgpa) {
  const semesters = Object.keys(pastSemesterCourses).map(Number).filter((semester) => semester <= completed)
  if (semesters.length === 0) return []
  const pickCourse = (taken) => {
    for (let attempt = 0; attempt < 20; attempt += 1) {
      const semester = semesters[randomInt(random, 0, semesters.length - 1)]
      const [code, name] = pastSemesterCourses[semester][randomInt(random, 0, pastSemesterCourses[semester].length - 1)]
      if (!taken.some((subject) => subject.code === code)) return { code, name, semester }
    }
    return null
  }
  const subjects = []
  for (let index = 0; index < active; index += 1) {
    const course = pickCourse(subjects)
    if (course) subjects.push({ ...course, status: 'active' })
  }
  if (cgpa < 7.4 && random() < 0.5) {
    const course = pickCourse(subjects)
    if (course && SUPPLEMENTARY_ON[course.semester] < '2026-09-01') subjects.push({ ...course, status: 'cleared', clearedOn: SUPPLEMENTARY_ON[course.semester] })
  }
  return subjects
}

function buildStudent(random, { college, department, year, section, index }) {
  const roll = `${JOIN_YEAR[year]}${COLLEGE_CODES[college]}1A${BRANCH_CODES[department]}${String(index + 1).padStart(2, '0')}`
  const first = FIRST_NAMES[randomInt(random, 0, FIRST_NAMES.length - 1)]
  const initial = INITIALS[randomInt(random, 0, INITIALS.length - 1)]
  const strength = random()
  const target = 0.66 + strength * 0.32

  let subjects = null
  let attendancePercentage = Math.round(target * 1000) / 10
  if (college === 'KIET' && department === 'CSE' && year === 3) {
    subjects = SECTION_SUBJECTS.map((entry) => {
      const attended = Math.min(entry.conducted, Math.max(0, Math.round(entry.conducted * (target + (random() - 0.5) * 0.14))))
      return { ...entry, attended, percentage: percentage(attended, entry.conducted) }
    })
    attendancePercentage = percentage(
      subjects.reduce((sum, entry) => sum + entry.attended, 0),
      subjects.reduce((sum, entry) => sum + entry.conducted, 0),
    )
  }

  const completed = year * 2 - 2
  const base = 5.4 + strength * 3.9
  const sgpas = Array.from({ length: completed }, () => Math.round(Math.min(9.9, Math.max(4.5, base + (random() - 0.5) * 0.9)) * 100) / 100)
  const cgpa = sgpas.length ? Math.round((sgpas.reduce((sum, value) => sum + value, 0) / sgpas.length) * 100) / 100 : null
  const active = cgpa !== null && cgpa < 6.2 ? randomInt(random, 1, 3) : 0
  const backlogSubjects = cgpa === null ? [] : backlogSubjectsFor(random, completed, active, cgpa)

  return {
    _id: `stu-${roll}`,
    name: `${initial}. ${first}`,
    rollNumber: roll,
    email: `${roll.toLowerCase()}@${college === 'KIET' ? 'kiet' : college === 'KIEW' ? 'kiew' : 'kietplus'}.edu`,
    college,
    department,
    year,
    section,
    semester: year * 2 - 1,
    attendancePercentage,
    cgpa,
    sgpas,
    backlogs: backlogSubjects.filter((subject) => subject.status === 'active').length,
    backlogSubjects,
    subjects,
  }
}

/** The demo student, with figures taken from her own attendance records and results. */
function demoStudent() {
  const attendance = summarizeAttendance(attendanceRecords)
  const backlogSubjects = resultBacklogs
  return {
    _id: studentProfile._id,
    name: studentProfile.name,
    rollNumber: studentProfile.rollNumber,
    email: studentProfile.email,
    college: 'KIET',
    department: 'CSE',
    year: 3,
    section: 'A',
    semester: 5,
    attendancePercentage: attendance.percentage,
    cgpa: weightedAverage(semesterResults.flatMap((entry) => entry.courses)),
    sgpas: semesterResults.map((entry) => weightedAverage(entry.courses)),
    backlogs: backlogSubjects.filter((subject) => subject.status === 'active').length,
    backlogSubjects,
    subjects: attendance.subjects.map(({ code, subject, conducted, attended, percentage: value }) => ({ code, subject, conducted, attended, percentage: value })),
  }
}

function buildRoster() {
  const random = seededRandom(7719)
  const students = []
  Object.entries(OFFERINGS).forEach(([college, departments]) => {
    departments.forEach((department) => {
      ;[1, 2, 3, 4].forEach((year) => {
        SECTIONS.forEach((section) => {
          const size = sectionSize(college, department, year)
          for (let index = 0; index < size; index += 1) {
            const serial = SECTIONS.indexOf(section) * size + index
            students.push(buildStudent(random, { college, department, year, section, index: serial }))
          }
        })
      })
    })
  })
  const demo = demoStudent()
  return [demo, ...students.filter((student) => student.rollNumber !== demo.rollNumber)]
}

/** Every student across the three colleges. All section and department figures derive from this list. */
export const rosterStudents = buildRoster()
