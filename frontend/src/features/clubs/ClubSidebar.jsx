import { BarChart3, CalendarDays, ChevronRight, ExternalLink, FolderKanban, GraduationCap, Handshake, Link2, MessageCircle, Trophy, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SectionCard } from '@/components/common/SectionCard'
import { formatNumber } from '@/lib/formatters'

/** Stat rows, in display order. A row is dropped when the club has no figure for it. */
const STAT_ROWS = [
  { key: 'members', icon: GraduationCap, label: 'Students trained', suffix: '+', from: (club) => club.membersCount },
  { key: 'placements', icon: Handshake, label: 'Placements', from: (club) => club.stats.placements },
  { key: 'internships', icon: FolderKanban, label: 'Internship selections', from: (club) => club.stats.internships },
  { key: 'projects', icon: FolderKanban, label: 'Projects completed', suffix: '+', from: (club) => club.stats.projects },
  { key: 'workshops', icon: Wrench, label: 'Workshops conducted', suffix: '+', from: (club) => club.stats.workshops },
  { key: 'hackathons', icon: Trophy, label: 'Hackathons participated', suffix: '+', from: (club) => club.stats.hackathons },
]

/** Jump-off points into the rest of the club's presence, on and off the portal. */
function quickLinksFor(club, role) {
  const links = []
  if (club.website) links.push({ key: 'website', label: `${club.name} website`, icon: ExternalLink, href: club.website, external: true })
  if (club.socials.whatsapp) links.push({ key: 'whatsapp', label: 'Follow on WhatsApp', icon: MessageCircle, href: club.socials.whatsapp.url, external: true })
  links.push({ key: 'events', label: 'Events and workshops', icon: CalendarDays, to: `/${role}/events` })
  if (club.email) links.push({ key: 'contact', label: 'Contact the club', icon: Link2, href: `mailto:${club.email}` })
  return links
}

export function ClubQuickLinks({ club, role }) {
  const links = quickLinksFor(club, role)
  if (links.length === 0) return null

  const row = 'group hover:bg-muted focus-visible:ring-ring flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none'

  return (
    <SectionCard title="Quick links" icon={Link2} bodyClassName="p-3">
      <ul className="flex flex-col">
        {links.map(({ key, label, icon: Icon, href, to, external }) => (
          <li key={key}>
            {to ? (
              <Link to={to} className={row}>
                <Icon className="text-brand size-4 shrink-0" aria-hidden />
                <span className="min-w-0 flex-1 truncate">{label}</span>
                <ChevronRight className="text-muted-foreground size-4 shrink-0" aria-hidden />
              </Link>
            ) : (
              <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className={row}>
                <Icon className="text-brand size-4 shrink-0" aria-hidden />
                <span className="min-w-0 flex-1 truncate">{label}</span>
                <ChevronRight className="text-muted-foreground size-4 shrink-0" aria-hidden />
                {external && <span className="sr-only">(opens in a new tab)</span>}
              </a>
            )}
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}

export function ClubStats({ club }) {
  const rows = STAT_ROWS.map((row) => ({ ...row, value: row.from(club) })).filter((row) => row.value != null && row.value > 0)
  if (rows.length === 0) return null

  return (
    <SectionCard title="Club stats" icon={BarChart3}>
      <ul className="flex flex-col gap-4">
        {rows.map(({ key, icon: Icon, label, suffix, value }) => (
          <li key={key} className="flex items-center gap-3">
            <span className="bg-tone-blue text-tone-blue-fg flex size-10 shrink-0 items-center justify-center rounded-full">
              <Icon className="size-5" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="text-heading block text-xl font-bold">
                {formatNumber(value)}
                {suffix}
              </span>
              <span className="text-muted-foreground block text-xs">{label}</span>
            </span>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}
