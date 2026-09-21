import { Navigate } from 'react-router-dom'
import { FullPageLoader } from '@/components/common/FullPageStatus'
import { useAuth } from '@/hooks/useAuth'
import { dashboardPath } from '@/lib/roles'

export function RootRedirect() {
  const { status, user } = useAuth()
  if (status === 'loading') return <FullPageLoader />
  return <Navigate to={status === 'authenticated' ? dashboardPath(user.role) : '/login'} replace />
}
