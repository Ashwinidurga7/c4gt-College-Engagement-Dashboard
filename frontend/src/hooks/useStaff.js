import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { queryKeys } from '@/lib/queryKeys'
import { certificateService } from '@/services/certificateService'
import { ctpoService } from '@/services/ctpoService'
import { facultyService } from '@/services/facultyService'
import { rosterService } from '@/services/rosterService'

function useRole() {
  return useAuth().user?.role ?? 'guest'
}

/** Backend-scoped roster (GET /api/students) for faculty, HOD and admin. */
export function useRoster(query) {
  const role = useRole()
  return useQuery({ queryKey: queryKeys.roster(role, query), queryFn: () => rosterService.list(query), placeholderData: keepPreviousData })
}

/** Count of roster students matching `filters`, read from the paginated total (one row fetched). */
export function useRosterCount(filters = {}) {
  const role = useRole()
  const query = { page: 1, pageSize: 1, filters }
  return useQuery({ queryKey: queryKeys.roster(role, query), queryFn: () => rosterService.list(query), select: (page) => page.total })
}

export function useFacultyProfile() {
  return useQuery({ queryKey: queryKeys.facultyMe, queryFn: facultyService.me })
}

export function useCertificateQueue(query) {
  const role = useRole()
  return useQuery({
    queryKey: queryKeys.certificateQueue(role, query),
    queryFn: () => certificateService.list(query),
    placeholderData: keepPreviousData,
  })
}

export function useVerifyCertificate() {
  const role = useRole()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, remarks }) => certificateService.verify(id, { status, remarks }),
    onSuccess: (certificate) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.certificateQueue(role) })
      toast.success(certificate.status === 'rejected' ? 'Certificate rejected' : 'Certificate verified')
    },
  })
}

export function useCtpoDashboard() {
  return useQuery({ queryKey: queryKeys.ctpo.dashboard, queryFn: ctpoService.dashboard })
}

export function useCtpoStudents(query) {
  return useQuery({ queryKey: queryKeys.ctpo.students(query), queryFn: () => ctpoService.students(query), placeholderData: keepPreviousData })
}

export function useCtpoAttendance() {
  return useQuery({ queryKey: queryKeys.ctpo.attendance, queryFn: ctpoService.attendance })
}

export function useCtpoAcademicReport() {
  return useQuery({ queryKey: queryKeys.ctpo.academicReport, queryFn: ctpoService.academicReport })
}
