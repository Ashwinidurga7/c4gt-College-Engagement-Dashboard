import { zodResolver } from '@hookform/resolvers/zod'
import { Phone, UserRound } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { FormField } from '@/components/common/FormField'
import { FormModal } from '@/components/common/FormModal'
import { IconInput } from '@/components/common/IconInput'
import { profileDefaults, profileSchema } from '@/features/student/profile/profileSchema'
import { useUpdateStudentProfile } from '@/hooks/useStudent'
import { fieldProps } from '@/lib/fieldProps'

const textareaClass =
  'bg-card border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive w-full rounded-lg border px-3 py-2 text-sm outline-none focus-visible:ring-3'

/** Mounted only while open, so the form always starts from the latest saved profile. */
export function EditProfileModal({ profile, open, onOpenChange }) {
  const update = useUpdateStudentProfile()
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: profileDefaults(profile),
  })
  const { errors } = formState

  const onSubmit = handleSubmit((values) => {
    update.mutate(values, { onSuccess: () => onOpenChange(false) })
  })

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit profile"
      description="Academic details such as roll number and department are managed by the college office."
      onSubmit={onSubmit}
      isSubmitting={update.isPending}
      error={update.error}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="profile-phone" label="Mobile number" error={errors.phone?.message}>
          <IconInput icon={Phone} type="tel" inputMode="numeric" autoComplete="tel-national" {...fieldProps('profile-phone', errors.phone)} {...register('phone')} />
        </FormField>
        <FormField id="profile-guardian-phone" label="Guardian mobile" error={errors.guardianPhone?.message}>
          <IconInput icon={Phone} type="tel" inputMode="numeric" {...fieldProps('profile-guardian-phone', errors.guardianPhone)} {...register('guardianPhone')} />
        </FormField>
        <FormField id="profile-guardian-name" label="Guardian name" error={errors.guardianName?.message} className="sm:col-span-2">
          <IconInput icon={UserRound} {...fieldProps('profile-guardian-name', errors.guardianName)} {...register('guardianName')} />
        </FormField>
        <FormField id="profile-address" label="Address" error={errors.address?.message} className="sm:col-span-2">
          <textarea rows={3} autoComplete="street-address" className={textareaClass} {...fieldProps('profile-address', errors.address)} {...register('address')} />
        </FormField>
        <FormField id="profile-bio" label="About me" error={errors.bio?.message} hint="Shown to faculty on your profile." className="sm:col-span-2">
          <textarea rows={3} className={textareaClass} {...fieldProps('profile-bio', errors.bio, true)} {...register('bio')} />
        </FormField>
      </div>
    </FormModal>
  )
}
