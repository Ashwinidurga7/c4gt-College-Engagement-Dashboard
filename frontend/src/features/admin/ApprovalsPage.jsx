import { UserCheck } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { PageTabs } from '@/components/common/PageTabs'
import { ApprovalList } from '@/features/approvals/ApprovalList'
import { useDecideRegistration, usePendingRegistrations } from '@/hooks/useAdmin'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { ROLE_META } from '@/lib/roles'

function RoleQueue({ role }) {
  const query = usePendingRegistrations(role)
  const decide = useDecideRegistration(role)
  const label = ROLE_META[role].label
  return (
    <ApprovalList
      query={query}
      decide={decide}
      emptyTitle={`No pending ${label} registrations`}
      emptyDescription={`New ${label} registrations from all three colleges will appear here.`}
    />
  )
}

const TABS = [
  { value: 'faculty', label: 'Faculty', icon: ROLE_META.faculty.icon },
  { value: 'hod', label: 'HOD', icon: ROLE_META.hod.icon },
]

/** Admin approves faculty and HOD registrations; CTPOs are approved by their HOD. */
export function ApprovalsPage() {
  useDocumentTitle('Approvals')
  const [params, setParams] = useSearchParams()
  const current = params.get('role') === 'hod' ? 'hod' : 'faculty'

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Pending approvals"
        description="Faculty and HOD registrations across all three colleges. CTPO registrations are approved by the HOD of their department."
        icon={UserCheck}
      />
      <PageTabs label="Registration type" tabs={TABS} value={current} onValueChange={(value) => setParams({ role: value }, { replace: true })}>
        {(role) => <RoleQueue role={role} />}
      </PageTabs>
    </div>
  )
}
