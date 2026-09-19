import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/queryKeys'
import { roleLabel } from '@/lib/roles'
import { adminService } from '@/services/adminService'
import { certificateService } from '@/services/certificateService'
import { clubService } from '@/services/clubService'

const keys = queryKeys.admin

export const useAdminDashboard = () => useQuery({ queryKey: keys.dashboard, queryFn: adminService.dashboard })

export const useAdminUsers = (query) =>
  useQuery({ queryKey: keys.users(query), queryFn: () => adminService.users(query), placeholderData: keepPreviousData })

export const usePendingRegistrations = (role) => useQuery({ queryKey: keys.pending(role), queryFn: () => adminService.pending(role) })

/** Approve or reject a faculty or HOD registration; refreshes queues, users and dashboard counts. */
export function useDecideRegistration(role) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, decision }) => adminService.decide(role, id, decision),
    onSuccess: (registration, { decision }) => {
      queryClient.invalidateQueries({ queryKey: keys.all })
      toast.success(decision === 'approved' ? `${registration.name} approved as ${roleLabel(role)}` : `${registration.name}'s registration rejected`)
    },
  })
}

export const useAdminVerifications = (query) =>
  useQuery({ queryKey: keys.verifications(query), queryFn: () => adminService.verifications(query), placeholderData: keepPreviousData })

export function useAdminVerifyCertificate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, remarks }) => certificateService.verify(id, { status, remarks }),
    onSuccess: (certificate) => {
      queryClient.invalidateQueries({ queryKey: keys.all })
      toast.success(certificate.status === 'rejected' ? 'Certificate rejected' : 'Certificate verified')
    },
  })
}

function useClubMutation(mutationFn, message) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: (club) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clubs('admin') })
      queryClient.invalidateQueries({ queryKey: keys.dashboard })
      toast.success(typeof message === 'function' ? message(club) : message)
    },
  })
}

export const useCreateClub = () => useClubMutation(clubService.create, (club) => `${club.name} created`)
export const useUpdateClub = () => useClubMutation(({ id, values }) => clubService.update(id, values), (club) => `${club.name} updated`)
export const useDeleteClub = () => useClubMutation(clubService.remove, 'Club deleted')
export const useSetClubActive = () =>
  useClubMutation(({ id, active }) => clubService.setActive(id, active), (club) => `${club.name} ${club.status === 'active' ? 'activated' : 'deactivated'}`)
