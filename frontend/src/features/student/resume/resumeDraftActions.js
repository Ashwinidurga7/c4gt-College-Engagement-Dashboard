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

/** Letters in any script, with spaces, dots, apostrophes and hyphens between them (e.g. "B. Ashwini Durga"). */
const NAME = /^[\p{L}\p{M}]+(?:[ .'-]+[\p{L}\p{M}]+)*\.?$/u
/** Place names: letters with spaces, commas, dots and hyphens; no digits. */
const LOCATION = /^[\p{L}\p{M}]+(?:[ ,.'-]+[\p{L}\p{M}]+)*$/u
/** Indian mobile, optionally written with +91 or 0 and spaces or hyphens. */
const PHONE = /^(?:\+91|0)?[6-9]\d{9}$/
const LINK = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i

/**
 * Problems with the personal details, keyed by field. `required` adds the errors for empty name and email,
 * which are shown only when the student tries to download or save; format errors show while typing.
 */
export function validatePersonal(personal, { required = true } = {}) {
  const errors = {}
  const name = personal.name.trim()
  const email = personal.email.trim()
  if (!name) {
    if (required) errors.name = 'Enter your name as it should appear on the resume.'
  } else if (!NAME.test(name)) errors.name = 'Use letters only, with spaces, dots or hyphens. No numbers or symbols such as # or $.'
  if (!email) {
    if (required) errors.email = 'Enter an email address recruiters can reach you on.'
  } else if (!looksLikeEmail(email)) errors.email = 'Enter a valid email address, e.g. name@example.com.'
  const phone = personal.phone.trim()
  if (phone && !PHONE.test(phone.replace(/[\s-]/g, ''))) errors.phone = 'Enter a 10-digit mobile number starting with 6, 7, 8 or 9, with or without +91.'
  const location = personal.location.trim()
  if (location && !LOCATION.test(location)) errors.location = 'Use the town, state and country only, without numbers, e.g. Kakinada, Andhra Pradesh.'
  ;['linkedin', 'github', 'portfolio'].forEach((field) => {
    const value = personal[field]?.trim()
    if (value && !LINK.test(value)) errors[field] = 'Enter a web address, e.g. github.com/your-name.'
  })
  return errors
}
