import { z } from 'zod'
import { fileSchema } from '@/lib/files'

const optionalUrl = z
  .string()
  .trim()
  .refine((value) => value === '' || /^https?:\/\/\S+\.\S+/.test(value), 'Enter a full link starting with http:// or https://.')

const requiredDate = (message) => z.string().min(1, message)

/** End date must not be before the start date when both are present. */
function endAfterStart(startKey, endKey, message) {
  return (values, ctx) => {
    if (values[startKey] && values[endKey] && values[endKey] < values[startKey]) {
      ctx.addIssue({ code: 'custom', path: [endKey], message })
    }
  }
}

export const certificationSchema = z
  .object({
    name: z.string().trim().min(2, 'Enter the certification name.').max(120),
    issuer: z.string().trim().min(2, 'Enter the issuing organisation.').max(120),
    issueDate: requiredDate('Select the issue date.'),
    expiryDate: z.string(),
    credentialId: z.string().trim().max(80),
    credentialUrl: optionalUrl,
  })
  .superRefine(endAfterStart('issueDate', 'expiryDate', 'Expiry date cannot be before the issue date.'))

export const CERTIFICATE_CATEGORIES = ['Event', 'Workshop', 'Hackathon', 'Participation', 'Achievement', 'Sports']
const CERTIFICATE_TYPES = ['application/pdf', 'image/jpeg', 'image/png']

export const certificateSchema = z.object({
  title: z.string().trim().min(2, 'Enter a title.').max(120),
  category: z.enum(CERTIFICATE_CATEGORIES, { error: 'Select a category.' }),
  issuedBy: z.string().trim().min(2, 'Enter the event or issuer.').max(120),
  date: requiredDate('Select the date on the certificate.'),
  file: fileSchema(CERTIFICATE_TYPES, 'Upload a PDF, JPG or PNG file.'),
})

export const PROJECT_STATUSES = ['ongoing', 'completed']

export const projectSchema = z
  .object({
    title: z.string().trim().min(3, 'Enter the project title.').max(120),
    description: z.string().trim().min(10, 'Describe the project in at least 10 characters.').max(600),
    techStack: z.string().trim().min(1, 'List at least one technology, separated by commas.'),
    status: z.enum(PROJECT_STATUSES),
    startDate: requiredDate('Select the start date.'),
    endDate: z.string(),
    repoUrl: optionalUrl,
    liveUrl: optionalUrl,
  })
  .superRefine(endAfterStart('startDate', 'endDate', 'End date cannot be before the start date.'))
  .superRefine((values, ctx) => {
    if (values.status === 'completed' && !values.endDate) {
      ctx.addIssue({ code: 'custom', path: ['endDate'], message: 'Completed projects need an end date.' })
    }
  })

export const INTERNSHIP_MODES = ['Onsite', 'Remote', 'Hybrid']

export const internshipSchema = z
  .object({
    company: z.string().trim().min(2, 'Enter the company name.').max(120),
    role: z.string().trim().min(2, 'Enter your role.').max(120),
    mode: z.enum(INTERNSHIP_MODES, { error: 'Select the work mode.' }),
    startDate: requiredDate('Select the start date.'),
    endDate: requiredDate('Select the end date.'),
    stipend: z.string().refine((value) => value === '' || (/^\d+$/.test(value) && Number(value) <= 1000000), 'Enter the monthly stipend in rupees, or leave it empty.'),
    description: z.string().trim().max(500, 'Keep the description under 500 characters.'),
  })
  .superRefine(endAfterStart('startDate', 'endDate', 'End date cannot be before the start date.'))

export const resumeFileSchema = fileSchema(['application/pdf'], 'Upload your resume as a PDF.')
