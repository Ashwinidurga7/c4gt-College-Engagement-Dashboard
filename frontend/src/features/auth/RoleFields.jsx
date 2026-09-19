import { FormField } from '@/components/common/FormField'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { academicYearOptions, SECTIONS, YEARS } from '@/lib/colleges'
import { fieldProps } from '@/lib/fieldProps'

function yearLabel(year) {
  return ['1st', '2nd', '3rd', '4th'][year - 1] + ' year'
}

/** Extra registration fields that only some roles need. */
export function RoleFields({ role, register, errors }) {
  if (role === 'faculty') {
    return (
      <fieldset className="sm:col-span-2" aria-describedby={errors.assignedYears ? 'reg-years-error' : undefined}>
        <legend className="text-heading mb-2 text-sm font-semibold">Years you teach</legend>
        <div className="flex flex-wrap gap-2">
          {YEARS.map((year) => (
            <label
              key={year}
              className="has-checked:border-primary has-checked:bg-accent has-focus-visible:ring-ring flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm has-focus-visible:ring-2"
            >
              <input type="checkbox" value={String(year)} className="accent-primary size-4" {...register('assignedYears')} />
              {yearLabel(year)}
            </label>
          ))}
        </div>
        {errors.assignedYears && (
          <p id="reg-years-error" role="alert" className="text-danger-text mt-1.5 text-xs font-medium">
            {errors.assignedYears.message}
          </p>
        )}
      </fieldset>
    )
  }

  if (role === 'hod') {
    return (
      <FormField id="reg-academic-year" label="Academic year" error={errors.academicYear?.message}>
        <NativeSelect size="lg" className="w-full" {...fieldProps('reg-academic-year', errors.academicYear)} {...register('academicYear')}>
          <NativeSelectOption value="">Select academic year</NativeSelectOption>
          {academicYearOptions().map((option) => (
            <NativeSelectOption key={option} value={option}>
              {option}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </FormField>
    )
  }

  if (role === 'ctpo') {
    return (
      <>
        <FormField id="reg-year" label="Class year" error={errors.year?.message}>
          <NativeSelect size="lg" className="w-full" {...fieldProps('reg-year', errors.year)} {...register('year')}>
            <NativeSelectOption value="">Select year</NativeSelectOption>
            {YEARS.map((year) => (
              <NativeSelectOption key={year} value={String(year)}>
                {yearLabel(year)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </FormField>
        <FormField id="reg-section" label="Section" error={errors.section?.message}>
          <NativeSelect size="lg" className="w-full" {...fieldProps('reg-section', errors.section)} {...register('section')}>
            <NativeSelectOption value="">Select section</NativeSelectOption>
            {SECTIONS.map((section) => (
              <NativeSelectOption key={section} value={section}>
                Section {section}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </FormField>
      </>
    )
  }

  return null
}
