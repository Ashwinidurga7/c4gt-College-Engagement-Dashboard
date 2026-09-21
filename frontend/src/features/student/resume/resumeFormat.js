/** Text helpers shared by the resume editor and the PDF. Output never contains em or en dashes. */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "Jun 2026" from an ISO date; null when the date is missing or invalid. */
export function monthYear(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : `${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

/** "Jan 2026 to Jun 2026", or "Jan 2026 to Present" when there is no end date. */
export function dateRange(start, end) {
  const from = monthYear(start)
  if (!from) return monthYear(end) ?? ''
  return `${from} to ${monthYear(end) ?? 'Present'}`
}

/** Replaces dashes the resume must not show and trims the text. */
export function cleanText(value) {
  return String(value ?? '')
    .replace(/\s*[—–]\s*/g, ' - ')
    .trim()
}

/** Splits free text into bullet points at sentence ends. */
export function toBullets(text) {
  return cleanText(text)
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
}

/** Comma-separated input to a clean list, and back. */
export function toList(text) {
  return String(text ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

/** Link text without the protocol or a trailing slash, e.g. "github.com/anita". */
export function displayUrl(url) {
  return String(url ?? '')
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/+$/, '')
}

/** Absolute URL for a link the student typed without a protocol. */
export function absoluteUrl(url) {
  const value = String(url ?? '').trim()
  if (!value) return null
  return /^https?:\/\//i.test(value) ? value : `https://${value}`
}

export function looksLikeUrl(value) {
  return /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(String(value ?? '').trim())
}

export function looksLikeEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? '').trim())
}

/**
 * First name + last name + "Resume.pdf", letters only: "B. Ashwini Durga" gives
 * "AshwiniDurgaResume.pdf". Single-letter initials are skipped when a full word exists.
 */
export function resumeFileName(name) {
  const words = String(name ?? '')
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}]/gu, ''))
    .filter(Boolean)
  const full = words.filter((word) => word.length > 1)
  const parts = full.length ? full : words
  const chosen = parts.length > 1 ? [parts[0], parts[parts.length - 1]] : parts
  const stem = chosen.map((word) => word[0].toUpperCase() + word.slice(1)).join('')
  return `${stem || 'My'}Resume.pdf`
}
