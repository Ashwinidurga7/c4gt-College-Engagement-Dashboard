import { ArrowLeft, BookOpen, CalendarRange, Code2, FolderKanban, GitBranch, Info, Lightbulb, Mail, Mic, Trophy, UsersRound, Wrench } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { DetailList } from '@/components/common/DetailList'
import { PreviewBadge } from '@/components/common/PreviewBadge'
import { QueryView } from '@/components/common/QueryView'
import { RoleGate } from '@/components/common/RoleGate'
import { SectionCard } from '@/components/common/SectionCard'
import { Skeleton, StatGridSkeleton } from '@/components/common/Skeleton'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { ClubEvents } from '@/features/clubs/ClubEvents'
import { ClubGallery } from '@/features/clubs/ClubGallery'
import { ClubHighlights } from '@/features/clubs/ClubHighlights'
import { ClubQuickLinks, ClubStats } from '@/features/clubs/ClubSidebar'
import { ClubSocials } from '@/features/clubs/ClubSocials'
import { ClubLogo } from '@/features/clubs/ClubLogo'
import { useAuth } from '@/hooks/useAuth'
import { useClub } from '@/hooks/useCampus'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

/** Icon per focus area, matched case-insensitively; anything unlisted gets a neutral mark. */
const FOCUS_ICONS = {
  hackathons: Trophy,
  workshops: Wrench,
  projects: FolderKanban,
  'tech talks': Mic,
  'open source': GitBranch,
  community: UsersRound,
  mentoring: BookOpen,
  'digital public goods': Code2,
}

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
            <ClubSocials club={club} />
            <div className="grid items-start gap-6 lg:grid-cols-3">
              <div className="flex flex-col gap-6 lg:col-span-2">
                <SectionCard title={`About ${club.name}`} icon={Lightbulb}>
                  <p className="text-body text-sm leading-relaxed">{club.description || 'No description yet.'}</p>
                  {club.focusAreas.length > 0 && (
                    <ul aria-label="Focus areas" className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {club.focusAreas.map((area) => {
                        const Icon = FOCUS_ICONS[area.toLowerCase()] ?? Info
                        return (
                          <li key={area} className="flex items-center gap-2.5">
                            <span className="bg-tone-blue text-tone-blue-fg flex size-9 shrink-0 items-center justify-center rounded-lg">
                              <Icon className="size-4" aria-hidden />
                            </span>
                            <span className="text-body min-w-0 truncate text-sm font-medium">{area}</span>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </SectionCard>
                <ClubHighlights club={club} />
              </div>
              <div className="flex flex-col gap-6">
                <ClubQuickLinks club={club} role={user.role} />
                <ClubStats club={club} />
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
                </SectionCard>
              </div>
            </div>
            <ClubGallery club={club} />
            <ClubEvents clubId={club.id} />
          </>
        )}
      </QueryView>
    </div>
  )
}
