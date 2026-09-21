import { DoorOpen, TriangleAlert, UserRound, Utensils } from 'lucide-react'
import { cellKey, DAYS, SLOTS, slotTimeLabel } from '@/lib/timetable'
import { cn } from '@/lib/utils'

function ClassCell({ entry, conflict, showSection }) {
  return (
    <div
      className={cn(
        'flex h-full min-h-20 flex-col gap-1 rounded-lg border p-2 text-left',
        conflict ? 'border-danger bg-danger-soft' : 'bg-tone-blue border-transparent',
      )}
    >
      <p className="text-heading flex items-start gap-1 text-xs leading-snug font-semibold">
        {conflict && <TriangleAlert className="text-danger-text mt-px size-3.5 shrink-0" aria-hidden />}
        <span>
          {entry.subject}
          {conflict && <span className="sr-only"> (conflict)</span>}
        </span>
      </p>
      {showSection && <p className="text-link text-[11px] font-semibold">Section {entry.section}</p>}
      <p className="text-muted-foreground flex items-center gap-1 text-[11px]">
        <UserRound className="size-3 shrink-0" aria-hidden /> {entry.faculty}
      </p>
      <p className="text-muted-foreground flex items-center gap-1 text-[11px]">
        <DoorOpen className="size-3 shrink-0" aria-hidden /> {entry.room}
      </p>
    </div>
  )
}

/**
 * Monday–Saturday grid with the plan's eight rows (lunch included). Scrolls horizontally
 * inside its card on narrow screens. `conflictIds` marks clashing classes.
 */
export function TimetableGrid({ entries, conflictIds = new Set(), showSection = false, caption }) {
  const byCell = new Map(entries.map((entry) => [cellKey(entry.day, entry.slot), entry]))

  return (
    <div tabIndex={0} role="region" aria-label={caption} className="bg-card shadow-soft relative overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[920px] table-fixed border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <colgroup>
          <col className="w-24" />
          {DAYS.map((day) => (
            <col key={day} />
          ))}
        </colgroup>
        <thead className="bg-sunken text-heading">
          <tr>
            <th scope="col" className="px-3 py-3 text-left font-semibold">
              Time
            </th>
            {DAYS.map((day) => (
              <th key={day} scope="col" className="px-2 py-3 text-left font-semibold">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SLOTS.map((slot) =>
            slot === 'Lunch' ? (
              <tr key={slot} className="border-t">
                <th scope="row" className="text-muted-foreground px-3 py-2 text-left text-xs font-semibold">
                  Lunch
                </th>
                <td colSpan={DAYS.length} className="bg-sunken text-muted-foreground px-3 py-2 text-center text-xs font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <Utensils className="size-3.5" aria-hidden /> Lunch break · {slotTimeLabel('Lunch')}
                  </span>
                </td>
              </tr>
            ) : (
              <tr key={slot} className="border-t align-top">
                <th scope="row" className="text-heading px-3 py-2 text-left text-xs font-semibold whitespace-nowrap">
                  {slot}
                  <span className="text-muted-foreground block font-normal">{slotTimeLabel(slot)}</span>
                </th>
                {DAYS.map((day) => {
                  const entry = byCell.get(cellKey(day, slot))
                  return (
                    <td key={day} className="p-1.5">
                      {entry ? (
                        <ClassCell entry={entry} conflict={conflictIds.has(entry.id)} showSection={showSection} />
                      ) : (
                        <div className="text-muted-foreground flex min-h-20 items-center justify-center rounded-lg border border-dashed text-[11px]">
                          Free
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  )
}
