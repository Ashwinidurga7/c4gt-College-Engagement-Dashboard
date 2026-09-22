import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Landmark, Loader2, Mail } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FormField } from '@/components/common/FormField'
import { IconInput } from '@/components/common/IconInput'
import { PasswordInput } from '@/components/common/PasswordInput'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { DemoAccounts } from '@/features/auth/DemoAccounts'
import { ForgotPasswordDialog } from '@/features/auth/ForgotPasswordDialog'
import { LoginErrorNotice, PendingApprovalNotice, PortalMismatchNotice } from '@/features/auth/LoginNotices'
import { PortalSelector } from '@/features/auth/PortalSelector'
import { loginSchema } from '@/features/auth/authSchemas'
import { useAuth } from '@/hooks/useAuth'
import { useLoginMutation } from '@/hooks/useAuthMutations'
import { env } from '@/lib/env'
import { fieldProps } from '@/lib/fieldProps'
import { dashboardPath } from '@/lib/roles'

const PENDING_PATTERN = /pending|approv/i

export function LoginForm() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const login = useLoginMutation()
  const [mismatch, setMismatch] = useState(null)

  const { register, handleSubmit, control, setValue, formState } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false, portal: 'student' },
  })
  const { errors } = formState

  function complete(session, remember) {
    signIn(session, remember)
    const from = location.state?.from
    const target = from?.startsWith(`/${session.user.role}/`) ? from : dashboardPath(session.user.role)
    navigate(target, { replace: true })
  }

  function onSubmit(values) {
    setMismatch(null)
    login.mutate(
      { email: values.email, password: values.password },
      {
        onSuccess: (session) => {
          if (session.user.approvalStatus === 'pending') {
            navigate('/awaiting-approval', { state: { role: session.user.role, email: session.user.email } })
          } else if (session.user.role !== values.portal) {
            setMismatch({ session, remember: values.remember })
          } else {
            complete(session, values.remember)
          }
        },
      },
    )
  }

  const error = login.error
  const isPending = error?.status === 403 && PENDING_PATTERN.test(error.message)

  if (mismatch) {
    return (
      <PortalMismatchNotice
        role={mismatch.session.user.role}
        onContinue={() => complete(mismatch.session, mismatch.remember)}
        onCancel={() => {
          setMismatch(null)
          login.reset()
        }}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {error && (isPending ? <PendingApprovalNotice message={error.message} /> : <LoginErrorNotice message={error.message} />)}

      <FormField id="login-email" label="Institutional email" error={errors.email?.message}>
        <IconInput
          icon={Mail}
          type="email"
          autoComplete="username"
          inputMode="email"
          placeholder="yourname@kiet.edu"
          {...fieldProps('login-email', errors.email)}
          {...register('email')}
        />
      </FormField>

      <FormField id="login-password" label="Password" error={errors.password?.message}>
        <PasswordInput
          autoComplete="current-password"
          placeholder="Enter your password"
          {...fieldProps('login-password', errors.password)}
          {...register('password')}
        />
      </FormField>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Controller
            name="remember"
            control={control}
            render={({ field }) => (
              <Checkbox id="login-remember" checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
            )}
          />
          <Label htmlFor="login-remember" className="text-body text-sm font-normal">
            Remember me
          </Label>
        </div>
        <ForgotPasswordDialog />
      </div>

      <PortalSelector register={register} />

      <Button type="submit" size="lg" className="h-12 text-base" disabled={login.isPending}>
        {login.isPending ? (
          <>
            <Loader2 className="animate-spin" aria-hidden /> Signing in…
          </>
        ) : (
          <>
            Sign In <ArrowRight data-icon="inline-end" aria-hidden />
          </>
        )}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        Don't have an account yet?{' '}
        <Link to="/register" className="text-link font-semibold hover:underline">
          Create an account
        </Link>
      </p>

      <Link to="/about" className="text-link inline-flex items-center justify-center gap-1.5 self-center text-sm font-semibold hover:underline">
        <Landmark className="size-4" aria-hidden /> About the college
      </Link>

      {env.useMock && (
        <DemoAccounts
          onPick={(account) => {
            setValue('email', account.email, { shouldValidate: true })
            setValue('password', account.password, { shouldValidate: true })
            setValue('portal', account.role)
          }}
        />
      )}
    </form>
  )
}
