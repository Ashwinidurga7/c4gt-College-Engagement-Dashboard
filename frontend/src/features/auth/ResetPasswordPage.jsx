import { useEffect, useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  AlertCircle,
  Check,
  CheckCircle2,
  KeyRound,
  Loader2,
  ShieldAlert,
} from 'lucide-react'
import { FormField } from '@/components/common/FormField'
import { PasswordInput } from '@/components/common/PasswordInput'
import { Button } from '@/components/ui/button'
import { AuthLayout } from '@/features/auth/AuthLayout'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useAuth } from '@/hooks/useAuth'
import { tokenStorage } from '@/lib/tokenStorage'
import { authService } from '@/services/authService'

export function ResetPasswordPage() {
  useDocumentTitle('Reset Password')
  const { signOut } = useAuth()
  const [searchParams] = useSearchParams()
  const token = (searchParams.get('token') || '').trim()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isValidatingToken, setIsValidatingToken] = useState(true)
  const [tokenError, setTokenError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formError, setFormError] = useState('')

  // 1. Isolate reset flow: completely purge any active session from memory and storage
  useEffect(() => {
    tokenStorage.clear()
    signOut()
  }, [signOut])

  // 2. Validate token on mount
  useEffect(() => {
    let isMounted = true

    async function checkToken() {
      if (!token) {
        setTokenError('No password reset token was provided in the link.')
        setIsValidatingToken(false)
        return
      }

      try {
        await authService.validateResetToken(token)
        if (isMounted) {
          setIsValidatingToken(false)
        }
      } catch (err) {
        if (isMounted) {
          setTokenError(
            err.message || 'This password reset link is invalid or has expired. Please request a new password reset link.'
          )
          setIsValidatingToken(false)
        }
      }
    }

    checkToken()
    return () => {
      isMounted = false
    }
  }, [token])

  // Password requirements evaluation
  const requirements = useMemo(() => {
    return [
      { id: 'length', label: 'Minimum 8 characters', met: newPassword.length >= 8 },
      { id: 'upper', label: 'At least one uppercase letter (A-Z)', met: /[A-Z]/.test(newPassword) },
      { id: 'lower', label: 'At least one lowercase letter (a-z)', met: /[a-z]/.test(newPassword) },
      { id: 'number', label: 'At least one number (0-9)', met: /\d/.test(newPassword) },
      { id: 'special', label: 'At least one special character (!@#$%^&*)', met: /[^A-Za-z0-9]/.test(newPassword) },
    ]
  }, [newPassword])

  const metCount = requirements.filter((r) => r.met).length
  const allRequirementsMet = metCount === requirements.length

  const strength = useMemo(() => {
    if (!newPassword) return { score: 0, label: '', color: 'bg-muted' }
    if (metCount <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500' }
    if (metCount === 3) return { score: 2, label: 'Fair', color: 'bg-amber-500' }
    if (metCount === 4) return { score: 3, label: 'Good', color: 'bg-blue-500' }
    return { score: 4, label: 'Strong', color: 'bg-emerald-500' }
  }, [newPassword, metCount])

  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword
  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')

    if (!token) {
      setFormError('Missing password reset token. Please request a new reset link.')
      return
    }

    if (!newPassword || !confirmPassword) {
      setFormError('Please enter and confirm your new password.')
      return
    }

    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match.')
      return
    }

    if (!allRequirementsMet) {
      setFormError('Please ensure your password satisfies all security requirements.')
      return
    }

    setIsSubmitting(true)
    try {
      await authService.resetPassword({
        token,
        new_password: newPassword,
        newPassword,
        confirmPassword,
      })
      setIsSuccess(true)
    } catch (err) {
      setFormError(
        err.message || 'This password reset link is invalid or has expired. Please request a new password reset link.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div className="bg-card shadow-lifted w-full max-w-md rounded-2xl border px-6 py-8 sm:px-9">
        {/* State 1: Verifying Reset Token */}
        {isValidatingToken ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Loader2 className="text-primary size-10 animate-spin" />
            <h2 className="text-heading mt-4 text-lg font-semibold">Validating reset link…</h2>
            <p className="text-muted-foreground mt-1 text-sm">Please wait while we verify your security token.</p>
          </div>
        ) : tokenError ? (
          /* State 2: Invalid or Expired Token */
          <div className="flex flex-col items-center text-center">
            <div className="bg-destructive/10 text-destructive mb-4 flex size-14 items-center justify-center rounded-2xl">
              <ShieldAlert className="size-8" />
            </div>
            <h1 className="text-heading text-2xl font-bold tracking-tight">Invalid or Expired Link</h1>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{tokenError}</p>

            <div className="mt-6 flex w-full flex-col gap-3">
              <Button asChild size="lg" className="w-full">
                <Link to="/forgot-password">Request New Reset Link</Link>
              </Button>
            </div>
          </div>
        ) : isSuccess ? (
          /* State 3: Password Reset Success */
          <div className="flex flex-col items-center text-center py-4">
            <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4 flex size-16 items-center justify-center rounded-2xl">
              <CheckCircle2 className="size-10" />
            </div>
            <h1 className="text-heading text-2xl font-bold tracking-tight sm:text-3xl">Password Updated</h1>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Your password has been successfully updated.
            </p>
          </div>
        ) : (
          /* State 4: Reset Password Form */
          <div>
            <div className="mb-6">
              <div className="bg-primary/10 text-primary mb-3 flex size-12 items-center justify-center rounded-xl">
                <KeyRound className="size-6" />
              </div>
              <h1 className="text-heading text-2xl font-bold tracking-tight sm:text-3xl">Reset Password</h1>
              <p className="text-muted-foreground mt-1.5 text-sm">
                Create a new, strong password for your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              {formError && (
                <div className="bg-destructive/10 border-destructive/20 text-destructive flex items-start gap-2.5 rounded-xl border p-3.5 text-sm">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <p className="leading-snug">{formError}</p>
                </div>
              )}

              {/* New Password */}
              <FormField id="reset-new-password" label="New Password">
                <PasswordInput
                  id="reset-new-password"
                  placeholder="Enter new secure password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={isSubmitting}
                />
              </FormField>

              {/* Password Strength Meter */}
              {newPassword && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Password strength:</span>
                    <span className="font-semibold text-heading">{strength.label}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-1.5 rounded-full transition-colors ${
                          step <= strength.score ? strength.color : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Confirm Password */}
              <FormField
                id="reset-confirm-password"
                label="Confirm Password"
                error={passwordsMismatch ? 'Passwords do not match.' : undefined}
              >
                <PasswordInput
                  id="reset-confirm-password"
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={isSubmitting}
                />
              </FormField>

              {/* Requirements Checklist */}
              <div className="bg-muted/40 rounded-xl border p-4">
                <p className="text-muted-foreground mb-2.5 text-xs font-semibold uppercase tracking-wider">
                  Password requirements:
                </p>
                <ul className="space-y-1.5 text-xs">
                  {requirements.map((req) => (
                    <li
                      key={req.id}
                      className={`flex items-center gap-2 transition-colors ${
                        req.met ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-muted-foreground'
                      }`}
                    >
                      {req.met ? (
                        <Check className="size-3.5 shrink-0" strokeWidth={2.5} />
                      ) : (
                        <div className="bg-muted-foreground/30 size-1.5 shrink-0 rounded-full mx-1" />
                      )}
                      <span>{req.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="h-12 w-full text-base font-semibold"
                disabled={isSubmitting || !allRequirementsMet || passwordsMismatch}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" aria-hidden /> Updating password…
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}
