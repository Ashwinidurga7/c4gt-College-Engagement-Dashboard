import { Eye, FileBadge, Trash2, Upload } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { FilterChips } from '@/components/common/FilterChips'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { CERTIFICATE_CATEGORIES } from '@/features/student/portfolio/portfolioSchemas'
import { TabSection } from '@/features/student/portfolio/TabSection'
import { UploadCertificateModal } from '@/features/student/portfolio/UploadCertificateModal'
import { useConfirmAction } from '@/hooks/useConfirmAction'
import { useCertificates, useDeleteCertificate } from '@/hooks/usePortfolio'
import { formatDate } from '@/lib/formatters'

const CATEGORY_OPTIONS = [{ value: '', label: 'All' }, ...CERTIFICATE_CATEGORIES.map((category) => ({ value: category, label: category }))]

export function CertificatesTab() {
  const [category, setCategory] = useState('')
  const query = useCertificates({ page: 1, pageSize: 50, filters: { category } })
  const [uploading, setUploading] = useState(false)
  const remove = useConfirmAction(useDeleteCertificate())

  return (
    <TabSection
      title="Certificates"
      description="Uploaded certificates and their verification status."
      count={query.data?.total}
      query={query}
      toolbar={<FilterChips label="Filter by category" options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />}
      isEmpty={(data) => data.items.length === 0}
      empty={{
        icon: FileBadge,
        title: category ? `No ${category.toLowerCase()} certificates` : 'No certificates uploaded',
        description: 'Upload certificates from events and workshops to get them verified by faculty.',
      }}
      action={
        <Button size="lg" onClick={() => setUploading(true)}>
          <Upload aria-hidden /> Upload certificate
        </Button>
      }
      render={(data) => (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.items.map((item) => (
            <li key={item.id} className="bg-card shadow-soft flex flex-col items-center gap-2 rounded-xl border p-5 text-center">
              <span className="bg-tone-blue text-tone-blue-fg flex size-12 items-center justify-center rounded-xl">
                <FileBadge className="size-6" strokeWidth={1.75} aria-hidden />
              </span>
              <h3 className="mt-1 font-semibold">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.issuedBy}</p>
              <p className="text-muted-foreground text-xs">
                {item.category} · {formatDate(item.date)}
              </p>
              <StatusBadge status={item.status} />
              {item.status === 'verified' && item.verifiedBy && <p className="text-muted-foreground text-xs">Verified by {item.verifiedBy}</p>}
              {item.status === 'rejected' && item.remarks && <p className="text-danger-text bg-danger-soft rounded-md px-2 py-1 text-xs">{item.remarks}</p>}
              <div className="mt-auto flex w-full items-center justify-center gap-2 border-t pt-3">
                {item.fileUrl ? (
                  <Button asChild variant="outline" size="lg">
                    <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Eye aria-hidden /> View<span className="sr-only"> {item.title} (opens in a new tab)</span>
                    </a>
                  </Button>
                ) : (
                  <span className="text-muted-foreground text-xs">{item.fileName ?? 'File stored with the college'}</span>
                )}
                <Button variant="ghost" size="icon-lg" className="text-danger-text" aria-label={`Delete ${item.title}`} onClick={() => remove.request(item)}>
                  <Trash2 />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    >
      {uploading && <UploadCertificateModal open onOpenChange={setUploading} />}
      <ConfirmDialog
        {...remove.dialogProps}
        title="Delete this certificate?"
        description={
          remove.target &&
          `"${remove.target.title}" will be removed${remove.target.status === 'verified' ? ', including its verification' : ''}. This cannot be undone.`
        }
        confirmLabel="Delete"
        pendingLabel="Deleting…"
      />
    </TabSection>
  )
}
