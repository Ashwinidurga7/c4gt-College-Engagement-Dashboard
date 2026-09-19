import { Check } from 'lucide-react'
import { ROLE_LIST, ROLE_META } from '@/lib/roles'
import { cn } from '@/lib/utils'

const TONE_CLASSES = {
  blue: 'bg-tone-blue text-tone-blue-fg',
  green: 'bg-tone-green text-tone-green-fg',
  purple: 'bg-tone-purple text-tone-purple-fg',
  teal: 'bg-tone-teal text-tone-teal-fg',
  orange: 'bg-tone-orange text-tone-orange-fg',
}

/** Radio group of the five portals, styled after the "Access for" row in the reference. */
export function PortalSelector({ register, name = 'portal' }) {
  return (
    <fieldset>
      <legend className="text-muted-foreground flex w-full items-center gap-3 text-sm">
        <span aria-hidden className="bg-border h-px flex-1" />
        Sign in to the portal for
        <span aria-hidden className="bg-border h-px flex-1" />
      </legend>
      <div className="mt-3 grid grid-cols-5 gap-1 sm:gap-2">
        {ROLE_LIST.map((role) => {
          const meta = ROLE_META[role]
          return (
            <label key={role} className="group relative cursor-pointer">
              <input type="radio" value={role} className="peer sr-only" {...register(name)} />
              <span
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-lg border border-transparent px-0.5 py-2 transition-colors',
                  'group-hover:bg-muted peer-checked:border-primary peer-checked:bg-accent',
                  'peer-focus-visible:ring-ring peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2',
                )}
              >
                <span className={cn('flex size-10 items-center justify-center rounded-full sm:size-11', TONE_CLASSES[meta.tone])}>
                  <meta.icon className="size-5" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="text-heading text-xs font-semibold sm:text-sm">{meta.label}</span>
              </span>
              <Check
                aria-hidden
                strokeWidth={3}
                className="bg-primary text-primary-foreground absolute top-1 right-1 hidden size-4 rounded-full p-0.5 peer-checked:block"
              />
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
