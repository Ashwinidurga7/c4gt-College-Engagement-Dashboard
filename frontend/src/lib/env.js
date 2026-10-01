const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

/** Modules moved to the real API while the rest stay on mock data, e.g. VITE_REAL_MODULES=auth,resume. */
const realModules = new Set(
  (import.meta.env.VITE_REAL_MODULES ?? '')
    .split(',')
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean),
)

export const env = {
  apiUrl: rawApiUrl.replace(/\/+$/, ''),
  useMock,
  /** Whether `module` ('auth', 'resume') uses mock data: VITE_USE_MOCK, unless VITE_REAL_MODULES lists it. */
  useMockFor: (module) => useMock && !realModules.has(module),
}
