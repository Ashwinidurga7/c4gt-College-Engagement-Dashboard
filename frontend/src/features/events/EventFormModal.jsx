import { zodResolver } from '@hookform/resolvers/zod'
import { ImagePlus, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FormField } from '@/components/common/FormField'
import { FormModal } from '@/components/common/FormModal'
import { TextArea } from '@/components/common/TextArea'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { EVENT_IMAGE_TYPES, MAX_EVENT_IMAGES, eventDefaults, eventSchema } from '@/features/events/eventSchema'
import { useCreateEvent, useUpdateEvent } from '@/hooks/useAdmin'
import { useClubs } from '@/hooks/useCampus'
import { EVENT_CATEGORIES } from '@/lib/campus'
import { COLLEGES } from '@/lib/colleges'
import { fieldProps } from '@/lib/fieldProps'

const inputClass = 'bg-card h-11'
const CLUB_QUERY = { page: 1, pageSize: 100, filters: {}, sort: { key: 'name', direction: 'asc' } }

/** First error among the photo list itself and each photo, for the single message under the picker. */
function imagesError(errors) {
  if (!errors) return undefined
  return errors.message ?? errors.root?.message ?? (Array.isArray(errors) ? errors.find(Boolean)?.message : undefined)
}

/** Photo grid with remove buttons; the first photo is the cover shown on event cards. */
function EventImagesField({ id, value, onChange, invalid, describedBy }) {
  const inputRef = useRef(null)
  const previews = useRef(new Set())

  // Object URLs made for previews are released when the form closes.
  useEffect(() => {
    const urls = previews.current
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [])

  function add(files) {
    const room = MAX_EVENT_IMAGES - value.length
    const added = Array.from(files ?? [])
      .slice(0, Math.max(room, 0))
      .map((file) => {
        const url = URL.createObjectURL(file)
        previews.current.add(url)
        return { url, caption: '', file }
      })
    if (added.length) onChange([...value, ...added])
    if (inputRef.current) inputRef.current.value = ''
  }

  function remove(index) {
    const image = value[index]
    if (image.file) {
      URL.revokeObjectURL(image.url)
      previews.current.delete(image.url)
    }
    onChange(value.filter((_, at) => at !== index))
  }

  return (
    <div
      className="flex flex-col gap-3"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        add(event.dataTransfer.files)
      }}
    >
      {value.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((image, index) => (
            <li key={image.url} className="bg-sunken relative overflow-hidden rounded-lg border">
              <img src={image.url} alt={image.file ? image.file.name : `Event photo ${index + 1}`} className="aspect-[4/3] w-full object-cover" />
              {index === 0 && <span className="bg-brand absolute bottom-1.5 left-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold text-white">Cover</span>}
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label={`Remove photo ${index + 1}`}
                className="focus-visible:ring-ring absolute top-1.5 right-1.5 inline-flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/75 focus-visible:ring-2 focus-visible:outline-none"
              >
                <X className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
      {value.length < MAX_EVENT_IMAGES && (
        <label
          htmlFor={id}
          className={`has-focus-visible:ring-ring flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border border-dashed px-4 py-5 text-center has-focus-visible:ring-2 ${invalid ? 'border-destructive' : 'border-input'}`}
        >
          <ImagePlus className="text-brand size-7" strokeWidth={1.5} aria-hidden />
          <span className="text-link text-sm font-semibold">Add photos</span>
          <span className="text-muted-foreground text-xs">
            Drag photos here or browse. JPG, PNG or WebP, up to 5 MB each, {MAX_EVENT_IMAGES - value.length} more allowed.
          </span>
          <input
            ref={inputRef}
            id={id}
            type="file"
            multiple
            accept={EVENT_IMAGE_TYPES.join(',')}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            onChange={(event) => add(event.target.files)}
            className="sr-only"
          />
        </label>
      )}
    </div>
  )
}

/** Create an event, or edit one when `event` is given. Admin only. */
export function EventFormModal({ event, open, onOpenChange }) {
  const create = useCreateEvent()
  const update = useUpdateEvent()
  const mutation = event ? update : create
  const clubs = useClubs(CLUB_QUERY)
  const { register, handleSubmit, control, formState, getValues, setValue } = useForm({ resolver: zodResolver(eventSchema), defaultValues: eventDefaults(event) })
  const { errors } = formState
  const photoError = imagesError(errors.images)
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
              <EventImagesField
                id="event-photos"
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
