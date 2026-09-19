import { useState } from 'react'
import { TONE_CLASSES } from '@/lib/tones'
import { cn } from '@/lib/utils'

const CATEGORY_TONES = { Technical: 'blue', Innovation: 'teal', Cultural: 'purple', Service: 'orange', Sports: 'green' }

/** Club logo, or a tinted monogram when the club has no logo (or it fails to load). */
export function ClubLogo({ club, className }) {
  const [failed, setFailed] = useState(false)

  if (club.logoUrl && !failed) {
    return <img src={club.logoUrl} alt="" onError={() => setFailed(true)} className={cn('bg-logo-chip rounded-xl object-contain', className)} />
  }

  const monogram = club.name.replace(/[^A-Za-z0-9+ ]/g, '').split(/\s+/).map((word) => word[0]).join('').slice(0, 3)
  return (
    <span aria-hidden className={cn('flex items-center justify-center rounded-xl font-bold', TONE_CLASSES[CATEGORY_TONES[club.category] ?? 'blue'], className)}>
      {club.name.length <= 5 ? club.name : monogram}
    </span>
  )
}
