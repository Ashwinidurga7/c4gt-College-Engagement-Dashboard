import { UsersRound } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { FilterBar } from '@/components/common/FilterBar'
import { PageHeader } from '@/components/common/PageHeader'
import { ListSkeleton } from '@/components/common/Skeleton'
import { TablePagination } from '@/components/common/TablePagination'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { ClubCard } from '@/features/clubs/ClubCard'
import { useAuth } from '@/hooks/useAuth'
import { useClubs } from '@/hooks/useCampus'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useListQuery } from '@/hooks/useListQuery'
import { CLUB_CATEGORIES } from '@/lib/campus'
import { COLLEGES } from '@/lib/colleges'

const PAGE_SIZE = 9

function FilterSelect({ id, label, value, onChange, options, allLabel }) {
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <NativeSelect id={id} size="lg" className="w-full sm:w-44" value={value ?? ''} onChange={(event) => onChange(event.target.value)}>
        <NativeSelectOption value="">{allLabel}</NativeSelectOption>
        {options.map((option) => (
          <NativeSelectOption key={option} value={option}>
            {option}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </>
  )
}

/** Active clubs from all three colleges, filtered on the server. */
export function ClubsPage() {
  useDocumentTitle('Clubs')
  const { user } = useAuth()
  const list = useListQuery({ pageSize: PAGE_SIZE, initialFilters: { status: 'active', college: '', category: '' } })
  const query = useClubs(list.query)
  const data = query.data
  const filtered = list.query.search || list.filters.college || list.filters.category

  let body
  if (query.isPending) body = <ListSkeleton rows={4} />
  else if (query.isError) body = <ErrorState error={query.error} onRetry={query.refetch} />
  else if (data.items.length === 0) {
    body = (
      <EmptyState
        icon={UsersRound}
        title={filtered ? 'No clubs match these filters' : 'No active clubs yet'}
        description={filtered ? 'Try another college or category.' : 'Clubs will appear here once they are set up.'}
      />
    )
  } else {
    body = (
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.items.map((club) => (
          <li key={club.id}>
            <ClubCard club={club} to={`/${user.role}/clubs/${club.id}`} />
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Clubs and communities" description="Active clubs across KIET, KIET+ and KIEW." icon={UsersRound} />
      <FilterBar search={list.search} onSearchChange={list.setSearch} searchPlaceholder="Search clubs" searchLabel="Search clubs">
        <FilterSelect id="club-college" label="College" value={list.filters.college} onChange={(value) => list.setFilter('college', value)} options={COLLEGES} allLabel="All colleges" />
        <FilterSelect id="club-category" label="Category" value={list.filters.category} onChange={(value) => list.setFilter('category', value)} options={CLUB_CATEGORIES} allLabel="All categories" />
      </FilterBar>
      <div aria-busy={query.isFetching || undefined} className={query.isFetching && !query.isPending ? 'opacity-70' : undefined}>
        {body}
      </div>
      {data && data.total > PAGE_SIZE && (
        <div className="bg-card rounded-xl border">
          <TablePagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={list.setPage} />
        </div>
      )}
    </div>
  )
}
