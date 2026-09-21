import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/queryKeys'
import { hodService } from '@/services/hodService'

const keys = queryKeys.hod

export const useHodDashboard = () => useQuery({ queryKey: keys.dashboard, queryFn: hodService.dashboard })
export const useHodStudents = (query) =>
  useQuery({ queryKey: keys.students(query), queryFn: () => hodService.students(query), placeholderData: keepPreviousData })
export const useHodAttendance = () => useQuery({ queryKey: keys.attendance, queryFn: hodService.attendance })
export const useHodAcademicReport = () => useQuery({ queryKey: keys.academicReport, queryFn: hodService.academicReport })
export const usePendingCtpos = () => useQuery({ queryKey: keys.pendingCtpos, queryFn: hodService.pendingCtpos })

/** Approve or reject a CTPO; refreshes the queue and the dashboard's pending count. */
export function useDecideCtpo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, decision }) => (decision === 'approved' ? hodService.approveCtpo(id) : hodService.rejectCtpo(id)),
    onSuccess: (registration, { decision }) => {
      queryClient.invalidateQueries({ queryKey: keys.all })
      toast.success(decision === 'approved' ? `${registration.name} approved as CTPO` : `${registration.name}'s registration rejected`)
    },
  })
}
