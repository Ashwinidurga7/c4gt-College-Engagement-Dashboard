import { Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useAuth } from '@/hooks/useAuth'
import { findNavItem } from '@/lib/navigation'
import { dashboardPath, roleLabel } from '@/lib/roles'

export function AppBreadcrumb() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const current = findNavItem(user.role, pathname)
  const onDashboard = current?.path === 'dashboard'

  return (
    <Breadcrumb className="mb-5">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={dashboardPath(user.role)} className="inline-flex items-center gap-1.5">
              <Home className="size-3.5" aria-hidden />
              {roleLabel(user.role)}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {current && !onDashboard && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{current.label}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
