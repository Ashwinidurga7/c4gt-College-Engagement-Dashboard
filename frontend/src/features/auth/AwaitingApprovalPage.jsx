import { CircleCheck, Clock, Hourglass, Send } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AuthLayout } from '@/features/auth/AuthLayout'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { APPROVAL_ROUTE, roleLabel } from '@/lib/roles'

export function AwaitingApprovalPage() {
  useDocumentTitle('Awaiting approval')
  const { state } = useLocation()
  const role = state?.role
  const approver = APPROVAL_ROUTE[role]

  const steps = [
    { icon: Send, title: 'Registration received', text: 'Your details have been submitted.', done: true },
    {
      icon: Hourglass,
      title: approver ? `${approver} review` : 'Review',
      text: approver
        ? `The ${approver} verifies your ${roleLabel(role)} account.`
        : 'Faculty and HOD accounts are reviewed by the Admin; CTPO accounts by the department HOD.',
      done: false,
    },
    { icon: CircleCheck, title: 'Access granted', text: 'Sign in with the same email and password.', done: false },
  ]

  return (
    <AuthLayout>
      <div className="bg-card shadow-lifted w-full max-w-lg rounded-2xl border px-5 py-8 text-center sm:px-10">
        <span className="bg-warning-soft text-warning-text mx-auto flex size-14 items-center justify-center rounded-full">
          <Clock className="size-7" strokeWidth={1.75} aria-hidden />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">Awaiting approval</h1>
        <p className="text-muted-foreground mt-2">
          {state?.email ? (
            <>
              The account for <span className="text-heading font-semibold">{state.email}</span> is pending approval.
            </>
          ) : (
            'Your account is pending approval.'
          )}{' '}
          You can sign in once it has been approved.
        </p>

        <ol className="mt-7 flex flex-col gap-4 text-left">
          {steps.map((step) => (
            <li key={step.title} className="flex items-start gap-3">
              <span
                className={
                  step.done
                    ? 'bg-success-soft text-success-text flex size-9 shrink-0 items-center justify-center rounded-full'
                    : 'bg-sunken text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-full'
                }
              >
                <step.icon className="size-4" strokeWidth={2} aria-hidden />
              </span>
              <div>
                <p className="text-heading text-sm font-semibold">
                  {step.title}
                  <span className="sr-only">{step.done ? ' (completed)' : ' (pending)'}</span>
                </p>
                <p className="text-muted-foreground text-sm">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <Button asChild size="lg" className="mt-8 h-11 w-full">
          <Link to="/login">Back to sign in</Link>
        </Button>
      </div>
    </AuthLayout>
  )
}
