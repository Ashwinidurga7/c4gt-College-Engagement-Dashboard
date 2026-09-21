import { looksLikeEmail } from '@/features/student/resume/resumeFormat'

/**
 * Named edits on the resume draft, built over `useResumeDraft().update`. Each one returns a
 * new draft object, so the draft is never mutated in place.
 */
export function createDraftActions(update) {
  const setIn = (key, changes) => update((draft) => ({ ...draft, [key]: { ...draft[key], ...changes } }))

  return {
    setPersonal: (field, value) => setIn('personal', { [field]: value }),
    setSummary: (value) => update((draft) => ({ ...draft, summary: value })),
    setTemplate: (value) => update((draft) => ({ ...draft, template: value })),
    setEducation: (field, value) => setIn('education', { [field]: value }),
    setSchool: (rows) => update((draft) => ({ ...draft, school: rows })),
    setSkillText: (key, text) => setIn('skills', { [key]: text }),

    /** Include/exclude or edit one item (project, internship, certificate, ...). */
    setItem: (section, id, changes) =>
      update((draft) => {
        const items = draft.items ?? {}
        const current = items[section]?.[id] ?? {}
        return { ...draft, items: { ...items, [section]: { ...items[section], [id]: { ...current, ...changes } } } }
      }),

    setSectionVisible: (id, visible) => setIn('sectionVisible', { [id]: visible }),

    /** Moves a section one place up (-1) or down (+1) within `order`. */
    moveSection: (order, id, step) =>
      update((draft) => {
        const from = order.indexOf(id)
        const to = from + step
        if (from < 0 || to < 0 || to >= order.length) return draft
        const next = [...order]
        ;[next[from], next[to]] = [next[to], next[from]]
        return { ...draft, sectionOrder: next }
      }),

    /** Remembers resumes uploaded from the builder so the Resume tab can offer "Edit in builder". */
    addSavedResume: (id) => update((draft) => ({ ...draft, savedResumeIds: [...new Set([id, ...(draft.savedResumeIds ?? [])])] })),

    /** Drops a local override so the field follows the profile again (after saving it there). */
    clearPersonal: (field) =>
      update((draft) => {
        const { [field]: _removed, ...personal } = draft.personal ?? {}
        return { ...draft, personal }
      }),
    clearSummary: () =>
      update((draft) => {
        const { summary: _removed, ...rest } = draft
        return rest
      }),
  }
}

/** Name and email are required before the PDF can be downloaded or saved. */
export function validatePersonal(personal) {
  const errors = {}
  if (!personal.name.trim()) errors.name = 'Enter your name as it should appear on the resume.'
  if (!personal.email.trim()) errors.email = 'Enter an email address recruiters can reach you on.'
  else if (!looksLikeEmail(personal.email)) errors.email = 'Enter a valid email address, e.g. name@example.com.'
  return errors
}
