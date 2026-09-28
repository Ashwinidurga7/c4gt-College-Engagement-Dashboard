import { applyListQuery } from '@/lib/listQuery'

export const ROSTER_SEARCH_KEYS = ['name', 'rollNumber', 'email']

/** Filters that match a range rather than an exact value; each takes the filter's value and a student. */
const RANGE_FILTERS = {
  attendanceBelow: (value, student) => student.attendancePercentage < Number(value),
  cgpaMin: (value, student) => student.cgpa != null && student.cgpa >= Number(value),
  cgpaBelow: (value, student) => student.cgpa != null && student.cgpa < Number(value),
  /** `0`, `1`, … for an exact count of active backlogs; `N+` for N or more. */
  backlogs: (value, student) => (value.endsWith('+') ? student.backlogs >= Number(value.slice(0, -1)) : student.backlogs === Number(value)),
}

/** A CGPA band filter value (`min-max`) splits into the two range filters above. */
function expand(filters) {
  const { cgpaBand, ...rest } = filters
  if (!cgpaBand) return rest
  const [min, max] = cgpaBand.split('-')
  return { ...rest, ...(min && { cgpaMin: min }), ...(max && { cgpaBelow: max }) }
}

/**
 * Search, filter, sort and paginate students the way the roster endpoints should. The mock layer uses it,
 * and so do the services when an endpoint returns the whole unfiltered list.
 */
export function queryStudents(students, { filters = {}, ...query } = {}) {
  const all = expand(filters)
  const exact = Object.fromEntries(Object.entries(all).filter(([key]) => !RANGE_FILTERS[key]))
  const pool = students.filter((student) =>
    Object.entries(all).every(([key, value]) => !RANGE_FILTERS[key] || value === '' || value == null || RANGE_FILTERS[key](String(value), student)),
  )
  return applyListQuery(pool, { ...query, filters: exact, searchKeys: ROSTER_SEARCH_KEYS, sort: query.sort ?? { key: 'rollNumber', direction: 'asc' } })
}
