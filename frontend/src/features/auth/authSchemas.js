import { z } from 'zod'
import { COLLEGES, DEPARTMENTS } from '@/lib/colleges'
import { ROLE_LIST } from '@/lib/roles'

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Enter your institutional email.').pipe(z.email('Enter a valid email address.')),
  password: z.string().min(1, 'Enter your password.'),
  remember: z.boolean(),
  portal: z.enum(ROLE_LIST),
})

export const REGISTRABLE_ROLES = ['student', 'faculty', 'hod', 'ctpo']

const requiredFor = {
  assignedYears: ['faculty'],
  academicYear: ['hod'],
  year: ['ctpo'],
  section: ['ctpo'],
}

export const registerSchema = z
  .object({
    role: z.enum(REGISTRABLE_ROLES),
    name: z.string().trim().min(3, 'Enter your full name (at least 3 characters).').max(80, 'Name is too long.'),
    email: z.string().trim().min(1, 'Enter your institutional email.').pipe(z.email('Enter a valid email address.')),
    password: z
      .string()
      .min(8, 'Use at least 8 characters.')
      .regex(/[A-Za-z]/, 'Include at least one letter.')
      .regex(/\d/, 'Include at least one number.'),
    confirmPassword: z.string().min(1, 'Re-enter your password.'),
    college: z.enum(COLLEGES, { error: 'Select your college.' }),
    department: z.enum(DEPARTMENTS, { error: 'Select your department.' }),
    assignedYears: z.array(z.string()),
    academicYear: z.string(),
    year: z.string(),
    section: z.string(),
  })
  .superRefine((values, ctx) => {
    if (values.password !== values.confirmPassword) {
      ctx.addIssue({ code: 'custom', path: ['confirmPassword'], message: 'Passwords do not match.' })
    }
    const messages = {
      assignedYears: 'Select at least one year you teach.',
      academicYear: 'Select the academic year.',
      year: 'Select the year of your class.',
      section: 'Select your section.',
    }
    Object.entries(requiredFor).forEach(([field, roles]) => {
      if (roles.includes(values.role) && values[field].length === 0) {
        ctx.addIssue({ code: 'custom', path: [field], message: messages[field] })
      }
    })
  })

/** Builds the request body each registration endpoint expects. */
export function toRegisterPayload(values) {
  const base = {
    role: values.role,
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    password: values.password,
    college: values.college,
    department: values.department,
  }
  if (values.role === 'faculty') return { ...base, assignedYears: values.assignedYears.map(Number).sort() }
  if (values.role === 'hod') return { ...base, academicYear: values.academicYear }
  if (values.role === 'ctpo') return { ...base, year: Number(values.year), section: values.section }
  return base
}
