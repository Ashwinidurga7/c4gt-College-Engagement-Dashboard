import React, { useEffect, useState, createContext, useContext } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { RealtimeProvider } from '../../contexts/RealtimeContext'

export const LayoutContext = createContext({
  isCollapsed: false,
  isMobileOpen: false,
  toggleCollapse: () => {},
  toggleMobile: () => {},
  closeMobile: () => {},
})

export function useLayout() {
  return useContext(LayoutContext)
}

export default function DashboardLayout({ children, role }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('kiet_sidebar_collapsed') === 'true'
    } catch {
      return false
    }
  })
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) navigate('/')
  }, [user, navigate])

  // Protect role-based routes
  useEffect(() => {
    if (user && role) {
      const allowedRoles = Array.isArray(role) ? role : [role]
      const userRoleLower = String(user.role).toLowerCase()
      // HOD and Admin have administrative access to faculty views
      const isAllowed = allowedRoles.some((r) => {
        const rLower = String(r).toLowerCase()
        return (
          userRoleLower === rLower ||
          (userRoleLower === 'hod' && rLower === 'faculty') ||
          userRoleLower === 'admin'
        )
      })
      if (!isAllowed) {
        navigate(`/${userRoleLower}`)
      }
    }
  }, [user, role, navigate])

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [location.pathname])

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem('kiet_sidebar_collapsed', String(next))
      } catch {}
      return next
    })
  }

  const toggleMobile = () => {
    setIsMobileOpen((prev) => !prev)
  }

  const closeMobile = () => {
    setIsMobileOpen(false)
  }

  if (!user) return null

  return (
    <RealtimeProvider>
      <LayoutContext.Provider
        value={{
          isCollapsed,
          isMobileOpen,
          toggleCollapse,
          toggleMobile,
          closeMobile,
        }}
      >
        <div
          className={`app-shell ${isCollapsed ? 'sidebar-collapsed' : ''} ${
            isMobileOpen ? 'mobile-nav-open' : ''
          }`}
        >
          {/* Mobile backdrop overlay */}
          <div
            className={`mobile-backdrop ${isMobileOpen ? 'active' : ''}`}
            onClick={closeMobile}
            aria-hidden="true"
          />

          <Sidebar
            role={role || user.role}
            isCollapsed={isCollapsed}
            isMobileOpen={isMobileOpen}
            onToggleCollapse={toggleCollapse}
            onCloseMobile={closeMobile}
          />

          <div className="app-content">
            <Topbar
              onToggleCollapse={toggleCollapse}
              onToggleMobile={toggleMobile}
              isCollapsed={isCollapsed}
            />
            <main className="app-page">
              <div className="app-page-inner">{children}</div>
              <footer className="app-institutional-footer">
                <div className="footer-trust-lockup">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>256-Bit SSL Encrypted Campus ERP • Affiliated to JNTUK Kakinada • ISO 9001:2015</span>
                </div>
              </footer>
            </main>
          </div>
        </div>
      </LayoutContext.Provider>
    </RealtimeProvider>
  )
}