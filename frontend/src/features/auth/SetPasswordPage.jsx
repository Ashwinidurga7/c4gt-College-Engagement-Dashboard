import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { KeyRound, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { FormField } from '@/components/common/FormField'
import { FullPageLoader } from '@/components/common/FullPageStatus'
import { PasswordInput } from '@/components/common/PasswordInput'
import { Button } from '@/components/ui/button'
import { AuthLayout } from '@/features/auth/AuthLayout'
import { LoginErrorNotice } from '@/features/auth/LoginNotices'
import { setPasswordSchema } from '@/features/auth/authSchemas'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { fieldProps } from '@/lib/fieldProps'
import { dashboardPath } from '@/lib/roles'
import { authService } from '@/services/authService'

/**
 * Shown after signing in with an issued password (a student's roll number). The account
 * can do nothing else until it has its own password; the API enforces this too.
 */
export function SetPasswordPage() {
  useDocumentTitle('Set your password')
  const { status, user, passwordChanged, signOut } = useAuth()
  const navigate = useNavigate()
  const change = useMutation({ mutationFn: authService.changePassword })

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })
  const { errors } = formState

  if (status === 'loading') return <FullPageLoader />
  if (status !== 'authenticated') return <Navigate to="/login" replace />
  if (!user.mustChangePassword && !change.isSuccess) return <Navigate to={dashboardPath(user.role)} replace />

  function onSubmit(values) {
    change.mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      {
        onSuccess: (token) => {
          passwordChanged(token)
          toast.success('Your password is set. Use it the next time you sign in.')
          navigate(dashboardPath(user.role), { replace: true })
        },
      },
    )
  }

  return (
    <AuthLayout>
      <div className="bg-card shadow-lifted w-full max-w-md rounded-2xl border px-5 py-8 sm:px-8">
        <span className="bg-primary/10 text-primary mx-auto flex size-14 items-center justify-center rounded-full">
          <KeyRound className="size-7" strokeWidth={1.75} aria-hidden />
        </span>
        <h1 className="mt-5 text-center text-2xl font-bold tracking-tight">Set your password</h1>
        <p className="text-muted-foreground mt-2 text-center text-sm">
          Welcome, {user.name}. You signed in with the password you were given{user.rollNumber ? ' (your roll number)' : ''}. Choose your own
          to continue; your roll number will no longer work.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 flex flex-col gap-5">
          {change.error && <LoginErrorNotice message={change.error.message} />}

          <FormField id="current-password" label="Current password" error={errors.currentPassword?.message}>
            <PasswordInput
              autoComplete="current-password"
              placeholder={user.rollNumber ? 'Your roll number' : 'The password you signed in with'}
              {...fieldProps('current-password', errors.currentPassword)}
              {...register('currentPassword')}
            />
          </FormField>

          <FormField id="new-password" label="New password" error={errors.newPassword?.message} hint="At least 8 characters, with a letter and a number.">
            <PasswordInput autoComplete="new-password" {...fieldProps('new-password', errors.newPassword, true)} {...register('newPassword')} />
          </FormField>

          <FormField id="confirm-password" label="Confirm new password" error={errors.confirmPassword?.message}>
            <PasswordInput autoComplete="new-password" {...fieldProps('confirm-password', errors.confirmPassword)} {...register('confirmPassword')} />
          </FormField>

          <Button type="submit" size="lg" className="h-12 text-base" disabled={change.isPending}>
            {change.isPending ? (
              <>
                <Loader2 className="animate-spin" aria-hidden /> Saving…
              </>
            ) : (
              'Save password and continue'
            )}
          </Button>

          <Button type="button" variant="ghost" onClick={() => signOut()}>
            Sign out
          </Button>
        </form>
      </div>
    </AuthLayout>
  )
}
