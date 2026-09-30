import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef } from 'react'
import { printModelFor } from '@/features/student/resume/resumeValidation'
import { queryKeys } from '@/lib/queryKeys'
import { resumeVersionService } from '@/services/resumeVersionService'

const KEY = queryKeys.student.resumeVersions

/** What a version records, and what the history list calls it. */
export const VERSION_REASONS = {
  edit: 'Before editing',
  download: 'Downloaded as PDF',
  saved: 'Saved to my resumes',
  manual: 'Saved by you',
  restore: 'Before restoring an older version',
  reset: 'Before reset to profile data',
}

/** The draft's content, without the bookkeeping that changes on every save. */
function contentOf(draft = {}) {
  const { version: _version, updatedAt: _updatedAt, savedResumeIds: _saved, ...content } = draft
  return JSON.stringify(content)
}

/**
 * The student's resume history, kept against their account. `snapshot(base, draft, reason)` records the
 * draft with the resume as it prints right now, unless it matches the newest version already saved, so
 * downloading the same resume twice does not fill the history with copies. Resolves to the saved version or null.
 */
export function useResumeVersions() {
  const queryClient = useQueryClient()
  const query = useQuery({ queryKey: KEY, queryFn: resumeVersionService.list })

  const create = useMutation({
    mutationFn: resumeVersionService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  })
  const remove = useMutation({
    mutationFn: resumeVersionService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  })

  const { mutateAsync } = create
  const snapshot = useCallback(
    async (base, draft, reason) => {
      const versions = await queryClient.ensureQueryData({ queryKey: KEY, queryFn: resumeVersionService.list })
      if (versions[0] && contentOf(versions[0].draft) === contentOf(draft)) return null
      const { savedResumeIds: _saved, ...kept } = draft
      return mutateAsync({ reason, draft: kept, printModel: printModelFor(base, draft) })
    },
    [queryClient, mutateAsync],
  )

  return { versions: query.data ?? [], isPending: query.isPending, error: query.error, retry: query.refetch, snapshot, remove }
}

/**
 * Connects the history to the builder. `record(reason)` snapshots the current resume; `edit` wraps the
 * draft's `update` so the resume as it was before this visit's first edit is kept. Both read the latest
 * draft and data from refs, so the edit actions built on `edit` are not re-created on every keystroke.
 */
export function useHistoryRecorder({ base, draft, update, snapshot }) {
  const latest = useRef({ base, draft })
  const snapshotted = useRef(false)
  useEffect(() => {
    latest.current = { base, draft }
  })

  const record = useCallback(
    (reason) => {
      const { base: currentBase, draft: currentDraft } = latest.current
      return currentBase ? snapshot(currentBase, currentDraft, reason) : Promise.resolve(null)
    },
    [snapshot],
  )

  const edit = useCallback(
    (change) => {
      if (!snapshotted.current) {
        snapshotted.current = true
        record('edit').catch(() => {})
      }
      update(change)
    },
    [update, record],
  )

  /** Replaces the draft with an older version, keeping the current one in the history first. */
  const restore = useCallback(
    async (version) => {
      await record('restore').catch(() => {})
      snapshotted.current = true
      update((current) => ({ ...version.draft, ...(current.savedResumeIds?.length && { savedResumeIds: current.savedResumeIds }) }))
    },
    [record, update],
  )

  return { record, edit, restore }
}
