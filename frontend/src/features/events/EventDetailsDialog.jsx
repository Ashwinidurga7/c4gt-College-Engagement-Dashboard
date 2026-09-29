import { CalendarDays, Clock, MapPin, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { CollegeBadge } from '@/components/common/CollegeBadge'
import { ErrorState } from '@/components/common/ErrorState'
import { ListSkeleton } from '@/components/common/Skeleton'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useEvent } from '@/hooks/useCampus'
import { formatDate, formatTime } from '@/lib/formatters'
import { cn } from '@/lib/utils'

function Row({ icon: Icon, children }) {
  return (
    <li className="text-body flex items-start gap-2 text-sm">
      <Icon className="text-brand mt-0.5 size-4 shrink-0" aria-hidden />
      <span>{children}</span>
    </li>
  )
}

/** The selected photo large, with thumbnails to switch between them. Photos that fail to load are dropped. */
function EventPhotos({ event }) {
  const [broken, setBroken] = useState(() => new Set())
  const [selected, setSelected] = useState(0)
  const photos = (event.images ?? []).filter((photo) => !broken.has(photo.url))
  if (photos.length === 0) return null
  const active = photos[Math.min(selected, photos.length - 1)]
  const drop = (url) => setBroken((current) => new Set(current).add(url))

  return (
    <figure className="flex flex-col gap-2">
      <img
        src={active.url}
        alt={active.caption || `${event.title} photo`}
        onError={() => drop(active.url)}
        className="bg-sunken aspect-video w-full rounded-lg border object-cover"
      />
      {photos.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto pb-1" aria-label="Event photos">
          {photos.map((photo, index) => (
            <li key={photo.url} className="shrink-0">
              <button
                type="button"
                onClick={() => setSelected(index)}
                aria-label={`Show photo ${index + 1} of ${photos.length}`}
                aria-pressed={photo === active}
                className={cn(
                  'focus-visible:ring-ring block overflow-hidden rounded-md border-2 focus-visible:ring-2 focus-visible:outline-none',
                  photo === active ? 'border-brand' : 'border-transparent opacity-70 hover:opacity-100',
                )}
              >
                <img src={photo.url} alt="" loading="lazy" onError={() => drop(photo.url)} className="aspect-[4/3] w-16 object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {active.caption && <figcaption className="text-muted-foreground text-xs">{active.caption}</figcaption>}
    </figure>
  )
}

/** Loads the full event from GET /events/:id; `preview` fills the header while it loads. */
export function EventDetailsDialog({ eventId, preview, onClose }) {
  const query = useEvent(eventId)
  const event = query.data ?? preview

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
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
            {event && <EventPhotos event={event} />}
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
