import { nameOf, pick, toId, toNumber } from '@/services/adapterUtils'

const lower = (value, fallback) => String(pick(value, fallback) ?? '').toLowerCase()
const blankToNull = (value) => (value === '' || value === undefined ? null : value)

export function toCertification(raw = {}) {
  return {
    id: toId(raw),
    name: pick(raw.name, raw.title, 'Certification'),
    issuer: pick(raw.issuer, raw.issuingOrganization, raw.organization),
    issueDate: pick(raw.issueDate, raw.issuedOn, raw.date),
    expiryDate: pick(raw.expiryDate, raw.expiresOn),
    credentialId: pick(raw.credentialId, raw.certificateId),
    credentialUrl: pick(raw.credentialUrl, raw.url, raw.link),
  }
}

export function toCertificationPayload(values) {
  return {
    name: values.name.trim(),
    issuer: values.issuer.trim(),
    issueDate: values.issueDate,
    expiryDate: blankToNull(values.expiryDate),
    credentialId: values.credentialId.trim(),
    credentialUrl: values.credentialUrl.trim(),
  }
}

export function toCertificate(raw = {}) {
  const verified = raw.isVerified === true || raw.verified === true
  return {
    id: toId(raw),
    title: pick(raw.title, raw.name, 'Certificate'),
    category: pick(raw.category, raw.type, 'General'),
    issuedBy: pick(raw.issuedBy, raw.issuer, raw.event),
    date: pick(raw.date, raw.issueDate, raw.createdAt),
    status: lower(pick(raw.status, raw.verificationStatus), verified ? 'verified' : 'pending'),
    fileUrl: pick(raw.fileUrl, raw.url, raw.file?.url, raw.certificateUrl),
    fileName: pick(raw.fileName, raw.originalName, raw.file?.name),
    verifiedBy: nameOf(raw.verifiedBy),
    remarks: pick(raw.remarks, raw.comment),
    student: raw.student ? { name: nameOf(raw.student), rollNumber: raw.student?.rollNumber ?? null } : null,
  }
}

export function toProject(raw = {}) {
  const stack = raw.techStack ?? raw.technologies ?? raw.tags ?? []
  return {
    id: toId(raw),
    title: pick(raw.title, raw.name, 'Project'),
    description: pick(raw.description, ''),
    techStack: Array.isArray(stack) ? stack : String(stack).split(',').map((item) => item.trim()).filter(Boolean),
    status: lower(raw.status, 'ongoing'),
    approvalStatus: raw.approvalStatus ? lower(raw.approvalStatus) : null,
    startDate: raw.startDate ?? null,
    endDate: raw.endDate ?? null,
    repoUrl: pick(raw.repoUrl, raw.githubUrl, raw.githubLink),
    liveUrl: pick(raw.liveUrl, raw.demoUrl, raw.projectUrl),
  }
}

export function toProjectPayload(values) {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    techStack: values.techStack.split(',').map((item) => item.trim()).filter(Boolean),
    status: values.status,
    startDate: values.startDate,
    endDate: blankToNull(values.endDate),
    repoUrl: values.repoUrl.trim(),
    liveUrl: values.liveUrl.trim(),
  }
}

export function toInternship(raw = {}) {
  return {
    id: toId(raw),
    company: pick(raw.company, raw.companyName, raw.organization, 'Company'),
    role: pick(raw.role, raw.position, raw.title),
    mode: raw.mode ?? null,
    startDate: raw.startDate ?? null,
    endDate: raw.endDate ?? null,
    stipend: toNumber(raw.stipend),
    description: pick(raw.description, ''),
  }
}

export function toInternshipPayload(values) {
  return {
    company: values.company.trim(),
    role: values.role.trim(),
    mode: values.mode,
    startDate: values.startDate,
    endDate: values.endDate,
    stipend: values.stipend === '' ? 0 : Number(values.stipend),
    description: values.description.trim(),
  }
}

export function toResume(raw = {}) {
  return {
    id: toId(raw),
    fileName: pick(raw.fileName, raw.originalName, raw.name, 'Resume.pdf'),
    fileUrl: pick(raw.fileUrl, raw.url),
    size: toNumber(raw.size),
    uploadedAt: pick(raw.uploadedAt, raw.createdAt),
    isPrimary: Boolean(raw.isPrimary ?? raw.primary),
  }
}

export function toAchievement(raw = {}) {
  return {
    id: toId(raw),
    title: pick(raw.title, raw.name, 'Achievement'),
    category: raw.category ?? null,
    level: raw.level ?? null,
    date: pick(raw.date, raw.createdAt),
    description: pick(raw.description, ''),
  }
}

export function toPortfolioActivity(raw = {}) {
  return {
    id: toId(raw),
    title: pick(raw.title, raw.name, 'Activity'),
    type: pick(raw.type, raw.category),
    organizer: pick(nameOf(raw.organizer), nameOf(raw.club)),
    role: raw.role ?? null,
    date: pick(raw.date, raw.createdAt),
  }
}
