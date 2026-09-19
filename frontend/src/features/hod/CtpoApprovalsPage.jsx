import { UserCheck } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { ApprovalList } from '@/features/approvals/ApprovalList'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useDecideCtpo, usePendingCtpos } from '@/hooks/useHod'

export function CtpoApprovalsPage() {
  useDocumentTitle('CTPO Approvals')
  const query = usePendingCtpos()
  const decide = useDecideCtpo()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="CTPO approvals"
        description="Class Teacher and Placement Officer registrations for your department. Approved CTPOs can sign in immediately."
        icon={UserCheck}
      />
      <ApprovalList query={query} decide={decide} emptyTitle="No pending CTPO registrations" emptyDescription="New CTPO registrations for your department will appear here." />
    </div>
  )
}
