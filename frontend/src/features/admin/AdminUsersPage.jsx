import { Users } from 'lucide-react'
import { CollegeBadge } from '@/components/common/CollegeBadge'
import { DataTable } from '@/components/common/DataTable'
import { FilterBar } from '@/components/common/FilterBar'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { useAdminUsers } from '@/hooks/useAdmin'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useListQuery } from '@/hooks/useListQuery'
import { COLLEGES } from '@/lib/colleges'
import { formatDate } from '@/lib/formatters'
import { ROLE_LIST, roleLabel } from '@/lib/roles'

const STATUS_LABELS = { approved: 'Active' }

const COLUMNS = [
  {
    key: 'name',
    header: 'User',
    sortable: true,
    cell: (row) => (
      <div className="min-w-0">
        <p className="text-heading font-medium">{row.name}</p>
        <p className="text-muted-foreground text-xs break-all">{row.email}</p>
      </div>
    ),
  },
  { key: 'role', header: 'Role', sortable: true, cell: (row) => <span className="bg-muted text-heading rounded-full px-2 py-0.5 text-xs font-semibold">{roleLabel(row.role)}</span> },
  { key: 'college', header: 'College', sortable: true, cell: (row) => <CollegeBadge college={row.college} /> },
  { key: 'department', header: 'Department', sortable: true },
  { key: 'approvalStatus', header: 'Status', sortable: true, cell: (row) => <StatusBadge status={row.approvalStatus} label={STATUS_LABELS[row.approvalStatus]} /> },
  { key: 'createdAt', header: 'Joined', sortable: true, cell: (row) => formatDate(row.createdAt), className: 'whitespace-nowrap' },
]

const FILTERS = [
  { key: 'role', label: 'Role', allLabel: 'All roles', options: ROLE_LIST.map((role) => ({ value: role, label: roleLabel(role) })) },
  { key: 'college', label: 'College', allLabel: 'All colleges', options: COLLEGES.map((college) => ({ value: college, label: college })) },
  {
    key: 'approvalStatus',
    label: 'Status',
    allLabel: 'Any status',
    options: [
      { value: 'approved', label: 'Active' },
      { value: 'pending', label: 'Pending' },
      { value: 'rejected', label: 'Rejected' },
    ],
  },
]

export function AdminUsersPage() {
  useDocumentTitle('All Users')
  const list = useListQuery({ initialFilters: { role: '', college: '', approvalStatus: '' }, initialSort: { key: 'name', direction: 'asc' } })
  const query = useAdminUsers(list.query)
  const data = query.data

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="All users" description="Every account across KIET, KIET+ and KIEW." icon={Users} />
      <DataTable
        caption="Users"
        columns={COLUMNS}
        rows={data?.items}
        isLoading={query.isPending}
        isFetching={query.isFetching && !query.isPending}
        error={query.error}
        onRetry={query.refetch}
        emptyTitle="No users match"
        emptyDescription="Try a different search or clear the filters."
        sort={list.sort}
        onSortChange={list.setSort}
        minWidth={820}
        pagination={data && { page: data.page, pageSize: data.pageSize, total: data.total, onPageChange: list.setPage }}
        toolbar={
          <FilterBar search={list.search} onSearchChange={list.setSearch} searchPlaceholder="Search name, email or department" searchLabel="Search users">
            {FILTERS.map((filter) => (
              <span key={filter.key} className="contents">
                <label htmlFor={`users-${filter.key}`} className="sr-only">
                  {filter.label}
                </label>
                <NativeSelect
                  id={`users-${filter.key}`}
                  size="lg"
                  className="w-full sm:w-40"
                  value={list.filters[filter.key]}
                  onChange={(event) => list.setFilter(filter.key, event.target.value)}
                >
                  <NativeSelectOption value="">{filter.allLabel}</NativeSelectOption>
                  {filter.options.map((option) => (
                    <NativeSelectOption key={option.value} value={option.value}>
                      {option.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </span>
            ))}
          </FilterBar>
        }
      />
    </div>
  )
}
