import { Megaphone } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'
import { NoticeCard } from '@/components/common/NoticeCard'
import { SectionCard } from '@/components/common/SectionCard'

export function CampusUpdates({ announcements, className }) {
  return (
    <SectionCard title="Campus updates" icon={Megaphone} className={className}>
      {announcements.length === 0 ? (
        <EmptyState icon={Megaphone} title="No announcements" description="College notices will appear here." />
      ) : (
        <div className="flex flex-col gap-3">
          {announcements.slice(0, 3).map((notice) => (
            <NoticeCard key={notice.id ?? notice.title} notice={notice} />
          ))}
        </div>
      )}
    </SectionCard>
  )
}
