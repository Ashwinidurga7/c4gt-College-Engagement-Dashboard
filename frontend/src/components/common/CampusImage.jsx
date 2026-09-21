import { Building2 } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const CAMPUS_SRC = '/campus.jpg'

/** Campus photograph from /public/campus.jpg with a neutral placeholder if it fails to load. */
export function CampusImage({ className }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
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

  return (
    <img
      src={CAMPUS_SRC}
      alt="KIET campus building"
      className={cn('object-cover', className)}
      onError={() => setFailed(true)}
    />
  )
}
