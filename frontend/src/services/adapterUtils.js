/** Small helpers for defensive response adapters. */

export function toNumber(value, fallback = null) {
  const number = Number(value)
  return value === null || value === undefined || value === '' || Number.isNaN(number) ? fallback : number
}

/** First value that is neither null, undefined nor an empty string. */
export function pick(...values) {
  return values.find((value) => value !== null && value !== undefined && value !== '') ?? null
}

export function toId(raw, ...fallbacks) {
  return pick(raw?._id, raw?.id, ...fallbacks)
}

/** Name from a populated reference (`{ name }`) or a plain string. */
export function nameOf(value) {
  if (!value) return null
  return typeof value === 'object' ? pick(value.name, value.fullName) : value
}

export function toList(value) {
  return Array.isArray(value) ? value : []
}
