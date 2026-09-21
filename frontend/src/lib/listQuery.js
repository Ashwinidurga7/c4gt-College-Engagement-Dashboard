export const DEFAULT_PAGE_SIZE = 10

/** Query-string parameters for a list request; empty values are dropped. */
export function toListParams({ search, sort, page, pageSize, filters } = {}) {
  const params = { ...filters }
  if (search) params.search = search
  if (sort?.key) {
    params.sortBy = sort.key
    params.order = sort.direction
  }
  if (page) params.page = page
  if (pageSize) params.limit = pageSize
  return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== '' && value != null))
}

function compare(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a ?? '').localeCompare(String(b ?? ''), 'en-IN', { numeric: true, sensitivity: 'base' })
}

/**
 * Search, sort and paginate an in-memory list the way the server would.
 * Used by the mock layer, and as a fallback when an endpoint returns a small unpaginated list.
 */
export function applyListQuery(items, { search, searchKeys = [], filters = {}, sort, page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) {
  let result = items.filter((item) =>
    Object.entries(filters).every(([key, value]) => value === '' || value == null || String(item[key]) === String(value)),
  )
  const term = search?.trim().toLowerCase()
  if (term) {
    result = result.filter((item) => searchKeys.some((key) => String(item[key] ?? '').toLowerCase().includes(term)))
  }
  if (sort?.key) {
    const direction = sort.direction === 'desc' ? -1 : 1
    result = [...result].sort((a, b) => compare(a[sort.key], b[sort.key]) * direction)
  }
  const total = result.length
  const start = (page - 1) * pageSize
  return { items: result.slice(start, start + pageSize), total, page, pageSize }
}

/**
 * Normalises a list response into `{ items, total, page, pageSize }`.
 * Accepts a paginated object (items/docs/results/data plus total) or a bare array.
 */
export function toPage(raw, query, mapItem, fallback) {
  const list = Array.isArray(raw) ? raw : (raw?.items ?? raw?.docs ?? raw?.results ?? raw?.data ?? [])
  const items = list.map(mapItem)
  if (Array.isArray(raw) && fallback) {
    return applyListQuery(items, { ...query, searchKeys: fallback.searchKeys })
  }
  return {
    items,
    total: Number(raw?.total ?? raw?.totalDocs ?? raw?.count ?? items.length),
    page: Number(raw?.page ?? query?.page ?? 1),
    pageSize: Number(raw?.limit ?? raw?.pageSize ?? query?.pageSize ?? (items.length || DEFAULT_PAGE_SIZE)),
  }
}
