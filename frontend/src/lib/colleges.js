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

export const YEARS = [1, 2, 3, 4]

export const SECTIONS = ['A', 'B', 'C', 'D']

export function academicYearOptions(today = new Date()) {
  const start = today.getMonth() >= 5 ? today.getFullYear() : today.getFullYear() - 1
  return [start - 1, start, start + 1].map((year) => `${year}-${String(year + 1).slice(2)}`)
}
