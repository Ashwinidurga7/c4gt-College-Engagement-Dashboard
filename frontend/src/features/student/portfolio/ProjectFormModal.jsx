import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FormField } from '@/components/common/FormField'
import { FormModal } from '@/components/common/FormModal'
import { TextArea } from '@/components/common/TextArea'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { projectSchema } from '@/features/student/portfolio/portfolioSchemas'
import { useCreateProject, useUpdateProject } from '@/hooks/usePortfolio'
import { fieldProps } from '@/lib/fieldProps'

const inputClass = 'bg-card h-11'

function defaults(item) {
  return {
    title: item?.title ?? '',
    description: item?.description ?? '',
    techStack: item?.techStack?.join(', ') ?? '',
    status: item?.status ?? 'ongoing',
    startDate: item?.startDate?.slice(0, 10) ?? '',
    endDate: item?.endDate?.slice(0, 10) ?? '',
    repoUrl: item?.repoUrl ?? '',
    liveUrl: item?.liveUrl ?? '',
  }
}

export function ProjectFormModal({ item, open, onOpenChange }) {
  const create = useCreateProject()
  const update = useUpdateProject()
  const mutation = item ? update : create
  const { register, handleSubmit, formState } = useForm({ resolver: zodResolver(projectSchema), defaultValues: defaults(item) })
  const { errors } = formState

  const onSubmit = handleSubmit((values) => {
    const done = { onSuccess: () => onOpenChange(false) }
    if (item) update.mutate({ id: item.id, values }, done)
    else create.mutate(values, done)
  })

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={item ? 'Edit project' : 'Add project'}
      description="Academic, club and personal projects. New projects may be reviewed by faculty."
      onSubmit={onSubmit}
      submitLabel={item ? 'Save changes' : 'Add project'}
      isSubmitting={mutation.isPending}
      error={mutation.error}
      size="sm:max-w-2xl"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="proj-title" label="Project title" error={errors.title?.message} className="sm:col-span-2">
          <Input className={inputClass} {...fieldProps('proj-title', errors.title)} {...register('title')} />
        </FormField>
        <FormField id="proj-description" label="Description" error={errors.description?.message} className="sm:col-span-2">
          <TextArea rows={3} {...fieldProps('proj-description', errors.description)} {...register('description')} />
        </FormField>
        <FormField id="proj-stack" label="Technologies" error={errors.techStack?.message} hint="Separate with commas, e.g. React, Node.js, MongoDB" className="sm:col-span-2">
          <Input className={inputClass} {...fieldProps('proj-stack', errors.techStack, true)} {...register('techStack')} />
        </FormField>
        <FormField id="proj-status" label="Status" error={errors.status?.message}>
          <NativeSelect size="lg" className="w-full" {...fieldProps('proj-status', errors.status)} {...register('status')}>
            <NativeSelectOption value="ongoing">Ongoing</NativeSelectOption>
            <NativeSelectOption value="completed">Completed</NativeSelectOption>
          </NativeSelect>
        </FormField>
        <div className="hidden sm:block" />
        <FormField id="proj-start" label="Start date" error={errors.startDate?.message}>
          <Input type="date" className={inputClass} {...fieldProps('proj-start', errors.startDate)} {...register('startDate')} />
        </FormField>
        <FormField id="proj-end" label="End date" error={errors.endDate?.message}>
          <Input type="date" className={inputClass} {...fieldProps('proj-end', errors.endDate)} {...register('endDate')} />
        </FormField>
        <FormField id="proj-repo" label="Repository link (optional)" error={errors.repoUrl?.message}>
          <Input type="url" className={inputClass} placeholder="https://github.com/…" {...fieldProps('proj-repo', errors.repoUrl)} {...register('repoUrl')} />
        </FormField>
        <FormField id="proj-live" label="Live link (optional)" error={errors.liveUrl?.message}>
          <Input type="url" className={inputClass} placeholder="https://" {...fieldProps('proj-live', errors.liveUrl)} {...register('liveUrl')} />
        </FormField>
      </div>
    </FormModal>
  )
}
