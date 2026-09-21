import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { FullPageError, FullPageLoader } from '@/components/common/FullPageStatus'
import { useAuth } from '@/hooks/useAuth'

/**
 * Requires a signed-in user whose role is in `roles`.
 * This only shapes navigation; the backend remains the authority on access.
 */
export function ProtectedRoute({ roles, children }) {
  const { status, user, error, retry, signOut } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <FullPageLoader />

  if (status === 'error') {
    return (
      <FullPageError
        title="We could not restore your session"
        message={error?.message ?? 'Please check your connection and try again.'}
        onRetry={() => retry()}
        onSignOut={() => signOut()}
      />
    )
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/forbidden" replace state={{ from: location.pathname }} />
  }

  return children ?? <Outlet />
}
