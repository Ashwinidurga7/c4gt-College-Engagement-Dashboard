import { Bell, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BrandLogo } from '@/components/common/BrandLogo'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { GlobalSearch } from '@/components/layout/GlobalSearch'
import { ProfileMenu } from '@/components/layout/ProfileMenu'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { navItemsFor } from '@/lib/navigation'

export function Topbar({ onOpenDrawer }) {
  const { user } = useAuth()
  const hasNotifications = navItemsFor(user.role).some((item) => item.path === 'notifications')

  return (
    <header className="bg-card/95 border-border sticky top-0 z-20 border-b backdrop-blur">
      <div className="flex h-16 items-center gap-2 px-4 sm:gap-3 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="icon-lg"
          className="text-heading lg:hidden"
          onClick={onOpenDrawer}
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" strokeWidth={1.75} />
        </Button>

        <BrandLogo className="text-base sm:hidden" />
        <GlobalSearch role={user.role} className="hidden max-w-md flex-1 sm:block" />

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          {hasNotifications && (
            <Button asChild variant="ghost" size="icon-lg" className="text-brand">
              <Link to={`/${user.role}/notifications`} aria-label="Notifications">
                <Bell className="size-5" strokeWidth={1.75} />
              </Link>
            </Button>
          )}
          <ProfileMenu />
        </div>
      </div>
    </header>
  )
}
