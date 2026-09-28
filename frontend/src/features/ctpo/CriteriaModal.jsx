import { useState } from 'react'
import { toast } from 'sonner'
import { FormField } from '@/components/common/FormField'
import { FormModal } from '@/components/common/FormModal'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { useSaveDriveCriteria } from '@/hooks/usePreview'
import { DEPARTMENTS } from '@/lib/colleges'
import { fieldProps } from '@/lib/fieldProps'

const LIMITS = {
  minCgpa: { min: 0, max: 10, step: 0.1, label: 'Minimum CGPA' },
  maxActiveBacklogs: { min: 0, max: 10, step: 1, label: 'Active backlogs allowed' },
  minAttendance: { min: 0, max: 100, step: 1, label: 'Minimum attendance (%)' },
}

function validate(values) {
  const errors = {}
  Object.entries(LIMITS).forEach(([key, limit]) => {
    const value = Number(values[key])
    if (values[key] === '' || Number.isNaN(value) || value < limit.min || value > limit.max) errors[key] = `Enter a number from ${limit.min} to ${limit.max}.`
    else if (limit.step === 1 && !Number.isInteger(value)) errors[key] = 'Enter a whole number.'
  })
  return errors
}

/** Edits one company's eligibility rules. An empty branch list means every branch may apply. */
export function CriteriaModal({ drive, graduationYears, onClose }) {
  const save = useSaveDriveCriteria()
  const [values, setValues] = useState(() => ({
    ...drive.criteria,
    minCgpa: String(drive.criteria.minCgpa ?? 0),
    maxActiveBacklogs: String(drive.criteria.maxActiveBacklogs ?? 0),
    minAttendance: String(drive.criteria.minAttendance ?? 0),
    graduationYear: String(drive.criteria.graduationYear ?? ''),
  }))
  const [errors, setErrors] = useState({})
  const set = (key, value) => setValues((current) => ({ ...current, [key]: value }))

  function toggleBranch(code, checked) {
    set('branches', checked ? [...values.branches, code] : values.branches.filter((entry) => entry !== code))
  }

  function submit(event) {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) return
    const criteria = {
      ...values,
      minCgpa: Number(values.minCgpa),
      maxActiveBacklogs: Number(values.maxActiveBacklogs),
      minAttendance: Number(values.minAttendance),
      graduationYear: values.graduationYear ? Number(values.graduationYear) : null,
    }
    save.mutate({ id: drive.id, criteria }, { onSuccess: onClose, onError: (error) => toast.error(error.message) })
  }

  return (
    <FormModal
      open
      onOpenChange={(open) => !open && onClose()}
      title={`${drive.company} eligibility`}
      description="Students must meet every rule. Zero backlogs alone does not make a student eligible."
      onSubmit={submit}
      submitLabel="Save criteria"
      isSubmitting={save.isPending}
      size="sm:max-w-xl"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(LIMITS).map(([key, limit]) => (
          <FormField key={key} id={`criteria-${key}`} label={limit.label} error={errors[key]}>
            <Input
              type="number"
              inputMode="decimal"
              min={limit.min}
              max={limit.max}
              step={limit.step}
              className="h-11"
              value={values[key]}
              onChange={(event) => set(key, event.target.value)}
              {...fieldProps(`criteria-${key}`, errors[key])}
            />
          </FormField>
        ))}
        <FormField id="criteria-graduationYear" label="Graduation year">
          <NativeSelect id="criteria-graduationYear" size="lg" className="w-full" value={values.graduationYear} onChange={(event) => set('graduationYear', event.target.value)}>
            <NativeSelectOption value="">Any year</NativeSelectOption>
            {graduationYears.map((year) => (
              <NativeSelectOption key={year} value={String(year)}>
                {year}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </FormField>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="criteria-cleared" checked={values.allowClearedBacklogs} onCheckedChange={(checked) => set('allowClearedBacklogs', checked === true)} />
        <Label htmlFor="criteria-cleared" className="text-sm">
          Allow students who have cleared past backlogs
        </Label>
      </div>
      <fieldset className="flex flex-col gap-2">
        <legend className="text-heading mb-2 text-sm font-semibold">Eligible branches (none ticked means all)</legend>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {DEPARTMENTS.map((code) => (
            <div key={code} className="flex items-center gap-2">
              <Checkbox id={`criteria-branch-${code}`} checked={values.branches.includes(code)} onCheckedChange={(checked) => toggleBranch(code, checked === true)} />
              <Label htmlFor={`criteria-branch-${code}`} className="text-sm">
                {code}
              </Label>
            </div>
          ))}
        </div>
      </fieldset>
    </FormModal>
  )
}
