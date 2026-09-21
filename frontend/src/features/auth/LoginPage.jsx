import { CampusSlideshow } from '@/components/common/CampusSlideshow'
import { AuthFooter, AuthHeader } from '@/features/auth/AuthLayout'
import { LoginCurves } from '@/features/auth/LoginCurves'
import { LoginForm } from '@/features/auth/LoginForm'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PRODUCT_NAME, PRODUCT_SUBTITLE, PRODUCT_TAGLINE } from '@/lib/brand'

export function LoginPage() {
  useDocumentTitle('Sign in')

  return (
    <div className="bg-canvas relative flex min-h-dvh flex-col overflow-hidden">
      {/* Campus photos cross-fade into the page from the right, as in the reference */}
      <div className="absolute inset-y-0 right-0 hidden w-[42%] lg:block">
        <CampusSlideshow className="h-full w-full [mask-image:linear-gradient(to_right,transparent,black_38%)]" />
      </div>
      <LoginCurves className="h-40 w-[70%] sm:h-56 lg:h-72 lg:w-[46%]" />

      <AuthHeader />

      <main className="relative z-10 flex flex-1 items-center px-4 py-8 sm:px-10 lg:px-16">
        <div className="flex w-full items-center justify-center gap-16 lg:justify-start">
          <section aria-label="About the portal" className="hidden w-72 shrink-0 xl:block">
            <p className="text-heading text-5xl leading-tight font-bold">
              {PRODUCT_TAGLINE.map((word) => (
                <span key={word} className="block">
                  {word}
                </span>
              ))}
            </p>
            <span aria-hidden className="bg-primary mt-6 block h-1 w-20 rounded-full" />
            <p className="text-muted-foreground mt-6 text-lg leading-relaxed">{PRODUCT_SUBTITLE}</p>
          </section>

          <div className="bg-card shadow-lifted w-full max-w-[470px] rounded-2xl border px-5 py-8 sm:px-10 sm:py-10">
            <div className="mb-7 text-center">
              <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-4xl">{PRODUCT_NAME}</h1>
              <p className="text-muted-foreground mt-3 text-base">Sign in with your institutional account</p>
              <p className="text-muted-foreground mt-2 text-sm xl:hidden">{PRODUCT_SUBTITLE}</p>
            </div>
            <LoginForm />
          </div>
        </div>
      </main>

      <AuthFooter className="lg:text-left" />
    </div>
  )
}
