import { Moon, Palette, Sun } from 'lucide-react'
import { SectionCard } from '@/components/common/SectionCard'
import { NotificationSettings } from '@/features/settings/NotificationSettings'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

/** Theme, applied immediately and remembered on this device, next to the notification preferences. */
export function PreferenceSettings() {
  const { theme, setTheme } = useTheme()

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
      <NotificationSettings />
    </div>
  )
}
