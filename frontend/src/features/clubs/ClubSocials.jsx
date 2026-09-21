import { ArrowRight, Globe, Share2 } from 'lucide-react'
import { InstagramIcon, LinkedInIcon, WhatsAppIcon } from '@/components/common/BrandIcons'
import { SectionCard } from '@/components/common/SectionCard'

/** Presentation per network. Brand marks carry their own colour; anything else uses a token. */
const NETWORKS = {
  instagram: { name: 'Instagram', icon: InstagramIcon, fallback: 'Follow us', chip: { background: 'linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4)', color: '#fff' } },
  linkedin: { name: 'LinkedIn', icon: LinkedInIcon, fallback: 'Connect with us', chip: { background: '#0A66C2', color: '#fff' } },
  whatsapp: { name: 'WhatsApp', icon: WhatsAppIcon, fallback: 'Follow the channel', chip: { background: '#25D366', color: '#fff' } },
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
          const chip = meta.chip
          return (
            <li key={network}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group hover:border-primary/40 focus-visible:ring-ring flex items-center gap-3 rounded-xl border p-3 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${chip ? '' : meta.tone}`} style={chip}>
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
