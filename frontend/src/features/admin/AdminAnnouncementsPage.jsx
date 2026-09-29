import { Megaphone, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { DataTable } from '@/components/common/DataTable'
import { FilterBar } from '@/components/common/FilterBar'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { AnnouncementFormModal } from '@/features/admin/AnnouncementFormModal'
import { useAdminAnnouncements, useDeleteAnnouncement } from '@/hooks/useAdmin'
import { useConfirmAction } from '@/hooks/useConfirmAction'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useListQuery } from '@/hooks/useListQuery'
import { ANNOUNCEMENT_CATEGORIES } from '@/lib/campus'
import { formatDate } from '@/lib/formatters'

const COLUMNS = [
  {
    key: 'title',
    header: 'Announcement',
    sortable: true,
    cell: (row) => (
      <div className="min-w-0">
        <p className="text-heading font-medium">{row.title}</p>
        {row.body && <p className="text-muted-foreground line-clamp-1 text-xs">{row.body}</p>}
      </div>
    ),
  },
  { key: 'category', header: 'Category', sortable: true, cell: (row) => <StatusBadge status={row.category} /> },
  { key: 'date', header: 'Date', sortable: true, cell: (row) => formatDate(row.date), className: 'whitespace-nowrap' },
]

export function AdminAnnouncementsPage() {
  useDocumentTitle('Announcements')
  const list = useListQuery({ initialFilters: { category: '' }, initialSort: { key: 'date', direction: 'desc' } })
  const query = useAdminAnnouncements(list.query)
  const [editor, setEditor] = useState(null)
  const remove = useConfirmAction(useDeleteAnnouncement())
  const data = query.data

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Announcements"
        description="Publish, edit and remove the campus updates students see on their dashboard."
        icon={Megaphone}
        actions={
          <Button size="lg" onClick={() => setEditor({ notice: null })}>
            <Plus aria-hidden /> New announcement
          </Button>
        }
      />
      <DataTable
        caption="Announcements"
        columns={COLUMNS}
        rows={data?.items}
        isLoading={query.isPending}
        isFetching={query.isFetching && !query.isPending}
        error={query.error}
        onRetry={query.refetch}
        emptyTitle="No announcements"
        emptyDescription="Publish one and it appears on every student's dashboard."
        sort={list.sort}
        onSortChange={list.setSort}
        minWidth={720}
        pagination={data && { page: data.page, pageSize: data.pageSize, total: data.total, onPageChange: list.setPage }}
        toolbar={
          <FilterBar search={list.search} onSearchChange={list.setSearch} searchPlaceholder="Search announcements" searchLabel="Search announcements">
            <label htmlFor="announcements-category" className="sr-only">
              Category
            </label>
            <NativeSelect id="announcements-category" size="lg" className="w-full sm:w-40" value={list.filters.category} onChange={(event) => list.setFilter('category', event.target.value)}>
              <NativeSelectOption value="">All categories</NativeSelectOption>
              {ANNOUNCEMENT_CATEGORIES.map((category) => (
                <NativeSelectOption key={category} value={category}>
                  {category}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </FilterBar>
        }
        rowActions={(notice) => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon-lg" aria-label={`Edit ${notice.title}`} onClick={() => setEditor({ notice })}>
              <Pencil />
            </Button>
            <Button variant="ghost" size="icon-lg" className="text-danger-text" aria-label={`Delete ${notice.title}`} onClick={() => remove.request(notice)}>
              <Trash2 />
            </Button>
          </div>
        )}
      />
      {editor && <AnnouncementFormModal notice={editor.notice} open onOpenChange={(open) => !open && setEditor(null)} />}
      <ConfirmDialog
        {...remove.dialogProps}
        title="Delete this announcement?"
        description={remove.target && `"${remove.target.title}" is removed from every student's dashboard.`}
        confirmLabel="Delete"
        pendingLabel="Deleting…"
      />
    </div>
  )
}
