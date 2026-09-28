export const COLLEGES = ['KIET', 'KIET+', 'KIEW']

/** Branch codes as JNTUK prints them; CAI, CSM and AID are the CSE specialisations. */
export const DEPARTMENT_NAMES = {
  CSE: 'Computer Science and Engineering',
  CAI: 'Computer Science and Engineering (Artificial Intelligence)',
  CSM: 'Computer Science and Engineering (AI and Machine Learning)',
  AID: 'Artificial Intelligence and Data Science',
  IT: 'Information Technology',
  ECE: 'Electronics and Communication Engineering',
  EEE: 'Electrical and Electronics Engineering',
  MECH: 'Mechanical Engineering',
  CIVIL: 'Civil Engineering',
}

export const DEPARTMENTS = Object.keys(DEPARTMENT_NAMES)

/** The CSE department also runs the CAI, CSM and AID branches, so its HOD sees all four. */
const BRANCH_FAMILIES = { CSE: ['CSE', 'CAI', 'CSM', 'AID'] }

export function branchesOf(department) {
  return BRANCH_FAMILIES[department] ?? [department]
}

export const YEARS = [1, 2, 3, 4]

export const SECTIONS = ['A', 'B', 'C', 'D']

/** First calendar year of the academic year `today` falls in; a new year starts in June. */
export function academicYearStart(today = new Date()) {
  return today.getMonth() >= 5 ? today.getFullYear() : today.getFullYear() - 1
}

export function academicYearLabel(start) {
  return `${start}-${String(start + 1).slice(2)}`
}

export function academicYearOptions(today = new Date()) {
  const start = academicYearStart(today)
  return [start - 1, start, start + 1].map(academicYearLabel)
}
