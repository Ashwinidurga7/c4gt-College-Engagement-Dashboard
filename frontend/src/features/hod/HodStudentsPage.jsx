import { RosterPage } from '@/features/roster/RosterPage'
import { ATTENDANCE_FILTER, BACKLOG_FILTER, BRANCH_FILTER, CGPA_FILTER, SECTION_FILTER, SEMESTER_FILTER, YEAR_FILTER } from '@/features/roster/rosterFilters'
import { useAuth } from '@/hooks/useAuth'
import { useHodStudents } from '@/hooks/useHod'
import { branchesOf } from '@/lib/colleges'

export function HodStudentsPage() {
  const { user } = useAuth()
  const branches = user.department ? branchesOf(user.department) : []

  return (
    <RosterPage
      title="Department students"
      documentTitle="Students"
      description={user.department ? `All students in ${branches.join(', ')}, across years and sections.` : 'All students in your department.'}
      useStudents={useHodStudents}
      filterOptions={[
        ...(branches.length > 1 ? [BRANCH_FILTER(branches)] : []),
        YEAR_FILTER(),
        SEMESTER_FILTER,
        SECTION_FILTER,
        CGPA_FILTER,
        BACKLOG_FILTER,
        ATTENDANCE_FILTER,
      ]}
    />
  )
}
