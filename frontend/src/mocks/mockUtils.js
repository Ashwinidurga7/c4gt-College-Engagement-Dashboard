import { ApiError } from '@/services/apiClient'

const LATENCY_MS = 450

/** Simulates network latency so loading states are visible in mock mode. */
export function mockResponse(value, latency = LATENCY_MS) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(value)), latency)
  })
}

export function mockError(message, status, latency = LATENCY_MS) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new ApiError(message, { status })), latency)
  })
}

/** The file as a data: URL, so a mock upload still opens after a reload (blob: URLs die with the page). */
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
