import { StatusBadge } from '@/components/common/StatusBadge'
import { monthYear } from '@/features/student/resume/resumeFormat'
import { IncludeList } from '@/features/student/resume/sections/IncludeList'

function badgeFor(item) {
  if (item.status === 'external') return <StatusBadge status="general" label="External" />
  if (item.verified) return <StatusBadge status="verified" />
  if (item.status === 'rejected') return <StatusBadge status="rejected" />
  return <StatusBadge status="pending" label="Not verified" />
}

/**
 * External certifications (student-managed) are included by default. Institutional certificates
 * are included only once verified; unverified ones can be turned on, rejected ones cannot.
 */
export function CertificationsSection({ model, actions }) {
  return (
    <IncludeList
      id="resume-certifications-list"
      items={model.certifications}
      onToggle={(item, included) => actions.setItem('certifications', item.id, { included })}
      describe={(item) => ({
        title: item.title,
        meta: [item.issuer, monthYear(item.date)].filter(Boolean).join(', '),
        badge: badgeFor(item),
        disabledReason: item.status === 'rejected' ? 'The college rejected this certificate, so it cannot go on your resume. Upload a clearer copy from Portfolio.' : null,
      })}
      emptyText="No certifications or certificates yet, so this section is left out."
      emptyLink={{ to: '/student/portfolio?tab=certifications', label: 'Add a certification in Portfolio' }}
    />
  )
}
