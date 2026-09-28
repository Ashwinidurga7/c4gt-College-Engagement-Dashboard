import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { previewService } from '@/services/previewService'

/** Keys are `[role, 'preview', module, query]` so each role caches its own scoped copy. */
function usePreviewKey(module, query) {
  const role = useAuth().user?.role ?? 'guest'
  return query === undefined ? [role, 'preview', module] : [role, 'preview', module, query]
}

function usePreviewQuery(module, fetcher, query) {
  return useQuery({ queryKey: usePreviewKey(module, query), queryFn: () => fetcher(query), placeholderData: keepPreviousData })
}

export const useTimetable = () => usePreviewQuery('timetable', previewService.timetable)
export const useFees = (query) => usePreviewQuery('fees', previewService.fees, query)
export const useStudentFees = () => usePreviewQuery('student-fees', previewService.studentFees)
export const useExams = (query) => usePreviewQuery('exams', previewService.exams, query)
export const useDepartments = () => usePreviewQuery('departments', previewService.departments)
export const useCourseCatalog = (query) => usePreviewQuery('catalog', previewService.catalog, query)
export const useFacilities = (query) => usePreviewQuery('facilities', previewService.facilities, query)
export const useBusPass = () => usePreviewQuery('bus-pass', previewService.busPass)
export const useReportSource = () => usePreviewQuery('report-source', previewService.reportSource)
export const usePlacementPool = () => usePreviewQuery('placement-pool', previewService.placementPool)
export const usePlacementDrives = () => usePreviewQuery('placement-drives', previewService.placementDrives)
export const useInstitutionSettings = () => usePreviewQuery('institution-settings', previewService.institutionSettings)

/** `params` is `{ department, year, section, date }`; nothing loads until all four are chosen. */
export function useAttendanceDay(params) {
  return useQuery({
    queryKey: usePreviewKey('attendance', params),
    queryFn: () => previewService.attendanceDay(params),
    enabled: Boolean(params.department && params.year && params.section && params.date),
  })
}

/** `params` is `{ department, year, section, month }`. */
export function useAttendanceMonth(params) {
  return useQuery({
    queryKey: usePreviewKey('attendance', params),
    queryFn: () => previewService.attendanceMonth(params),
    enabled: Boolean(params.department && params.year && params.section && params.month),
  })
}

function usePreviewMutation(module, mutationFn, message) {
  const queryClient = useQueryClient()
  const key = usePreviewKey(module)
  return useMutation({
    mutationFn,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: key })
      if (message) toast.success(typeof message === 'function' ? message(result) : message)
    },
  })
}

export const useMoveTimetableEntry = () =>
  usePreviewMutation('timetable', previewService.moveTimetableEntry, (entry) => `${entry.subject} moved to ${entry.day} ${entry.slot}`)
export const useSaveAttendanceDay = () =>
  usePreviewMutation('attendance', previewService.saveAttendanceDay, (record) =>
    `Attendance ${record.corrected ? 'updated' : 'saved'}: ${record.total - record.absentees.length} of ${record.total} present`,
  )
export const useSaveDriveCriteria = () => usePreviewMutation('placement-drives', previewService.saveDriveCriteria, (drive) => `Criteria saved for ${drive.company}`)
export const useSetApplicationStatus = () => usePreviewMutation('placement-drives', previewService.setApplicationStatus)
export const useSaveInstitutionSettings = () => usePreviewMutation('institution-settings', previewService.saveInstitutionSettings, 'Institution settings saved')
