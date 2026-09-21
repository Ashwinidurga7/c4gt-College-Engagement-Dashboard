import { ArrowRight, Briefcase, Camera, Globe, MessageCircle, Share2 } from 'lucide-react'
import { SectionCard } from '@/components/common/SectionCard'

/** Presentation per network. lucide dropped brand marks, so these are generic stand-ins. */
const NETWORKS = {
  instagram: { name: 'Instagram', icon: Camera, fallback: 'Follow us', tone: 'bg-tone-orange text-tone-orange-fg' },
  linkedin: { name: 'LinkedIn', icon: Briefcase, fallback: 'Connect with us', tone: 'bg-tone-blue text-tone-blue-fg' },
  whatsapp: { name: 'WhatsApp community', icon: MessageCircle, fallback: 'Join our community', tone: 'bg-tone-green text-tone-green-fg' },
  website: { name: 'Website', icon: Globe, fallback: 'Visit the site', tone: 'bg-tone-purple text-tone-purple-fg' },
}

/** The club's social channels, one card each. Renders nothing when a club has none. */
export function ClubSocials({ club }) {
  const entries = Object.entries(club.socials)
  if (entries.length === 0) return null

  return (
    <SectionCard title="Follow us" description={`Stay connected with ${club.name} on our channels`} icon={Share2}>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {entries.map(([network, { url, label }]) => {
          const meta = NETWORKS[network] ?? { name: network, icon: Globe, fallback: 'Visit', tone: 'bg-muted text-muted-foreground' }
          const Icon = meta.icon
          return (
            <li key={network}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group hover:border-primary/40 focus-visible:ring-ring flex items-center gap-3 rounded-xl border p-3 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${meta.tone}`}>
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{meta.name}</span>
                  <span className="text-muted-foreground block truncate text-xs">{label || meta.fallback}</span>
                </span>
                <ArrowRight className="text-muted-foreground group-hover:text-primary size-4 shrink-0 transition-colors" aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          )
        })}
      </ul>
    </SectionCard>
  )
}
