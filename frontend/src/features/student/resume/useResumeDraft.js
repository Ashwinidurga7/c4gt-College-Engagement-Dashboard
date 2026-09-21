import { useCallback, useEffect, useRef, useState } from 'react'

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

/**
 * The student's local resume edits (skills, summary, school marks, links, bullet edits, item
 * choices, section order and template), laid over API data by `applyDraft`. Changes are saved
 * to this browser shortly after each edit; `status` drives the "Draft saved" indicator.
 */
export function useResumeDraft(userId) {
  const [stored] = useState(() => readResumeDraft(userId))
  const [draft, setDraft] = useState(stored ?? { version: VERSION })
  const [status, setStatus] = useState(stored ? { state: 'saved', at: stored.updatedAt } : { state: 'idle' })
  const pending = useRef(null)

  // Keep an edit made just before leaving the page.
  useEffect(
    () => () => {
      if (pending.current) writeDraft(userId, pending.current)
    },
    [userId],
  )

  useEffect(() => {
    if (!pending.current) return undefined
    const next = pending.current
    const timer = setTimeout(() => {
      pending.current = null
      setStatus(writeDraft(userId, next) ? { state: 'saved', at: next.updatedAt } : { state: 'unavailable' })
    }, SAVE_DELAY)
    return () => clearTimeout(timer)
  }, [draft, userId])

  /** `change` receives the current draft and returns the next one. */
  const update = useCallback((change) => {
    setDraft((current) => {
      const next = { ...change(current), version: VERSION, updatedAt: new Date().toISOString() }
      pending.current = next
      return next
    })
    setStatus((current) => (current.state === 'unavailable' ? current : { state: 'saving' }))
  }, [])

  /** Discards local edits but remembers which saved resumes came from the builder. */
  const reset = useCallback(() => {
    pending.current = null
    setDraft((current) => {
      const next = current.savedResumeIds?.length ? { version: VERSION, savedResumeIds: current.savedResumeIds } : { version: VERSION }
      writeDraft(userId, next.savedResumeIds ? next : null)
      return next
    })
    setStatus({ state: 'idle' })
  }, [userId])

  return { draft, update, reset, status }
}
