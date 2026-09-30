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
    <div className="bg-canvas relative min-h-dvh overflow-x-clip">
      {/* Ambient background glowing gradient blobs and floating glass spheres for Glassmorphism depth */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="animate-ambient-1 absolute -top-32 -left-20 size-[550px] rounded-full bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-sky-400/10 blur-3xl dark:from-blue-600/30 dark:via-indigo-800/25" />
        <div className="animate-ambient-2 absolute top-1/3 -right-24 size-[600px] rounded-full bg-gradient-to-br from-indigo-500/18 via-sky-500/15 to-blue-600/10 blur-3xl dark:from-indigo-700/25 dark:via-blue-600/20" />
        <div className="animate-ambient-1 absolute -bottom-32 left-1/3 size-[500px] rounded-full bg-gradient-to-tl from-sky-500/18 via-indigo-500/15 to-blue-700/10 blur-3xl dark:from-sky-600/25 dark:via-indigo-900/20" />
        
        {/* Floating Specular Glass Spheres */}
        <div className="animate-bubble-1 absolute top-20 left-1/4 size-16 rounded-full border border-white/40 bg-white/10 backdrop-blur-md shadow-lg dark:border-white/20 dark:bg-white/5" />
        <div className="animate-bubble-2 absolute top-1/2 right-20 size-24 rounded-full border border-white/40 bg-white/15 backdrop-blur-md shadow-xl dark:border-white/20 dark:bg-white/5" />
        <div className="animate-bubble-3 absolute bottom-32 left-12 size-20 rounded-full border border-white/40 bg-white/10 backdrop-blur-md shadow-lg dark:border-white/20 dark:bg-white/5" />
      </div>

      <a
        href="#main-content"
        className="bg-primary text-primary-foreground sr-only z-50 rounded-md px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to main content
      </a>
      <Sidebar open={sidebarOpen} />
      <MobileDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />

      <div className={cn('relative z-10 flex min-h-dvh min-w-0 flex-col', sidebarOpen && 'lg:pl-64')}>
        <Topbar onOpenDrawer={() => setDrawerOpen(true)} sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl min-w-0 flex-1 px-4 py-6 outline-none sm:px-6 lg:px-8">
          <AppBreadcrumb />
          <Outlet />
        </main>
      </div>
    </div>
  )
}
