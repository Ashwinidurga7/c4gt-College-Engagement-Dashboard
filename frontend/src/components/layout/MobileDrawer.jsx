import { SidebarContent } from '@/components/layout/SidebarContent'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'

export function MobileDrawer({ open, onOpenChange }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="bg-nav w-72 max-w-[85vw] gap-0 border-none p-0 sm:max-w-72 lg:hidden [&>[data-slot=sheet-close]]:text-nav-text [&>[data-slot=sheet-close]]:hover:bg-nav-hover [&>[data-slot=sheet-close]]:top-4.5"
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SheetDescription className="sr-only">Portal sections for your role</SheetDescription>
        <SidebarContent onNavigate={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  )
}
