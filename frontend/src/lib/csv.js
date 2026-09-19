function escape(value) {
  const text = value === null || value === undefined ? '' : String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/** CSV text from `[{ key, header }]` columns and plain rows (uses `csv(row)` when a column has one). */
export function toCsv(columns, rows) {
  const header = columns.map((column) => escape(column.header)).join(',')
  const body = rows.map((row) => columns.map((column) => escape(column.csv ? column.csv(row) : row[column.key])).join(','))
  return [header, ...body].join('\n')
}

/** Saves text as a file via a temporary link; only called from a user's click. */
export function downloadText(filename, text, type = 'text/csv;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([`﻿${text}`], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
