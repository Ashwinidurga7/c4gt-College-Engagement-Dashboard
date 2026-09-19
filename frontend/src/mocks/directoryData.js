import { allAccounts } from '@/mocks/authMock'
import { rosterStudents } from '@/mocks/rosterData'
import { randomInt, seededRandom } from '@/mocks/seededRandom'

const STAFF_NAMES = [
  'Dr. K. Suresh', 'Mrs. P. Anuradha', 'Mr. V. Kishore', 'Dr. B. Padmaja', 'Mr. Ch. Srinu', 'Mrs. M. Kalyani', 'Dr. N. Rajesh',
  'Mrs. S. Vijaya Lakshmi', 'Mr. D. Prasad', 'Dr. T. Uma Devi', 'Mr. G. Satish', 'Mrs. Y. Radha', 'Dr. R. Chandra Sekhar', 'Mrs. K. Swathi',
]
const OFFERINGS = {
  KIET: ['CSE', 'CSE-AI', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'],
  'KIET+': ['CSE', 'ECE', 'EEE', 'MECH'],
  KIEW: ['CSE', 'CSE-AI', 'IT', 'ECE'],
}
const DOMAINS = { KIET: 'kiet.edu', 'KIET+': 'kietplus.edu', KIEW: 'kiew.edu' }

/** Approved HODs, faculty and CTPOs for every college and department (seeded). */
function buildStaff(existingEmails) {
  const random = seededRandom(911)
  const staff = []
  let serial = 0
  const add = (role, college, department, extra = {}) => {
    serial += 1
    const name = STAFF_NAMES[randomInt(random, 0, STAFF_NAMES.length - 1)]
    const email = `${role}${serial}.${department.toLowerCase()}@${DOMAINS[college]}`
    if (existingEmails.has(email)) return
    staff.push({
      id: `staff-${serial}`,
      name,
      email,
      role,
      college,
      department,
      approvalStatus: 'approved',
      createdAt: `20${randomInt(random, 18, 25)}-0${randomInt(random, 1, 9)}-1${randomInt(random, 0, 9)}T10:00:00+05:30`,
      ...extra,
    })
  }
  Object.entries(OFFERINGS).forEach(([college, departments]) =>
    departments.forEach((department) => {
      const ownHod = college === 'KIET' && department === 'CSE'
      if (!ownHod) add('hod', college, department, { academicYear: '2026-27' })
      for (let index = 0; index < 3; index += 1) add('faculty', college, department, { assignedYears: [randomInt(random, 1, 2), randomInt(random, 3, 4)] })
      ;[2, 3, 4].forEach((year) => add('ctpo', college, department, { year, section: 'A' }))
    }),
  )
  return staff
}

function studentAccounts() {
  return rosterStudents.map((student) => ({
    id: student._id,
    name: student.name,
    email: student.email,
    role: 'student',
    college: student.college,
    department: student.department,
    year: student.year,
    section: student.section,
    approvalStatus: 'approved',
    createdAt: `20${String(student.rollNumber).slice(0, 2)}-07-15T09:00:00+05:30`,
  }))
}

/** Institution-wide user directory for the admin. Mock accounts first, so their live approval state shows. */
export function directoryUsers() {
  const accounts = allAccounts().filter((account) => account.role !== 'student')
  const emails = new Set(accounts.map((account) => account.email))
  return [...accounts, ...buildStaffCached(emails), ...studentAccounts()]
}

let staffCache = null
function buildStaffCached(emails) {
  staffCache ??= buildStaff(emails)
  return staffCache
}
