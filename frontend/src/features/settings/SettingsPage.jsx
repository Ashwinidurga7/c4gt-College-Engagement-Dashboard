import { KeyRound, Settings, UserRound } from 'lucide-react'
import { CollegeBadge } from '@/components/common/CollegeBadge'
import { DetailList } from '@/components/common/DetailList'
import { PageHeader } from '@/components/common/PageHeader'
import { PreviewNotice } from '@/components/common/PreviewNotice'
import { SectionCard } from '@/components/common/SectionCard'
import { InstitutionSettings } from '@/features/settings/InstitutionSettings'
import { PreferenceSettings } from '@/features/settings/PreferenceSettings'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { roleLabel } from '@/lib/roles'

export function SettingsPage() {
  useDocumentTitle('Settings')
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" description="Your account, appearance and notification preferences." icon={Settings} preview />
      <SectionCard title="Account" icon={UserRound}>
        <DetailList
          columns={3}
          items={[
            { label: 'Name', value: user.name },
            { label: 'Institutional email', value: user.email },
            { label: 'Role', value: roleLabel(user.role) },
            { label: 'College', value: user.college && <CollegeBadge college={user.college} /> },
            { label: 'Department', value: user.department },
          ]}
        />
        <p className="text-muted-foreground mt-4 flex items-start gap-2 border-t pt-4 text-sm">
          <KeyRound className="text-brand mt-0.5 size-4 shrink-0" aria-hidden />
          To change your password or email, contact the admin office of your college. Self-service changes arrive with the account service.
        </p>
      </SectionCard>
      <PreferenceSettings />
      {user.role === 'admin' && <InstitutionSettings />}
      <PreviewNotice>Appearance applies immediately. Other settings are stored in this preview until the settings service is available.</PreviewNotice>
    </div>
  )
}
