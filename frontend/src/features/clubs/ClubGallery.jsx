import { ChevronLeft, ChevronRight, Images } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SectionCard } from '@/components/common/SectionCard'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

/** Photographs of the club at work. Nothing renders until a club has some. */
export function ClubGallery({ club }) {
  const [broken, setBroken] = useState(() => new Set())
  const [openAt, setOpenAt] = useState(null)

  const photos = club.photos.filter((photo) => !broken.has(photo.url))

  // Arrow keys move through the lightbox, as in any photo viewer.
  useEffect(() => {
    if (openAt === null) return undefined
    const onKey = (event) => {
      if (event.key === 'ArrowRight') setOpenAt((at) => (at + 1) % photos.length)
      if (event.key === 'ArrowLeft') setOpenAt((at) => (at - 1 + photos.length) % photos.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openAt, photos.length])

  if (photos.length === 0) return null

  const active = openAt === null ? null : photos[Math.min(openAt, photos.length - 1)]

  return (
    <SectionCard title="Gallery" description={`${photos.length} photos from ${club.name}`} icon={Images}>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <li key={photo.url}>
            <button
              type="button"
              onClick={() => setOpenAt(index)}
              className="group focus-visible:ring-ring bg-sunken block w-full overflow-hidden rounded-lg border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <img
                src={photo.url}
                alt={photo.caption || `${club.name} photo ${index + 1}`}
                loading="lazy"
                decoding="async"
                onError={() => setBroken((current) => new Set(current).add(photo.url))}
                className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={active !== null} onOpenChange={(open) => !open && setOpenAt(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-heading text-lg">{club.name} gallery</DialogTitle>
            <DialogDescription>{active?.caption || `Photo ${(openAt ?? 0) + 1} of ${photos.length}`}</DialogDescription>
          </DialogHeader>
          {active && (
            <figure className="flex flex-col gap-3">
              <img src={active.url} alt={active.caption || `${club.name} photo`} className="bg-sunken max-h-[65vh] w-full rounded-lg object-contain" />
              {photos.length > 1 && (
                <figcaption className="flex items-center justify-between gap-3">
                  <GalleryStep label="Previous photo" icon={ChevronLeft} onClick={() => setOpenAt((at) => (at - 1 + photos.length) % photos.length)} />
                  <span className="text-muted-foreground text-xs">
                    {(openAt ?? 0) + 1} of {photos.length}
                  </span>
                  <GalleryStep label="Next photo" icon={ChevronRight} onClick={() => setOpenAt((at) => (at + 1) % photos.length)} />
                </figcaption>
              )}
            </figure>
          )}
        </DialogContent>
      </Dialog>
    </SectionCard>
  )
}

function GalleryStep({ label, icon: Icon, onClick, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn('hover:bg-muted focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded-full border focus-visible:ring-2 focus-visible:outline-none', className)}
    >
      <Icon className="size-4" aria-hidden />
    </button>
  )
}
