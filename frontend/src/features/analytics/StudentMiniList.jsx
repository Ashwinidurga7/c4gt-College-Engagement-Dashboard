import { EmptyState } from '@/components/common/EmptyState'
import { SectionCard } from '@/components/common/SectionCard'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { initials } from '@/lib/formatters'

/** Short ranked list of students (top performers, lowest attendance). */
export function StudentMiniList({ title, icon, students, metric, emptyTitle, className }) {
  return (
    <SectionCard title={title} icon={icon} className={className}>
      {students.length === 0 ? (
        <EmptyState title={emptyTitle} className="py-6" />
      ) : (
        <ol className="flex flex-col gap-3">
          {students.map((student, index) => (
            <li key={student.id ?? student.rollNumber} className="flex items-center gap-3">
              <span className="text-muted-foreground w-5 text-right text-sm font-semibold tabular-nums">{index + 1}</span>
              <Avatar className="size-9">
                <AvatarFallback className="bg-tone-blue text-tone-blue-fg text-xs font-semibold">{initials(student.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-heading truncate text-sm font-medium">{student.name}</p>
                <p className="text-muted-foreground text-xs">{student.rollNumber}</p>
              </div>
              <div className="shrink-0">{metric(student)}</div>
            </li>
          ))}
        </ol>
      )}
    </SectionCard>
  )
}
