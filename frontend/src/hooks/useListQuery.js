import { useMemo, useState } from 'react'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { DEFAULT_PAGE_SIZE } from '@/lib/listQuery'

/**
 * State for a server-driven table: search text (debounced), filters, sort and page.
 * `query` is stable between renders and is meant to go into the React Query key.
 */
export function useListQuery({ pageSize = DEFAULT_PAGE_SIZE, initialSort = null, initialFilters = {} } = {}) {
  const [search, setSearchValue] = useState('')
  const [filters, setFiltersValue] = useState(initialFilters)
  const [sort, setSortValue] = useState(initialSort)
  const [page, setPage] = useState(1)
  const debouncedSearch = useDebouncedValue(search)

  const query = useMemo(
    () => ({ search: debouncedSearch.trim(), filters, sort, page, pageSize }),
    [debouncedSearch, filters, sort, page, pageSize],
  )

  return {
    query,
    search,
    setSearch: (value) => {
      setSearchValue(value)
      setPage(1)
    },
    filters,
    setFilter: (key, value) => {
      setFiltersValue((current) => ({ ...current, [key]: value }))
      setPage(1)
    },
    sort,
    setSort: (value) => {
      setSortValue(value)
      setPage(1)
    },
    setPage,
  }
}
