import axios from 'axios'
import { env } from '@/lib/env'
import { tokenStorage } from '@/lib/tokenStorage'

/** Normalised error thrown by every service call. */
export class ApiError extends Error {
  constructor(message, { status = 0, details = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

const FALLBACK_MESSAGES = {
  0: 'Cannot reach the server. Check your connection and try again.',
  400: 'The request could not be processed. Check the details and try again.',
  401: 'Your session has expired. Please sign in again.',
  403: 'You do not have permission to view or change this.',
  404: 'The requested record was not found.',
  500: 'The server ran into a problem. Please try again shortly.',
}

let unauthorizedHandler = null

/** AuthProvider registers this so a 401 anywhere ends the session. */
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

export const apiClient = axios.create({
  baseURL: `${env.apiUrl}/api`,
  timeout: 20000,
})

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (response) => {
    const body = response.data
    // Backend envelope: { success, message, data }
    if (body && typeof body === 'object' && 'success' in body) {
      if (body.success === false) {
        throw new ApiError(body.message || FALLBACK_MESSAGES[400], { status: response.status })
      }
      return body.data
    }
    return body
  },
  (error) => {
    const status = error.response?.status ?? 0
    const body = error.response?.data
    const message = body?.message || FALLBACK_MESSAGES[status] || FALLBACK_MESSAGES[status >= 500 ? 500 : 400]
    const isLoginCall = error.config?.url?.includes('/auth/login')

    if (status === 401 && !isLoginCall) {
      tokenStorage.clear()
      unauthorizedHandler?.()
    }

    return Promise.reject(new ApiError(message, { status, details: body?.errors ?? null }))
  },
)
