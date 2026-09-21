import { ArrowLeft, CalendarRange, FolderKanban, Info, Link2, Mail, Trophy, Users, Wrench } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { DetailList } from '@/components/common/DetailList'
import { PreviewBadge } from '@/components/common/PreviewBadge'
import { QueryView } from '@/components/common/QueryView'
import { RoleGate } from '@/components/common/RoleGate'
import { SectionCard } from '@/components/common/SectionCard'
import { Skeleton, StatGridSkeleton } from '@/components/common/Skeleton'
import { StatCard } from '@/components/common/StatCard'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { ClubEvents } from '@/features/clubs/ClubEvents'
import { ClubGallery } from '@/features/clubs/ClubGallery'
import { ClubLogo } from '@/features/clubs/ClubLogo'
import { useAuth } from '@/hooks/useAuth'
import { useClub } from '@/hooks/useCampus'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { formatNumber } from '@/lib/formatters'

const SOCIAL_LABELS = { instagram: 'Instagram', linkedin: 'LinkedIn', whatsapp: 'WhatsApp community', website: 'Website' }

function ClubHero({ club }) {
  return (
    <section aria-label={club.name} className="bg-nav text-nav-strong border-nav-border flex flex-col gap-5 rounded-xl border p-6 sm:flex-row sm:items-center">
      <ClubLogo club={club} className="size-20 shrink-0 text-2xl" />
      <div className="min-w-0 flex-1">
        <h1 className="text-nav-strong text-2xl font-bold sm:text-3xl">{club.name}</h1>
        {club.fullName && club.fullName !== club.name && <p className="text-nav-text">{club.fullName}</p>}
        {club.tagline && <p className="text-nav-text mt-1 text-sm">{club.tagline}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          {club.category && <span className="bg-nav-hover text-nav-text rounded-full px-2 py-0.5 text-xs font-semibold">{club.category}</span>}
          <StatusBadge status={club.status} />
        </div>
      </div>
      <RoleGate allow={['student']}>
      <div className="flex flex-col items-start gap-1.5 sm:items-end">
        <Button size="lg" disabled aria-describedby="join-note">
          Join club
        </Button>
        <p id="join-note" className="text-nav-text flex items-center gap-1.5 text-xs">
          <PreviewBadge compact /> Joining online is not available yet
        </p>
      </div>
      </RoleGate>
    </section>
  )
}

export function ClubDetailPage() {
  const { clubId } = useParams()
  const { user } = useAuth()
  const query = useClub(clubId)
  useDocumentTitle(query.data?.name ?? 'Club')

  return (
    <div className="flex flex-col gap-6">
      <Link to={`/${user.role}/clubs`} className="text-link inline-flex w-fit items-center gap-1.5 text-sm font-medium hover:underline">
        <ArrowLeft className="size-4" aria-hidden /> All clubs
      </Link>
      <QueryView
        query={query}
        skeleton={
          <div className="flex flex-col gap-6">
            <Skeleton className="h-36 rounded-xl" />
            <StatGridSkeleton />
          </div>
        }
      >
        {(club) => (
          <>
            <ClubHero club={club} />
            <section aria-label="Club statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Members" value={formatNumber(club.membersCount)} icon={Users} tone="blue" />
              <StatCard label="Projects" value={formatNumber(club.stats.projects)} icon={FolderKanban} tone="green" />
              <StatCard label="Workshops" value={formatNumber(club.stats.workshops)} icon={Wrench} tone="purple" />
              <StatCard label="Hackathons" value={formatNumber(club.stats.hackathons)} icon={Trophy} tone="orange" />
            </section>
            <div className="grid gap-6 lg:grid-cols-3">
              <SectionCard title={`About ${club.name}`} icon={Info} className="lg:col-span-2">
                <p className="text-body text-sm leading-relaxed">{club.description || 'No description yet.'}</p>
                {club.focusAreas.length > 0 && (
                  <ul aria-label="Focus areas" className="mt-4 flex flex-wrap gap-2">
                    {club.focusAreas.map((area) => (
                      <li key={area} className="bg-tone-blue text-tone-blue-fg rounded-full px-3 py-1 text-xs font-semibold">
                        {area}
                      </li>
                    ))}
                  </ul>
                )}
              </SectionCard>
              <SectionCard title="Club details" icon={CalendarRange}>
                <DetailList
                  columns={1}
                  items={[
                    { label: 'Faculty coordinator', value: club.coordinator },
                    { label: 'Student president', value: club.president },
                    { label: 'Founded', value: club.founded },
                    { label: 'Contact', value: club.email && <a className="text-link inline-flex items-center gap-1 hover:underline" href={`mailto:${club.email}`}><Mail className="size-3.5" aria-hidden />{club.email}</a> },
                  ]}
                />
                {Object.keys(club.socials).length > 0 && (
                  <ul className="mt-4 flex flex-col gap-2 border-t pt-4">
                    {Object.entries(club.socials).map(([network, url]) => (
                      <li key={network}>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-link inline-flex items-center gap-1.5 text-sm font-medium hover:underline">
                          <Link2 className="size-4" aria-hidden /> {SOCIAL_LABELS[network] ?? network}
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </SectionCard>
            </div>
            <ClubGallery club={club} />
            <ClubEvents clubId={club.id} />
          </>
        )}
      </QueryView>
    </div>
  )
}
