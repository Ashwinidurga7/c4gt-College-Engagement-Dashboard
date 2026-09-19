import { zodResolver } from '@hookform/resolvers/zod'
import { IndianRupee } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { FormField } from '@/components/common/FormField'
import { FormModal } from '@/components/common/FormModal'
import { IconInput } from '@/components/common/IconInput'
import { TextArea } from '@/components/common/TextArea'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { INTERNSHIP_MODES, internshipSchema } from '@/features/student/portfolio/portfolioSchemas'
import { useCreateInternship } from '@/hooks/usePortfolio'
import { fieldProps } from '@/lib/fieldProps'

const inputClass = 'bg-card h-11'

export function InternshipFormModal({ open, onOpenChange }) {
  const create = useCreateInternship()
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(internshipSchema),
    defaultValues: { company: '', role: '', mode: '', startDate: '', endDate: '', stipend: '', description: '' },
  })
  const { errors } = formState

  const onSubmit = handleSubmit((values) => create.mutate(values, { onSuccess: () => onOpenChange(false) }))

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add internship"
      description="Internships cannot be edited after saving, so check the details before adding."
      onSubmit={onSubmit}
      submitLabel="Add internship"
      isSubmitting={create.isPending}
      error={create.error}
      size="sm:max-w-2xl"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="intern-company" label="Company" error={errors.company?.message}>
          <Input className={inputClass} {...fieldProps('intern-company', errors.company)} {...register('company')} />
        </FormField>
        <FormField id="intern-role" label="Role" error={errors.role?.message}>
          <Input className={inputClass} placeholder="e.g. Web Development Intern" {...fieldProps('intern-role', errors.role)} {...register('role')} />
        </FormField>
        <FormField id="intern-mode" label="Work mode" error={errors.mode?.message}>
          <NativeSelect size="lg" className="w-full" {...fieldProps('intern-mode', errors.mode)} {...register('mode')}>
            <NativeSelectOption value="">Select mode</NativeSelectOption>
            {INTERNSHIP_MODES.map((mode) => (
              <NativeSelectOption key={mode} value={mode}>
                {mode}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </FormField>
        <FormField id="intern-stipend" label="Monthly stipend (optional)" error={errors.stipend?.message}>
          <IconInput icon={IndianRupee} inputMode="numeric" placeholder="0" {...fieldProps('intern-stipend', errors.stipend)} {...register('stipend')} />
        </FormField>
        <FormField id="intern-start" label="Start date" error={errors.startDate?.message}>
          <Input type="date" className={inputClass} {...fieldProps('intern-start', errors.startDate)} {...register('startDate')} />
        </FormField>
        <FormField id="intern-end" label="End date" error={errors.endDate?.message}>
          <Input type="date" className={inputClass} {...fieldProps('intern-end', errors.endDate)} {...register('endDate')} />
        </FormField>
        <FormField id="intern-description" label="What did you work on? (optional)" error={errors.description?.message} className="sm:col-span-2">
          <TextArea {...fieldProps('intern-description', errors.description)} {...register('description')} />
        </FormField>
      </div>
    </FormModal>
  )
}
