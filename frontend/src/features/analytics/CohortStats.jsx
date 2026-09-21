import { CalendarCheck, GraduationCap, TriangleAlert, Users } from 'lucide-react'
import { StatCard } from '@/components/common/StatCard'
import { isLowAttendance } from '@/lib/academics'
import { formatNumber, formatPercent } from '@/lib/formatters'

/** Headline figures for a class or department. `links` optionally maps stat keys to routes. */
export function CohortStats({ summary, links = {} }) {
  const lowAverage = summary.averageAttendance != null && isLowAttendance(summary.averageAttendance)

  return (
    <section aria-label="Summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Students" value={formatNumber(summary.total)} icon={Users} tone="blue" to={links.students} linkLabel="View students" />
      <StatCard
        label="Average attendance"
        value={formatPercent(summary.averageAttendance)}
        icon={CalendarCheck}
        tone={lowAverage ? 'orange' : 'green'}
        hint={lowAverage ? 'Below 75%' : 'Above 75%'}
        to={links.attendance}
      />
      <StatCard
        label="Average CGPA"
        value={summary.averageCgpa != null ? summary.averageCgpa.toFixed(2) : null}
        icon={GraduationCap}
        tone="purple"
        to={links.report}
        linkLabel="View report"
      />
      <StatCard
        label="Below 75% attendance"
        value={formatNumber(summary.lowAttendance)}
        icon={TriangleAlert}
        tone={summary.lowAttendance > 0 ? 'red' : 'teal'}
        hint={summary.withBacklogs != null ? `${formatNumber(summary.withBacklogs)} with backlogs` : undefined}
      />
    </section>
  )
}
