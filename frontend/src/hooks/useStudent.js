import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/queryKeys'
import { studentService } from '@/services/studentService'

const keys = queryKeys.student

export function useStudentDashboard() {
  return useQuery({ queryKey: keys.dashboard, queryFn: studentService.dashboard })
}

export function useStudentProfile() {
  return useQuery({ queryKey: keys.profile, queryFn: studentService.profile })
}

export function useStudentAcademic() {
  return useQuery({ queryKey: keys.academic, queryFn: studentService.academic })
}

export function useStudentCourses(query) {
  return useQuery({
    queryKey: keys.courses(query),
    queryFn: () => studentService.courses(query),
    placeholderData: keepPreviousData,
  })
}

export function useStudentAttendance() {
  return useQuery({ queryKey: keys.attendance, queryFn: studentService.attendance })
}

export function useStudentAcademicReport() {
  return useQuery({ queryKey: keys.academicReport, queryFn: studentService.academicReport })
}

export function useUpcomingEvents() {
  return useQuery({ queryKey: keys.upcomingEvents, queryFn: studentService.upcomingEvents })
}

export function useUpdateStudentProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: studentService.updateProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(keys.profile, profile)
      queryClient.invalidateQueries({ queryKey: keys.dashboard })
      toast.success('Profile updated')
    },
  })
}
