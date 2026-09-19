import { z } from 'zod'

const indianMobile = /^[6-9]\d{9}$/

export const profileSchema = z.object({
  phone: z.string().trim().regex(indianMobile, 'Enter a 10-digit mobile number starting with 6, 7, 8 or 9.'),
  address: z.string().trim().max(200, 'Keep the address under 200 characters.'),
  guardianName: z.string().trim().max(80, 'Name is too long.'),
  guardianPhone: z
    .string()
    .trim()
    .refine((value) => value === '' || indianMobile.test(value), 'Enter a valid 10-digit mobile number or leave it empty.'),
  bio: z.string().trim().max(300, 'Keep the bio under 300 characters.'),
})

export function profileDefaults(profile) {
  return {
    phone: profile.phone ?? '',
    address: profile.address ?? '',
    guardianName: profile.guardianName ?? '',
    guardianPhone: profile.guardianPhone ?? '',
    bio: profile.bio ?? '',
  }
}
