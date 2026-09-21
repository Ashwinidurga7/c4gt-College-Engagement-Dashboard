import { ArrowRight, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ClubLogo } from '@/features/clubs/ClubLogo'
import { formatNumber } from '@/lib/formatters'

export function ClubCard({ club, to }) {
  return (
    <article className="bg-card shadow-soft hover:border-primary/40 flex h-full flex-col items-center gap-3 rounded-xl border p-5 text-center transition-colors">
      <ClubLogo club={club} className="size-16 text-lg" />
      <div>
        <h3 className="text-lg font-semibold">{club.name}</h3>
        {club.fullName && club.fullName !== club.name && <p className="text-muted-foreground text-xs">{club.fullName}</p>}
      </div>
      {club.tagline && <p className="text-body text-sm">{club.tagline}</p>}
      <div className="flex flex-wrap justify-center gap-1.5">
        {club.category && <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold">{club.category}</span>}
        {club.status !== 'active' && <StatusBadge status={club.status} />}
      </div>
      {club.membersCount != null && (
        <p className="text-muted-foreground inline-flex items-center gap-1 text-xs">
          <Users className="size-3.5" aria-hidden /> {formatNumber(club.membersCount)} members
        </p>
      )}
      <Link to={to} className="text-link mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold hover:underline">
        View club<span className="sr-only">: {club.name}</span> <ArrowRight className="size-3.5" aria-hidden />
      </Link>
    </article>
  )
}
