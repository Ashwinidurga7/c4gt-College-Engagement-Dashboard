import { Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ResumeField } from '@/features/student/resume/sections/ResumeField'
import { useSaveProfileField } from '@/features/student/resume/useSaveProfileField'

/**
 * Name and email are required. Phone can be saved back to the profile; location and links are
 * kept in the resume draft only, so the full home address never has to appear on a resume.
 */
export function PersonalSection({ model, profilePhone, actions, errors }) {
  const personal = model.personal
  const profile = useSaveProfileField()
  const phoneChanged = personal.phone.trim() !== (profilePhone ?? '')
  const set = (field) => (value) => actions.setPersonal(field, value)

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ResumeField id="resume-name" label="Full name (required)" value={personal.name} onChange={set('name')} error={errors.name} autoComplete="name" required />
      <ResumeField id="resume-email" label="Email (required)" type="email" value={personal.email} onChange={set('email')} error={errors.email} autoComplete="email" required />
      <div className="flex flex-col gap-2">
        <ResumeField id="resume-phone" label="Phone" type="tel" inputMode="tel" value={personal.phone} onChange={set('phone')} autoComplete="tel" />
        {phoneChanged && profile.canSave('phone', personal.phone.trim()) && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="self-start"
            disabled={profile.isPending}
            onClick={() => profile.save('phone', personal.phone.trim(), () => actions.clearPersonal('phone'))}
          >
            {profile.isPending ? <Loader2 className="animate-spin" aria-hidden /> : <Save aria-hidden />}
            Save phone to my profile
          </Button>
        )}
      </div>
      <ResumeField
        id="resume-location"
        label="Location"
        value={personal.location}
        onChange={set('location')}
        hint="Town and state only, e.g. Kakinada, Andhra Pradesh."
        autoComplete="address-level2"
      />
      <ResumeField id="resume-linkedin" label="LinkedIn" value={personal.linkedin} onChange={set('linkedin')} placeholder="linkedin.com/in/your-name" inputMode="url" />
      <ResumeField id="resume-github" label="GitHub" value={personal.github} onChange={set('github')} placeholder="github.com/your-name" inputMode="url" />
      <ResumeField
        id="resume-portfolio"
        label="Portfolio website"
        value={personal.portfolio}
        onChange={set('portfolio')}
        placeholder="your-site.dev"
        inputMode="url"
        className="sm:col-span-2"
      />
      <p className="text-muted-foreground text-xs sm:col-span-2">
        Name and email start from your profile. Changes here apply to this resume only, unless you save them to your profile.
      </p>
    </div>
  )
}
