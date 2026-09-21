import { Newspaper } from 'lucide-react'
import { SectionCard } from '@/components/common/SectionCard'
import { formatDate } from '@/lib/formatters'

/** What the club is running or has been part of. Renders nothing until a club has entries. */
export function ClubHighlights({ club }) {
  if (club.highlights.length === 0) return null

  return (
    <SectionCard title={`What's happening in ${club.name}`} icon={Newspaper}>
      <ul className="flex flex-col divide-y">
        {club.highlights.map((item, index) => (
          <li key={item.id} className={index === 0 ? 'pb-4' : 'py-4 last:pb-0'}>
            <div className="flex flex-wrap items-center gap-2">
              {item.category && <span className="bg-tone-blue text-tone-blue-fg rounded-full px-2 py-0.5 text-xs font-semibold">{item.category}</span>}
              {item.date && <span className="text-muted-foreground text-xs">{formatDate(item.date)}</span>}
            </div>
            <h3 className="text-heading mt-2 text-sm font-semibold">{item.title}</h3>
            {item.description && <p className="text-body mt-1 text-sm leading-relaxed">{item.description}</p>}
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}
