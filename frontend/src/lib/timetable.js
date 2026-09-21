/** Weekly grid defined by the plan: Monday–Saturday, eight rows including lunch. */
export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const SLOTS = ['09:00', '10:00', '11:00', '12:00', 'Lunch', '02:00', '03:00', '04:00']
export const TEACHING_SLOTS = SLOTS.filter((slot) => slot !== 'Lunch')

export function cellKey(day, slot) {
  return `${day}|${slot}`
}

/**
 * A conflict is the same faculty member, or the same room, booked twice in one slot.
 * Returns `[{ id, type: 'faculty' | 'room', resource, day, slot, entries }]`.
 */
export function detectConflicts(entries) {
  const conflicts = []
  ;['faculty', 'room'].forEach((type) => {
    const bySlot = new Map()
    entries.forEach((entry) => {
      const key = `${cellKey(entry.day, entry.slot)}|${entry[type]}`
      bySlot.set(key, [...(bySlot.get(key) ?? []), entry])
    })
    bySlot.forEach((clashing) => {
      if (clashing.length < 2) return
      const [first] = clashing
      conflicts.push({
        id: `${type}|${cellKey(first.day, first.slot)}|${first[type]}`,
        type,
        resource: first[type],
        day: first.day,
        slot: first.slot,
        entries: clashing,
      })
    })
  })
  return conflicts.sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || SLOTS.indexOf(a.slot) - SLOTS.indexOf(b.slot))
}

function isFree(entries, moving, day, slot) {
  return !entries.some(
    (other) =>
      other.id !== moving.id &&
      other.day === day &&
      other.slot === slot &&
      (other.section === moving.section || other.faculty === moving.faculty || other.room === moving.room),
  )
}

/**
 * Nearest slot where the entry's section, faculty and room are all free: the same day first
 * (closest hour), then the following days in order. Returns `{ day, slot }` or null.
 */
export function suggestSlot(entries, moving) {
  const dayIndex = DAYS.indexOf(moving.day)
  const slotIndex = TEACHING_SLOTS.indexOf(moving.slot)
  const orderedDays = DAYS.map((_, offset) => DAYS[(dayIndex + offset) % DAYS.length])
  const orderedSlots = [...TEACHING_SLOTS].sort(
    (a, b) => Math.abs(TEACHING_SLOTS.indexOf(a) - slotIndex) - Math.abs(TEACHING_SLOTS.indexOf(b) - slotIndex) || TEACHING_SLOTS.indexOf(a) - TEACHING_SLOTS.indexOf(b),
  )
  for (const day of orderedDays) {
    for (const slot of orderedSlots) {
      if (day === moving.day && slot === moving.slot) continue
      if (isFree(entries, moving, day, slot)) return { day, slot }
    }
  }
  return null
}

/** The entry to move for a conflict: the one in `preferredSection` if present, otherwise the last booked. */
export function entryToMove(conflict, preferredSection) {
  return conflict.entries.find((entry) => entry.section === preferredSection) ?? conflict.entries[conflict.entries.length - 1]
}

/** "10:00" → "10:00 am", "02:00" → "2:00 pm" (afternoon slots are written without the 24-hour prefix). */
export function slotTimeLabel(slot) {
  if (slot === 'Lunch') return '12:50 – 01:50 pm'
  const [hours] = slot.split(':').map(Number)
  return hours >= 9 ? `${hours}:00 ${hours === 12 ? 'pm' : 'am'}` : `${hours}:00 pm`
}
