import { CollegeBadge } from '@/components/common/CollegeBadge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { firstName, greeting, initials } from '@/lib/formatters'

const today = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

/** Greeting banner for staff dashboards (faculty, CTPO, HOD, admin). */
export function StaffWelcome({ name, role, college, details = [], aside }) {
  return (
    <section aria-label="Welcome" className="bg-card shadow-soft flex flex-col gap-4 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex min-w-0 items-center gap-4">
        <Avatar className="size-14 shrink-0">
          <AvatarFallback className="bg-nav text-nav-strong text-lg font-semibold">{initials(name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-muted-foreground text-sm">{today.format(new Date())}</p>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            {greeting()}, {firstName(name)}
          </h1>
          <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="text-heading font-medium">{role}</span>
            {details.filter(Boolean).map((detail) => (
              <span key={detail}>{detail}</span>
            ))}
            <CollegeBadge college={college} />
          </div>
        </div>
      </div>
      {aside}
    </section>
  )
}
