import { z } from 'zod'
import { EVENT_CATEGORIES } from '@/lib/campus'
import { COLLEGES } from '@/lib/colleges'
import { photoDefaults, photoListSchema } from '@/lib/photos'

export const MAX_EVENT_IMAGES = 6

const optionalTime = z.string().refine((value) => value === '' || /^\d{2}:\d{2}$/.test(value), 'Enter a valid time.')

export const eventSchema = z
  .object({
    title: z.string().trim().min(3, 'Enter the event title.').max(100, 'Keep the title under 100 characters.'),
    category: z.enum(EVENT_CATEGORIES, { error: 'Select a category.' }),
    college: z.union([z.literal(''), z.enum(COLLEGES)]),
    clubId: z.string(),
    organizer: z.string().trim().min(2, 'Enter who is organising the event.').max(80),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose the event date.'),
    startTime: optionalTime,
    endTime: optionalTime,
    registrationDeadline: z.string(),
    venue: z.string().trim().min(2, 'Enter the venue.').max(100),
    description: z.string().trim().min(20, 'Describe the event in at least 20 characters.').max(1000, 'Keep the description under 1000 characters.'),
    images: photoListSchema(MAX_EVENT_IMAGES),
  })
  .refine((values) => !values.startTime || !values.endTime || values.endTime > values.startTime, {
    path: ['endTime'],
    message: 'The end time must be after the start time.',
  })
  .refine((values) => !values.registrationDeadline || !values.date || values.registrationDeadline <= values.date, {
    path: ['registrationDeadline'],
    message: 'Registration must close on or before the event date.',
  })

export function eventDefaults(event) {
  return {
    title: event?.title ?? '',
    category: event?.category ?? '',
    college: event?.college ?? '',
    clubId: event?.clubId ?? '',
    organizer: event?.organizer ?? '',
    date: event?.date?.slice(0, 10) ?? '',
    startTime: event?.startTime ?? '',
    endTime: event?.endTime ?? '',
    registrationDeadline: event?.registrationDeadline?.slice(0, 10) ?? '',
    venue: event?.venue ?? '',
    description: event?.description ?? '',
    images: photoDefaults(event?.images),
  }
}
