import { LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BrandLogo } from '@/components/common/BrandLogo'
import { SidebarNav } from '@/components/layout/SidebarNav'
import { useAuth } from '@/hooks/useAuth'
import { PRODUCT_TAGLINE } from '@/lib/brand'
import { dashboardPath, roleLabel } from '@/lib/roles'
import { cn } from '@/lib/utils'

/** Shared body of the desktop sidebar and the mobile drawer. */
export function SidebarContent({ onNavigate }) {
  const { user, signOut } = useAuth()

  return (
    <div className="bg-nav flex h-full flex-col">
      {/* Same height as the topbar so their bottom borders form one line. In the drawer, leave room for the close button. */}
      <div className={cn('border-nav-border box-content flex h-16 shrink-0 items-center gap-3 border-b px-5', onNavigate && 'pr-14')}>
        <Link
          to={dashboardPath(user.role)}
          onClick={onNavigate}
          aria-label="Go to dashboard"
          className="focus-visible:outline-nav-strong rounded-md"
        >
          <BrandLogo onDark className="text-lg" />
        </Link>
        <span className="text-nav-muted ml-auto rounded-full border border-current px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase">
          {roleLabel(user.role)}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <SidebarNav role={user.role} onNavigate={onNavigate} />
      </div>

      <div className="border-nav-border border-t px-3 py-4">
        <button
          type="button"
          onClick={() => signOut()}
          className="text-nav-text hover:bg-nav-hover focus-visible:outline-nav-strong flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
        >
          <LogOut className="size-[18px]" strokeWidth={1.75} aria-hidden />
          Sign out
        </button>
        <p className="text-nav-muted mt-3 px-3 text-xs">{PRODUCT_TAGLINE.join(' · ')}</p>
      </div>
    </div>
  )
}
