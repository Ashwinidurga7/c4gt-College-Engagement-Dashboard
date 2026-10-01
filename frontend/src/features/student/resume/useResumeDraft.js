import { useCallback, useEffect, useRef, useState } from 'react'
import { resumeDraftService } from '@/services/resumeDraftService'

const VERSION = 1
const SAVE_DELAY = 400

const storageKey = (userId) => `resumeDraft:${userId}`

/** The stored draft, or null when there is none or browser storage is unavailable. */
export function readResumeDraft(userId) {
  try {
    const draft = JSON.parse(window.localStorage.getItem(storageKey(userId)) ?? 'null')
    return draft?.version === VERSION ? draft : null
  } catch {
    return null
  }
}

function writeDraft(userId, draft) {
  try {
    if (draft) window.localStorage.setItem(storageKey(userId), JSON.stringify(draft))
    else window.localStorage.removeItem(storageKey(userId))
    return true
  } catch {
    return false
  }
}

const isNewer = (candidate, current) => candidate?.version === VERSION && (!current?.updatedAt || String(candidate.updatedAt ?? '') > current.updatedAt)

/**
 * The student's resume edits (skills, summary, school marks, links, bullet edits, item choices, section
 * order and template), laid over API data by `applyDraft`.
 *
 * The browser copy opens the builder instantly; the account copy (resumeDraftService) is what survives
 * sign-out, refresh and a change of device. On load the newer of the two wins, and a browser copy the account
 * missed (say, an edit made as the session ended) is sent up. Each edit is written to the browser at once and to
 * the account shortly after, but only once the account copy has been read, so a failed load can never let an
 * older browser copy overwrite a newer one. `status` drives the save indicator: `local` means only this browser
 * has the latest edits and `offline` that the account copy could not be loaded; `retry` tries the account again.
 */
export function useResumeDraft(userId) {
  const [stored] = useState(() => readResumeDraft(userId))
  const [draft, setDraft] = useState(stored ?? { version: VERSION })
  const [status, setStatus] = useState(stored ? { state: 'saved', at: stored.updatedAt } : { state: 'idle' })
  const [attempt, setAttempt] = useState(0)
  const latest = useRef(draft)
  const pending = useRef(null)
  // 'loading' until the account copy has been read, then 'ready', or 'failed' if it could not be.
  const sync = useRef('loading')

  const failedStatus = useCallback(
    (next) => (readResumeDraft(userId)?.updatedAt === next.updatedAt ? { state: 'local', at: next.updatedAt } : { state: 'unavailable' }),
    [userId],
  )

  /** Sends a draft to the account and shows where it ended up. */
  const push = useCallback(
    async (next) => {
      try {
        await resumeDraftService.save(next)
        // A newer edit is already on its way; its own save reports the status.
        if (latest.current === next) setStatus({ state: 'saved', at: next.updatedAt })
      } catch {
        setStatus(failedStatus(next))
      }
    },
    [failedStatus],
  )

  // Read the account copy, take it when it is newer than this browser's, otherwise send up what it missed.
  useEffect(() => {
    let active = true
    sync.current = 'loading'
    resumeDraftService
      .get()
      .then((remote) => {
        if (!active) return
        sync.current = 'ready'
        const current = latest.current
        if (isNewer(remote, current)) {
          writeDraft(userId, remote)
          latest.current = remote
          setDraft(remote)
          setStatus({ state: 'saved', at: remote.updatedAt })
        } else if (current.updatedAt && current.updatedAt !== remote?.updatedAt) {
          push(current)
        }
      })
      .catch(() => {
        if (!active) return
        sync.current = 'failed'
        const current = latest.current
        setStatus(current.updatedAt ? failedStatus(current) : { state: 'offline' })
      })
    return () => {
      active = false
    }
  }, [userId, attempt, push, failedStatus])

  // Send an edit made just before leaving the builder, signing out, or closing or reloading the tab. Nothing is
  // left on screen to report a failure to, and the browser copy is sent up the next time the builder opens.
  useEffect(() => {
    const flush = () => {
      if (!pending.current || sync.current !== 'ready') return
      resumeDraftService.save(pending.current).catch(() => {})
      pending.current = null
    }
    window.addEventListener('pagehide', flush)
    return () => {
      window.removeEventListener('pagehide', flush)
      flush()
    }
  }, [userId])

  useEffect(() => {
    if (!pending.current) return undefined
    const timer = setTimeout(() => {
      const next = pending.current
      pending.current = null
      if (sync.current === 'ready') push(next)
      else if (sync.current === 'failed') setStatus(failedStatus(next))
      // Still loading: the load sends the latest draft once it has compared it with the account copy.
    }, SAVE_DELAY)
    return () => clearTimeout(timer)
  }, [draft, push, failedStatus])

  /** `change` receives the current draft and returns the next one. */
  const update = useCallback(
    (change) => {
      setDraft((current) => {
        const next = { ...change(current), version: VERSION, updatedAt: new Date().toISOString() }
        // The browser copy is written at once, so no edit is lost to a reload; the account copy follows shortly.
        writeDraft(userId, next)
        pending.current = next
        latest.current = next
        return next
      })
      setStatus({ state: 'saving' })
    },
    [userId],
  )

  /** Discards the edits but remembers which saved resumes came from the builder. */
  const reset = useCallback(() => {
    const current = latest.current
    const next = { version: VERSION, updatedAt: new Date().toISOString(), ...(current.savedResumeIds?.length && { savedResumeIds: current.savedResumeIds }) }
    pending.current = null
    latest.current = next
    writeDraft(userId, next)
    setDraft(next)
    setStatus({ state: 'saving' })
    if (sync.current === 'ready') push(next)
    else if (sync.current === 'failed') setStatus(failedStatus(next))
  }, [userId, push, failedStatus])

  /** Tries the account again: loads its copy, then sends up anything it is missing. */
  const retry = useCallback(() => {
    setStatus({ state: 'saving' })
    setAttempt((count) => count + 1)
  }, [])

  return { draft, update, reset, status, retry }
}
