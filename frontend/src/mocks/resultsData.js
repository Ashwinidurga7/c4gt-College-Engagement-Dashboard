import { gradeFor } from '@/lib/academics'
import { pastSemesterCourses } from '@/mocks/studentProfileData'
import { randomInt, seededRandom } from '@/mocks/seededRandom'

/** Month each completed semester's results were published. */
const PUBLISHED_ON = { 1: '2025-03-08', 2: '2025-08-02', 3: '2026-03-12', 4: '2026-08-06' }

/**
 * Courses the student failed in the regular exam by scoring below the external-exam minimum. A course with
 * `clearedOn` was passed in a supplementary exam and shows that attempt's score; the rest are active backlogs (F).
 */
const FAILED_COURSES = {
  PH101: { external: 46, clearedOn: '2025-06-20' },
  MA301: { external: 19 },
}

function buildResults() {
  const random = seededRandom(534)
  return Object.entries(pastSemesterCourses).map(([semester, courses]) => ({
    semester: Number(semester),
    publishedOn: PUBLISHED_ON[semester],
    courses: courses.map(([code, name, credits]) => {
      const isLab = code.endsWith('L')
      const internal = randomInt(random, isLab ? 24 : 20, 29)
      const failed = FAILED_COURSES[code]
      // Always draw a score so every other course keeps the same marks.
      const drawn = randomInt(random, isLab ? 52 : 40, isLab ? 68 : 66)
      const external = failed ? failed.external : drawn
      const total = internal + external
      const { grade, points } = failed && !failed.clearedOn ? { grade: 'F', points: 0 } : gradeFor(total)
      return { code, name, credits, internal, external, total, grade, gradePoints: points, clearedOn: failed?.clearedOn }
    }),
  }))
}

/** Raw semester results in the shape a results API would plausibly return; SGPA/CGPA are derived. */
export const semesterResults = buildResults()

/** Every course failed at least once: `active` while the grade is still F, `cleared` once passed. */
export const resultBacklogs = semesterResults.flatMap((entry) =>
  entry.courses
    .filter((course) => course.gradePoints === 0 || course.clearedOn)
    .map((course) => ({ code: course.code, name: course.name, semester: entry.semester, status: course.gradePoints === 0 ? 'active' : 'cleared', clearedOn: course.clearedOn })),
)
