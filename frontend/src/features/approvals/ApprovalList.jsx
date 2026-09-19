import { Check, UserCheck, X } from 'lucide-react'
import { useState } from 'react'
import { CollegeBadge } from '@/components/common/CollegeBadge'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { QueryView } from '@/components/common/QueryView'
import { ListSkeleton } from '@/components/common/Skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { formatDateTime, initials } from '@/lib/formatters'
import { roleLabel } from '@/lib/roles'

/** What the applicant is asking to manage, e.g. "CSE · Year 2 · Section B". */
function scopeOf(registration) {
  return [
    registration.department,
    registration.year && `Year ${registration.year}`,
    registration.section && `Section ${registration.section}`,
    registration.academicYear && `AY ${registration.academicYear}`,
    registration.assignedYears.length > 0 && `Years ${registration.assignedYears.join(', ')}`,
  ]
    .filter(Boolean)
    .join(' · ')
}

/**
 * Pending registrations with approve/reject, each confirmed in a dialog.
 * `decide` is a mutation taking `{ id, decision }`.
 */
export function ApprovalList({ query, decide, emptyTitle, emptyDescription }) {
  const [pending, setPending] = useState(null)
  const approving = pending?.decision === 'approved'

  return (
    <>
      <QueryView
        query={query}
        skeleton={
          <div className="bg-card rounded-xl border p-5">
            <ListSkeleton rows={3} />
          </div>
        }
        isEmpty={(items) => items.length === 0}
        empty={{ icon: UserCheck, title: emptyTitle, description: emptyDescription }}
      >
        {(items) => (
          <ul className="bg-card shadow-soft divide-y rounded-xl border">
            {items.map((registration) => (
              <li key={registration.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Avatar className="size-11 shrink-0">
                    <AvatarFallback className="bg-tone-purple text-tone-purple-fg font-semibold">{initials(registration.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-heading flex flex-wrap items-center gap-2 font-semibold">
                      {registration.name}
                      <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold">{roleLabel(registration.role)}</span>
                      <CollegeBadge college={registration.college} />
                    </p>
                    <p className="text-muted-foreground text-sm break-all">{registration.email}</p>
                    <p className="text-muted-foreground text-xs">
                      {scopeOf(registration)}
                      {registration.requestedAt && ` · Requested ${formatDateTime(registration.requestedAt)}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="lg" onClick={() => setPending({ registration, decision: 'approved' })}>
                    <Check aria-hidden /> Approve<span className="sr-only"> {registration.name}</span>
                  </Button>
                  <Button variant="outline" size="lg" className="text-danger-text" onClick={() => setPending({ registration, decision: 'rejected' })}>
                    <X aria-hidden /> Reject<span className="sr-only"> {registration.name}</span>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </QueryView>
      <ConfirmDialog
        open={pending !== null}
        onOpenChange={(open) => !open && setPending(null)}
        tone={approving ? 'primary' : 'danger'}
        title={approving ? `Approve ${pending?.registration.name}?` : `Reject ${pending?.registration.name}?`}
        description={
          pending &&
          (approving
            ? `They will be able to sign in to the ${roleLabel(pending.registration.role)} portal for ${scopeOf(pending.registration)}.`
            : 'They will not be able to sign in and will need to register again or contact the admin office.')
        }
        confirmLabel={approving ? 'Approve' : 'Reject'}
        pendingLabel={approving ? 'Approving…' : 'Rejecting…'}
        isPending={decide.isPending}
        onConfirm={() =>
          decide.mutate(
            { id: pending.registration.id, decision: pending.decision },
            { onSuccess: () => setPending(null), onError: (error) => toast.error(error.message) },
          )
        }
      />
    </>
  )
}
