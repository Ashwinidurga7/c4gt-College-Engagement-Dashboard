const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const env = {
  apiUrl: rawApiUrl.replace(/\/+$/, ''),
  useMock: import.meta.env.VITE_USE_MOCK === 'true',
}
