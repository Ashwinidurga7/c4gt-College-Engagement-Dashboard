import { Award, CalendarCheck, Download, History, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { EmptyState } from '@/components/common/EmptyState'
import { EventCard } from '@/components/common/EventCard'
import { QueryView } from '@/components/common/QueryView'
import { ListSkeleton } from '@/components/common/Skeleton'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { downloadParticipationCertificate } from '@/features/events/participationCertificate'
import { useAuth } from '@/hooks/useAuth'
import { useCancelEventRegistration, useEventRegistrations, useRegisterForEvent } from '@/hooks/usePreview'
import { formatDateTime } from '@/lib/formatters'

/** Registration button for an event in the browse list: register, cancel, or closed. */
export function RegisterButton({ event, registration }) {
  const register = useRegisterForEvent()
  const cancel = useCancelEventRegistration()

  if (registration?.status === 'upcoming') {
    return (
      <Button variant="outline" size="lg" disabled={cancel.isPending} onClick={() => cancel.mutate(event.id, { onError: (error) => toast.error(error.message) })}>
        {cancel.isPending && <Loader2 className="animate-spin" aria-hidden />}
        Cancel registration<span className="sr-only">: {event.title}</span>
      </Button>
    )
  }
  if (registration) return <StatusBadge status={registration.status === 'attended' ? 'completed' : 'absent'} label={registration.status === 'attended' ? 'Attended' : 'Missed'} />
  if (event.registrationOpen === false) return <StatusBadge status="inactive" label="Registration closed" />
  return (
    <Button size="lg" disabled={register.isPending} onClick={() => register.mutate(event.id, { onError: (error) => toast.error(error.message) })}>
      {register.isPending && <Loader2 className="animate-spin" aria-hidden />}
      Register<span className="sr-only">: {event.title}</span>
    </Button>
  )
}

function CertificateButton({ registration }) {
  const { user } = useAuth()
  const [busy, setBusy] = useState(false)

  async function download() {
    setBusy(true)
    try {
      await downloadParticipationCertificate({ studentName: user.name, rollNumber: user.rollNumber, event: registration.event })
    } catch {
      toast.error('The certificate could not be created. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Button variant="outline" size="lg" onClick={download} disabled={busy}>
      {busy ? <Loader2 className="animate-spin" aria-hidden /> : <Download aria-hidden />}
      Certificate<span className="sr-only"> for {registration.event.title}</span>
    </Button>
  )
}

/** Registered events that have not happened yet. */
export function UpcomingRegistrations() {
  const query = useEventRegistrations()
  return (
    <QueryView
      query={query}
      skeleton={<ListSkeleton rows={3} />}
      isEmpty={(rows) => !rows.some((row) => row.status === 'upcoming')}
      empty={{ icon: CalendarCheck, title: 'No upcoming registrations', description: 'Register for an event from the Browse tab and it appears here.' }}
    >
      {(rows) => (
        <ul className="bg-card shadow-soft divide-y rounded-xl border">
          {rows
            .filter((row) => row.status === 'upcoming')
            .reverse()
            .map((row) => (
              <li key={row.event.id} className="p-4 sm:p-5">
                <EventCard event={row.event} action={<RegisterButton event={row.event} registration={row} />} />
                <p className="text-muted-foreground mt-2 text-xs sm:pl-18">Registered {formatDateTime(row.registeredAt)}</p>
              </li>
            ))}
        </ul>
      )}
    </QueryView>
  )
}

/** Past events the student registered for, with attendance and a certificate for those attended. */
export function ParticipationHistory() {
  const query = useEventRegistrations()
  return (
    <QueryView
      query={query}
      skeleton={<ListSkeleton rows={3} />}
      isEmpty={(rows) => !rows.some((row) => row.status !== 'upcoming')}
      empty={{ icon: History, title: 'No past events yet', description: 'Events you register for appear here once they are over.' }}
    >
      {(rows) => {
        const past = rows.filter((row) => row.status !== 'upcoming')
        const attended = past.filter((row) => row.status === 'attended').length
        return (
          <div className="flex flex-col gap-3">
            <p className="text-muted-foreground flex items-center gap-2 text-sm">
              <Award className="text-brand size-4" aria-hidden /> Attended {attended} of {past.length} events you registered for.
            </p>
            <ul className="bg-card shadow-soft divide-y rounded-xl border">
              {past.map((row) => (
                <li key={row.event.id} className="p-4 sm:p-5">
                  <EventCard
                    event={row.event}
                    action={
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={row.status === 'attended' ? 'completed' : 'absent'} label={row.status === 'attended' ? 'Attended' : 'Missed'} />
                        {row.status === 'attended' && <CertificateButton registration={row} />}
                      </div>
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        )
      }}
    </QueryView>
  )
}
