const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

/** Modules moved to the real API while the rest stay on mock data, e.g. VITE_REAL_MODULES=auth,resume. */
const realModules = new Set(
  (import.meta.env.VITE_REAL_MODULES ?? '')
    .split(',')
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean),
)

const apiUrl = rawApiUrl.replace(/\/+$/, '')

/** Files the API returns as paths ("/api/media/…") are served by the API host, not the frontend's. */
export const apiUrlOf = (url) => (typeof url === 'string' && url.startsWith('/api/') ? `${apiUrl}${url}` : url)

/** The reverse of apiUrlOf, for sending a stored file's URL back to the API (e.g. photos kept in a gallery). */
export const apiPathOf = (url) => (typeof url === 'string' && url.startsWith(`${apiUrl}/api/`) ? url.slice(apiUrl.length) : url)

export const env = {
  apiUrl,
  useMock,
  /** Whether `module` ('auth', 'resume') uses mock data: VITE_USE_MOCK, unless VITE_REAL_MODULES lists it. */
  useMockFor: (module) => useMock && !realModules.has(module),
}
