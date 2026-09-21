import { Medal, Sparkles } from 'lucide-react'
import { DataTable } from '@/components/common/DataTable'
import { TabSection } from '@/features/student/portfolio/TabSection'
import { useAchievements, useActivities } from '@/hooks/usePortfolio'
import { formatDate } from '@/lib/formatters'

const QUERY = { page: 1, pageSize: 50 }

/** Achievements are recorded by the college; students can view but not edit them. */
export function AchievementsTab() {
  const query = useAchievements(QUERY)

  return (
    <TabSection
      title="Achievements"
      description="Awards and recognitions recorded by the college."
      count={query.data?.total}
      query={query}
      isEmpty={(data) => data.items.length === 0}
      empty={{ icon: Medal, title: 'No achievements recorded yet', description: 'Awards verified by the college will appear here.' }}
      render={(data) => (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.items.map((item) => (
            <li key={item.id} className="bg-card shadow-soft flex gap-3 rounded-xl border p-5">
              <span className="bg-tone-orange text-tone-orange-fg flex size-11 shrink-0 items-center justify-center rounded-full">
                <Medal className="size-5" strokeWidth={1.75} aria-hidden />
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-muted-foreground text-xs">
                  {[item.category, item.level, formatDate(item.date)].filter(Boolean).join(' · ')}
                </p>
                {item.description && <p className="text-body mt-2 text-sm">{item.description}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    />
  )
}

const ACTIVITY_COLUMNS = [
  { key: 'title', header: 'Activity', className: 'text-heading font-medium' },
  { key: 'type', header: 'Type' },
  { key: 'organizer', header: 'Organised by' },
  { key: 'role', header: 'Your role' },
  { key: 'date', header: 'Date', cell: (row) => formatDate(row.date), className: 'whitespace-nowrap' },
]

export function ActivitiesTab() {
  const query = useActivities(QUERY)

  return (
    <TabSection
      title="Activities"
      description="Events, drives and competitions you took part in."
      count={query.data?.total}
      query={query}
      isEmpty={(data) => data.items.length === 0}
      empty={{ icon: Sparkles, title: 'No activities recorded yet', description: 'Club and event participation will appear here.' }}
      render={(data) => <DataTable caption="Activities" columns={ACTIVITY_COLUMNS} rows={data.items} minWidth={620} />}
    />
  )
}
