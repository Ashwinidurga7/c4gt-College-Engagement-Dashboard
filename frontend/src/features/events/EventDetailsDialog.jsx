import { CalendarDays, Clock, MapPin, UsersRound } from 'lucide-react'
import { CollegeBadge } from '@/components/common/CollegeBadge'
import { ErrorState } from '@/components/common/ErrorState'
import { ListSkeleton } from '@/components/common/Skeleton'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useEvent } from '@/hooks/useCampus'
import { formatDate, formatTime } from '@/lib/formatters'

function Row({ icon: Icon, children }) {
  return (
    <li className="text-body flex items-start gap-2 text-sm">
      <Icon className="text-brand mt-0.5 size-4 shrink-0" aria-hidden />
      <span>{children}</span>
    </li>
  )
}

/** Loads the full event from GET /events/:id; `preview` fills the header while it loads. */
export function EventDetailsDialog({ eventId, preview, onClose }) {
  const query = useEvent(eventId)
  const event = query.data ?? preview

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex flex-wrap gap-2">
            {event?.category && <span className="bg-tone-blue text-tone-blue-fg rounded-full px-2 py-0.5 text-xs font-semibold">{event.category}</span>}
            <CollegeBadge college={event?.college} />
          </div>
          <DialogTitle className="text-heading text-xl">{event?.title ?? 'Event'}</DialogTitle>
          <DialogDescription>{event?.organizer ? `Organised by ${event.organizer}` : 'Campus event'}</DialogDescription>
        </DialogHeader>
        {query.isError ? (
          <ErrorState error={query.error} onRetry={query.refetch} />
        ) : (
          <>
            <ul className="flex flex-col gap-2">
              <Row icon={CalendarDays}>{formatDate(event?.date)}</Row>
              {(event?.startTime || event?.endTime) && (
                <Row icon={Clock}>
                  {formatTime(event.startTime)}
                  {event.endTime && ` – ${formatTime(event.endTime)}`}
                </Row>
              )}
              {event?.venue && <Row icon={MapPin}>{event.venue}</Row>}
              {event?.organizer && <Row icon={UsersRound}>{event.organizer}</Row>}
            </ul>
            {query.isPending ? <ListSkeleton rows={1} /> : event?.description && <p className="text-body border-t pt-4 text-sm leading-relaxed">{event.description}</p>}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
