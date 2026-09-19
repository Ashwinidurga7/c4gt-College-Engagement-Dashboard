import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { FilePicker } from '@/components/common/FilePicker'
import { FormField } from '@/components/common/FormField'
import { FormModal } from '@/components/common/FormModal'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { CERTIFICATE_CATEGORIES, certificateSchema } from '@/features/student/portfolio/portfolioSchemas'
import { useUploadCertificate } from '@/hooks/usePortfolio'
import { fieldProps } from '@/lib/fieldProps'

export function UploadCertificateModal({ open, onOpenChange }) {
  const upload = useUploadCertificate()
  const { register, handleSubmit, control, formState } = useForm({
    resolver: zodResolver(certificateSchema),
    defaultValues: { title: '', category: '', issuedBy: '', date: '', file: null },
  })
  const { errors } = formState

  const onSubmit = handleSubmit((values) => upload.mutate(values, { onSuccess: () => onOpenChange(false) }))

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Upload certificate"
      description="Certificates from events, workshops and competitions. A faculty member verifies each upload."
      onSubmit={onSubmit}
      submitLabel="Upload"
      isSubmitting={upload.isPending}
      error={upload.error}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="crt-title" label="Title" error={errors.title?.message} className="sm:col-span-2">
          <Input className="bg-card h-11" placeholder="e.g. Hackathon Participation" {...fieldProps('crt-title', errors.title)} {...register('title')} />
        </FormField>
        <FormField id="crt-category" label="Category" error={errors.category?.message}>
          <NativeSelect size="lg" className="w-full" {...fieldProps('crt-category', errors.category)} {...register('category')}>
            <NativeSelectOption value="">Select category</NativeSelectOption>
            {CERTIFICATE_CATEGORIES.map((category) => (
              <NativeSelectOption key={category} value={category}>
                {category}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </FormField>
        <FormField id="crt-date" label="Date on certificate" error={errors.date?.message}>
          <Input type="date" className="bg-card h-11" {...fieldProps('crt-date', errors.date)} {...register('date')} />
        </FormField>
        <FormField id="crt-issued" label="Event or issuer" error={errors.issuedBy?.message} className="sm:col-span-2">
          <Input className="bg-card h-11" placeholder="e.g. AI Hackathon 2026" {...fieldProps('crt-issued', errors.issuedBy)} {...register('issuedBy')} />
        </FormField>
        <FormField id="crt-file" label="Certificate file" error={errors.file?.message} className="sm:col-span-2">
          <Controller
            name="file"
            control={control}
            render={({ field }) => (
              <FilePicker
                id="crt-file"
                value={field.value}
                onChange={field.onChange}
                accept="application/pdf,image/jpeg,image/png"
                hint="PDF, JPG or PNG, up to 5 MB"
                invalid={Boolean(errors.file)}
                describedBy={errors.file ? 'crt-file-error' : undefined}
              />
            )}
          />
        </FormField>
      </div>
    </FormModal>
  )
}
