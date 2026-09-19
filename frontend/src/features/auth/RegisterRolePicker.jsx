import { CircleCheck } from 'lucide-react'
import { REGISTRABLE_ROLES } from '@/features/auth/authSchemas'
import { APPROVAL_ROUTE, ROLE_META } from '@/lib/roles'

export function RegisterRolePicker({ register }) {
  return (
    <fieldset>
      <legend className="text-heading mb-2 text-sm font-semibold">I am registering as</legend>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {REGISTRABLE_ROLES.map((role) => {
          const meta = ROLE_META[role]
          return (
            <label
              key={role}
              className="group has-checked:border-primary has-checked:bg-accent has-focus-visible:ring-ring hover:bg-muted flex cursor-pointer flex-col gap-1 rounded-lg border p-3 transition-colors has-focus-visible:ring-2"
            >
              <input type="radio" value={role} className="sr-only" {...register('role')} />
              <span className="text-heading flex items-center gap-2 text-sm font-semibold">
                <meta.icon className="text-brand size-4" strokeWidth={1.75} aria-hidden />
                {meta.label}
                <CircleCheck className="text-link ml-auto hidden size-4 group-has-checked:block" aria-hidden />
              </span>
              <span className="text-muted-foreground text-xs">
                {APPROVAL_ROUTE[role] ? `Needs ${APPROVAL_ROUTE[role]} approval` : 'Instant access'}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
