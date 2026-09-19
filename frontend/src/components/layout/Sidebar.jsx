import { SidebarContent } from '@/components/layout/SidebarContent'

/** Fixed desktop sidebar; below `lg` the MobileDrawer takes over. */
export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
      <SidebarContent />
    </aside>
  )
}
