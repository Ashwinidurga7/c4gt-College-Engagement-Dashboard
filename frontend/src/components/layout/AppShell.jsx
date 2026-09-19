import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AppBreadcrumb } from '@/components/layout/AppBreadcrumb'
import { MobileDrawer } from '@/components/layout/MobileDrawer'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { cn } from '@/lib/utils'

const SIDEBAR_KEY = 'kiet.sidebar'

function readSidebarOpen() {
  try {
    return window.localStorage.getItem(SIDEBAR_KEY) !== 'closed'
  } catch {
    return true
  }
}

export function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  // Desktop only: the sidebar can be hidden to give pages the full width.
  const [sidebarOpen, setSidebarOpen] = useState(readSidebarOpen)

  function toggleSidebar() {
    const next = !sidebarOpen
    setSidebarOpen(next)
    try {
      window.localStorage.setItem(SIDEBAR_KEY, next ? 'open' : 'closed')
    } catch {
      // Not remembered in private mode; the toggle still works for this visit.
    }
  }

  return (
    <div className="bg-canvas min-h-dvh">
      <a
        href="#main-content"
        className="bg-primary text-primary-foreground sr-only z-50 rounded-md px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to main content
      </a>
      <Sidebar open={sidebarOpen} />
      <MobileDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />

      <div className={cn('flex min-h-dvh min-w-0 flex-col', sidebarOpen && 'lg:pl-64')}>
        <Topbar onOpenDrawer={() => setDrawerOpen(true)} sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl min-w-0 flex-1 px-4 py-6 outline-none sm:px-6 lg:px-8">
          <AppBreadcrumb />
          <Outlet />
        </main>
      </div>
    </div>
  )
}
