import { FileCheck2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { QueryView } from '@/components/common/QueryView'
import { SectionCard } from '@/components/common/SectionCard'
import { ListSkeleton } from '@/components/common/Skeleton'
import { formatDate } from '@/lib/formatters'

export function PendingCertificatesCard({ query, className }) {
  return (
    <SectionCard
      title="Awaiting your verification"
      icon={FileCheck2}
      className={className}
      action={
        <Link to="/faculty/certificates" className="text-link text-sm font-medium hover:underline">
          Open queue
        </Link>
      }
    >
      <QueryView
        query={query}
        skeleton={<ListSkeleton rows={4} />}
        isEmpty={(data) => data.items.length === 0}
        empty={{ icon: FileCheck2, title: 'Nothing to verify', description: 'New certificate uploads from your students will appear here.' }}
      >
        {(data) => (
          <ul className="divide-y">
            {data.items.map((certificate) => (
              <li key={certificate.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <p className="text-heading text-sm font-medium">{certificate.title}</p>
                  <p className="text-muted-foreground text-xs">
                    {certificate.student?.name} · {certificate.student?.rollNumber} · {certificate.category}
                  </p>
                </div>
                <time dateTime={certificate.date} className="text-muted-foreground text-xs">
                  {formatDate(certificate.date)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </QueryView>
    </SectionCard>
  )
}
