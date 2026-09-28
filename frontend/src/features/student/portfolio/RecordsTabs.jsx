import { Medal, Pencil, Plus, Sparkles, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { DataTable } from '@/components/common/DataTable'
import { Button } from '@/components/ui/button'
import { AchievementFormModal, ActivityFormModal } from '@/features/student/portfolio/RecordFormModals'
import { TabSection } from '@/features/student/portfolio/TabSection'
import { useConfirmAction } from '@/hooks/useConfirmAction'
import { useAchievements, useActivities, useDeleteAchievement, useDeleteActivity } from '@/hooks/usePortfolio'
import { formatDate } from '@/lib/formatters'

const QUERY = { page: 1, pageSize: 50 }

function RowActions({ label, onEdit, onDelete }) {
  return (
    <div className="flex shrink-0 gap-1">
      <Button variant="ghost" size="icon-lg" aria-label={`Edit ${label}`} onClick={onEdit}>
        <Pencil />
      </Button>
      <Button variant="ghost" size="icon-lg" className="text-danger-text" aria-label={`Delete ${label}`} onClick={onDelete}>
        <Trash2 />
      </Button>
    </div>
  )
}

export function AchievementsTab() {
  const query = useAchievements(QUERY)
  // null when closed, {} to add, { item } to edit.
  const [editor, setEditor] = useState(null)
  const remove = useConfirmAction(useDeleteAchievement())

  return (
    <TabSection
      title="Achievements"
      description="Awards, ranks and recognitions. They also appear on your resume."
      count={query.data?.total}
      query={query}
      isEmpty={(data) => data.items.length === 0}
      empty={{ icon: Medal, title: 'No achievements yet', description: 'Add awards, ranks or scholarships to show them on your portfolio and resume.' }}
      action={
        <Button size="lg" onClick={() => setEditor({})}>
          <Plus aria-hidden /> Add achievement
        </Button>
      }
      render={(data) => (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.items.map((item) => (
            <li key={item.id} className="bg-card shadow-soft flex gap-3 rounded-xl border p-5">
              <span className="bg-tone-orange text-tone-orange-fg flex size-11 shrink-0 items-center justify-center rounded-full">
                <Medal className="size-5" strokeWidth={1.75} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-muted-foreground text-xs">{[item.category, item.level, formatDate(item.date)].filter(Boolean).join(' · ')}</p>
                {item.description && <p className="text-body mt-2 text-sm">{item.description}</p>}
              </div>
              <RowActions label={item.title} onEdit={() => setEditor({ item })} onDelete={() => remove.request(item)} />
            </li>
          ))}
        </ul>
      )}
    >
      {editor && <AchievementFormModal item={editor.item} onOpenChange={(open) => !open && setEditor(null)} />}
      <ConfirmDialog
        {...remove.dialogProps}
        title="Delete this achievement?"
        description={remove.target && `"${remove.target.title}" will be removed from your portfolio and resume. This cannot be undone.`}
        confirmLabel="Delete"
        pendingLabel="Deleting…"
      />
    </TabSection>
  )
}

export function ActivitiesTab() {
  const query = useActivities(QUERY)
  const [editor, setEditor] = useState(null)
  const remove = useConfirmAction(useDeleteActivity())

  const columns = [
    { key: 'title', header: 'Activity', className: 'text-heading font-medium' },
    { key: 'type', header: 'Type' },
    { key: 'organizer', header: 'Organised by' },
    { key: 'role', header: 'Your role' },
    { key: 'date', header: 'Date', cell: (row) => formatDate(row.date), className: 'whitespace-nowrap' },
  ]

  return (
    <TabSection
      title="Activities"
      description="Events, drives, competitions and club work you took part in."
      count={query.data?.total}
      query={query}
      isEmpty={(data) => data.items.length === 0}
      empty={{ icon: Sparkles, title: 'No activities yet', description: 'Add events and club work you took part in.' }}
      action={
        <Button size="lg" onClick={() => setEditor({})}>
          <Plus aria-hidden /> Add activity
        </Button>
      }
      render={(data) => (
        <DataTable
          caption="Activities"
          columns={columns}
          rows={data.items}
          minWidth={720}
          rowActions={(row) => <RowActions label={row.title} onEdit={() => setEditor({ item: row })} onDelete={() => remove.request(row)} />}
        />
      )}
    >
      {editor && <ActivityFormModal item={editor.item} onOpenChange={(open) => !open && setEditor(null)} />}
      <ConfirmDialog
        {...remove.dialogProps}
        title="Delete this activity?"
        description={remove.target && `"${remove.target.title}" will be removed from your portfolio. This cannot be undone.`}
        confirmLabel="Delete"
        pendingLabel="Deleting…"
      />
    </TabSection>
  )
}
