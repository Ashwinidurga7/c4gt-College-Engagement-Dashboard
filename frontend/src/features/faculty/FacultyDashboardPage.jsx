import { FileCheck2, Layers, TriangleAlert, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ErrorState } from '@/components/common/ErrorState'
import { Skeleton, StatGridSkeleton } from '@/components/common/Skeleton'
import { StatCard } from '@/components/common/StatCard'
import { ValueBadge } from '@/components/common/StatusBadge'
import { StudentMiniList } from '@/features/analytics/StudentMiniList'
import { PendingCertificatesCard } from '@/features/faculty/PendingCertificatesCard'
import { StaffWelcome } from '@/features/roster/StaffWelcome'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useCertificateQueue, useFacultyProfile, useRoster, useRosterCount } from '@/hooks/useStaff'
import { formatNumber, formatPercent } from '@/lib/formatters'

const PENDING_QUERY = { page: 1, pageSize: 5, filters: { status: 'pending' } }
const LOW_ATTENDANCE_QUERY = { page: 1, pageSize: 5, filters: { attendanceBelow: 75 }, sort: { key: 'attendancePercentage', direction: 'asc' } }

function YearCount({ year }) {
  const count = useRosterCount({ year })
  return (
    <li className="bg-sunken flex items-center justify-between rounded-lg px-3 py-2 text-sm">
      <span className="text-heading font-medium">Year {year}</span>
      <span className="text-muted-foreground">{count.isPending ? '…' : `${formatNumber(count.data)} students`}</span>
    </li>
  )
}

export function FacultyDashboardPage() {
  useDocumentTitle('Dashboard')
  const profile = useFacultyProfile()
  const total = useRosterCount({})
  const low = useRoster(LOW_ATTENDANCE_QUERY)
  const pending = useCertificateQueue(PENDING_QUERY)

  if (profile.isPending) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-28 rounded-xl" />
        <StatGridSkeleton />
      </div>
    )
  }
  if (profile.isError) return <ErrorState error={profile.error} onRetry={profile.refetch} />

  const faculty = profile.data
  return (
    <div className="flex flex-col gap-6">
      <StaffWelcome
        name={faculty.name}
        role={faculty.designation ?? 'Faculty'}
        college={faculty.college}
        details={[faculty.department, faculty.employeeId]}
        aside={
          faculty.assignedYears.length > 0 && (
            <div className="sm:text-right">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Assigned years</p>
              <p className="text-heading text-lg font-semibold">{faculty.assignedYears.map((year) => `Year ${year}`).join(', ')}</p>
            </div>
          )
        }
      />

      <section aria-label="Summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Students in scope" value={total.isPending ? '…' : formatNumber(total.data)} icon={Users} tone="blue" to="/faculty/students" linkLabel="Open roster" />
        <StatCard label="Below 75% attendance" value={low.data ? formatNumber(low.data.total) : '…'} icon={TriangleAlert} tone="orange" />
        <StatCard label="Certificates to verify" value={pending.data ? formatNumber(pending.data.total) : '…'} icon={FileCheck2} tone="purple" to="/faculty/certificates" linkLabel="Open queue" />
        <StatCard label="Assigned years" value={faculty.assignedYears.length || '—'} icon={Layers} tone="teal" hint={faculty.department} />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <PendingCertificatesCard query={pending} className="lg:col-span-2" />
        <div className="flex flex-col gap-6">
          <StudentMiniList
            title="Needs attention"
            icon={TriangleAlert}
            students={low.data?.items ?? []}
            emptyTitle="Everyone is above 75%"
            metric={(student) => <ValueBadge value={formatPercent(student.attendancePercentage)} warn />}
          />
          {faculty.assignedYears.length > 0 && (
            <section className="bg-card shadow-soft rounded-xl border p-5">
              <h2 className="text-lg font-semibold">Students by year</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {faculty.assignedYears.map((year) => (
                  <YearCount key={year} year={year} />
                ))}
              </ul>
              <Link to="/faculty/students" className="text-link mt-3 inline-block text-sm font-medium hover:underline">
                View full roster
              </Link>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
