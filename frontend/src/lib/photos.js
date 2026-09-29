import { z } from 'zod'

export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_PHOTO_BYTES = 5 * 1024 * 1024

/** A photo already saved has a `url`; one chosen in a form also carries its `file` (the url is a preview). */
const photoSchema = z
  .object({ url: z.string(), caption: z.string().optional(), file: z.custom((value) => value === undefined || value instanceof File).optional() })
  .refine((photo) => !photo.file || PHOTO_TYPES.includes(photo.file.type), 'Photos must be JPG, PNG or WebP.')
  .refine((photo) => !photo.file || photo.file.size <= MAX_PHOTO_BYTES, 'Each photo must be 5 MB or smaller.')

export function photoListSchema(max) {
  return z.array(photoSchema).max(max, `Add at most ${max} photos.`)
}

/** Saved photos as form values; the form adds `file` to new ones. */
export function photoDefaults(photos) {
  return photos?.map((photo) => ({ url: photo.url, caption: photo.caption ?? '' })) ?? []
}

/** Mock mode keeps new photos as object URLs, so they last until the page reloads. */
export function toMockPhotos(photos) {
  return photos.map((photo) => ({ url: photo.file ? URL.createObjectURL(photo.file) : photo.url, caption: photo.caption ?? '' }))
}

/**
 * Adds photos to a multipart body: the kept URLs as JSON in `keepImages` and each
 * new file under `images` (see ASSUMPTIONS.md).
 */
export function appendPhotos(form, photos) {
  form.append('keepImages', JSON.stringify(photos.filter((photo) => !photo.file).map((photo) => photo.url)))
  photos.filter((photo) => photo.file).forEach((photo) => form.append('images', photo.file))
  return form
}

/** First error among the photo list itself and each photo, for the single message under the picker. */
export function photoListError(errors) {
  if (!errors) return undefined
  return errors.message ?? errors.root?.message ?? (Array.isArray(errors) ? errors.find(Boolean)?.message : undefined)
}
