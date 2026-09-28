import { Bell, Loader2, Mail } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { QueryView } from '@/components/common/QueryView'
import { SectionCard } from '@/components/common/SectionCard'
import { ListSkeleton } from '@/components/common/Skeleton'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/hooks/useAuth'
import { useNotificationPreferences, useSaveNotificationPreferences } from '@/hooks/usePreview'
import { categoriesFor } from '@/lib/notificationPreferences'

function PreferenceForm({ email, saved, role }) {
  const save = useSaveNotificationPreferences()
  const [preferences, setPreferences] = useState(saved)
  const categories = categoriesFor(role)
  const changed = JSON.stringify(preferences) !== JSON.stringify(saved)

  const toggle = (key, channel, value) => setPreferences((current) => ({ ...current, [key]: { ...current[key], [channel]: value } }))

  return (
    <>
      <p className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
        <Mail className="text-brand size-4 shrink-0" aria-hidden /> Emails go to <span className="text-heading font-medium break-all">{email}</span>
      </p>
      <table className="w-full text-sm">
        <caption className="sr-only">Notification preferences by category</caption>
        <thead>
          <tr className="text-muted-foreground border-b text-left text-xs">
            <th scope="col" className="py-2 font-semibold">
              Category
            </th>
            <th scope="col" className="w-20 py-2 text-center font-semibold">
              In app
            </th>
            <th scope="col" className="w-20 py-2 text-center font-semibold">
              Email
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {categories.map((category) => (
            <tr key={category.key}>
              <th scope="row" className="py-3 pr-3 text-left font-normal">
                <span className="text-heading block font-medium">{category.label}</span>
                <span className="text-muted-foreground block text-xs">{category.description}</span>
              </th>
              {['inApp', 'email'].map((channel) => (
                <td key={channel} className="py-3 text-center">
                  <Switch
                    checked={preferences[category.key]?.[channel] ?? false}
                    onCheckedChange={(value) => toggle(category.key, channel, value)}
                    aria-label={`${category.label}: ${channel === 'email' ? 'email' : 'in-app'} notifications`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Button size="lg" className="mt-4" disabled={!changed || save.isPending} onClick={() => save.mutate(preferences, { onError: (error) => toast.error(error.message) })}>
        {save.isPending && <Loader2 className="animate-spin" aria-hidden />}
        Save preferences
      </Button>
    </>
  )
}

/** Per-category choice of in-app and email notifications. */
export function NotificationSettings() {
  const { user } = useAuth()
  const query = useNotificationPreferences()

  return (
    <SectionCard title="Notifications" icon={Bell} description="Choose what you hear about, in the portal and by email.">
      <QueryView query={query} skeleton={<ListSkeleton rows={3} />}>
        {(data) => <PreferenceForm key={JSON.stringify(data.preferences)} email={data.email} saved={data.preferences} role={user.role} />}
      </QueryView>
    </SectionCard>
  )
}
