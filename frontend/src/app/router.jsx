import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { FullPageLoader } from '@/components/common/FullPageStatus'
import { GuestRoute } from '@/components/common/GuestRoute'
import { PlaceholderPage } from '@/components/common/PlaceholderPage'
import { ProtectedRoute } from '@/components/common/ProtectedRoute'
import { RootRedirect } from '@/components/common/RootRedirect'
import { AppShell } from '@/components/layout/AppShell'
import { navItemsFor } from '@/lib/navigation'
import { ROLE_LIST } from '@/lib/roles'

/** Lazily loads a named page export as a route component. */
function page(loader, name) {
  return async () => ({ Component: (await loader())[name] })
}

/**
 * Real pages replace PlaceholderPage phase by phase through this map, keyed "role/path".
 * Anything not listed renders the placeholder for its nav item.
 */
const PAGES = {}

function statusRoute(path, variant) {
  return {
    path,
    lazy: async () => {
      const { StatusPage: Component } = await import('@/features/auth/StatusPage')
      return { element: <Component variant={variant} /> }
    },
  }
}

function roleRoutes(role) {
  return {
    path: role,
    element: (
      <ProtectedRoute roles={[role]}>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      ...navItemsFor(role).map((item) => {
        const lazy = PAGES[`${role}/${item.path}`]
        return lazy ? { path: item.path, lazy } : { path: item.path, element: <PlaceholderPage item={item} /> }
      }),
      statusRoute('*', 'notFound'),
    ],
  }
}

export const router = createBrowserRouter([
  {
    // Pathless root so the first lazily loaded route has a loading screen.
    element: <Outlet />,
    hydrateFallbackElement: <FullPageLoader />,
    children: [
      { path: '/', element: <RootRedirect /> },
      {
        element: <GuestRoute />,
        children: [
          { path: '/login', lazy: page(() => import('@/features/auth/LoginPage'), 'LoginPage') },
          { path: '/register', lazy: page(() => import('@/features/auth/RegisterPage'), 'RegisterPage') },
        ],
      },
      { path: '/awaiting-approval', lazy: page(() => import('@/features/auth/AwaitingApprovalPage'), 'AwaitingApprovalPage') },
      statusRoute('/forbidden', 'forbidden'),
      ...ROLE_LIST.map(roleRoutes),
      statusRoute('*', 'notFound'),
    ],
  },
])
