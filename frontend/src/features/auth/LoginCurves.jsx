import { useId } from 'react'
import { cn } from '@/lib/utils'

/**
 * Decorative blue waves at the bottom-left of the auth pages.
 * Holds one of the app's two permitted gradients (the other is the campus photo fade).
 */
export function LoginCurves({ className }) {
  const gradientId = useId()

  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 640 320"
      preserveAspectRatio="none"
      className={cn('pointer-events-none absolute bottom-0 left-0', className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--curve-front-start)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--curve-front-end)' }} />
        </linearGradient>
      </defs>
      <path d="M0 40 C 150 20, 300 150, 420 230 S 600 320, 640 320 L 0 320 Z" className="fill-curve-back" opacity="0.8" />
      <path d="M0 150 C 120 120, 260 200, 360 260 S 520 320, 560 320 L 0 320 Z" fill={`url(#${gradientId})`} opacity="0.9" />
    </svg>
  )
}
