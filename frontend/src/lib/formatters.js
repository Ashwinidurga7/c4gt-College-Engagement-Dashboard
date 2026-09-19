const dateFormatter = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
const dateTimeFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})
const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})
const numberFormatter = new Intl.NumberFormat('en-IN')

function toDate(value) {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(value) {
  const date = toDate(value)
  return date ? dateFormatter.format(date) : '—'
}

export function formatDateTime(value) {
  const date = toDate(value)
  return date ? dateTimeFormatter.format(date) : '—'
}

function isNumeric(value) {
  return value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value))
}

export function formatCurrency(value) {
  return isNumeric(value) ? currencyFormatter.format(Number(value)) : '—'
}

export function formatNumber(value) {
  return isNumeric(value) ? numberFormatter.format(Number(value)) : '—'
}

export function formatPercent(value, digits = 1) {
  return isNumeric(value) ? `${Number(value).toFixed(digits)}%` : '—'
}

export function initials(name = '') {
  const parts = name
    .replace(/^(dr|mr|mrs|ms|prof)\.?\s+/i, '')
    .split(/[\s.]+/)
    .filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return `${first}${last}`.toUpperCase()
}

export function greeting(now = new Date()) {
  const hour = now.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

/** Given name for greetings, skipping initials and titles ("B. Ashwini Durga" → "Ashwini"). */
export function firstName(name = '') {
  const words = name.replace(/^(dr|mr|mrs|ms|prof)\.?\s+/i, '').split(/\s+/)
  return words.find((word) => word.replace(/\./g, '').length > 2) ?? words[0] ?? ''
}

export function formatMonth(value) {
  if (!value) return '—'
  const date = /^\d{4}-\d{2}$/.test(value) ? new Date(`${value}-01T00:00:00`) : new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
}
