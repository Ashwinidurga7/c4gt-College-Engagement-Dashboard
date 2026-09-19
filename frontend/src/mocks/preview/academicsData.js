import { DEPARTMENTS } from '@/lib/colleges'
import { currentCourses, pastSemesterCourses } from '@/mocks/studentProfileData'

/** Theory subjects examined in the mid-terms, by department and year. */
const EXAM_SUBJECTS = {
  CSE: {
    2: ['Discrete Mathematics', 'OOP through Java', 'Advanced Data Structures', 'Software Engineering', 'Universal Human Values'],
    3: ['AI & ML', 'DBMS', 'Web Development', 'Data Science', 'Probability and Statistics'],
  },
  default: {
    1: ['Linear Algebra and Calculus', 'Engineering Physics', 'Introduction to Programming', 'Basic Electrical Engineering', 'Communicative English'],
    2: ['Probability and Statistics', 'Signals and Systems', 'Digital Electronics', 'Environmental Science', 'Universal Human Values'],
    3: ['Control Systems', 'Microprocessors', 'Engineering Economics', 'Professional Elective I', 'Open Elective I'],
    4: ['Professional Elective III', 'Professional Elective IV', 'Open Elective III', 'Management Science', 'Project Seminar'],
  },
}
/** Mid-term dates: Tuesday 6 to Saturday 10 October 2026. */
const EXAM_DATES = ['2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09', '2026-10-10']

/** Years 1 and 3 write in the forenoon, years 2 and 4 in the afternoon. */
export const examSchedule = DEPARTMENTS.flatMap((department, deptIndex) =>
  [1, 2, 3, 4].flatMap((year) => {
    const subjects = EXAM_SUBJECTS[department]?.[year] ?? EXAM_SUBJECTS.default[year]
    const forenoon = year % 2 === 1
    return subjects.map((subject, index) => ({
      id: `exam-${department}-${year}-${index}`,
      subject,
      department,
      year,
      date: EXAM_DATES[index],
      startTime: forenoon ? '10:00' : '14:00',
      endTime: forenoon ? '11:30' : '15:30',
      room: `Exam Hall ${deptIndex + 1}${year <= 2 ? 'A' : 'B'}`,
      type: 'Mid-term I',
    }))
  }),
)

const LATER_CSE = {
  6: [
    ['CS601', 'Compiler Design', 3],
    ['CS602', 'Cloud Computing', 3],
    ['CS603', 'Cryptography and Network Security', 3],
    ['CS604', 'Professional Elective II', 3],
    ['CS601L', 'Machine Learning Lab', 1.5],
  ],
}

function courseType(code) {
  if (code.endsWith('L')) return 'Lab'
  if (code.startsWith('HS') || code.startsWith('MB')) return 'Humanities'
  return 'Theory'
}

/** Course catalog: semesters 1–2 are common to every department; CSE carries semesters 3–6. */
export const courseCatalog = DEPARTMENTS.flatMap((department) => {
  const common = [1, 2].flatMap((semester) => pastSemesterCourses[semester].map(([code, name, credits]) => ({ code, name, credits, semester })))
  const cse =
    department === 'CSE'
      ? [
          ...[3, 4].flatMap((semester) => pastSemesterCourses[semester].map(([code, name, credits]) => ({ code, name, credits, semester }))),
          ...currentCourses.map(({ code, name, credits }) => ({ code, name, credits, semester: 5 })),
          ...LATER_CSE[6].map(([code, name, credits]) => ({ code, name, credits, semester: 6 })),
        ]
      : []
  return [...common, ...cse].map((course) => ({
    ...course,
    id: `${department}-${course.code}`,
    department,
    type: courseType(course.code),
    regulation: 'R23',
  }))
})
