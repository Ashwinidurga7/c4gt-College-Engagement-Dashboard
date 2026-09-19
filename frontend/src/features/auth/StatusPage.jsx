import { Compass, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AuthLayout } from '@/features/auth/AuthLayout'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { dashboardPath, roleLabel } from '@/lib/roles'

const VARIANTS = {
  forbidden: {
    icon: ShieldAlert,
    title: 'You do not have access to this page',
    tone: 'bg-danger-soft text-danger-text',
    message: (role) =>
      role
        ? `This page is not part of the ${roleLabel(role)} portal. If you think you should have access, contact your college admin.`
        : 'Sign in with an account that has access to this page.',
  },
  notFound: {
    icon: Compass,
    title: 'Page not found',
    tone: 'bg-tone-blue text-tone-blue-fg',
    message: () => 'The page you are looking for does not exist or has moved.',
  },
}

/** Full-page 403 and 404 states. */
export function StatusPage({ variant }) {
  const config = VARIANTS[variant]
  const { user } = useAuth()
  useDocumentTitle(config.title)
  const home = user ? dashboardPath(user.role) : '/login'

  return (
    <AuthLayout>
      <div className="bg-card shadow-lifted w-full max-w-md rounded-2xl border px-6 py-10 text-center sm:px-10">
        <span className={`mx-auto flex size-14 items-center justify-center rounded-full ${config.tone}`}>
          <config.icon className="size-7" strokeWidth={1.75} aria-hidden />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">{config.title}</h1>
        <p className="text-muted-foreground mt-2">{config.message(user?.role)}</p>
        <Button asChild size="lg" className="mt-8 h-11 w-full">
          <Link to={home}>{user ? 'Go to my dashboard' : 'Go to sign in'}</Link>
        </Button>
      </div>
    </AuthLayout>
  )
}
