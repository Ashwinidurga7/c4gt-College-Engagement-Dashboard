export const COLLEGES = ['KIET', 'KIET+', 'KIEW']

export const DEPARTMENTS = ['CSE', 'CSE-AI', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL']

export const YEARS = [1, 2, 3, 4]

export const SECTIONS = ['A', 'B', 'C', 'D']

export function academicYearOptions(today = new Date()) {
  const start = today.getMonth() >= 5 ? today.getFullYear() : today.getFullYear() - 1
  return [start - 1, start, start + 1].map((year) => `${year}-${String(year + 1).slice(2)}`)
}
