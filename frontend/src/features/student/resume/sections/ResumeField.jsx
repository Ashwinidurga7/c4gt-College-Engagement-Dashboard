import { FormField } from '@/components/common/FormField'
import { TextArea } from '@/components/common/TextArea'
import { Input } from '@/components/ui/input'
import { fieldProps } from '@/lib/fieldProps'

/** Labelled text input (or textarea) for the resume editor, wired for screen readers. */
export function ResumeField({ id, label, value, onChange, error, hint, multiline = false, rows = 3, className, ...inputProps }) {
  const Control = multiline ? TextArea : Input
  return (
    <FormField id={id} label={label} error={error} hint={hint} className={className}>
      <Control
        {...fieldProps(id, error, hint)}
        {...inputProps}
        rows={multiline ? rows : undefined}
        className={multiline ? undefined : 'bg-card h-10'}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
      />
    </FormField>
  )
}
