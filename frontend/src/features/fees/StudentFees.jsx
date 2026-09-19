import { CircleCheck, Hourglass, IndianRupee, Receipt } from 'lucide-react'
import { DataTable } from '@/components/common/DataTable'
import { PreviewBadge } from '@/components/common/PreviewBadge'
import { QueryView } from '@/components/common/QueryView'
import { SectionCard } from '@/components/common/SectionCard'
import { StatGridSkeleton } from '@/components/common/Skeleton'
import { StatCard } from '@/components/common/StatCard'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { useStudentFees } from '@/hooks/usePreview'
import { formatCurrency, formatDate } from '@/lib/formatters'

const HISTORY_COLUMNS = [
  { key: 'date', header: 'Date', cell: (row) => formatDate(row.date), className: 'whitespace-nowrap' },
  { key: 'label', header: 'Description', className: 'text-heading font-medium' },
  { key: 'amount', header: 'Amount', align: 'right', cell: (row) => formatCurrency(row.amount), className: 'tabular-nums' },
  { key: 'method', header: 'Method' },
  { key: 'receipt', header: 'Receipt', className: 'text-muted-foreground whitespace-nowrap' },
]

export function StudentFees() {
  const query = useStudentFees()

  return (
    <QueryView query={query} skeleton={<StatGridSkeleton count={3} />}>
      {(account) => {
        const total = account.items.reduce((sum, item) => sum + item.amount, 0)
        const paid = account.items.filter((item) => item.status === 'paid').reduce((sum, item) => sum + item.amount, 0)
        const due = account.items.find((item) => item.status !== 'paid')
        return (
          <>
            <section aria-label="Fee summary" className="grid gap-4 sm:grid-cols-3">
              <StatCard label="This semester" value={formatCurrency(total)} icon={IndianRupee} tone="blue" />
              <StatCard label="Paid" value={formatCurrency(paid)} icon={CircleCheck} tone="green" />
              <StatCard label="Outstanding" value={formatCurrency(total - paid)} icon={Hourglass} tone={total - paid > 0 ? 'orange' : 'teal'} hint={due && `Due ${formatDate(due.dueDate)}`} />
            </section>
            <SectionCard title="Fee items" icon={Receipt}>
              <ul className="divide-y">
                {account.items.map((item) => (
                  <li key={item.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-heading text-sm font-medium">{item.label}</p>
                      <p className="text-muted-foreground text-xs">Due {formatDate(item.dueDate)}</p>
                    </div>
                    <span className="text-heading text-sm font-semibold tabular-nums">{formatCurrency(item.amount)}</span>
                    <StatusBadge status={item.status} label={item.status === 'paid' ? 'Paid' : undefined} />
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t pt-4">
                <Button size="lg" disabled aria-describedby="pay-note">
                  Pay online
                </Button>
                <p id="pay-note" className="text-muted-foreground flex items-center gap-2 text-xs">
                  <PreviewBadge /> Pay at the accounts office until online payment is enabled.
                </p>
              </div>
            </SectionCard>
            <section aria-labelledby="fee-history" className="flex flex-col gap-3">
              <h2 id="fee-history" className="text-lg font-semibold">
                Payment history
              </h2>
              <DataTable caption="Payment history" columns={HISTORY_COLUMNS} rows={account.history} emptyTitle="No payments yet" minWidth={620} />
            </section>
          </>
        )
      }}
    </QueryView>
  )
}
