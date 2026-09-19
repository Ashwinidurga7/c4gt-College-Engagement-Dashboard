import { BrandLogo } from '@/components/common/BrandLogo'
import { BRAND_MOTTO, BRAND_NAME } from '@/lib/brand'
import { cn } from '@/lib/utils'

export function BrandBlock({ className }) {
  return (
    <div className={cn('flex min-w-0 items-center gap-3 sm:gap-4', className)}>
      <BrandLogo className="shrink-0 text-xl sm:text-3xl" />
      <span aria-hidden className="bg-border hidden h-12 w-px shrink-0 sm:block" />
      <div className="min-w-0">
        <p className="text-heading text-base leading-tight font-semibold sm:text-2xl">{BRAND_NAME}</p>
        <p className="text-muted-foreground mt-1 flex flex-wrap gap-x-2 text-xs sm:text-base">
          {BRAND_MOTTO.map((word, index) => (
            <span key={word} className="whitespace-nowrap">
              {index > 0 && (
                <span aria-hidden className="mr-2">
                  •
                </span>
              )}
              {word}
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}
