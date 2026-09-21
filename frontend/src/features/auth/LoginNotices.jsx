import { ArrowRight, CircleAlert, Clock, Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { roleLabel } from '@/lib/roles'

export function LoginErrorNotice({ message }) {
  return (
    <div role="alert" className="bg-danger-soft text-danger-text flex items-start gap-2.5 rounded-lg px-3.5 py-3 text-sm">
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p>{message}</p>
    </div>
  )
}

export function PendingApprovalNotice({ message }) {
  return (
    <div role="alert" className="bg-warning-soft text-warning-text flex items-start gap-2.5 rounded-lg px-3.5 py-3 text-sm">
      <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p>
        {message}{' '}
        <Link to="/awaiting-approval" className="font-semibold underline underline-offset-2">
          What happens next?
        </Link>
      </p>
    </div>
  )
}

/** Shown when the account's role differs from the portal the user picked. */
export function PortalMismatchNotice({ role, onContinue, onCancel }) {
  const label = roleLabel(role)
  return (
    <div role="alert" className="bg-info-soft rounded-lg px-4 py-4">
      <div className="text-info-text flex items-start gap-2.5 text-sm">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        <p className="font-semibold">This account belongs to the {label} portal.</p>
      </div>
      <p className="text-body mt-1 pl-6.5 text-sm">You can continue to the {label} dashboard or sign in with a different account.</p>
      <div className="mt-4 flex flex-col gap-2">
        <Button onClick={onContinue} size="lg" className="h-11">
          Continue to {label} dashboard
          <ArrowRight data-icon="inline-end" aria-hidden />
        </Button>
        <Button onClick={onCancel} size="lg" variant="outline" className="h-11">
          Use another account
        </Button>
      </div>
    </div>
  )
}
