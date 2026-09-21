import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FormField } from '@/components/common/FormField'
import { FormModal } from '@/components/common/FormModal'
import { Input } from '@/components/ui/input'
import { certificationSchema } from '@/features/student/portfolio/portfolioSchemas'
import { useCreateCertification, useUpdateCertification } from '@/hooks/usePortfolio'
import { fieldProps } from '@/lib/fieldProps'

const inputClass = 'bg-card h-11'

function defaults(item) {
  return {
    name: item?.name ?? '',
    issuer: item?.issuer ?? '',
    issueDate: item?.issueDate?.slice(0, 10) ?? '',
    expiryDate: item?.expiryDate?.slice(0, 10) ?? '',
    credentialId: item?.credentialId ?? '',
    credentialUrl: item?.credentialUrl ?? '',
  }
}

/** Add or edit a certification; `item` switches it to edit mode. */
export function CertificationFormModal({ item, open, onOpenChange }) {
  const create = useCreateCertification()
  const update = useUpdateCertification()
  const mutation = item ? update : create
  const { register, handleSubmit, formState } = useForm({ resolver: zodResolver(certificationSchema), defaultValues: defaults(item) })
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
      title={item ? 'Edit certification' : 'Add certification'}
      description="Online courses and professional certifications you have earned."
      onSubmit={onSubmit}
      submitLabel={item ? 'Save changes' : 'Add certification'}
      isSubmitting={mutation.isPending}
      error={mutation.error}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="cert-name" label="Certification name" error={errors.name?.message} className="sm:col-span-2">
          <Input className={inputClass} {...fieldProps('cert-name', errors.name)} {...register('name')} />
        </FormField>
        <FormField id="cert-issuer" label="Issued by" error={errors.issuer?.message} className="sm:col-span-2">
          <Input className={inputClass} placeholder="e.g. NPTEL, Coursera, AWS" {...fieldProps('cert-issuer', errors.issuer)} {...register('issuer')} />
        </FormField>
        <FormField id="cert-issue" label="Issue date" error={errors.issueDate?.message}>
          <Input type="date" className={inputClass} {...fieldProps('cert-issue', errors.issueDate)} {...register('issueDate')} />
        </FormField>
        <FormField id="cert-expiry" label="Expiry date (optional)" error={errors.expiryDate?.message}>
          <Input type="date" className={inputClass} {...fieldProps('cert-expiry', errors.expiryDate)} {...register('expiryDate')} />
        </FormField>
        <FormField id="cert-credential" label="Credential ID (optional)" error={errors.credentialId?.message}>
          <Input className={inputClass} {...fieldProps('cert-credential', errors.credentialId)} {...register('credentialId')} />
        </FormField>
        <FormField id="cert-url" label="Verification link (optional)" error={errors.credentialUrl?.message}>
          <Input type="url" className={inputClass} placeholder="https://" {...fieldProps('cert-url', errors.credentialUrl)} {...register('credentialUrl')} />
        </FormField>
      </div>
    </FormModal>
  )
}
