import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Loader2, Mail, Send } from 'lucide-react'
import { FormField } from '@/components/common/FormField'
import { IconInput } from '@/components/common/IconInput'
import { Button } from '@/components/ui/button'
import { AuthLayout } from '@/features/auth/AuthLayout'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { authService } from '@/services/authService'

export function ForgotPasswordPage() {
  useDocumentTitle('Forgot Password')

  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [result, setResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setResult(null)

    const trimmedEmail = email.trim().toLowerCase()
    if (!trimmedEmail) {
      setErrorMessage('Please enter your institutional email address.')
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address format (e.g. student@kiet.edu).')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await authService.forgotPassword(trimmedEmail)
      const msg =
        (typeof response === 'string' ? response : response?.message) ||
        'Password reset link has been sent to your registered email address.'
      setSuccessMessage(msg)
      setResult(typeof response === 'object' ? response : null)
    } catch (err) {
      if (err.status >= 500) {
        setErrorMessage('Unable to send reset email. Please try again later.')
      } else {
        setErrorMessage(err.message || 'Unable to process your request. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div className="bg-card shadow-lifted w-full max-w-md rounded-2xl border px-6 py-8 sm:px-9">
        <div className="mb-6">
          <Link
            to="/login"
            className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-xs font-medium transition-colors"
          >
            <ArrowLeft className="size-3.5" aria-hidden /> Back to sign in
          </Link>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Reset password</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Enter your registered email address and we'll send you a secure link to reset your account password.
          </p>
        </div>

        {successMessage ? (
          <div className="flex flex-col gap-5">
            <div className="bg-tone-green border-tone-green-border text-tone-green-fg flex items-start gap-3 rounded-lg border p-4 text-sm">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden />
              <div>
                <p className="font-semibold">Check your inbox</p>
                <p className="mt-1 leading-relaxed">{successMessage}</p>
                <p className="text-muted-foreground mt-2 text-xs">
                  The link will expire in 30 minutes. If you don't see it, be sure to check your spam folder.
                </p>
              </div>
            </div>

            <Button asChild size="lg" className="w-full">
              <Link to="/login">Return to Sign In</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {errorMessage && (
              <div className="bg-tone-red border-tone-red-border text-tone-red-fg rounded-lg border p-3 text-sm">
                {errorMessage}
              </div>
            )}

            <FormField id="forgot-email" label="Institutional email" error={undefined}>
              <IconInput
                id="forgot-email"
                icon={Mail}
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                placeholder="yourname@kiet.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </FormField>

            <Button
              type="submit"
              size="lg"
              className="h-12 w-full text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden /> Sending link…
                </>
              ) : (
                <>
                  Send Reset Link <Send className="ml-1.5 size-4" aria-hidden />
                </>
              )}
            </Button>

            <p className="text-muted-foreground mt-2 text-center text-sm">
              Remember your password?{' '}
              <Link to="/login" className="text-link font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </AuthLayout>
  )
}
