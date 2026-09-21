import { toast } from 'sonner'
import { profileDefaults, profileSchema } from '@/features/student/profile/profileSchema'
import { useStudentProfile, useUpdateStudentProfile } from '@/hooks/useStudent'

/**
 * Saves one editable profile field (phone or bio) through PUT /api/students/profile, sending the
 * other editable fields unchanged. `canSave` applies the profile page's own validation.
 */
export function useSaveProfileField() {
  const profile = useStudentProfile()
  const mutation = useUpdateStudentProfile()

  const valuesWith = (field, value) => ({ ...profileDefaults(profile.data ?? {}), [field]: value })

  return {
    isPending: mutation.isPending,
    canSave: (field, value) => Boolean(profile.data) && profileSchema.safeParse(valuesWith(field, value)).success,
    save: (field, value, onSaved) =>
      mutation.mutate(valuesWith(field, value), {
        onSuccess: onSaved,
        onError: (error) => toast.error(error.message),
      }),
  }
}
