import { z } from 'zod'
import { CLUB_CATEGORIES } from '@/lib/campus'
import { COLLEGES } from '@/lib/colleges'

const currentYear = new Date().getFullYear()

export const clubSchema = z.object({
  name: z.string().trim().min(2, 'Enter the club name.').max(40, 'Keep the short name under 40 characters.'),
  fullName: z.string().trim().max(100),
  tagline: z.string().trim().max(80, 'Keep the tagline under 80 characters.'),
  category: z.enum(CLUB_CATEGORIES, { error: 'Select a category.' }),
  college: z.enum(COLLEGES, { error: 'Select the college.' }),
  coordinator: z.string().trim().min(3, 'Enter the faculty coordinator.').max(80),
  email: z.string().trim().refine((value) => value === '' || z.email().safeParse(value).success, 'Enter a valid email address or leave it empty.'),
  founded: z
    .string()
    .refine((value) => value === '' || (/^\d{4}$/.test(value) && Number(value) >= 1990 && Number(value) <= currentYear), `Enter a year between 1990 and ${currentYear}.`),
  description: z.string().trim().min(20, 'Describe the club in at least 20 characters.').max(600),
  focusAreas: z.string().trim().max(200),
})

export function clubDefaults(club) {
  return {
    name: club?.name ?? '',
    fullName: club?.fullName && club.fullName !== club.name ? club.fullName : '',
    tagline: club?.tagline ?? '',
    category: club?.category ?? '',
    college: club?.college ?? '',
    coordinator: club?.coordinator ?? '',
    email: club?.email ?? '',
    founded: club?.founded ? String(club.founded) : '',
    description: club?.description ?? '',
    focusAreas: club?.focusAreas?.join(', ') ?? '',
  }
}
