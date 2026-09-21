import { useEffect, useRef, useState } from 'react'
import { renderResumePdf } from '@/features/student/resume/pdf/renderResumePdf'

const PREVIEW_DELAY = 500

/**
 * The live preview: re-renders the PDF about half a second after the last edit and exposes it
 * as an object URL. Results of superseded renders are dropped, and old URLs are released.
 * `status` is "pending" before the first PDF, "updating" while it is out of date.
 */
export function useResumePdf(printModel) {
  const [rendered, setRendered] = useState({ signature: null, url: null, pages: 0, unicode: false, error: null })
  const urlRef = useRef(null)
  const signature = JSON.stringify(printModel)

  useEffect(() => {
    let current = true
    const timer = setTimeout(async () => {
      try {
        const { blob, pages, unicode } = await renderResumePdf(JSON.parse(signature))
        if (!current) return
        if (urlRef.current) URL.revokeObjectURL(urlRef.current)
        urlRef.current = URL.createObjectURL(blob)
        setRendered({ signature, url: urlRef.current, pages, unicode, error: null })
      } catch (error) {
        if (current) setRendered((state) => ({ ...state, signature, error }))
      }
    }, PREVIEW_DELAY)
    return () => {
      current = false
      clearTimeout(timer)
    }
  }, [signature])

  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    },
    [],
  )

  const upToDate = rendered.signature === signature
  const status = !upToDate ? (rendered.url ? 'updating' : 'pending') : rendered.error ? 'error' : 'ready'
  return { status, url: rendered.url, pages: rendered.pages, unicode: rendered.unicode }
}
