import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'

/**
 * Renders the loading, error and empty states of a React Query result, and the
 * children render-prop once data is available.
 */
export function QueryView({ query, skeleton, isEmpty, empty, children }) {
  if (query.isPending) return skeleton ?? null
  if (query.isError) return <ErrorState error={query.error} onRetry={query.refetch} />
  if (isEmpty?.(query.data)) return <EmptyState {...empty} />
  return children(query.data)
}
