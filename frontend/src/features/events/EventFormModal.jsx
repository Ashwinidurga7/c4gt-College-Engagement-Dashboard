import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormField } from '@/components/common/FormField'
import { FormModal } from '@/components/common/FormModal'
import { PhotoListField } from '@/components/common/PhotoListField'
import { TextArea } from '@/components/common/TextArea'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { MAX_EVENT_IMAGES, eventDefaults, eventSchema } from '@/features/events/eventSchema'
import { useCreateEvent, useUpdateEvent } from '@/hooks/useAdmin'
import { useClubs } from '@/hooks/useCampus'
import { EVENT_CATEGORIES } from '@/lib/campus'
import { COLLEGES } from '@/lib/colleges'
import { fieldProps } from '@/lib/fieldProps'
import { photoListError } from '@/lib/photos'

const inputClass = 'bg-card h-11'
const CLUB_QUERY = { page: 1, pageSize: 100, filters: {}, sort: { key: 'name', direction: 'asc' } }

/** Create an event, or edit one when `event` is given. Admin only. */
export function EventFormModal({ event, open, onOpenChange }) {
  const create = useCreateEvent()
  const update = useUpdateEvent()
  const mutation = event ? update : create
  const clubs = useClubs(CLUB_QUERY)
  const { register, handleSubmit, control, formState, getValues, setValue } = useForm({ resolver: zodResolver(eventSchema), defaultValues: eventDefaults(event) })
  const { errors } = formState
  const photoError = photoListError(errors.images)
  const clubOptions = clubs.data?.items

  // The club options load after the form, so the saved club is selected again once they arrive.
  useEffect(() => {
    if (clubOptions) setValue('clubId', getValues('clubId'))
  }, [clubOptions, getValues, setValue])

  const onSubmit = handleSubmit((values) => {
    const done = { onSuccess: () => onOpenChange(false) }
    if (event) update.mutate({ id: event.id, values }, done)
    else create.mutate(values, done)
  })

  // Picking a club fills in the organiser when it is still empty.
  const clubField = register('clubId', {
    onChange: (change) => {
      const club = clubs.data?.items.find((item) => item.id === change.target.value)
      if (club && !getValues('organizer').trim()) setValue('organizer', club.name, { shouldValidate: true })
    },
  })

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={event ? `Edit ${event.title}` : 'Create event'}
      description={event ? 'Changes are visible to everyone immediately.' : 'The event is listed for students and staff as soon as it is created.'}
      onSubmit={onSubmit}
      submitLabel={event ? 'Save changes' : 'Create event'}
      isSubmitting={mutation.isPending}
      error={mutation.error}
      size="sm:max-w-2xl"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="event-title" label="Title" error={errors.title?.message} className="sm:col-span-2">
          <Input className={inputClass} placeholder="e.g. C4GT Hackathon 2026" {...fieldProps('event-title', errors.title)} {...register('title')} />
        </FormField>
        <FormField id="event-form-category" label="Category" error={errors.category?.message}>
          <NativeSelect size="lg" className="w-full" {...fieldProps('event-form-category', errors.category)} {...register('category')}>
            <NativeSelectOption value="">Select category</NativeSelectOption>
            {EVENT_CATEGORIES.map((category) => (
              <NativeSelectOption key={category} value={category}>
                {category}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </FormField>
        <FormField id="event-form-college" label="College" error={errors.college?.message}>
          <NativeSelect size="lg" className="w-full" {...fieldProps('event-form-college', errors.college)} {...register('college')}>
            <NativeSelectOption value="">All colleges</NativeSelectOption>
            {COLLEGES.map((college) => (
              <NativeSelectOption key={college} value={college}>
                {college}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </FormField>
        <FormField id="event-club" label="Organising club (optional)" error={errors.clubId?.message} hint="The event also shows on the club's page.">
          <NativeSelect size="lg" className="w-full" {...fieldProps('event-club', errors.clubId, true)} {...clubField}>
            <NativeSelectOption value="">No club</NativeSelectOption>
            {clubs.data?.items.map((club) => (
              <NativeSelectOption key={club.id} value={club.id}>
                {club.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </FormField>
        <FormField id="event-organizer" label="Organiser" error={errors.organizer?.message}>
          <Input className={inputClass} placeholder="e.g. C4GT or CSE Department" {...fieldProps('event-organizer', errors.organizer)} {...register('organizer')} />
        </FormField>
        <FormField id="event-date" label="Date" error={errors.date?.message}>
          <Input type="date" className={inputClass} {...fieldProps('event-date', errors.date)} {...register('date')} />
        </FormField>
        <FormField id="event-deadline" label="Registration closes (optional)" error={errors.registrationDeadline?.message}>
          <Input type="date" className={inputClass} {...fieldProps('event-deadline', errors.registrationDeadline)} {...register('registrationDeadline')} />
        </FormField>
        <FormField id="event-start" label="Starts (optional)" error={errors.startTime?.message}>
          <Input type="time" className={inputClass} {...fieldProps('event-start', errors.startTime)} {...register('startTime')} />
        </FormField>
        <FormField id="event-end" label="Ends (optional)" error={errors.endTime?.message}>
          <Input type="time" className={inputClass} {...fieldProps('event-end', errors.endTime)} {...register('endTime')} />
        </FormField>
        <FormField id="event-venue" label="Venue" error={errors.venue?.message} className="sm:col-span-2">
          <Input className={inputClass} placeholder="e.g. Seminar Hall, KIET" {...fieldProps('event-venue', errors.venue)} {...register('venue')} />
        </FormField>
        <FormField id="event-description" label="Description" error={errors.description?.message} className="sm:col-span-2">
          <TextArea rows={4} {...fieldProps('event-description', errors.description)} {...register('description')} />
        </FormField>
        <FormField id="event-photos" label="Photos (optional)" error={photoError} hint="The first photo is the cover everyone sees on the event." className="sm:col-span-2">
          <Controller
            name="images"
            control={control}
            render={({ field }) => (
              <PhotoListField
                id="event-photos"
                max={MAX_EVENT_IMAGES}
                altPrefix="Event photo"
                value={field.value}
                onChange={field.onChange}
                invalid={Boolean(photoError)}
                describedBy={photoError ? 'event-photos-error' : 'event-photos-hint'}
              />
            )}
          />
        </FormField>
      </div>
    </FormModal>
  )
}
