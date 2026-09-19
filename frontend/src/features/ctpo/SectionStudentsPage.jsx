import { sectionLabel } from '@/features/ctpo/sectionLabel'
import { RosterPage } from '@/features/roster/RosterPage'
import { ATTENDANCE_FILTER } from '@/features/roster/rosterFilters'
import { useAuth } from '@/hooks/useAuth'
import { useCtpoStudents } from '@/hooks/useStaff'

export function SectionStudentsPage() {
  const { user } = useAuth()
  const scope = sectionLabel(user)

  return (
    <RosterPage
      title="Section students"
      description={scope ? `Students of ${scope}.` : 'Students in your section.'}
      useStudents={useCtpoStudents}
      filterOptions={[ATTENDANCE_FILTER]}
    />
  )
}
