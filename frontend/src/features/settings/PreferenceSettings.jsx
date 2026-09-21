import { Bell, Moon, Palette, Sun } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { SectionCard } from '@/components/common/SectionCard'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

const NOTIFICATION_OPTIONS = [
  { key: 'events', label: 'New events and club activities' },
  { key: 'academics', label: 'Attendance and results alerts' },
  { key: 'verifications', label: 'Certificate and approval updates' },
  { key: 'email', label: 'Also send these by email' },
]
const DEFAULT_PREFS = { events: true, academics: true, verifications: true, email: false }

function storageKey(userId) {
  return `kiet.prefs.${userId}`
}

function readPrefs(userId) {
  try {
    return { ...DEFAULT_PREFS, ...JSON.parse(window.localStorage.getItem(storageKey(userId)) ?? '{}') }
  } catch {
    return DEFAULT_PREFS
  }
}

/** Theme (applied immediately) and notification preferences (kept in this browser until a settings API exists). */
export function PreferenceSettings() {
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()
  const [prefs, setPrefs] = useState(() => readPrefs(user.id))

  function save() {
    try {
      window.localStorage.setItem(storageKey(user.id), JSON.stringify(prefs))
      toast.success('Notification preferences saved on this device')
    } catch {
      toast.error('Preferences could not be saved in this browser.')
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <SectionCard title="Appearance" icon={Palette} description="Applies right away and is remembered on this device.">
        <fieldset>
          <legend className="sr-only">Theme</legend>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'light', label: 'Light', icon: Sun },
              { value: 'dark', label: 'Dark', icon: Moon },
            ].map((option) => (
              <label
                key={option.value}
                className={cn(
                  'has-focus-visible:ring-ring flex cursor-pointer items-center gap-3 rounded-lg border p-4 has-focus-visible:ring-2',
                  theme === option.value && 'border-primary bg-accent',
                )}
              >
                <input type="radio" name="theme" value={option.value} checked={theme === option.value} onChange={() => setTheme(option.value)} className="accent-primary size-4" />
                <option.icon className="text-brand size-5" aria-hidden />
                <span className="text-heading font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </SectionCard>
      <SectionCard title="Notifications" icon={Bell} description="Choose what you want to hear about.">
        <fieldset className="flex flex-col gap-3">
          <legend className="sr-only">Notification preferences</legend>
          {NOTIFICATION_OPTIONS.map((option) => (
            <label key={option.key} className="text-body flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={prefs[option.key]}
                onChange={(event) => setPrefs((current) => ({ ...current, [option.key]: event.target.checked }))}
                className="accent-primary size-4"
              />
              {option.label}
            </label>
          ))}
        </fieldset>
        <Button size="lg" className="mt-4" onClick={save}>
          Save preferences
        </Button>
      </SectionCard>
    </div>
  )
}
