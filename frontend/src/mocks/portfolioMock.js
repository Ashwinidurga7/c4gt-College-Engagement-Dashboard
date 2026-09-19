import { applyListQuery } from '@/lib/listQuery'
import { currentMockUser } from '@/mocks/authMock'
import { createMockCollection } from '@/mocks/mockStore'
import { mockResponse } from '@/mocks/mockUtils'
import {
  achievementsData,
  activitiesData,
  certificatesData,
  certificationsData,
  internshipsData,
  projectsData,
  resumesData,
} from '@/mocks/portfolioData'
import { rosterStudents } from '@/mocks/rosterData'
import { scopedStudents } from '@/mocks/rosterMock'
import { randomInt, seededRandom } from '@/mocks/seededRandom'

const newestFirst = { key: 'date', direction: 'desc' }

export const certificationsMock = createMockCollection(certificationsData, {
  prefix: 'cert',
  searchKeys: ['name', 'issuer', 'credentialId'],
  defaultSort: { key: 'issueDate', direction: 'desc' },
})

const QUEUE_TITLES = [
  ['Smart India Hackathon Finalist', 'Hackathon', 'SIH 2026'],
  ['Cloud Computing Workshop', 'Workshop', 'AWS Academy'],
  ['NSS Blood Donation Camp', 'Participation', 'NSS KIET'],
  ['Paper Presentation', 'Achievement', 'IEEE Student Branch'],
  ['Inter-College Kabaddi', 'Sports', 'Sports Committee'],
  ['Python Bootcamp', 'Workshop', 'C4GT'],
]

function ownerOf(student) {
  return { _id: student._id, name: student.name, rollNumber: student.rollNumber, year: student.year, section: student.section }
}

/** The demo student's certificates plus a verification queue from KIET CSE years 2 and 3. */
function buildCertificates() {
  const random = seededRandom(4242)
  const demo = rosterStudents[0]
  const own = certificatesData.map((item) => ({ ...item, studentId: demo._id, student: ownerOf(demo) }))
  const candidates = rosterStudents.filter((student) => student.college === 'KIET' && student.department === 'CSE' && [2, 3].includes(student.year) && student._id !== demo._id)
  const queue = Array.from({ length: 14 }, (_, index) => {
    const student = candidates[randomInt(random, 0, candidates.length - 1)]
    const [title, category, issuedBy] = QUEUE_TITLES[index % QUEUE_TITLES.length]
    return {
      _id: `crt-q${index + 1}`,
      title,
      category,
      issuedBy,
      date: `2026-0${randomInt(random, 6, 9)}-${String(randomInt(random, 1, 28)).padStart(2, '0')}`,
      status: index < 10 ? 'pending' : 'verified',
      verifiedBy: index < 10 ? null : 'Dr. Ramesh Varma',
      fileName: `${title.toLowerCase().replace(/[^a-z]+/g, '-')}.pdf`,
      studentId: student._id,
      student: ownerOf(student),
    }
  })
  return [...own, ...queue]
}

const certificates = createMockCollection(buildCertificates(), { prefix: 'crt' })

/** Students see their own certificates; faculty see those of students in their scope. */
export const certificatesMock = {
  ...certificates,
  list({ filters = {}, ...query } = {}) {
    const user = currentMockUser()
    const visible =
      user?.role === 'student'
        ? certificates.all().filter((item) => item.studentId === user.id)
        : certificates.all().filter((item) => scopedStudents(user).some((student) => student._id === item.studentId))
    const page = applyListQuery(visible, { ...query, filters, searchKeys: ['title', 'issuedBy', 'category'], sort: query.sort ?? { key: 'date', direction: 'desc' } })
    return mockResponse({ ...page, limit: page.pageSize })
  },
  create(data) {
    const user = currentMockUser()
    const owner = rosterStudents.find((student) => student._id === user?.id) ?? rosterStudents[0]
    return certificates.create({ ...data, studentId: owner._id, student: ownerOf(owner) })
  },
}

export const projectsMock = createMockCollection(projectsData, {
  prefix: 'proj',
  searchKeys: ['title', 'description'],
  defaultSort: { key: 'startDate', direction: 'desc' },
})

export const internshipsMock = createMockCollection(internshipsData, {
  prefix: 'intern',
  searchKeys: ['company', 'role'],
  defaultSort: { key: 'startDate', direction: 'desc' },
})

export const achievementsMock = createMockCollection(achievementsData, { prefix: 'ach', defaultSort: newestFirst })
export const activitiesMock = createMockCollection(activitiesData, { prefix: 'actv', defaultSort: newestFirst })

const resumes = createMockCollection(resumesData, { prefix: 'res', defaultSort: { key: 'uploadedAt', direction: 'desc' } })

export const resumesMock = {
  ...resumes,
  /** The first upload becomes primary automatically. */
  create(data) {
    return resumes.create({ ...data, isPrimary: resumes.all().length === 0 })
  },
  async setPrimary(id) {
    await resumes.updateAll((entry) => ({ isPrimary: entry._id === id }))
    return mockResponse(resumes.all().find((entry) => entry._id === id))
  },
}
