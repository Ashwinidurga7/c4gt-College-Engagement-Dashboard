import { gradeFor } from '@/lib/academics'
import { pastSemesterCourses } from '@/mocks/studentProfileData'
import { randomInt, seededRandom } from '@/mocks/seededRandom'

/** Month each completed semester's results were published. */
const PUBLISHED_ON = { 1: '2025-03-08', 2: '2025-08-02', 3: '2026-03-12', 4: '2026-08-06' }

function buildResults() {
  const random = seededRandom(534)
  return Object.entries(pastSemesterCourses).map(([semester, courses]) => ({
    semester: Number(semester),
    publishedOn: PUBLISHED_ON[semester],
    courses: courses.map(([code, name, credits]) => {
      const isLab = code.endsWith('L')
      const internal = randomInt(random, isLab ? 24 : 20, 29)
      const external = randomInt(random, isLab ? 52 : 40, isLab ? 68 : 66)
      const total = internal + external
      const { grade, points } = gradeFor(total)
      return { code, name, credits, internal, external, total, grade, gradePoints: points }
    }),
  }))
}

/** Raw semester results in the shape a results API would plausibly return; SGPA/CGPA are derived. */
export const semesterResults = buildResults()
