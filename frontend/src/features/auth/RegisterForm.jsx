import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Mail, UserRound } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { FormField } from '@/components/common/FormField'
import { IconInput } from '@/components/common/IconInput'
import { PasswordInput } from '@/components/common/PasswordInput'
import { Button } from '@/components/ui/button'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { LoginErrorNotice } from '@/features/auth/LoginNotices'
import { RegisterRolePicker } from '@/features/auth/RegisterRolePicker'
import { RoleFields } from '@/features/auth/RoleFields'
import { registerSchema, toRegisterPayload } from '@/features/auth/authSchemas'
import { useRegisterMutation } from '@/hooks/useAuthMutations'
import { COLLEGES, DEPARTMENTS } from '@/lib/colleges'
import { fieldProps } from '@/lib/fieldProps'

const DEFAULT_VALUES = {
  role: 'student',
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  college: '',
  department: '',
  assignedYears: [],
  academicYear: '',
  year: '',
  section: '',
}

export function RegisterForm() {
  const navigate = useNavigate()
  const registration = useRegisterMutation()
  const { register, handleSubmit, control, formState } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: DEFAULT_VALUES,
  })
  const { errors } = formState
  const role = useWatch({ control, name: 'role' })

  function onSubmit(values) {
    registration.mutate(toRegisterPayload(values), {
      onSuccess: ({ approvalStatus }) => {
        if (approvalStatus === 'pending') {
          navigate('/awaiting-approval', { state: { role: values.role, email: values.email } })
        } else {
          toast.success('Account created. Sign in with your new credentials.')
          navigate('/login')
        }
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      {registration.error && <LoginErrorNotice message={registration.error.message} />}

      <RegisterRolePicker register={register} />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="reg-name" label="Full name" error={errors.name?.message}>
          <IconInput icon={UserRound} autoComplete="name" placeholder="e.g. B. Ashwini Durga" {...fieldProps('reg-name', errors.name)} {...register('name')} />
        </FormField>
        <FormField id="reg-email" label="Institutional email" error={errors.email?.message}>
          <IconInput icon={Mail} type="email" autoComplete="email" placeholder="yourname@kiet.edu" {...fieldProps('reg-email', errors.email)} {...register('email')} />
        </FormField>
        <FormField id="reg-password" label="Password" error={errors.password?.message} hint="At least 8 characters with a letter and a number.">
          <PasswordInput autoComplete="new-password" placeholder="Create a password" {...fieldProps('reg-password', errors.password, true)} {...register('password')} />
        </FormField>
        <FormField id="reg-confirm" label="Confirm password" error={errors.confirmPassword?.message}>
          <PasswordInput autoComplete="new-password" placeholder="Re-enter the password" {...fieldProps('reg-confirm', errors.confirmPassword)} {...register('confirmPassword')} />
        </FormField>
        <FormField id="reg-college" label="College" error={errors.college?.message}>
          <NativeSelect size="lg" className="w-full" {...fieldProps('reg-college', errors.college)} {...register('college')}>
            <NativeSelectOption value="">Select college</NativeSelectOption>
            {COLLEGES.map((college) => (
              <NativeSelectOption key={college} value={college}>
                {college}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </FormField>
        <FormField id="reg-department" label="Department" error={errors.department?.message}>
          <NativeSelect size="lg" className="w-full" {...fieldProps('reg-department', errors.department)} {...register('department')}>
            <NativeSelectOption value="">Select department</NativeSelectOption>
            {DEPARTMENTS.map((department) => (
              <NativeSelectOption key={department} value={department}>
                {department}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </FormField>
        <RoleFields role={role} register={register} errors={errors} />
      </div>

      <Button type="submit" size="lg" className="h-12 text-base" disabled={registration.isPending}>
        {registration.isPending ? (
          <>
            <Loader2 className="animate-spin" aria-hidden /> Creating account…
          </>
        ) : (
          'Create account'
        )}
      </Button>
    </form>
  )
}
