import { Building2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/utils'

/** Campus and club life, in the order they are shown. The first one loads eagerly. */
const SLIDES = [
  { src: '/campus.jpg', alt: 'KIET campus building' },
  { src: '/campus/c4gt-team.jpg', alt: 'The C4GT Hub team with faculty at a campus ceremony' },
  { src: '/campus/session-hall.jpg', alt: 'A student presenting to a full seminar hall' },
  { src: '/campus/session-speaker.jpg', alt: 'A speaker addressing students at a club session' },
  { src: '/campus/session-audience.jpg', alt: 'Students at a C4GT Hub session' },
  { src: '/campus/seminar.jpg', alt: 'A seminar in progress on campus' },
]

const HOLD_MS = 5500
const FADE_MS = 1200

/**
 * Cross-fading campus photographs. Falls back to a neutral placeholder if every image fails,
 * and to a single still image when the viewer prefers reduced motion.
 */
export function CampusSlideshow({ className }) {
  const [broken, setBroken] = useState(() => new Set())
  const [index, setIndex] = useState(0)
  const reducedMotion = usePrefersReducedMotion()

  const slides = useMemo(() => SLIDES.filter((slide) => !broken.has(slide.src)), [broken])

  // One timer, restarted whenever the slide changes. Paused while the tab is hidden so a
  // backgrounded login page is not decoding images nobody can see.
  useEffect(() => {
    if (reducedMotion || slides.length < 2) return undefined

    let timer = null
    const stop = () => {
      if (timer) clearTimeout(timer)
      timer = null
    }
    const start = () => {
      stop()
      if (document.hidden) return
      timer = setTimeout(() => setIndex((current) => (current + 1) % slides.length), HOLD_MS)
    }

    start()
    document.addEventListener('visibilitychange', start)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', start)
    }
  }, [index, reducedMotion, slides.length])

  if (slides.length === 0) {
    return (
      <div
        role="img"
        aria-label="KIET campus (photo placeholder)"
        className={cn('bg-sunken text-muted-foreground flex flex-col items-center justify-center gap-3', className)}
      >
        <Building2 className="text-brand size-16" strokeWidth={1.5} aria-hidden />
        <span className="text-sm font-medium">KIET campus</span>
      </div>
    )
  }

  const active = slides[Math.min(index, slides.length - 1)]

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {slides.map((slide, position) => {
        const isActive = slide.src === active.src
        return (
          <img
            key={slide.src}
            src={slide.src}
            // The visible slide carries the description; the rest are decorative until shown.
            alt={isActive ? slide.alt : ''}
            aria-hidden={isActive ? undefined : true}
            loading={position === 0 ? 'eager' : 'lazy'}
            decoding="async"
            onError={() => setBroken((current) => new Set(current).add(slide.src))}
            style={{ transitionDuration: reducedMotion ? '0ms' : `${FADE_MS}ms` }}
            className={cn(
              'absolute inset-0 size-full object-cover transition-opacity ease-in-out motion-reduce:transition-none',
              isActive ? 'opacity-100' : 'opacity-0',
            )}
          />
        )
      })}
    </div>
  )
}
