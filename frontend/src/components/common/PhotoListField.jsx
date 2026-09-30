import { ImagePlus, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { PHOTO_TYPES } from '@/lib/photos'
import { cn } from '@/lib/utils'

/**
 * Photo grid with remove buttons and an add box that also takes dropped files.
 * The first photo is marked as the cover unless `markCover` is false. Use inside FormField through a Controller.
 */
export function PhotoListField({ id, value, onChange, max, altPrefix = 'Photo', markCover = true, invalid, describedBy }) {
  const inputRef = useRef(null)
  const previews = useRef(new Set())

  // Object URLs made for previews are released when the form closes.
  useEffect(() => {
    const urls = previews.current
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [])

  function add(files) {
    const room = Math.max(max - value.length, 0)
    const added = Array.from(files ?? [])
      .slice(0, room)
      .map((file) => {
        const url = URL.createObjectURL(file)
        previews.current.add(url)
        return { url, caption: '', file }
      })
    if (added.length) onChange([...value, ...added])
    if (inputRef.current) inputRef.current.value = ''
  }

  function remove(index) {
    const photo = value[index]
    if (photo.file) {
      URL.revokeObjectURL(photo.url)
      previews.current.delete(photo.url)
    }
    onChange(value.filter((_, at) => at !== index))
  }

  return (
    <div
      className="flex flex-col gap-3"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        add(event.dataTransfer.files)
      }}
    >
      {value.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((photo, index) => (
            <li key={photo.url} className="bg-sunken relative overflow-hidden rounded-lg border">
              <img src={photo.url} alt={photo.file ? photo.file.name : `${altPrefix} ${index + 1}`} className="aspect-[4/3] w-full object-cover" />
              {markCover && index === 0 && <span className="bg-brand absolute bottom-1.5 left-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold text-white">Cover</span>}
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label={`Remove photo ${index + 1}`}
                className="focus-visible:ring-ring absolute top-1.5 right-1.5 inline-flex size-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/75 focus-visible:ring-2 focus-visible:outline-none"
              >
                <X className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
      {value.length < max && (
        <label
          htmlFor={id}
          className={cn(
            'has-focus-visible:ring-ring flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border border-dashed px-4 py-5 text-center has-focus-visible:ring-2',
            invalid ? 'border-destructive' : 'border-input',
          )}
        >
          <ImagePlus className="text-brand size-7" strokeWidth={1.5} aria-hidden />
          <span className="text-link text-sm font-semibold">Add photos</span>
          <span className="text-muted-foreground text-xs">
            Drag photos here or browse. JPG, PNG or WebP, up to 5 MB each, {max - value.length} more allowed.
          </span>
          <input
            ref={inputRef}
            id={id}
            type="file"
            multiple
            accept={PHOTO_TYPES.join(',')}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            onChange={(event) => add(event.target.files)}
            className="sr-only"
          />
        </label>
      )}
    </div>
  )
}
