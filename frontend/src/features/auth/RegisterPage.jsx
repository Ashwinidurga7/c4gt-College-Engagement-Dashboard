import { Link } from 'react-router-dom'
import { AuthLayout } from '@/features/auth/AuthLayout'
import { RegisterForm } from '@/features/auth/RegisterForm'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export function RegisterPage() {
  useDocumentTitle('Create account')

  return (
    <AuthLayout>
      <div className="bg-card shadow-lifted w-full max-w-2xl rounded-2xl border px-5 py-8 sm:px-10">
        <div className="mb-7">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Create your account</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Students get access right away. Faculty and HOD accounts are approved by the Admin, and CTPO accounts by the
            HOD of your department.
          </p>
        </div>
        <RegisterForm />
        <p className="text-muted-foreground mt-6 text-center text-sm">
          Already registered?{' '}
          <Link to="/login" className="text-link font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
