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
const PAGES = {
  'student/dashboard': page(() => import('@/features/student/StudentDashboardPage'), 'StudentDashboardPage'),
  'student/profile': page(() => import('@/features/student/ProfilePage'), 'ProfilePage'),
  'student/academic': page(() => import('@/features/student/AcademicPage'), 'AcademicPage'),
  'student/courses': page(() => import('@/features/student/CoursesPage'), 'CoursesPage'),
  'student/attendance': page(() => import('@/features/student/AttendancePage'), 'AttendancePage'),
  'student/academic-report': page(() => import('@/features/student/AcademicReportPage'), 'AcademicReportPage'),
  'student/portfolio': page(() => import('@/features/student/PortfolioPage'), 'PortfolioPage'),
  'student/clubs': page(() => import('@/features/clubs/ClubsPage'), 'ClubsPage'),
  'student/events': page(() => import('@/features/events/EventsPage'), 'EventsPage'),
  'student/notifications': page(() => import('@/features/notifications/NotificationsPage'), 'NotificationsPage'),
  'faculty/dashboard': page(() => import('@/features/faculty/FacultyDashboardPage'), 'FacultyDashboardPage'),
  'faculty/students': page(() => import('@/features/faculty/FacultyStudentsPage'), 'FacultyStudentsPage'),
  'faculty/certificates': page(() => import('@/features/faculty/CertificateQueuePage'), 'CertificateQueuePage'),
  'faculty/notifications': page(() => import('@/features/notifications/NotificationsPage'), 'NotificationsPage'),
  'admin/dashboard': page(() => import('@/features/admin/AdminDashboardPage'), 'AdminDashboardPage'),
  'admin/users': page(() => import('@/features/admin/AdminUsersPage'), 'AdminUsersPage'),
  'admin/approvals': page(() => import('@/features/admin/ApprovalsPage'), 'ApprovalsPage'),
  'admin/verifications': page(() => import('@/features/admin/VerificationsPage'), 'VerificationsPage'),
  'admin/clubs': page(() => import('@/features/admin/AdminClubsPage'), 'AdminClubsPage'),
  'admin/events': page(() => import('@/features/events/EventsPage'), 'EventsPage'),
  'hod/dashboard': page(() => import('@/features/hod/HodDashboardPage'), 'HodDashboardPage'),
  'hod/students': page(() => import('@/features/hod/HodStudentsPage'), 'HodStudentsPage'),
  'hod/attendance': page(() => import('@/features/hod/AttendanceAnalyticsPage'), 'AttendanceAnalyticsPage'),
  'hod/academic-report': page(() => import('@/features/hod/GradeDistributionPage'), 'GradeDistributionPage'),
  'hod/ctpo-approvals': page(() => import('@/features/hod/CtpoApprovalsPage'), 'CtpoApprovalsPage'),
  'ctpo/dashboard': page(() => import('@/features/ctpo/ClassDashboardPage'), 'ClassDashboardPage'),
  'ctpo/students': page(() => import('@/features/ctpo/SectionStudentsPage'), 'SectionStudentsPage'),
  'ctpo/attendance': page(() => import('@/features/ctpo/SectionAttendancePage'), 'SectionAttendancePage'),
  'ctpo/academic-report': page(() => import('@/features/ctpo/SectionReportPage'), 'SectionReportPage'),
}

/** Detail routes below a nav item, e.g. a single club. */
const clubDetail = { path: 'clubs/:clubId', lazy: page(() => import('@/features/clubs/ClubDetailPage'), 'ClubDetailPage') }
const DETAIL_ROUTES = {
  student: [clubDetail],
  admin: [clubDetail],
}

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
      ...(DETAIL_ROUTES[role] ?? []),
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
