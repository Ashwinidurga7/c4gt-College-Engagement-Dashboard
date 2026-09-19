import { UserCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CollegeBadge } from '@/components/common/CollegeBadge'
import { EmptyState } from '@/components/common/EmptyState'
import { SectionCard } from '@/components/common/SectionCard'
import { formatDate } from '@/lib/formatters'
import { roleLabel } from '@/lib/roles'

export function RecentRegistrations({ registrations }) {
  return (
    <SectionCard
      title="Awaiting approval"
      icon={UserCheck}
      action={
        <Link to="/admin/approvals" className="text-link text-sm font-medium hover:underline">
          Open queue
        </Link>
      }
    >
      {registrations.length === 0 ? (
        <EmptyState icon={UserCheck} title="No pending registrations" className="py-6" />
      ) : (
        <ul className="divide-y">
          {registrations.map((registration) => (
            <li key={registration.id} className="py-3 first:pt-0 last:pb-0">
              <p className="text-heading flex flex-wrap items-center gap-2 text-sm font-medium">
                {registration.name} <CollegeBadge college={registration.college} />
              </p>
              <p className="text-muted-foreground text-xs">
                {roleLabel(registration.role)} · {registration.department} · {formatDate(registration.requestedAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  )
}
