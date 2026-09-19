import { useLayoutEffect, useRef } from 'react'

/**
 * For dialogs opened from state rather than a DialogTrigger: remembers the element that had
 * focus when `open` became true and returns focus there on close (pass the result to
 * DialogContent's onCloseAutoFocus).
 */
export function useReturnFocus(open) {
  const origin = useRef(null)

  useLayoutEffect(() => {
    if (open && document.activeElement instanceof HTMLElement && document.activeElement !== document.body) {
      origin.current = document.activeElement
    }
  }, [open])

  return (event) => {
    // If the opener is gone (e.g. its row was deleted), fall back to the main region.
    const target = origin.current?.isConnected ? origin.current : document.getElementById('main-content')
    if (target) {
      event.preventDefault()
      target.focus()
    }
    origin.current = null
  }
}
