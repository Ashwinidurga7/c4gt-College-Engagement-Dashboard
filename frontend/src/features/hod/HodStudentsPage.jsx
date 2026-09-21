import { RosterPage } from '@/features/roster/RosterPage'
import { ATTENDANCE_FILTER, SECTION_FILTER, YEAR_FILTER } from '@/features/roster/rosterFilters'
import { useAuth } from '@/hooks/useAuth'
import { useHodStudents } from '@/hooks/useHod'

export function HodStudentsPage() {
  const { user } = useAuth()

  return (
    <RosterPage
      title="Department students"
      documentTitle="Students"
      description={user.department ? `All students in ${user.department}, across years and sections.` : 'All students in your department.'}
      useStudents={useHodStudents}
      filterOptions={[YEAR_FILTER(), SECTION_FILTER, ATTENDANCE_FILTER]}
    />
  )
}
