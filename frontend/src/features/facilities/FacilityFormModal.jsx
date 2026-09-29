import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { FormField } from '@/components/common/FormField'
import { FormModal } from '@/components/common/FormModal'
import { PhotoListField } from '@/components/common/PhotoListField'
import { TextArea } from '@/components/common/TextArea'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { useSaveFacility } from '@/hooks/usePreview'
import { FACILITY_CATEGORIES } from '@/lib/campus'
import { fieldProps } from '@/lib/fieldProps'
import { photoDefaults, photoListError, photoListSchema } from '@/lib/photos'

const MAX_FACILITY_PHOTOS = 6
const WEEK = [
  { value: '1', label: 'Mon' },
  { value: '2', label: 'Tue' },
  { value: '3', label: 'Wed' },
  { value: '4', label: 'Thu' },
  { value: '5', label: 'Fri' },
  { value: '6', label: 'Sat' },
  { value: '0', label: 'Sun' },
]
const time = /^\d{2}:\d{2}$/

const facilitySchema = z
  .object({
    name: z.string().trim().min(2, 'Enter the facility name.').max(80),
    category: z.enum(FACILITY_CATEGORIES, { error: 'Select a category.' }),
    description: z.string().trim().max(400, 'Keep the description under 400 characters.'),
    details: z.string().max(1000, 'Keep the details under 1000 characters.'),
    location: z.string().trim().min(2, 'Enter where the facility is.').max(100),
    contact: z.string().trim().min(5, 'Enter a contact number.').max(40),
    alwaysOpen: z.boolean(),
    opens: z.string(),
    closes: z.string(),
    // Checkboxes give a string for one tick and an array for several.
    days: z.preprocess((value) => (Array.isArray(value) ? value : value ? [value] : []), z.array(z.string())),
    photos: photoListSchema(MAX_FACILITY_PHOTOS),
  })
  .superRefine((values, context) => {
    if (values.alwaysOpen) return
    if (!time.test(values.opens)) context.addIssue({ code: 'custom', path: ['opens'], message: 'Enter the opening time.' })
    if (!time.test(values.closes)) context.addIssue({ code: 'custom', path: ['closes'], message: 'Enter the closing time.' })
    else if (time.test(values.opens) && values.closes <= values.opens) context.addIssue({ code: 'custom', path: ['closes'], message: 'Closing must be after opening.' })
    if (values.days.length === 0) context.addIssue({ code: 'custom', path: ['days'], message: 'Choose the days it is open.' })
  })

function facilityDefaults(facility) {
  return {
    name: facility?.name ?? '',
    category: facility?.category ?? '',
    description: facility?.description ?? '',
    details: facility?.details?.join('\n') ?? '',
    location: facility?.location ?? '',
    contact: facility?.contact ?? '',
    alwaysOpen: facility ? !facility.opens : false,
    opens: facility?.opens ?? '09:00',
    closes: facility?.closes ?? '17:00',
    days: (facility?.days ?? [1, 2, 3, 4, 5, 6]).map(String),
    photos: photoDefaults(facility?.photos),
  }
}

/** Add a facility, or edit one when `facility` is given. Admin only. */
export function FacilityFormModal({ facility, open, onOpenChange }) {
  const save = useSaveFacility()
  const { register, handleSubmit, control, formState } = useForm({ resolver: zodResolver(facilitySchema), defaultValues: facilityDefaults(facility) })
  const { errors } = formState
  const alwaysOpen = useWatch({ control, name: 'alwaysOpen' })
  const photoError = photoListError(errors.photos)

  const onSubmit = handleSubmit((values) => save.mutate({ ...values, id: facility?.id }, { onSuccess: () => onOpenChange(false) }))

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={facility ? `Edit ${facility.name}` : 'Add facility'}
      description="Students and staff see these details on the Facilities page."
      onSubmit={onSubmit}
      submitLabel={facility ? 'Save changes' : 'Add facility'}
      isSubmitting={save.isPending}
      error={save.error}
      size="sm:max-w-2xl"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="facility-name" label="Name" error={errors.name?.message}>
          <Input className="bg-card h-11" placeholder="e.g. Central Library" {...fieldProps('facility-name', errors.name)} {...register('name')} />
        </FormField>
        <FormField id="facility-category" label="Category" error={errors.category?.message}>
          <NativeSelect size="lg" className="w-full" {...fieldProps('facility-category', errors.category)} {...register('category')}>
            <NativeSelectOption value="">Select category</NativeSelectOption>
            {FACILITY_CATEGORIES.map((category) => (
              <NativeSelectOption key={category} value={category}>
                {category}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </FormField>
        <FormField id="facility-location" label="Location" error={errors.location?.message}>
          <Input className="bg-card h-11" placeholder="e.g. Block A, ground floor" {...fieldProps('facility-location', errors.location)} {...register('location')} />
        </FormField>
        <FormField id="facility-contact" label="Contact number" error={errors.contact?.message}>
          <Input type="tel" className="bg-card h-11" {...fieldProps('facility-contact', errors.contact)} {...register('contact')} />
        </FormField>
        <FormField id="facility-description" label="Description (optional)" error={errors.description?.message} className="sm:col-span-2">
          <TextArea rows={3} {...fieldProps('facility-description', errors.description)} {...register('description')} />
        </FormField>
        <FormField id="facility-details" label="Key points (optional)" error={errors.details?.message} hint="One per line, e.g. Borrow with your college ID card." className="sm:col-span-2">
          <TextArea rows={3} {...fieldProps('facility-details', errors.details, true)} {...register('details')} />
        </FormField>
        <fieldset className="flex flex-col gap-3 sm:col-span-2">
          <legend className="text-heading mb-2 text-sm font-semibold">Opening hours</legend>
          <label className="flex w-fit cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" className="accent-primary size-4" {...register('alwaysOpen')} />
            Available at all hours
          </label>
          {!alwaysOpen && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField id="facility-opens" label="Opens" error={errors.opens?.message}>
                  <Input type="time" className="bg-card h-11" {...fieldProps('facility-opens', errors.opens)} {...register('opens')} />
                </FormField>
                <FormField id="facility-closes" label="Closes" error={errors.closes?.message}>
                  <Input type="time" className="bg-card h-11" {...fieldProps('facility-closes', errors.closes)} {...register('closes')} />
                </FormField>
              </div>
              <div role="group" aria-label="Open on" aria-describedby={errors.days ? 'facility-days-error' : undefined} className="flex flex-wrap gap-2">
                {WEEK.map((day) => (
                  <label
                    key={day.value}
                    className="has-checked:border-primary has-checked:bg-accent has-focus-visible:ring-ring flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm has-focus-visible:ring-2"
                  >
                    <input type="checkbox" value={day.value} className="accent-primary size-4" {...register('days')} />
                    {day.label}
                  </label>
                ))}
              </div>
              {errors.days && (
                <p id="facility-days-error" role="alert" className="text-danger-text text-xs font-medium">
                  {errors.days.message}
                </p>
              )}
            </>
          )}
        </fieldset>
        <FormField id="facility-photos" label="Photos (optional)" error={photoError} hint="The first photo is shown on the facility's card." className="sm:col-span-2">
          <Controller
            name="photos"
            control={control}
            render={({ field }) => (
              <PhotoListField
                id="facility-photos"
                value={field.value}
                onChange={field.onChange}
                max={MAX_FACILITY_PHOTOS}
                altPrefix="Facility photo"
                invalid={Boolean(photoError)}
                describedBy={photoError ? 'facility-photos-error' : 'facility-photos-hint'}
              />
            )}
          />
        </FormField>
      </div>
    </FormModal>
  )
}
