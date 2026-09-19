import { CollegeBadge } from '@/components/common/CollegeBadge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { firstName, greeting, initials } from '@/lib/formatters'

const today = new Intl.DateTimeFormat('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

export function WelcomeBanner({ student }) {
  const details = [student.rollNumber, student.department, student.year && `Year ${student.year}`, student.section && `Section ${student.section}`]
    .filter(Boolean)

  return (
    <section
      aria-label="Welcome"
      className="bg-card shadow-soft flex flex-col gap-5 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
    >
      <div className="flex min-w-0 items-center gap-4">
        <Avatar className="size-14 shrink-0">
          <AvatarFallback className="bg-nav text-nav-strong text-lg font-semibold">{initials(student.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-muted-foreground text-sm">{today.format(new Date())}</p>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            {greeting()}, {firstName(student.name)}
          </h1>
          <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <span className="text-heading font-medium">Student</span>
            {details.map((detail) => (
              <span key={detail} className="before:mr-2 before:content-['|']">
                {detail}
              </span>
            ))}
            <CollegeBadge college={student.college} />
          </div>
        </div>
      </div>
      <p className="text-muted-foreground border-l-primary max-w-xs border-l-2 pl-4 text-sm italic sm:text-right sm:border-l-0 sm:border-r-2 sm:pr-4 sm:pl-0">
        Small steps every day lead to big achievements.
      </p>
    </section>
  )
}
