import { CircleCheck, DoorOpen, TriangleAlert, UserRound, Wand2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { SectionCard } from '@/components/common/SectionCard'
import { Button } from '@/components/ui/button'
import { useMoveTimetableEntry } from '@/hooks/usePreview'
import { entryToMove, suggestSlot } from '@/lib/timetable'

/** Lists detected clashes; "Resolve" proposes the nearest free slot and applies it only after confirmation. */
export function ConflictPanel({ conflicts, entries, preferredSection }) {
  const move = useMoveTimetableEntry()
  const [proposal, setProposal] = useState(null)

  function propose(conflict) {
    const entry = entryToMove(conflict, preferredSection)
    const target = suggestSlot(entries, entry)
    if (!target) {
      toast.error(`No free slot this week for ${entry.faculty} in ${entry.room}. Adjust the timetable manually.`)
      return
    }
    setProposal({ entry, target })
  }

  return (
    <SectionCard
      title="Conflicts"
      icon={TriangleAlert}
      description="Same faculty member or room booked twice in one slot, across all sections."
    >
      {conflicts.length === 0 ? (
        <p className="text-success-text bg-success-soft flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium" role="status">
          <CircleCheck className="size-4" aria-hidden /> No conflicts found.
        </p>
      ) : (
        <ul className="flex flex-col gap-3" aria-live="polite">
          {conflicts.map((conflict) => {
            const Icon = conflict.type === 'faculty' ? UserRound : DoorOpen
            return (
              <li key={conflict.id} className="border-danger/40 flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="text-heading flex items-center gap-2 text-sm font-semibold">
                    <Icon className="text-danger-text size-4 shrink-0" aria-hidden />
                    {conflict.type === 'faculty' ? 'Faculty clash' : 'Room clash'}: {conflict.resource}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {conflict.day} {conflict.slot} · {conflict.entries.map((entry) => `${entry.subject} (Section ${entry.section})`).join(' and ')}
                  </p>
                </div>
                <Button variant="outline" size="lg" onClick={() => propose(conflict)}>
                  <Wand2 aria-hidden /> Resolve<span className="sr-only"> {conflict.type} clash on {conflict.day} {conflict.slot}</span>
                </Button>
              </li>
            )
          })}
        </ul>
      )}
      <ConfirmDialog
        open={proposal !== null}
        onOpenChange={(open) => !open && setProposal(null)}
        tone="primary"
        title="Move this class?"
        description={
          proposal &&
          `Move ${proposal.entry.subject} (Section ${proposal.entry.section}, ${proposal.entry.faculty}, ${proposal.entry.room}) from ${proposal.entry.day} ${proposal.entry.slot} to ${proposal.target.day} ${proposal.target.slot}. That is the nearest slot where the section, faculty member and room are all free.`
        }
        confirmLabel="Move class"
        pendingLabel="Moving…"
        isPending={move.isPending}
        onConfirm={() =>
          move.mutate(
            { id: proposal.entry.id, ...proposal.target },
            { onSuccess: () => setProposal(null), onError: (error) => toast.error(error.message) },
          )
        }
      />
    </SectionCard>
  )
}
