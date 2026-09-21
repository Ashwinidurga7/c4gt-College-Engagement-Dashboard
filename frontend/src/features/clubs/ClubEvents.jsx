import { CalendarDays } from 'lucide-react'
import { EventCard } from '@/components/common/EventCard'
import { QueryView } from '@/components/common/QueryView'
import { SectionCard } from '@/components/common/SectionCard'
import { ListSkeleton } from '@/components/common/Skeleton'
import { useEvents } from '@/hooks/useCampus'

export function ClubEvents({ clubId, className }) {
  const query = useEvents({ page: 1, pageSize: 5, filters: { clubId, when: 'upcoming' } })

  return (
    <SectionCard title="Upcoming events" icon={CalendarDays} className={className}>
      <QueryView
        query={query}
        skeleton={<ListSkeleton rows={2} />}
        isEmpty={(data) => data.items.length === 0}
        empty={{ icon: CalendarDays, title: 'No upcoming events', description: 'This club has no events scheduled yet.' }}
      >
        {(data) => (
          <ul className="divide-y">
            {data.items.map((event) => (
              <li key={event.id} className="py-3 first:pt-0 last:pb-0">
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        )}
      </QueryView>
    </SectionCard>
  )
}
