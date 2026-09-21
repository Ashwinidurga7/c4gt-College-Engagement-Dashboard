import { CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EventCard } from '@/components/common/EventCard'
import { QueryView } from '@/components/common/QueryView'
import { SectionCard } from '@/components/common/SectionCard'
import { ListSkeleton } from '@/components/common/Skeleton'
import { useUpcomingEvents } from '@/hooks/useStudent'

export function UpcomingEventsCard({ className }) {
  const query = useUpcomingEvents()

  return (
    <SectionCard
      title="Upcoming events"
      icon={CalendarDays}
      className={className}
      action={
        <Link to="/student/events" className="text-link text-sm font-medium hover:underline">
          View all
        </Link>
      }
    >
      <QueryView
        query={query}
        skeleton={<ListSkeleton rows={3} />}
        isEmpty={(events) => events.length === 0}
        empty={{ icon: CalendarDays, title: 'No upcoming events', description: 'New campus events will show up here.' }}
      >
        {(events) => (
          <ul className="divide-y">
            {events.slice(0, 4).map((event) => (
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
