import { IndianRupee } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { PreviewNotice } from '@/components/common/PreviewNotice'
import { AdminFees } from '@/features/fees/AdminFees'
import { StudentFees } from '@/features/fees/StudentFees'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function FeesPage() {
  useDocumentTitle('Fees')
  const { user } = useAuth()
  const isStudent = user.role === 'student'

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={isStudent ? 'My fees' : 'Fee collection'}
        description={isStudent ? 'Your fee items, dues and receipts.' : 'Semester tuition across KIET, KIET+ and KIEW.'}
        icon={IndianRupee}
        preview
      />
      {isStudent ? <StudentFees /> : <AdminFees />}
      <PreviewNotice />
    </div>
  )
}
