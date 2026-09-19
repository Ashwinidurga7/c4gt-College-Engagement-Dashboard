import { Navigate, Outlet } from 'react-router-dom'
import { FullPageLoader } from '@/components/common/FullPageStatus'
import { useAuth } from '@/hooks/useAuth'
import { dashboardPath } from '@/lib/roles'

/** Pages for signed-out visitors (login, registration). Signed-in users go to their dashboard. */
export function GuestRoute() {
  const { status, user } = useAuth()

  if (status === 'loading') return <FullPageLoader />
  if (status === 'authenticated') return <Navigate to={dashboardPath(user.role)} replace />

  return <Outlet />
}
