import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FormField } from '@/components/common/FormField'
import { FormModal } from '@/components/common/FormModal'
import { TextArea } from '@/components/common/TextArea'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { NOTICE_CATEGORIES } from '@/features/exams/noticeCategories'
import { useSaveExamNotice } from '@/hooks/usePreview'
import { fieldProps } from '@/lib/fieldProps'

const COURSES = ['B.Tech', 'M.Tech', 'MBA', 'All']
const REGULATIONS = ['R20', 'R23', 'R24']
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8]
const EXAM_TYPES = ['Regular', 'Supplementary']
const date = /^\d{4}-\d{2}-\d{2}$/

const noticeSchema = z
  .object({
    title: z.string().trim().min(10, 'Enter the notice title as JNTUK words it.').max(200),
    category: z.enum(Object.keys(NOTICE_CATEGORIES), { error: 'Select the notice type.' }),
    course: z.enum(COURSES, { error: 'Select the course.' }),
    regulation: z.string(),
    semester: z.string(),
    examType: z.string(),
    publishedOn: z.string().regex(date, 'Choose the date JNTUK published it.'),
    deadline: z.string(),
    summary: z.string().trim().max(400, 'Keep the summary under 400 characters.'),
    sourceUrl: z.string().trim().refine((value) => /^https?:\/\/\S+$/.test(value), 'Enter the link to the official notice, starting with https://.'),
  })
  .refine((values) => !values.deadline || values.deadline >= values.publishedOn, { path: ['deadline'], message: 'The last date must be on or after the published date.' })

function noticeDefaults(notice) {
  return {
    title: notice?.title ?? '',
    category: notice?.category ?? '',
    course: notice?.course ?? 'B.Tech',
    regulation: notice?.regulation ?? '',
    semester: notice?.semester ? String(notice.semester) : '',
    examType: notice?.examType ?? '',
    publishedOn: notice?.publishedOn ?? new Date().toLocaleDateString('en-CA'),
    deadline: notice?.deadline ?? '',
    summary: notice?.summary ?? '',
    sourceUrl: notice?.sourceUrl ?? 'https://www.jntuk.edu.in/',
  }
}

function Select({ id, label, error, hint, registration, placeholder, options }) {
  return (
    <FormField id={id} label={label} error={error?.message} hint={hint}>
      <NativeSelect size="lg" className="w-full" {...fieldProps(id, error, Boolean(hint))} {...registration}>
        {placeholder !== undefined && <NativeSelectOption value="">{placeholder}</NativeSelectOption>}
        {options.map((option) => (
          <NativeSelectOption key={option.value} value={option.value}>
            {option.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </FormField>
  )
}

const asOptions = (values, label = (value) => value) => values.map((value) => ({ value: String(value), label: label(value) }))

/** Add a JNTUK examination notice, or edit one when `notice` is given. Admin only. */
export function NoticeFormModal({ notice, open, onOpenChange }) {
  const save = useSaveExamNotice()
  const { register, handleSubmit, formState } = useForm({ resolver: zodResolver(noticeSchema), defaultValues: noticeDefaults(notice) })
  const { errors } = formState

  const onSubmit = handleSubmit((values) => save.mutate({ ...values, id: notice?.id }, { onSuccess: () => onOpenChange(false) }))

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={notice ? 'Edit notice' : 'Add notice'}
      description="Students see a notice when it matches their course, regulation and semester, or under All notices."
      onSubmit={onSubmit}
      submitLabel={notice ? 'Save changes' : 'Add notice'}
      isSubmitting={save.isPending}
      error={save.error}
      size="sm:max-w-2xl"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="exam-notice-title" label="Title" error={errors.title?.message} className="sm:col-span-2">
          <TextArea rows={2} {...fieldProps('exam-notice-title', errors.title)} {...register('title')} />
        </FormField>
        <Select id="exam-notice-category" label="Type" error={errors.category} registration={register('category')} placeholder="Select type" options={Object.entries(NOTICE_CATEGORIES).map(([value, label]) => ({ value, label }))} />
        <Select id="exam-notice-course" label="Course" error={errors.course} hint="All means every course." registration={register('course')} options={asOptions(COURSES)} />
        <Select id="exam-notice-regulation" label="Regulation" error={errors.regulation} registration={register('regulation')} placeholder="All regulations" options={asOptions(REGULATIONS)} />
        <Select id="exam-notice-semester" label="Semester" error={errors.semester} registration={register('semester')} placeholder="All semesters" options={asOptions(SEMESTERS, (value) => `Semester ${value}`)} />
        <Select id="exam-notice-type" label="Examination" error={errors.examType} registration={register('examType')} placeholder="Not specific" options={asOptions(EXAM_TYPES)} />
        <FormField id="exam-notice-published" label="Published on" error={errors.publishedOn?.message}>
          <Input type="date" className="bg-card h-11" {...fieldProps('exam-notice-published', errors.publishedOn)} {...register('publishedOn')} />
        </FormField>
        <FormField id="exam-notice-deadline" label="Last date (optional)" error={errors.deadline?.message} hint="For fee payments and registrations.">
          <Input type="date" className="bg-card h-11" {...fieldProps('exam-notice-deadline', errors.deadline, true)} {...register('deadline')} />
        </FormField>
        <FormField id="exam-notice-url" label="Official notice link" error={errors.sourceUrl?.message}>
          <Input type="url" className="bg-card h-11" {...fieldProps('exam-notice-url', errors.sourceUrl)} {...register('sourceUrl')} />
        </FormField>
        <FormField id="exam-notice-summary" label="Summary (optional)" error={errors.summary?.message} className="sm:col-span-2">
          <TextArea rows={3} {...fieldProps('exam-notice-summary', errors.summary)} {...register('summary')} />
        </FormField>
      </div>
    </FormModal>
  )
}
