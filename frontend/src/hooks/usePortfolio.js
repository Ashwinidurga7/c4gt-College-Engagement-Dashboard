import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/queryKeys'
import { certificateService } from '@/services/certificateService'
import { certificationService } from '@/services/certificationService'
import { internshipService } from '@/services/internshipService'
import { projectService } from '@/services/projectService'
import { resumeService } from '@/services/resumeService'
import { studentService } from '@/services/studentService'

const key = queryKeys.student.resource

function useResourceList(name, fetcher, query) {
  return useQuery({ queryKey: key(name, query), queryFn: () => fetcher(query), placeholderData: keepPreviousData })
}

/** Mutation that refreshes the resource's lists and confirms with a toast. */
function useResourceMutation(name, mutationFn, successMessage) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key(name) })
      toast.success(successMessage)
    },
  })
}

export const useCertifications = (query) => useResourceList('certifications', certificationService.list, query)
export const useCreateCertification = () => useResourceMutation('certifications', certificationService.create, 'Certification added')
export const useUpdateCertification = () =>
  useResourceMutation('certifications', ({ id, values }) => certificationService.update(id, values), 'Certification updated')
export const useDeleteCertification = () => useResourceMutation('certifications', certificationService.remove, 'Certification deleted')

export const useCertificates = (query) => useResourceList('certificates', certificateService.list, query)
export const useUploadCertificate = () =>
  useResourceMutation('certificates', certificateService.upload, 'Certificate uploaded and sent for verification')
export const useDeleteCertificate = () => useResourceMutation('certificates', certificateService.remove, 'Certificate deleted')

export const useProjects = (query) => useResourceList('projects', projectService.list, query)
export const useCreateProject = () => useResourceMutation('projects', projectService.create, 'Project added')
export const useUpdateProject = () => useResourceMutation('projects', ({ id, values }) => projectService.update(id, values), 'Project updated')
export const useDeleteProject = () => useResourceMutation('projects', projectService.remove, 'Project deleted')

export const useInternships = (query) => useResourceList('internships', internshipService.list, query)
export const useCreateInternship = () => useResourceMutation('internships', internshipService.create, 'Internship added')
export const useDeleteInternship = () => useResourceMutation('internships', internshipService.remove, 'Internship deleted')

export const useAchievements = (query) => useResourceList('achievements', studentService.achievements, query)
export const useActivities = (query) => useResourceList('activities', studentService.activities, query)

export const useResumes = () => useQuery({ queryKey: key('resumes'), queryFn: resumeService.list })
export const useUploadResume = () => useResourceMutation('resumes', resumeService.upload, 'Resume uploaded')
export const useSetPrimaryResume = () => useResourceMutation('resumes', resumeService.setPrimary, 'Primary resume updated')
export const useDeleteResume = () => useResourceMutation('resumes', resumeService.remove, 'Resume deleted')
