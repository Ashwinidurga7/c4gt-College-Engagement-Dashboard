import { Menu, PanelLeftClose } from 'lucide-react'
import { BrandLogo } from '@/components/common/BrandLogo'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { GlobalSearch } from '@/components/layout/GlobalSearch'
import { NotificationBell } from '@/components/layout/NotificationBell'
import { ProfileMenu } from '@/components/layout/ProfileMenu'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { navItemsFor } from '@/lib/navigation'
import { cn } from '@/lib/utils'

export function Topbar({ onOpenDrawer, sidebarOpen, onToggleSidebar }) {
  const { user } = useAuth()
  const hasNotifications = navItemsFor(user.role).some((item) => item.path === 'notifications')
  const sidebarLabel = sidebarOpen ? 'Hide navigation menu' : 'Show navigation menu'

  return (
    <header className="bg-card/95 border-border sticky top-0 z-20 border-b backdrop-blur">
      <div className="flex h-16 items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
        {/* -ml-2 lines the icon up with the page content below */}
        <Button variant="ghost" size="icon-lg" className="text-heading -ml-2 lg:hidden" onClick={onOpenDrawer} aria-label="Open navigation menu">
          <Menu className="size-5" strokeWidth={1.75} />
        </Button>
        <Button
          variant="ghost"
          size="icon-lg"
          className="text-heading -ml-2 hidden lg:inline-flex"
          onClick={onToggleSidebar}
          aria-label={sidebarLabel}
          title={sidebarLabel}
          aria-expanded={sidebarOpen}
          aria-controls="app-sidebar"
        >
          {sidebarOpen ? <PanelLeftClose className="size-5" strokeWidth={1.75} /> : <Menu className="size-5" strokeWidth={1.75} />}
        </Button>

        {/* The logo lives in the sidebar; show it here whenever the sidebar is not visible */}
        <BrandLogo className={cn('shrink-0 text-base sm:hidden', !sidebarOpen && 'lg:inline-flex')} />
        <GlobalSearch role={user.role} className="hidden max-w-md flex-1 sm:block" />

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          {hasNotifications && <NotificationBell role={user.role} />}
          <ProfileMenu />
        </div>
      </div>
    </header>
  )
}
