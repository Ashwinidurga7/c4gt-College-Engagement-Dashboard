import { CalendarClock, Clock, MapPin } from 'lucide-react'
import { useState } from 'react'
import { CollegeBadge } from '@/components/common/CollegeBadge'
import { formatDate, formatTime } from '@/lib/formatters'
import { cn } from '@/lib/utils'

const dayFormatter = new Intl.DateTimeFormat('en-IN', { day: '2-digit' })
const monthFormatter = new Intl.DateTimeFormat('en-IN', { month: 'short' })

/** Compact event row with a calendar date tile, as in the reference's upcoming events. */
export function EventCard({ event, action, className }) {
  const date = event.date ? new Date(event.date) : null
  const time = [formatTime(event.startTime), formatTime(event.endTime)].filter(Boolean).join(' – ')
  const [broken, setBroken] = useState(false)
  // The cover photo is decorative here; the details dialog shows every photo with a description.
  const cover = broken ? null : event.images?.[0]

  return (
    <article className={cn('flex flex-wrap items-start gap-4', className)}>
      {date && (
        <time
          dateTime={event.date}
          className="glass-chip bg-tone-blue/90 text-tone-blue-fg flex w-14 shrink-0 flex-col items-center rounded-xl py-2.5 leading-tight shadow-sm"
        >
          <span className="text-xl font-bold">{dayFormatter.format(date)}</span>
          <span className="text-xs font-semibold uppercase">{monthFormatter.format(date)}</span>
        </time>
      )}
      {cover && (
        <img
          src={cover.url}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setBroken(true)}
          className="bg-sunken aspect-[4/3] w-20 shrink-0 rounded-lg border object-cover max-sm:hidden"
        />
      )}
      <div className="min-w-48 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold">{event.title}</h3>
          <CollegeBadge college={event.college} />
        </div>
        {(event.category || event.organizer) && <p className="text-muted-foreground text-xs">{[event.category, event.organizer].filter(Boolean).join(' · ')}</p>}
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
          {event.registrationDeadline && event.registrationOpen && (
            <span className="inline-flex items-center gap-1">
              <CalendarClock className="size-3.5" aria-hidden /> Register by {formatDate(event.registrationDeadline)}
            </span>
          )}
        </div>
      </div>
      {action && <div className="shrink-0 max-sm:w-full max-sm:pl-18 [&>*]:max-sm:w-full">{action}</div>}
    </article>
  )
}
