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

export function formatCurrency(value) {
  return Number.isFinite(Number(value)) ? currencyFormatter.format(Number(value)) : '—'
}

export function formatNumber(value) {
  return Number.isFinite(Number(value)) ? numberFormatter.format(Number(value)) : '—'
}

export function formatPercent(value, digits = 1) {
  return Number.isFinite(Number(value)) ? `${Number(value).toFixed(digits)}%` : '—'
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
