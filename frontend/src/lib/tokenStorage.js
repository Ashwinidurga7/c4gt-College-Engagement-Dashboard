const TOKEN_KEY = 'kiet.token'

function safe(storageName) {
  try {
    return window[storageName]
  } catch {
    return null
  }
}

export const tokenStorage = {
  get() {
    return safe('localStorage')?.getItem(TOKEN_KEY) ?? safe('sessionStorage')?.getItem(TOKEN_KEY) ?? null
  },

  /** Remembered sessions survive a browser restart; others end with the tab. */
  set(token, remember) {
    this.clear()
    safe(remember ? 'localStorage' : 'sessionStorage')?.setItem(TOKEN_KEY, token)
  },

  /** Swaps in a new token (e.g. after a password change), keeping the session where it was stored. */
  replace(token) {
    const remembered = Boolean(safe('localStorage')?.getItem(TOKEN_KEY))
    this.set(token, remembered)
  },

  clear() {
    safe('localStorage')?.removeItem(TOKEN_KEY)
    safe('sessionStorage')?.removeItem(TOKEN_KEY)
  },
}
