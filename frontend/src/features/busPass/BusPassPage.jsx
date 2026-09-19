import { BusFront, Clock, MapPin, Phone } from 'lucide-react'
import { BrandLogo } from '@/components/common/BrandLogo'
import { PageHeader } from '@/components/common/PageHeader'
import { PreviewNotice } from '@/components/common/PreviewNotice'
import { QueryView } from '@/components/common/QueryView'
import { SectionCard } from '@/components/common/SectionCard'
import { ListSkeleton } from '@/components/common/Skeleton'
import { StatusBadge } from '@/components/common/StatusBadge'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useBusPass } from '@/hooks/usePreview'
import { formatDate, formatTime } from '@/lib/formatters'

function PassCard({ pass }) {
  const valid = new Date() <= new Date(`${pass.validTo}T23:59:59`)
  return (
    <article aria-label="Digital bus pass" className="bg-nav text-nav-strong border-nav-border flex flex-col gap-5 rounded-2xl border p-6">
      <div className="flex items-start justify-between gap-4">
        <BrandLogo onDark className="text-lg" />
        <StatusBadge status={valid ? 'active' : 'inactive'} label={valid ? 'Valid' : 'Expired'} />
      </div>
      <div>
        <p className="text-nav-muted text-xs font-semibold tracking-wide uppercase">Transport pass</p>
        <p className="text-nav-strong mt-1 text-2xl font-bold">{pass.holder}</p>
        <p className="text-nav-text text-sm">{pass.rollNumber}</p>
      </div>
      <dl className="grid grid-cols-2 gap-4 text-sm">
        {[
          ['Route', `${pass.route} · ${pass.routeName}`],
          ['Boarding point', `${pass.boardingPoint}, ${formatTime(pass.pickupTime)}`],
          ['Bus number', pass.busNumber],
          ['Valid', `${formatDate(pass.validFrom)} – ${formatDate(pass.validTo)}`],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-nav-muted text-xs">{label}</dt>
            <dd className="text-nav-strong font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="border-nav-border text-nav-text border-t pt-4 font-mono text-lg tracking-widest">{pass.passId}</p>
    </article>
  )
}

export function BusPassPage() {
  useDocumentTitle('Bus Pass')
  const query = useBusPass()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Digital bus pass" description="Show this pass when you board the college bus." icon={BusFront} preview />
      <QueryView query={query} skeleton={<ListSkeleton rows={4} />}>
        {(pass) => (
          <div className="grid gap-6 lg:grid-cols-2">
            <PassCard pass={pass} />
            <SectionCard title={`${pass.route} stops`} icon={MapPin}>
              <ol className="relative flex flex-col gap-4 border-l-2 pl-5">
                {pass.stops.map((stop) => {
                  const mine = stop.name === pass.boardingPoint
                  return (
                    <li key={stop.name} className="relative">
                      <span aria-hidden className={`absolute top-1.5 -left-[27px] size-3 rounded-full border-2 ${mine ? 'bg-primary border-primary' : 'bg-card border-border-strong'}`} />
                      <p className={`text-sm ${mine ? 'text-heading font-semibold' : 'text-body'}`}>
                        {stop.name}
                        {mine && <span className="text-link ml-2 text-xs font-semibold">Your stop</span>}
                      </p>
                      <p className="text-muted-foreground inline-flex items-center gap-1 text-xs">
                        <Clock className="size-3" aria-hidden /> {formatTime(stop.time)}
                      </p>
                    </li>
                  )
                })}
              </ol>
              <p className="text-muted-foreground mt-5 flex items-center gap-2 border-t pt-4 text-sm">
                <Phone className="text-brand size-4" aria-hidden /> Driver {pass.driver}:{' '}
                <a href={`tel:${pass.driverPhone}`} className="text-link font-medium hover:underline">
                  {pass.driverPhone}
                </a>
              </p>
            </SectionCard>
          </div>
        )}
      </QueryView>
      <PreviewNotice />
    </div>
  )
}
