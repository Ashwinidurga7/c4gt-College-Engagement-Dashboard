import { z } from 'zod'

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

export function formatFileSize(bytes) {
  if (!Number.isFinite(bytes)) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Zod rule for a required File of the given MIME types and at most 5 MB. */
export function fileSchema(types, typeMessage) {
  return z
    .custom((value) => value instanceof File, 'Choose a file to upload.')
    .refine((file) => types.includes(file.type), typeMessage)
    .refine((file) => file.size <= MAX_UPLOAD_BYTES, 'The file must be 5 MB or smaller.')
}
