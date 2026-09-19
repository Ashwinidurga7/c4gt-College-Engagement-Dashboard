import { CertificateQueuePage } from '@/features/faculty/CertificateQueuePage'
import { useAdminVerifications, useAdminVerifyCertificate } from '@/hooks/useAdmin'

export function VerificationsPage() {
  return (
    <CertificateQueuePage
      title="Pending verifications"
      description="Certificates and activities awaiting verification across KIET, KIET+ and KIEW."
      documentTitle="Verifications"
      useQueue={useAdminVerifications}
      useVerify={useAdminVerifyCertificate}
    />
  )
}
