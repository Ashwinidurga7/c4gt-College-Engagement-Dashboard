import { Briefcase, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { InternshipFormModal } from '@/features/student/portfolio/InternshipFormModal'
import { TabSection } from '@/features/student/portfolio/TabSection'
import { useConfirmAction } from '@/hooks/useConfirmAction'
import { useDeleteInternship, useInternships } from '@/hooks/usePortfolio'
import { formatCurrency, formatDate } from '@/lib/formatters'

const QUERY = { page: 1, pageSize: 50 }

export function InternshipsTab() {
  const query = useInternships(QUERY)
  const [adding, setAdding] = useState(false)
  const remove = useConfirmAction(useDeleteInternship())

  return (
    <TabSection
      title="Internships"
      description="Industry experience, including virtual internships."
      count={query.data?.total}
      query={query}
      isEmpty={(data) => data.items.length === 0}
      empty={{ icon: Briefcase, title: 'No internships added', description: 'Add internships to show placement officers your industry experience.' }}
      action={
        <Button size="lg" onClick={() => setAdding(true)}>
          <Plus aria-hidden /> Add internship
        </Button>
      }
      render={(data) => (
        <ol className="bg-card shadow-soft divide-y rounded-xl border">
          {data.items.map((internship) => (
            <li key={internship.id} className="flex gap-4 p-5">
              <span className="bg-tone-teal text-tone-teal-fg flex size-11 shrink-0 items-center justify-center rounded-full">
                <Briefcase className="size-5" strokeWidth={1.75} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">{internship.role}</h3>
                <p className="text-body text-sm">
                  {internship.company}
                  {internship.mode && <span className="text-muted-foreground"> · {internship.mode}</span>}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {formatDate(internship.startDate)} – {formatDate(internship.endDate)}
                  {internship.stipend > 0 && ` · Stipend ${formatCurrency(internship.stipend)}/month`}
                </p>
                {internship.description && <p className="text-muted-foreground mt-2 text-sm">{internship.description}</p>}
              </div>
              <Button variant="ghost" size="icon-lg" className="text-danger-text shrink-0" aria-label={`Delete ${internship.role} at ${internship.company}`} onClick={() => remove.request(internship)}>
                <Trash2 />
              </Button>
            </li>
          ))}
        </ol>
      )}
    >
      {adding && <InternshipFormModal open onOpenChange={setAdding} />}
      <ConfirmDialog
        {...remove.dialogProps}
        title="Delete this internship?"
        description={remove.target && `${remove.target.role} at ${remove.target.company} will be removed. This cannot be undone.`}
        confirmLabel="Delete"
        pendingLabel="Deleting…"
      />
    </TabSection>
  )
}
