import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FormField } from '@/components/common/FormField'
import { FormModal } from '@/components/common/FormModal'
import { TextArea } from '@/components/common/TextArea'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { useCreateAnnouncement, useUpdateAnnouncement } from '@/hooks/useAdmin'
import { ANNOUNCEMENT_CATEGORIES } from '@/lib/campus'
import { fieldProps } from '@/lib/fieldProps'

const announcementSchema = z.object({
  title: z.string().trim().min(5, 'Enter a headline of at least 5 characters.').max(120, 'Keep the headline under 120 characters.'),
  body: z.string().trim().max(600, 'Keep the details under 600 characters.'),
  category: z.enum(ANNOUNCEMENT_CATEGORIES, { error: 'Select a category.' }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose the announcement date.'),
})

const today = () => new Date().toLocaleDateString('en-CA')

function announcementDefaults(notice) {
  return {
    title: notice?.title ?? '',
    body: notice?.body ?? '',
    category: notice?.category ?? 'General',
    date: notice?.date?.slice(0, 10) ?? today(),
  }
}

/** Publish an announcement, or edit one when `notice` is given. */
export function AnnouncementFormModal({ notice, open, onOpenChange }) {
  const create = useCreateAnnouncement()
  const update = useUpdateAnnouncement()
  const mutation = notice ? update : create
  const { register, handleSubmit, formState } = useForm({ resolver: zodResolver(announcementSchema), defaultValues: announcementDefaults(notice) })
  const { errors } = formState

  const onSubmit = handleSubmit((values) => {
    const done = { onSuccess: () => onOpenChange(false) }
    if (notice) update.mutate({ id: notice.id, values }, done)
    else create.mutate(values, done)
  })

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={notice ? 'Edit announcement' : 'New announcement'}
      description="Announcements appear under Campus updates on every student's dashboard. The three most recent are shown."
      onSubmit={onSubmit}
      submitLabel={notice ? 'Save changes' : 'Publish'}
      isSubmitting={mutation.isPending}
      error={mutation.error}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="notice-title" label="Headline" error={errors.title?.message} className="sm:col-span-2">
          <Input className="bg-card h-11" placeholder="e.g. Mid-term examinations begin on 6 October" {...fieldProps('notice-title', errors.title)} {...register('title')} />
        </FormField>
        <FormField id="notice-category" label="Category" error={errors.category?.message} hint="Urgent notices get a red edge.">
          <NativeSelect size="lg" className="w-full" {...fieldProps('notice-category', errors.category, true)} {...register('category')}>
            {ANNOUNCEMENT_CATEGORIES.map((category) => (
              <NativeSelectOption key={category} value={category}>
                {category}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </FormField>
        <FormField id="notice-date" label="Date" error={errors.date?.message}>
          <Input type="date" className="bg-card h-11" {...fieldProps('notice-date', errors.date)} {...register('date')} />
        </FormField>
        <FormField id="notice-body" label="Details (optional)" error={errors.body?.message} className="sm:col-span-2">
          <TextArea rows={4} {...fieldProps('notice-body', errors.body)} {...register('body')} />
        </FormField>
      </div>
    </FormModal>
  )
}
