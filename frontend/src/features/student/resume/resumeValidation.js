import { applyDraft, SKILL_GROUPS, toPrintModel } from '@/features/student/resume/resumeAdapter'
import { validatePersonal } from '@/features/student/resume/resumeDraftActions'

/** Longest value each editor field accepts, used both as the input's maxLength and in the checks. */
export const LIMITS = {
  name: 60,
  location: 60,
  link: 100,
  summary: 500,
  institution: 80,
  degree: 40,
  branch: 60,
  board: 40,
  score: 15,
  skillGroup: 200,
  phone: 15,
}

const SKILL_MAX = 30
const DEGREE_SPAN = 8

/** Board, degree and branch names: letters first, then letters, spaces and . , & ( ) ' - (no digits). */
const WORDS = /^\p{L}[\p{L}\p{M} .,&()'-]*$/u
/** School and college names may also carry numbers and a slash, e.g. "ZPHS No. 2" or "Sri Chaitanya Jr/College". */
const INSTITUTION = /^[\p{L}\p{N}][\p{L}\p{M}\p{N} .,&()'/-]*$/u
/** One skill, e.g. C++, C#, Node.js or CI/CD. */
const SKILL = /^[\p{L}\p{M}\p{N} +#./&()'-]+$/u
const SCORE = /^(\d{1,3}(?:\.\d{1,2})?)\s*(%|cgpa|gpa|\/\s*10)?$/i
const YEAR = /^\d{4}$/

/** Keeps only digits, at most `max` of them (for year fields). */
export function digitsOnly(value, max = 4) {
  return String(value ?? '').replace(/\D/g, '').slice(0, max)
}

/** Keeps only the characters a phone number can contain: digits, +, spaces and hyphens. */
export function phoneChars(value) {
  return String(value ?? '').replace(/[^\d+ -]/g, '').slice(0, LIMITS.phone)
}

/** What is wrong with one skill, or null when it is fine. */
export function skillProblem(skill) {
  const value = String(skill ?? '').trim()
  if (value.length > SKILL_MAX) return `"${value.slice(0, 20)}..." is too long. Keep each skill under ${SKILL_MAX} characters.`
  if (!SKILL.test(value)) return `"${value}" has characters a skill cannot use. Letters, numbers and + # . / & ( ) ' - are fine.`
  return null
}

const thisYear = () => new Date().getFullYear()

function checkWords(value, label) {
  if (value && !WORDS.test(value)) return `Use letters only for the ${label}, with spaces and . , & ( ) ' - if needed. No numbers.`
  return null
}

function checkInstitution(value) {
  if (value && !INSTITUTION.test(value)) return "Use letters and numbers only, with spaces and . , & ( ) ' / - if needed."
  return null
}

function checkScore(value) {
  if (!value) return null
  const match = SCORE.exec(value)
  if (!match) return 'Enter a percentage or CGPA, e.g. 95.4% or 9.8 CGPA.'
  const number = Number(match[1])
  const unit = (match[2] ?? '').toLowerCase()
  if (unit === '%' && number > 100) return 'A percentage cannot be more than 100.'
  if (unit && unit !== '%' && number > 10) return 'A CGPA cannot be more than 10.'
  return null
}

function checkYear(value, from, to, label) {
  if (!value) return null
  if (!YEAR.test(value)) return `Enter the ${label} as 4 digits, e.g. ${to}.`
  const year = Number(value)
  if (year < from || year > to) return `The ${label} must be between ${from} and ${to}.`
  return null
}

function validateDegree(degree) {
  const errors = {}
  const add = (field, message) => {
    if (message) errors[field] = message
  }
  const now = thisYear()
  add('institution', checkInstitution(degree.institution?.trim()))
  add('degree', checkWords(degree.degree?.trim(), 'degree'))
  add('branch', checkWords(degree.branch?.trim(), 'branch'))
  const start = String(degree.startYear ?? '').trim()
  const end = String(degree.endYear ?? '').trim()
  add('startYear', checkYear(start, 2000, now, 'start year'))
  add('endYear', checkYear(end, 2000, now + DEGREE_SPAN, 'end year'))
  if (start && end && !errors.startYear && !errors.endYear) {
    const gap = Number(end) - Number(start)
    if (gap < 0) errors.endYear = 'The end year cannot be before the start year.'
    else if (gap > DEGREE_SPAN) errors.endYear = `The end year can be at most ${DEGREE_SPAN} years after the start year.`
  }
  return errors
}

function validateSchoolRow(row) {
  const errors = {}
  const add = (field, message) => {
    if (message) errors[field] = message
  }
  add('board', checkWords(row.board?.trim(), 'board'))
  add('institution', checkInstitution(row.institution?.trim()))
  add('year', checkYear(String(row.year ?? '').trim(), 1990, thisYear(), 'year of passing'))
  add('score', checkScore(row.score?.trim()))
  return errors
}

function validateSkills(list) {
  if (list.join(', ').length > LIMITS.skillGroup) return `Keep this list under ${LIMITS.skillGroup} characters.`
  for (const skill of list) {
    const problem = skillProblem(skill)
    if (problem) return problem
  }
  return null
}

/**
 * Every problem in the editor, by section: `personal`, `education` and `skills` are keyed by field
 * or group, `school` by row id (then field), and `summary` is a message or undefined. Empty optional
 * fields are never errors; `required` adds the missing name and email errors.
 */
export function validateResume(model, { required = true } = {}) {
  const errors = { personal: validatePersonal(model.personal, { required }), summary: undefined, education: {}, school: {}, skills: {} }
  if (model.summary.trim().length > LIMITS.summary) errors.summary = `Keep the summary under ${LIMITS.summary} characters.`
  if (model.education[0]) errors.education = validateDegree(model.education[0])
  model.school.forEach((row) => {
    const rowErrors = validateSchoolRow(row)
    if (Object.keys(rowErrors).length) errors.school[row.id] = rowErrors
  })
  SKILL_GROUPS.forEach(({ key }) => {
    const problem = validateSkills(model.skills[key] ?? [])
    if (problem) errors.skills[key] = problem
  })
  return errors
}

export function hasProblems(errors) {
  return (
    Boolean(errors.summary) ||
    [errors.personal, errors.education, errors.school, errors.skills].some((group) => Object.keys(group).length > 0)
  )
}

const EDUCATION_FIELDS = { institution: 'institution', degree: 'degree', branch: 'branch', startYear: 'start-year', endYear: 'end-year' }
const SCHOOL_FIELDS = ['board', 'institution', 'year', 'score']

/**
 * The first problem in on-screen order (personal, summary, education, school, skills), as the
 * accordion section and the id of the field to focus. Null when there are none.
 */
export function firstProblem(errors) {
  const personal = Object.keys(errors.personal)[0]
  if (personal) return { section: 'personal', field: `resume-${personal}` }
  if (errors.summary) return { section: 'summary', field: 'resume-summary' }
  const degree = Object.keys(EDUCATION_FIELDS).find((field) => errors.education[field])
  if (degree) return { section: 'education', field: `resume-${EDUCATION_FIELDS[degree]}` }
  // Rows are added in the order they appear on screen.
  const rowIds = Object.keys(errors.school)
  if (rowIds.length) {
    const field = SCHOOL_FIELDS.find((name) => errors.school[rowIds[0]][name])
    return { section: 'education', field: `resume-school-${rowIds[0]}-${field}` }
  }
  const group = SKILL_GROUPS.find(({ key }) => errors.skills[key])
  if (group) return { section: 'skills', field: `resume-skills-${group.key}` }
  return null
}

const blank = (object, fieldErrors = {}) => Object.fromEntries(Object.entries(object).map(([key, value]) => [key, fieldErrors[key] ? '' : value]))

/** A copy of the model with every field that has an error blanked and invalid skills left out, so nothing invalid is printed. */
export function withoutInvalid(model, errors) {
  return {
    ...model,
    personal: blank(model.personal, errors.personal),
    summary: errors.summary ? '' : model.summary,
    education: model.education.map((entry, index) => (index === 0 ? blank(entry, errors.education) : entry)),
    school: model.school.map((row) => blank(row, errors.school[row.id])),
    skills: Object.fromEntries(
      Object.entries(model.skills).map(([key, list]) => {
        const valid = list.filter((skill) => !skillProblem(skill))
        return [key, valid.join(', ').length > LIMITS.skillGroup ? [] : valid]
      }),
    ),
  }
}

/** The resume as it prints for this draft: the draft over `base`, with invalid values left out. */
export function printModelFor(base, draft) {
  const model = applyDraft(base, draft)
  return toPrintModel(withoutInvalid(model, validateResume(model, { required: false })))
}
