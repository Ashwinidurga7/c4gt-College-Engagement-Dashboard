import { Check, Eye, FileCheck2, X } from 'lucide-react'
import { useState } from 'react'
import { DataTable } from '@/components/common/DataTable'
import { FilterBar } from '@/components/common/FilterBar'
import { FilterChips } from '@/components/common/FilterChips'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { ReviewCertificateDialog } from '@/features/faculty/ReviewCertificateDialog'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useListQuery } from '@/hooks/useListQuery'
import { useCertificateQueue, useVerifyCertificate } from '@/hooks/useStaff'
import { formatDate } from '@/lib/formatters'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'verified', label: 'Verified' },
  { value: 'rejected', label: 'Rejected' },
  { value: '', label: 'All' },
]

const COLUMNS = [
  {
    key: 'student',
    header: 'Student',
    cell: (row) => (
      <div>
        <p className="text-heading font-medium">{row.student?.name ?? '—'}</p>
        <p className="text-muted-foreground text-xs">
          {row.student?.rollNumber}
          {row.student?.year && ` · Year ${row.student.year}${row.student.section ? ` · ${row.student.section}` : ''}`}
        </p>
      </div>
    ),
  },
  {
    key: 'title',
    header: 'Certificate',
    sortable: true,
    cell: (row) => (
      <div>
        <p className="text-heading font-medium">{row.title}</p>
        <p className="text-muted-foreground text-xs">
          {row.category} · {row.issuedBy}
        </p>
      </div>
    ),
  },
  { key: 'date', header: 'Date', sortable: true, cell: (row) => formatDate(row.date), className: 'whitespace-nowrap' },
  { key: 'status', header: 'Status', cell: (row) => <StatusBadge status={row.status} /> },
]

/**
 * Certificate review table. Faculty use their scoped queue; the admin passes the
 * institution-wide hooks.
 */
export function CertificateQueuePage({
  title = 'Certificate verification',
  description = 'Review certificates uploaded by students in your scope.',
  documentTitle = 'Certificate Queue',
  useQueue = useCertificateQueue,
  useVerify = useVerifyCertificate,
}) {
  useDocumentTitle(documentTitle)
  const list = useListQuery({ initialFilters: { status: 'pending' }, initialSort: { key: 'date', direction: 'desc' } })
  const query = useQueue(list.query)
  const verify = useVerify()
  const [review, setReview] = useState(null)
  const data = query.data

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={title} description={description} icon={FileCheck2} />
      <FilterChips label="Status" options={STATUS_OPTIONS} value={list.filters.status} onChange={(value) => list.setFilter('status', value)} />
      <DataTable
        caption="Certificates"
        columns={COLUMNS}
        rows={data?.items}
        isLoading={query.isPending}
        isFetching={query.isFetching && !query.isPending}
        error={query.error}
        onRetry={query.refetch}
        emptyTitle={list.filters.status === 'pending' ? 'No certificates waiting' : 'No certificates found'}
        emptyDescription={list.filters.status === 'pending' ? 'You are all caught up.' : 'Try another status or search.'}
        sort={list.sort}
        onSortChange={list.setSort}
        minWidth={820}
        pagination={data && { page: data.page, pageSize: data.pageSize, total: data.total, onPageChange: list.setPage }}
        toolbar={<FilterBar search={list.search} onSearchChange={list.setSearch} searchPlaceholder="Search certificates" searchLabel="Search certificates" />}
        rowActions={(row) => (
          <div className="flex justify-end gap-1">
            {row.fileUrl && (
              <Button asChild variant="ghost" size="icon-lg" aria-label={`Open ${row.title} file`}>
                <a href={row.fileUrl} target="_blank" rel="noopener noreferrer">
                  <Eye />
                </a>
              </Button>
            )}
            {row.status === 'pending' && (
              <>
                <Button size="lg" onClick={() => setReview({ certificate: row, decision: 'verified' })}>
                  <Check aria-hidden /> Verify<span className="sr-only"> {row.title} for {row.student?.name}</span>
                </Button>
                <Button variant="outline" size="lg" className="text-danger-text" onClick={() => setReview({ certificate: row, decision: 'rejected' })}>
                  <X aria-hidden /> Reject<span className="sr-only"> {row.title} for {row.student?.name}</span>
                </Button>
              </>
            )}
          </div>
        )}
      />
      {review && <ReviewCertificateDialog review={review} mutation={verify} onClose={() => setReview(null)} />}
    </div>
  )
}
