import { Pencil, Plus, Power, PowerOff, Trash2, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { DataTable } from '@/components/common/DataTable'
import { FilterBar } from '@/components/common/FilterBar'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { ClubFormModal } from '@/features/admin/ClubFormModal'
import { ClubLogo } from '@/features/clubs/ClubLogo'
import { useDeleteClub, useSetClubActive } from '@/hooks/useAdmin'
import { useClubs } from '@/hooks/useCampus'
import { useConfirmAction } from '@/hooks/useConfirmAction'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useListQuery } from '@/hooks/useListQuery'
import { CLUB_CATEGORIES } from '@/lib/campus'
import { formatNumber } from '@/lib/formatters'

const COLUMNS = [
  {
    key: 'name',
    header: 'Club',
    sortable: true,
    cell: (row) => (
      <div className="flex items-center gap-3">
        <ClubLogo club={row} className="size-10 shrink-0 text-xs" />
        <div className="min-w-0">
          <Link to={`/admin/clubs/${row.id}`} className="text-heading font-medium hover:underline">
            {row.name}
          </Link>
          <p className="text-muted-foreground text-xs">{row.fullName !== row.name ? row.fullName : row.tagline}</p>
        </div>
      </div>
    ),
  },
  { key: 'category', header: 'Category', sortable: true },
  { key: 'membersCount', header: 'Members', sortable: true, align: 'right', cell: (row) => formatNumber(row.membersCount), className: 'tabular-nums' },
  { key: 'status', header: 'Status', sortable: true, cell: (row) => <StatusBadge status={row.status} /> },
]

const FILTERS = [
  { key: 'category', allLabel: 'All categories', options: CLUB_CATEGORIES },
  { key: 'status', allLabel: 'Any status', options: ['active', 'inactive'], labels: { active: 'Active', inactive: 'Inactive' } },
]

export function AdminClubsPage() {
  useDocumentTitle('Clubs')
  const list = useListQuery({ initialFilters: { category: '', status: '' }, initialSort: { key: 'name', direction: 'asc' } })
  const query = useClubs(list.query)
  const [editor, setEditor] = useState(null)
  const remove = useConfirmAction(useDeleteClub())
  const toggle = useConfirmAction(useSetClubActive(), (club) => ({ id: club.id, active: club.status !== 'active' }))
  const data = query.data
  const activating = toggle.target?.status !== 'active'

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Clubs management"
        description="Create, edit, activate and deactivate clubs. Inactive clubs are hidden from students."
        icon={UsersRound}
        actions={
          <Button size="lg" onClick={() => setEditor({ club: null })}>
            <Plus aria-hidden /> Create club
          </Button>
        }
      />
      <DataTable
        caption="Clubs"
        columns={COLUMNS}
        rows={data?.items}
        isLoading={query.isPending}
        isFetching={query.isFetching && !query.isPending}
        error={query.error}
        onRetry={query.refetch}
        emptyTitle="No clubs match"
        emptyDescription="Try different filters, or create a club."
        sort={list.sort}
        onSortChange={list.setSort}
        minWidth={820}
        pagination={data && { page: data.page, pageSize: data.pageSize, total: data.total, onPageChange: list.setPage }}
        toolbar={
          <FilterBar search={list.search} onSearchChange={list.setSearch} searchPlaceholder="Search clubs" searchLabel="Search clubs">
            {FILTERS.map((filter) => (
              <span key={filter.key} className="contents">
                <label htmlFor={`clubs-${filter.key}`} className="sr-only">
                  {filter.allLabel}
                </label>
                <NativeSelect id={`clubs-${filter.key}`} size="lg" className="w-full sm:w-40" value={list.filters[filter.key]} onChange={(event) => list.setFilter(filter.key, event.target.value)}>
                  <NativeSelectOption value="">{filter.allLabel}</NativeSelectOption>
                  {filter.options.map((option) => (
                    <NativeSelectOption key={option} value={option}>
                      {filter.labels?.[option] ?? option}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </span>
            ))}
          </FilterBar>
        }
        rowActions={(club) => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon-lg" aria-label={`Edit ${club.name}`} onClick={() => setEditor({ club })}>
              <Pencil />
            </Button>
            <Button variant="ghost" size="icon-lg" aria-label={`${club.status === 'active' ? 'Deactivate' : 'Activate'} ${club.name}`} onClick={() => toggle.request(club)}>
              {club.status === 'active' ? <PowerOff /> : <Power />}
            </Button>
            <Button variant="ghost" size="icon-lg" className="text-danger-text" aria-label={`Delete ${club.name}`} onClick={() => remove.request(club)}>
              <Trash2 />
            </Button>
          </div>
        )}
      />
      {editor && <ClubFormModal club={editor.club} open onOpenChange={(open) => !open && setEditor(null)} />}
      <ConfirmDialog
        {...toggle.dialogProps}
        tone={activating ? 'primary' : 'danger'}
        title={toggle.target && `${activating ? 'Activate' : 'Deactivate'} ${toggle.target.name}?`}
        description={activating ? 'Students will see the club and its events again.' : 'The club will be hidden from students. Members and history are kept.'}
        confirmLabel={activating ? 'Activate' : 'Deactivate'}
        pendingLabel="Saving…"
      />
      <ConfirmDialog
        {...remove.dialogProps}
        title={remove.target && `Delete ${remove.target.name}?`}
        description="The club and its details are removed permanently. Deactivate it instead if it may return."
        confirmLabel="Delete club"
        pendingLabel="Deleting…"
      />
    </div>
  )
}
