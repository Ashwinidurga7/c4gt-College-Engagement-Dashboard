import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { FormField } from '@/components/common/FormField'
import { TextArea } from '@/components/common/TextArea'
import { fieldProps } from '@/lib/fieldProps'
import { formatDate } from '@/lib/formatters'

/**
 * Confirms a verify or reject decision. Rejection needs a reason so the student knows
 * what to fix.
 */
export function ReviewCertificateDialog({ review, mutation, onClose }) {
  const [remarks, setRemarks] = useState('')
  const [error, setError] = useState(null)
  const { certificate, decision } = review
  const rejecting = decision === 'rejected'

  function confirm() {
    if (rejecting && remarks.trim().length < 5) {
      setError('Explain why in at least 5 characters so the student can fix it.')
      return
    }
    mutation.mutate(
      { id: certificate.id, status: decision, remarks: rejecting ? remarks.trim() : undefined },
      { onSuccess: onClose, onError: (err) => setError(err.message) },
    )
  }

  return (
    <ConfirmDialog
      open
      onOpenChange={(open) => !open && onClose()}
      tone={rejecting ? 'danger' : 'primary'}
      title={rejecting ? 'Reject this certificate?' : 'Verify this certificate?'}
      description={`${certificate.title} from ${certificate.issuedBy ?? 'an unknown issuer'} (${formatDate(certificate.date)}), uploaded by ${certificate.student?.name ?? 'a student'}.`}
      confirmLabel={rejecting ? 'Reject' : 'Verify'}
      pendingLabel={rejecting ? 'Rejecting…' : 'Verifying…'}
      isPending={mutation.isPending}
      onConfirm={confirm}
    >
      {rejecting && (
        <FormField id="review-remarks" label="Reason for rejection" error={error}>
          <TextArea
            rows={3}
            value={remarks}
            onChange={(event) => {
              setRemarks(event.target.value)
              setError(null)
            }}
            placeholder="e.g. The certificate image is unreadable."
            {...fieldProps('review-remarks', error)}
          />
        </FormField>
      )}
      {!rejecting && error && (
        <p role="alert" className="text-danger-text text-sm">
          {error}
        </p>
      )}
    </ConfirmDialog>
  )
}
