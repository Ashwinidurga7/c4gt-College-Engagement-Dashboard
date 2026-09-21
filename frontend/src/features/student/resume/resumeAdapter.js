import { BRAND_NAME } from '@/lib/brand'
import { absoluteUrl, cleanText, toBullets, toList } from '@/features/student/resume/resumeFormat'

/** Body sections in their default order. Personal details are always the header. */
export const SECTION_IDS = ['summary', 'education', 'skills', 'projects', 'experience', 'certifications', 'achievements', 'extracurricular']

export const SECTION_LABELS = {
  personal: 'Personal details',
  summary: 'Summary',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  experience: 'Experience',
  certifications: 'Certifications',
  achievements: 'Achievements',
  extracurricular: 'Extracurricular',
}

export const SKILL_GROUPS = [
  { key: 'languages', label: 'Languages' },
  { key: 'frameworks', label: 'Frameworks and libraries' },
  { key: 'tools', label: 'Tools and platforms' },
  { key: 'other', label: 'Other skills' },
]

const BRANCHES = {
  CSE: 'Computer Science and Engineering',
  'CSE-AI': 'Computer Science and Engineering (Artificial Intelligence)',
  IT: 'Information Technology',
  ECE: 'Electronics and Communication Engineering',
  EEE: 'Electrical and Electronics Engineering',
  MECH: 'Mechanical Engineering',
  CIVIL: 'Civil Engineering',
}

const DEFAULT_PROJECTS = 3
const byNewest = (a, b) => String(b.sortDate ?? '').localeCompare(String(a.sortDate ?? ''))

/** Location from the profile address: the town and state, without house number or PIN code. */
function locationFrom(address) {
  const parts = String(address ?? '').split(',').map((part) => part.replace(/\b\d{6}\b/, '').trim()).filter(Boolean)
  return parts.slice(-2).join(', ')
}

/**
 * ResumeModel built only from API data (see useResumeData). Nothing is invented: fields the
 * API does not provide (skills, school marks, links) start empty and the completeness panel
 * asks for them. Items carry an `id` and an `included` default for the editor checklists.
 */
export function buildBaseModel({ profile = {}, academic = {}, report = {}, projects = [], internships = [], certifications = [], certificates = [], achievements = [], activities = [] }) {
  const [startYear, endYear] = String(academic.batch ?? profile.batch ?? '').split('-')
  const college = academic.college ?? profile.college
  const department = academic.department ?? profile.department
  const graded = (report.semesters ?? []).filter((entry) => entry.sgpa !== null)

  const projectItems = projects
    .map((project) => ({
      id: project.id,
      title: cleanText(project.title),
      techStack: project.techStack ?? [],
      bullets: toBullets(project.description),
      url: project.repoUrl ?? project.liveUrl ?? null,
      sortDate: project.endDate ?? project.startDate,
    }))
    .sort(byNewest)
    .map((item, index) => ({ ...item, included: index < DEFAULT_PROJECTS }))

  const external = certifications.map((item) => ({
    id: `ext-${item.id}`,
    title: cleanText(item.name),
    issuer: cleanText(item.issuer),
    date: item.issueDate,
    url: item.credentialUrl,
    verified: null,
    status: 'external',
    included: true,
  }))
  const institutional = certificates.map((item) => ({
    id: `inst-${item.id}`,
    title: cleanText(item.title),
    issuer: cleanText(item.issuedBy),
    date: item.date,
    url: null,
    verified: item.status === 'verified',
    status: item.status,
    included: item.status === 'verified',
  }))

  return {
    personal: {
      name: cleanText(profile.name),
      email: profile.email ?? '',
      phone: profile.phone ?? '',
      location: locationFrom(profile.address),
      linkedin: '',
      github: '',
      portfolio: '',
    },
    summary: cleanText(profile.bio),
    education: [
      {
        id: 'degree',
        institution: college && college !== 'KIET' ? `${BRAND_NAME} (${college})` : BRAND_NAME,
        degree: 'B.Tech',
        branch: BRANCHES[department] ?? department ?? '',
        startYear: startYear ?? '',
        endYear: endYear ?? '',
        cgpa: academic.cgpa ?? report.cgpa ?? null,
        semestersGraded: graded.length,
        sgpas: graded.map((entry) => ({ semester: entry.semester, sgpa: entry.sgpa })),
        showSgpa: false,
      },
    ],
    school: [],
    skills: { languages: [], frameworks: [], tools: [], other: [] },
    projects: projectItems,
    experience: internships
      .map((item) => ({
        id: item.id,
        company: cleanText(item.company),
        role: cleanText(item.role),
        startDate: item.startDate,
        endDate: item.endDate,
        bullets: toBullets(item.description),
        included: true,
        sortDate: item.startDate,
      }))
      .sort(byNewest),
    certifications: [...external, ...institutional].sort((a, b) => String(b.date ?? '').localeCompare(String(a.date ?? ''))),
    achievements: achievements.map((item) => ({
      id: item.id,
      text: cleanText(item.description ? `${item.title}: ${item.description}` : item.title),
      included: true,
    })),
    extracurricular: activities.map((item) => ({
      id: item.id,
      title: cleanText(item.title),
      role: cleanText(item.role),
      description: cleanText([item.type, item.organizer].filter(Boolean).join(', ')),
      included: true,
    })),
    sectionOrder: SECTION_IDS,
    sectionVisible: Object.fromEntries(SECTION_IDS.map((id) => [id, true])),
    template: 'classic',
  }
}

/** Applies per-item draft choices (included, bullets) over the API list. */
function mergeItems(items, choices = {}) {
  return items.map((item) => {
    const choice = choices[item.id]
    if (!choice) return item
    const locked = item.status === 'rejected'
    return { ...item, ...choice, included: locked ? false : (choice.included ?? item.included) }
  })
}

/** The editor's model: API data with the student's local draft laid over it. */
export function applyDraft(base, draft = {}) {
  const items = draft.items ?? {}
  const order = (draft.sectionOrder ?? []).filter((id) => SECTION_IDS.includes(id))
  return {
    ...base,
    personal: { ...base.personal, ...draft.personal },
    summary: draft.summary ?? base.summary,
    education: base.education.map((entry, index) => (index === 0 ? { ...entry, ...draft.education } : entry)),
    school: draft.school ?? base.school,
    // Skills are kept as the typed text (so commas can be typed) and read as lists.
    skills: Object.fromEntries(SKILL_GROUPS.map(({ key }) => [key, draft.skills?.[key] === undefined ? base.skills[key] : toList(draft.skills[key])])),
    projects: mergeItems(base.projects, items.projects),
    experience: mergeItems(base.experience, items.experience),
    certifications: mergeItems(base.certifications, items.certifications),
    achievements: mergeItems(base.achievements, items.achievements),
    extracurricular: mergeItems(base.extracurricular, items.extracurricular),
    sectionOrder: [...order, ...SECTION_IDS.filter((id) => !order.includes(id))],
    sectionVisible: { ...base.sectionVisible, ...draft.sectionVisible },
    template: draft.template ?? base.template,
  }
}

const filled = (list) => list.map((text) => cleanText(text)).filter(Boolean)

/** Whether a section has anything to print once exclusions are applied. */
export function sectionHasContent(model, id) {
  const included = (list) => list.some((item) => item.included)
  switch (id) {
    case 'summary':
      return Boolean(model.summary.trim())
    case 'education':
      return model.education.length > 0 || model.school.length > 0
    case 'skills':
      return Object.values(model.skills).some((list) => list.length > 0)
    default:
      return included(model[id] ?? [])
  }
}

/** What the PDF renders: visible sections with content, included items only, clean text. */
export function toPrintModel(model) {
  const pick = (list) => list.filter((item) => item.included)
  return {
    personal: {
      ...Object.fromEntries(Object.entries(model.personal).map(([key, value]) => [key, cleanText(value)])),
      links: ['linkedin', 'github', 'portfolio'].map((key) => model.personal[key]).filter((value) => value?.trim()).map((value) => ({ text: value.trim(), url: absoluteUrl(value) })),
    },
    summary: cleanText(model.summary),
    education: model.education,
    school: model.school.filter((row) => row.level || row.institution),
    skills: SKILL_GROUPS.map((group) => ({ ...group, items: filled(model.skills[group.key]) })).filter((group) => group.items.length),
    projects: pick(model.projects).map((item) => ({ ...item, bullets: filled(item.bullets), url: absoluteUrl(item.url) })),
    experience: pick(model.experience).map((item) => ({ ...item, bullets: filled(item.bullets) })),
    certifications: pick(model.certifications).map((item) => ({ ...item, url: absoluteUrl(item.url) })),
    achievements: pick(model.achievements).map((item) => item.text),
    extracurricular: pick(model.extracurricular),
    sections: model.sectionOrder.filter((id) => model.sectionVisible[id] && sectionHasContent(model, id)),
    template: model.template,
  }
}
