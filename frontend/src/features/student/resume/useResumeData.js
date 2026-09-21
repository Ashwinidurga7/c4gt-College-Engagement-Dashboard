import { useQueries } from '@tanstack/react-query'
import { buildBaseModel } from '@/features/student/resume/resumeAdapter'
import { queryKeys } from '@/lib/queryKeys'
import { studentService } from '@/services/studentService'

const keys = queryKeys.student
const ALL = { page: 1, pageSize: 100 }

/**
 * Every source of the resume, fetched in parallel. The profile, academic and report keys are
 * shared with their pages, and each list key sits under the resource's prefix, so adding a
 * project in the Portfolio also refreshes the builder.
 */
const SOURCES = [
  { name: 'profile', queryKey: keys.profile, queryFn: studentService.profile, required: true },
  { name: 'academic', queryKey: keys.academic, queryFn: studentService.academic },
  { name: 'report', queryKey: keys.academicReport, queryFn: studentService.academicReport },
  { name: 'projects', queryKey: keys.resource('projects', 'resume'), queryFn: () => studentService.ownRecords('projects') },
  { name: 'internships', queryKey: keys.resource('internships', 'resume'), queryFn: () => studentService.ownRecords('internships') },
  { name: 'certifications', queryKey: keys.resource('certifications', 'resume'), queryFn: () => studentService.ownRecords('certifications') },
  { name: 'certificates', queryKey: keys.resource('certificates', 'resume'), queryFn: () => studentService.ownRecords('certificates') },
  { name: 'achievements', queryKey: keys.resource('achievements', 'resume'), queryFn: async () => (await studentService.achievements(ALL)).items },
  { name: 'activities', queryKey: keys.resource('activities', 'resume'), queryFn: async () => (await studentService.activities(ALL)).items },
]

/**
 * Combines the query results into one ResumeModel. Defined outside the hook so React Query
 * re-runs it only when a result changes. The profile is required; if any other source fails,
 * the builder still works and `failed` names what is missing so it can be retried.
 */
function combine(results) {
  const isPending = results.some((result) => result.isPending)
  const error = results[0].error
  return {
    isPending,
    error,
    failed: SOURCES.filter((source, index) => !source.required && results[index].isError).map((source) => source.name),
    base: isPending || error ? null : buildBaseModel(Object.fromEntries(SOURCES.map((source, index) => [source.name, results[index].data ?? undefined]))),
    retry: () => results.forEach((result) => result.isError && result.refetch()),
  }
}

const QUERIES = SOURCES.map(({ queryKey, queryFn }) => ({ queryKey, queryFn }))

/** Every resume source fetched in parallel, as `{ base, isPending, error, failed, retry }`. */
export function useResumeData() {
  return useQueries({ queries: QUERIES, combine })
}
