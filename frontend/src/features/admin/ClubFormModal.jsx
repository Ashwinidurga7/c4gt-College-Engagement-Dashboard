import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FormField } from '@/components/common/FormField'
import { FormModal } from '@/components/common/FormModal'
import { TextArea } from '@/components/common/TextArea'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { clubDefaults, clubSchema } from '@/features/admin/clubSchema'
import { useCreateClub, useUpdateClub } from '@/hooks/useAdmin'
import { CLUB_CATEGORIES } from '@/lib/campus'
import { COLLEGES } from '@/lib/colleges'
import { fieldProps } from '@/lib/fieldProps'

const inputClass = 'bg-card h-11'

function Select({ id, label, error, options, placeholder, registration }) {
  return (
    <FormField id={id} label={label} error={error?.message}>
      <NativeSelect size="lg" className="w-full" {...fieldProps(id, error)} {...registration}>
        <NativeSelectOption value="">{placeholder}</NativeSelectOption>
        {options.map((option) => (
          <NativeSelectOption key={option} value={option}>
            {option}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </FormField>
  )
}

/** Create a club, or edit one when `club` is given. */
export function ClubFormModal({ club, open, onOpenChange }) {
  const create = useCreateClub()
  const update = useUpdateClub()
  const mutation = club ? update : create
  const { register, handleSubmit, formState } = useForm({ resolver: zodResolver(clubSchema), defaultValues: clubDefaults(club) })
  const { errors } = formState

  const onSubmit = handleSubmit((values) => {
    const done = { onSuccess: () => onOpenChange(false) }
    if (club) update.mutate({ id: club.id, values }, done)
    else create.mutate(values, done)
  })

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={club ? `Edit ${club.name}` : 'Create club'}
      description={club ? 'Changes are visible to students immediately.' : 'New clubs are active and visible to students once created.'}
      onSubmit={onSubmit}
      submitLabel={club ? 'Save changes' : 'Create club'}
      isSubmitting={mutation.isPending}
      error={mutation.error}
      size="sm:max-w-2xl"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="club-name" label="Short name" error={errors.name?.message}>
          <Input className={inputClass} placeholder="e.g. C4GT" {...fieldProps('club-name', errors.name)} {...register('name')} />
        </FormField>
        <FormField id="club-fullname" label="Full name (optional)" error={errors.fullName?.message}>
          <Input className={inputClass} placeholder="e.g. Code for a Greater Tomorrow" {...fieldProps('club-fullname', errors.fullName)} {...register('fullName')} />
        </FormField>
        <FormField id="club-tagline" label="Tagline (optional)" error={errors.tagline?.message} className="sm:col-span-2">
          <Input className={inputClass} {...fieldProps('club-tagline', errors.tagline)} {...register('tagline')} />
        </FormField>
        <Select id="club-category" label="Category" error={errors.category} options={CLUB_CATEGORIES} placeholder="Select category" registration={register('category')} />
        <Select id="club-college" label="College" error={errors.college} options={COLLEGES} placeholder="Select college" registration={register('college')} />
        <FormField id="club-coordinator" label="Faculty coordinator" error={errors.coordinator?.message}>
          <Input className={inputClass} {...fieldProps('club-coordinator', errors.coordinator)} {...register('coordinator')} />
        </FormField>
        <FormField id="club-email" label="Contact email (optional)" error={errors.email?.message}>
          <Input type="email" className={inputClass} {...fieldProps('club-email', errors.email)} {...register('email')} />
        </FormField>
        <FormField id="club-founded" label="Founded (optional)" error={errors.founded?.message}>
          <Input inputMode="numeric" className={inputClass} placeholder="YYYY" {...fieldProps('club-founded', errors.founded)} {...register('founded')} />
        </FormField>
        <FormField id="club-focus" label="Focus areas (optional)" error={errors.focusAreas?.message} hint="Separate with commas.">
          <Input className={inputClass} {...fieldProps('club-focus', errors.focusAreas, true)} {...register('focusAreas')} />
        </FormField>
        <FormField id="club-description" label="Description" error={errors.description?.message} className="sm:col-span-2">
          <TextArea rows={4} {...fieldProps('club-description', errors.description)} {...register('description')} />
        </FormField>
      </div>
    </FormModal>
  )
}
