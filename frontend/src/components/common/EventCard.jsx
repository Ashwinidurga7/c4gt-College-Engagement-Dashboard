import { Clock, MapPin } from 'lucide-react'
import { CollegeBadge } from '@/components/common/CollegeBadge'
import { formatTime } from '@/lib/formatters'
import { cn } from '@/lib/utils'

const dayFormatter = new Intl.DateTimeFormat('en-IN', { day: '2-digit' })
const monthFormatter = new Intl.DateTimeFormat('en-IN', { month: 'short' })

/** Compact event row with a calendar date tile, as in the reference's upcoming events. */
export function EventCard({ event, action, className }) {
  const date = event.date ? new Date(event.date) : null
  const time = [formatTime(event.startTime), formatTime(event.endTime)].filter(Boolean).join(' – ')

  return (
    <article className={cn('flex flex-wrap items-start gap-4', className)}>
      {date && (
        <time
          dateTime={event.date}
          className="bg-tone-blue text-tone-blue-fg flex w-14 shrink-0 flex-col items-center rounded-lg py-2 leading-tight"
        >
          <span className="text-xl font-bold">{dayFormatter.format(date)}</span>
          <span className="text-xs font-semibold uppercase">{monthFormatter.format(date)}</span>
        </time>
      )}
      <div className="min-w-48 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold">{event.title}</h3>
          <CollegeBadge college={event.college} />
        </div>
        {event.organizer && <p className="text-muted-foreground text-xs">{event.organizer}</p>}
        <div className="text-muted-foreground mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {time && (
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden /> {time}
            </span>
          )}
          {event.venue && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" aria-hidden /> {event.venue}
            </span>
          )}
        </div>
      </div>
      {action && <div className="shrink-0 max-sm:w-full max-sm:pl-18 [&>*]:max-sm:w-full">{action}</div>}
    </article>
  )
}
