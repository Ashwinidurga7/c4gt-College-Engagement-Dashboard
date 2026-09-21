import { Activity, Award, CalendarDays, FolderKanban, GraduationCap, UsersRound } from 'lucide-react'
import { SectionCard } from '@/components/common/SectionCard'
import { EmptyState } from '@/components/common/EmptyState'
import { formatDate } from '@/lib/formatters'
import { TONE_CLASSES } from '@/lib/tones'
import { cn } from '@/lib/utils'

const TYPES = {
  club: { icon: UsersRound, tone: 'blue' },
  project: { icon: FolderKanban, tone: 'green' },
  event: { icon: CalendarDays, tone: 'orange' },
  result: { icon: GraduationCap, tone: 'purple' },
  certificate: { icon: Award, tone: 'teal' },
}

export function RecentActivities({ activities, className }) {
  return (
    <SectionCard title="Recent activities" icon={Activity} className={className}>
      {activities.length === 0 ? (
        <EmptyState title="No recent activity" description="Club, project and event updates will appear here." />
      ) : (
        <ol className="divide-y">
          {activities.map((activity) => {
            const type = TYPES[activity.type] ?? { icon: Activity, tone: 'blue' }
            return (
              <li key={activity.id ?? activity.title} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-full', TONE_CLASSES[type.tone])}>
                  <type.icon className="size-4" strokeWidth={1.75} aria-hidden />
                </span>
                <p className="text-body min-w-0 flex-1 text-sm">{activity.title}</p>
                <time dateTime={activity.date} className="text-muted-foreground shrink-0 text-xs">
                  {formatDate(activity.date)}
                </time>
              </li>
            )
          })}
        </ol>
      )}
    </SectionCard>
  )
}
