import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AppBreadcrumb } from '@/components/layout/AppBreadcrumb'
import { MobileDrawer } from '@/components/layout/MobileDrawer'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

export function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="bg-canvas min-h-dvh">
      <a
        href="#main-content"
        className="bg-primary text-primary-foreground sr-only z-50 rounded-md px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to main content
      </a>
      <Sidebar />
      <MobileDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />

      <div className="flex min-h-dvh min-w-0 flex-col lg:pl-64">
        <Topbar onOpenDrawer={() => setDrawerOpen(true)} />
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-7xl min-w-0 flex-1 px-4 py-6 outline-none sm:px-6 lg:px-8">
          <AppBreadcrumb />
          <Outlet />
        </main>
      </div>
    </div>
  )
}
