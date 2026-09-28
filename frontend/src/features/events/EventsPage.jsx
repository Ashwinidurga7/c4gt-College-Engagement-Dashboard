import { CalendarCheck, CalendarDays, History } from 'lucide-react'
import { useState } from 'react'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { EventCard } from '@/components/common/EventCard'
import { FilterBar } from '@/components/common/FilterBar'
import { FilterChips } from '@/components/common/FilterChips'
import { PageHeader } from '@/components/common/PageHeader'
import { PageTabs } from '@/components/common/PageTabs'
import { ListSkeleton } from '@/components/common/Skeleton'
import { TablePagination } from '@/components/common/TablePagination'
import { Button } from '@/components/ui/button'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { EventDetailsDialog } from '@/features/events/EventDetailsDialog'
import { ParticipationHistory, RegisterButton, UpcomingRegistrations } from '@/features/events/MyEvents'
import { useAuth } from '@/hooks/useAuth'
import { useEvents } from '@/hooks/useCampus'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useListQuery } from '@/hooks/useListQuery'
import { useEventRegistrations } from '@/hooks/usePreview'
import { EVENT_CATEGORIES, EVENT_WINDOWS } from '@/lib/campus'
import { COLLEGES } from '@/lib/colleges'

const PAGE_SIZE = 8

const STUDENT_TABS = [
  { value: 'browse', label: 'Browse events', icon: CalendarDays },
  { value: 'mine', label: 'My registrations', icon: CalendarCheck },
  { value: 'history', label: 'Participation history', icon: History },
]

/** Registrations by event id, so the browse list can show each event's register or cancel action. */
function useRegistrationLookup(enabled) {
  const query = useEventRegistrations({ enabled })
  return new Map((query.data ?? []).map((row) => [row.event.id, row]))
}

function EventBrowser({ canRegister }) {
  const list = useListQuery({ pageSize: PAGE_SIZE, initialFilters: { when: 'upcoming', category: '', college: '' } })
  const query = useEvents(list.query)
  const registrations = useRegistrationLookup(canRegister)
  const [selected, setSelected] = useState(null)
  const data = query.data

  let body
  if (query.isPending) body = <ListSkeleton rows={4} />
  else if (query.isError) body = <ErrorState error={query.error} onRetry={query.refetch} />
  else if (data.items.length === 0) {
    body = <EmptyState icon={CalendarDays} title="No events found" description="Try a different time range, category or college." />
  } else {
    body = (
      <ul className="divide-y">
        {data.items.map((event) => (
          <li key={event.id} className="p-4 sm:p-5">
            <EventCard
              event={event}
              action={
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="lg" onClick={() => setSelected(event)}>
                    Details<span className="sr-only">: {event.title}</span>
                  </Button>
                  {canRegister && <RegisterButton event={event} registration={registrations.get(event.id)} />}
                </div>
              }
            />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <FilterChips label="Time range" options={EVENT_WINDOWS} value={list.filters.when} onChange={(value) => list.setFilter('when', value)} />
      <div className="bg-card shadow-soft overflow-hidden rounded-xl border">
        <div className="border-b p-4">
          <FilterBar search={list.search} onSearchChange={list.setSearch} searchPlaceholder="Search events, clubs or venues" searchLabel="Search events">
            <label htmlFor="event-category" className="sr-only">
              Category
            </label>
            <NativeSelect id="event-category" size="lg" className="w-full sm:w-44" value={list.filters.category} onChange={(event) => list.setFilter('category', event.target.value)}>
              <NativeSelectOption value="">All categories</NativeSelectOption>
              {EVENT_CATEGORIES.map((category) => (
                <NativeSelectOption key={category} value={category}>
                  {category}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <label htmlFor="event-college" className="sr-only">
              College
            </label>
            <NativeSelect id="event-college" size="lg" className="w-full sm:w-40" value={list.filters.college} onChange={(event) => list.setFilter('college', event.target.value)}>
              <NativeSelectOption value="">All colleges</NativeSelectOption>
              {COLLEGES.map((college) => (
                <NativeSelectOption key={college} value={college}>
                  {college}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </FilterBar>
        </div>
        <div aria-busy={query.isFetching || undefined} className={query.isFetching && !query.isPending ? 'opacity-70' : undefined}>
          {body}
        </div>
        {data && data.total > 0 && <TablePagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={list.setPage} />}
      </div>
      {selected && <EventDetailsDialog eventId={selected.id} preview={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

export function EventsPage() {
  useDocumentTitle('Events')
  const { user } = useAuth()
  const [tab, setTab] = useState('browse')
  const isStudent = user?.role === 'student'

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Events" description="Hackathons, workshops, AI summits, club activities and technical events across all three colleges." icon={CalendarDays} />
      {isStudent ? (
        <PageTabs label="Events" tabs={STUDENT_TABS} value={tab} onValueChange={setTab}>
          {(current) => (current === 'browse' ? <EventBrowser canRegister /> : current === 'mine' ? <UpcomingRegistrations /> : <ParticipationHistory />)}
        </PageTabs>
      ) : (
        <EventBrowser canRegister={false} />
      )}
    </div>
  )
}
