import { zodResolver } from '@hookform/resolvers/zod'
import { School } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FormField } from '@/components/common/FormField'
import { SectionCard } from '@/components/common/SectionCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { useInstitutionSettings, useSaveInstitutionSettings } from '@/hooks/usePreview'
import { LOW_ATTENDANCE_THRESHOLD } from '@/lib/academics'
import { academicYearOptions } from '@/lib/colleges'
import { fieldProps } from '@/lib/fieldProps'

const schema = z
  .object({
    academicYear: z.string().min(1, 'Select the academic year.'),
    semesterStart: z.string().min(1, 'Select the start date.'),
    semesterEnd: z.string().min(1, 'Select the end date.'),
    feeDueDate: z.string().min(1, 'Select the fee due date.'),
  })
  .refine((values) => values.semesterEnd > values.semesterStart, { path: ['semesterEnd'], message: 'The semester must end after it starts.' })

/** Admin-only institution calendar. Saved to the preview layer until a settings endpoint exists. */
export function InstitutionSettings() {
  const query = useInstitutionSettings()
  const save = useSaveInstitutionSettings()
  const { register, handleSubmit, reset, formState } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { academicYear: '', semesterStart: '', semesterEnd: '', feeDueDate: '' },
  })
  const { errors, isDirty } = formState

  useEffect(() => {
    if (query.data) reset(query.data)
  }, [query.data, reset])

  return (
    <SectionCard title="Institution calendar" icon={School} description="Applies to KIET, KIET+ and KIEW.">
      <form onSubmit={handleSubmit((values) => save.mutate(values))} noValidate className="grid gap-4 sm:grid-cols-2">
        <FormField id="inst-year" label="Academic year" error={errors.academicYear?.message}>
          <NativeSelect size="lg" className="w-full" {...fieldProps('inst-year', errors.academicYear)} {...register('academicYear')}>
            {academicYearOptions().map((option) => (
              <NativeSelectOption key={option} value={option}>
                {option}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </FormField>
        <FormField id="inst-threshold" label="Attendance requirement" hint="Fixed by the university regulation.">
          <Input id="inst-threshold" className="bg-sunken h-11" value={`${LOW_ATTENDANCE_THRESHOLD}%`} readOnly aria-describedby="inst-threshold-hint" />
        </FormField>
        <FormField id="inst-start" label="Semester starts" error={errors.semesterStart?.message}>
          <Input type="date" className="bg-card h-11" {...fieldProps('inst-start', errors.semesterStart)} {...register('semesterStart')} />
        </FormField>
        <FormField id="inst-end" label="Semester ends" error={errors.semesterEnd?.message}>
          <Input type="date" className="bg-card h-11" {...fieldProps('inst-end', errors.semesterEnd)} {...register('semesterEnd')} />
        </FormField>
        <FormField id="inst-fee" label="Fee due date" error={errors.feeDueDate?.message}>
          <Input type="date" className="bg-card h-11" {...fieldProps('inst-fee', errors.feeDueDate)} {...register('feeDueDate')} />
        </FormField>
        <div className="flex items-end">
          <Button type="submit" size="lg" disabled={!isDirty || save.isPending}>
            {save.isPending ? 'Saving…' : 'Save calendar'}
          </Button>
        </div>
      </form>
    </SectionCard>
  )
}
