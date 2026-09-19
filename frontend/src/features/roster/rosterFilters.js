/** Dropdown filter definitions for RosterTable. Values are sent to the API as query parameters. */

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
