import { DEPARTMENTS } from '@/lib/colleges'

/** Dropdown filter definitions for RosterTable. Values are sent to the API as query parameters. */

export const BRANCH_FILTER = (branches = DEPARTMENTS) => ({
  key: 'department',
  label: 'Branch',
  allLabel: 'All branches',
  options: branches.map((code) => ({ value: code, label: code })),
})

export const SEMESTER_FILTER = {
  key: 'semester',
  label: 'Semester',
  allLabel: 'All semesters',
  options: [1, 2, 3, 4, 5, 6, 7, 8].map((semester) => ({ value: String(semester), label: `Semester ${semester}` })),
}

/** Values are `min-max` bands, split into `cgpaMin` and `cgpaBelow` when filtering. */
export const CGPA_FILTER = {
  key: 'cgpaBand',
  label: 'CGPA',
  allLabel: 'Any CGPA',
  options: [
    { value: '9-', label: 'CGPA 9 and above' },
    { value: '8-9', label: 'CGPA 8 – 8.99' },
    { value: '7-8', label: 'CGPA 7 – 7.99' },
    { value: '6-7', label: 'CGPA 6 – 6.99' },
    { value: '-6', label: 'CGPA below 6' },
  ],
}

export const BACKLOG_FILTER = {
  key: 'backlogs',
  label: 'Backlogs',
  allLabel: 'Any backlogs',
  options: [
    { value: '0', label: 'No backlogs' },
    { value: '1', label: '1 backlog' },
    { value: '2', label: '2 backlogs' },
    { value: '3+', label: '3 or more' },
  ],
}

export const YEAR_FILTER = (years = [1, 2, 3, 4]) => ({
  key: 'year',
  label: 'Year',
  allLabel: 'All years',
  options: years.map((year) => ({ value: String(year), label: `Year ${year}` })),
})

export const SECTION_FILTER = {
  key: 'section',
  label: 'Section',
  allLabel: 'All sections',
  options: ['A', 'B', 'C', 'D'].map((section) => ({ value: section, label: `Section ${section}` })),
}

export const ATTENDANCE_FILTER = {
  key: 'attendanceBelow',
  label: 'Attendance',
  allLabel: 'Any attendance',
  options: [{ value: '75', label: 'Below 75%' }],
}
