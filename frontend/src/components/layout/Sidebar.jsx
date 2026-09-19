import { SidebarContent } from '@/components/layout/SidebarContent'
import { cn } from '@/lib/utils'

/** Fixed desktop sidebar, hidden with the topbar menu button; below `lg` the MobileDrawer takes over. */
export function Sidebar({ open }) {
  return (
    <aside id="app-sidebar" className={cn('fixed inset-y-0 left-0 z-30 hidden w-64', open && 'lg:block')}>
      <SidebarContent />
    </aside>
  )
}
