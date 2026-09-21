import { RosterPage } from '@/features/roster/RosterPage'
import { ATTENDANCE_FILTER, SECTION_FILTER, YEAR_FILTER } from '@/features/roster/rosterFilters'
import { useFacultyProfile, useRoster } from '@/hooks/useStaff'

export function FacultyStudentsPage() {
  const profile = useFacultyProfile()
  const years = profile.data?.assignedYears?.length ? profile.data.assignedYears : undefined

  return (
    <RosterPage
      title="Student roster"
      documentTitle="Student Roster"
      description="Students in the years and department you are assigned to."
      useStudents={useRoster}
      filterOptions={[YEAR_FILTER(years), SECTION_FILTER, ATTENDANCE_FILTER]}
    />
  )
}
