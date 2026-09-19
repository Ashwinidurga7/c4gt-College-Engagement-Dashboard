import { useEffect } from 'react'

const SUFFIX = 'KIET Portal'

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${SUFFIX}` : SUFFIX
  }, [title])
}
