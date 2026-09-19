import { BadgeCheck, ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { CertificationFormModal } from '@/features/student/portfolio/CertificationFormModal'
import { TabSection } from '@/features/student/portfolio/TabSection'
import { useConfirmAction } from '@/hooks/useConfirmAction'
import { useCertifications, useDeleteCertification } from '@/hooks/usePortfolio'
import { formatDate } from '@/lib/formatters'

const QUERY = { page: 1, pageSize: 50 }

export function CertificationsTab() {
  const query = useCertifications(QUERY)
  const [editor, setEditor] = useState(null)
  const remove = useConfirmAction(useDeleteCertification())

  return (
    <TabSection
      title="Certifications"
      description="Courses and professional certifications you have completed."
      count={query.data?.total}
      query={query}
      isEmpty={(data) => data.items.length === 0}
      empty={{ icon: BadgeCheck, title: 'No certifications yet', description: 'Add NPTEL, Coursera or industry certifications to strengthen your profile.' }}
      action={
        <Button size="lg" onClick={() => setEditor({ item: null })}>
          <Plus aria-hidden /> Add certification
        </Button>
      }
      render={(data) => (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.items.map((item) => (
            <li key={item.id} className="bg-card shadow-soft flex flex-col gap-3 rounded-xl border p-5">
              <div className="flex items-start gap-3">
                <span className="bg-tone-blue text-tone-blue-fg flex size-10 shrink-0 items-center justify-center rounded-lg">
                  <BadgeCheck className="size-5" strokeWidth={1.75} aria-hidden />
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-muted-foreground text-sm">{item.issuer}</p>
                </div>
              </div>
              <dl className="text-muted-foreground grid grid-cols-2 gap-2 text-xs">
                <div>
                  <dt>Issued</dt>
                  <dd className="text-heading font-medium">{formatDate(item.issueDate)}</dd>
                </div>
                <div>
                  <dt>Expires</dt>
                  <dd className="text-heading font-medium">{item.expiryDate ? formatDate(item.expiryDate) : 'No expiry'}</dd>
                </div>
                {item.credentialId && (
                  <div className="col-span-2">
                    <dt>Credential ID</dt>
                    <dd className="text-heading font-medium break-all">{item.credentialId}</dd>
                  </div>
                )}
              </dl>
              <div className="mt-auto flex items-center gap-1 border-t pt-3">
                {item.credentialUrl && (
                  <a href={item.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-link mr-auto inline-flex items-center gap-1 text-sm font-medium hover:underline">
                    Verify <ExternalLink className="size-3.5" aria-hidden />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
                <Button variant="ghost" size="icon-lg" className="ml-auto" aria-label={`Edit ${item.name}`} onClick={() => setEditor({ item })}>
                  <Pencil />
                </Button>
                <Button variant="ghost" size="icon-lg" className="text-danger-text" aria-label={`Delete ${item.name}`} onClick={() => remove.request(item)}>
                  <Trash2 />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    >
      {editor && <CertificationFormModal item={editor.item} open onOpenChange={(open) => !open && setEditor(null)} />}
      <ConfirmDialog
        {...remove.dialogProps}
        title="Delete this certification?"
        description={remove.target && `"${remove.target.name}" will be removed from your portfolio. This cannot be undone.`}
        confirmLabel="Delete"
        pendingLabel="Deleting…"
      />
    </TabSection>
  )
}
