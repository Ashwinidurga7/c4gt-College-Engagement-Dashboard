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
 * sign-out, refresh and a change of device. On load the newer of the two wins. Each edit is saved to both
 * shortly after it is made; `status` drives the save indicator, and `local` means only this browser has it.
 */
export function useResumeDraft(userId) {
  const [stored] = useState(() => readResumeDraft(userId))
  const [draft, setDraft] = useState(stored ?? { version: VERSION })
  const [status, setStatus] = useState(stored ? { state: 'saved', at: stored.updatedAt } : { state: 'idle' })
  const pending = useRef(null)
  const edited = useRef(false)

  // Take the account copy when it is newer than this browser's, unless the student has already started editing.
  useEffect(() => {
    let active = true
    resumeDraftService
      .get()
      .then((remote) => {
        if (!active || edited.current || !isNewer(remote, stored)) return
        writeDraft(userId, remote)
        setDraft(remote)
        setStatus({ state: 'saved', at: remote.updatedAt })
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [userId, stored])

  // Keep an edit made just before leaving the page.
  useEffect(
    () => () => {
      if (!pending.current) return
      writeDraft(userId, pending.current)
      resumeDraftService.save(pending.current).catch(() => {})
    },
    [userId],
  )

  useEffect(() => {
    if (!pending.current) return undefined
    const next = pending.current
    const timer = setTimeout(async () => {
      pending.current = null
      const local = writeDraft(userId, next)
      try {
        await resumeDraftService.save(next)
        setStatus({ state: 'saved', at: next.updatedAt })
      } catch {
        setStatus(local ? { state: 'local', at: next.updatedAt } : { state: 'unavailable' })
      }
    }, SAVE_DELAY)
    return () => clearTimeout(timer)
  }, [draft, userId])

  /** `change` receives the current draft and returns the next one. */
  const update = useCallback((change) => {
    edited.current = true
    setDraft((current) => {
      const next = { ...change(current), version: VERSION, updatedAt: new Date().toISOString() }
      pending.current = next
      return next
    })
    setStatus({ state: 'saving' })
  }, [])

  /** Discards the edits but remembers which saved resumes came from the builder. */
  const reset = useCallback(() => {
    edited.current = true
    pending.current = null
    setDraft((current) => {
      const next = { version: VERSION, updatedAt: new Date().toISOString(), ...(current.savedResumeIds?.length && { savedResumeIds: current.savedResumeIds }) }
      writeDraft(userId, next)
      resumeDraftService.save(next).catch(() => {})
      return next
    })
    setStatus({ state: 'idle' })
  }, [userId])

  return { draft, update, reset, status }
}
