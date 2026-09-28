import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FormField } from '@/components/common/FormField'
import { FormModal } from '@/components/common/FormModal'
import { TextArea } from '@/components/common/TextArea'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import {
  ACHIEVEMENT_CATEGORIES,
  ACHIEVEMENT_LEVELS,
  achievementSchema,
  ACTIVITY_TYPES,
  activitySchema,
} from '@/features/student/portfolio/portfolioSchemas'
import { useCreateAchievement, useCreateActivity, useUpdateAchievement, useUpdateActivity } from '@/hooks/usePortfolio'
import { fieldProps } from '@/lib/fieldProps'

const inputClass = 'bg-card h-11'
const today = () => new Date().toISOString().slice(0, 10)

function Select({ id, options, placeholder, error, registration }) {
  return (
    <NativeSelect size="lg" className="w-full" {...fieldProps(id, error)} {...registration}>
      <NativeSelectOption value="">{placeholder}</NativeSelectOption>
      {options.map((option) => (
        <NativeSelectOption key={option} value={option}>
          {option}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  )
}

/** Shared create-or-edit wiring: `item` set means edit. */
function useRecordForm({ item, schema, defaults, create, update, onOpenChange }) {
  const form = useForm({ resolver: zodResolver(schema), defaultValues: defaults })
  const mutation = item ? update : create
  const onSubmit = form.handleSubmit((values) => {
    const done = { onSuccess: () => onOpenChange(false) }
    if (item) update.mutate({ id: item.id, values }, done)
    else create.mutate(values, done)
  })
  return { ...form, errors: form.formState.errors, mutation, onSubmit }
}

export function AchievementFormModal({ item, onOpenChange }) {
  const { register, errors, mutation, onSubmit } = useRecordForm({
    item,
    schema: achievementSchema,
    defaults: { title: item?.title ?? '', category: item?.category ?? '', level: item?.level ?? '', date: item?.date?.slice(0, 10) ?? '', description: item?.description ?? '' },
    create: useCreateAchievement(),
    update: useUpdateAchievement(),
    onOpenChange,
  })

  return (
    <FormModal
      open
      onOpenChange={onOpenChange}
      title={item ? 'Edit achievement' : 'Add achievement'}
      description="Awards, ranks, scholarships and recognitions."
      onSubmit={onSubmit}
      submitLabel={item ? 'Save changes' : 'Add achievement'}
      isSubmitting={mutation.isPending}
      error={mutation.error}
      size="sm:max-w-2xl"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="ach-title" label="Achievement" error={errors.title?.message} className="sm:col-span-2">
          <Input className={inputClass} placeholder="e.g. First place, Smart India Hackathon" {...fieldProps('ach-title', errors.title)} {...register('title')} />
        </FormField>
        <FormField id="ach-category" label="Category" error={errors.category?.message}>
          <Select id="ach-category" options={ACHIEVEMENT_CATEGORIES} placeholder="Select category" error={errors.category} registration={register('category')} />
        </FormField>
        <FormField id="ach-level" label="Level" error={errors.level?.message}>
          <Select id="ach-level" options={ACHIEVEMENT_LEVELS} placeholder="Select level" error={errors.level} registration={register('level')} />
        </FormField>
        <FormField id="ach-date" label="Date" error={errors.date?.message}>
          <Input type="date" max={today()} className={inputClass} {...fieldProps('ach-date', errors.date)} {...register('date')} />
        </FormField>
        <FormField id="ach-description" label="Details (optional)" error={errors.description?.message} className="sm:col-span-2">
          <TextArea {...fieldProps('ach-description', errors.description)} {...register('description')} />
        </FormField>
      </div>
    </FormModal>
  )
}

export function ActivityFormModal({ item, onOpenChange }) {
  const { register, errors, mutation, onSubmit } = useRecordForm({
    item,
    schema: activitySchema,
    defaults: { title: item?.title ?? '', type: item?.type ?? '', organizer: item?.organizer ?? '', role: item?.role ?? '', date: item?.date?.slice(0, 10) ?? '' },
    create: useCreateActivity(),
    update: useUpdateActivity(),
    onOpenChange,
  })

  return (
    <FormModal
      open
      onOpenChange={onOpenChange}
      title={item ? 'Edit activity' : 'Add activity'}
      description="Events, drives, competitions and club work you took part in."
      onSubmit={onSubmit}
      submitLabel={item ? 'Save changes' : 'Add activity'}
      isSubmitting={mutation.isPending}
      error={mutation.error}
      size="sm:max-w-2xl"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="act-title" label="Activity" error={errors.title?.message} className="sm:col-span-2">
          <Input className={inputClass} placeholder="e.g. NSS blood donation camp" {...fieldProps('act-title', errors.title)} {...register('title')} />
        </FormField>
        <FormField id="act-type" label="Type" error={errors.type?.message}>
          <Select id="act-type" options={ACTIVITY_TYPES} placeholder="Select type" error={errors.type} registration={register('type')} />
        </FormField>
        <FormField id="act-date" label="Date" error={errors.date?.message}>
          <Input type="date" max={today()} className={inputClass} {...fieldProps('act-date', errors.date)} {...register('date')} />
        </FormField>
        <FormField id="act-organizer" label="Organised by" error={errors.organizer?.message}>
          <Input className={inputClass} {...fieldProps('act-organizer', errors.organizer)} {...register('organizer')} />
        </FormField>
        <FormField id="act-role" label="Your role" error={errors.role?.message}>
          <Input className={inputClass} placeholder="Participant, Volunteer, Organiser…" {...fieldProps('act-role', errors.role)} {...register('role')} />
        </FormField>
      </div>
    </FormModal>
  )
}
