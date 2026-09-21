import { useState } from 'react'
import { cn } from '@/lib/utils'

const LOGO_SRC = '/kietlogo.png'

/**
 * KIET logo from /public/kietlogo.png. If the file fails to load it renders a neutral
 * wordmark so layouts keep their final proportions.
 */
export function BrandLogo({ onDark = false, className }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span
        role="img"
        aria-label="KIET Group of Institutions logo"
        className={cn(
          'inline-flex flex-col items-start justify-center leading-none select-none',
          onDark ? 'text-nav-strong' : 'text-brand',
          className,
        )}
      >
        <span className="text-[1.65em] font-bold tracking-tight">
          K<span className="relative">
            ı
            <span aria-hidden className="bg-brand-red absolute top-[0.12em] left-1/2 size-[0.2em] -translate-x-1/2 rounded-full" />
          </span>
          ET
        </span>
        <span className={cn('text-[0.42em] font-semibold tracking-wide uppercase', onDark ? 'text-nav-text' : 'text-heading')}>
          Group of Institutions
        </span>
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex',
        // The logo's grey lettering needs a white chip on navy surfaces and in the dark theme.
        onDark ? 'bg-logo-chip rounded-lg px-2 py-1' : 'dark:bg-logo-chip dark:rounded-lg dark:px-2 dark:py-1',
        className,
      )}
    >
      <img
        src={LOGO_SRC}
        alt="KIET Group of Institutions logo"
        className="h-[2.2em] w-auto object-contain"
        onError={() => setFailed(true)}
      />
    </span>
  )
}
