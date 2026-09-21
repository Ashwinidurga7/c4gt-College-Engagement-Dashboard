import { BrandBlock } from '@/components/common/BrandBlock'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { LoginCurves } from '@/features/auth/LoginCurves'
import { BRAND_NAME } from '@/lib/brand'
import { cn } from '@/lib/utils'

export function AuthHeader() {
  return (
    <header className="relative z-10 flex items-start justify-between gap-4 px-4 pt-6 sm:px-10 lg:px-16 lg:pt-10">
      <BrandBlock />
      <ThemeToggle className="bg-card/80 shadow-soft shrink-0 border" />
    </header>
  )
}

export function AuthFooter({ className }) {
  return (
    <footer className={cn('relative z-10 px-4 pb-6 text-center sm:px-10 lg:px-16', className)}>
      <span className="bg-card/85 text-body inline-block rounded-full px-3 py-1 text-xs">
        © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
      </span>
    </footer>
  )
}

/** Frame for the signed-out pages other than login: brand header, centered content, curves. */
export function AuthLayout({ children }) {
  return (
    <div className="bg-canvas relative flex min-h-dvh flex-col overflow-hidden">
      <LoginCurves className="h-40 w-[70%] sm:h-56 lg:h-72 lg:w-[46%]" />
      <AuthHeader />
      <main className="relative z-10 flex flex-1 items-start justify-center px-4 py-8 sm:items-center sm:px-10">{children}</main>
      <AuthFooter />
    </div>
  )
}
