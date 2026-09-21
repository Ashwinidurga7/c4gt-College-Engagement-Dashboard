import { ClipboardList, GraduationCap, ShieldCheck, UserRoundCog, Users } from 'lucide-react'

const ROLES = {
  STUDENT: 'student',
  FACULTY: 'faculty',
  HOD: 'hod',
  CTPO: 'ctpo',
  ADMIN: 'admin',
}

export const ROLE_META = {
  student: {
    label: 'Student',
    description: 'Academics, portfolio and campus life',
    icon: GraduationCap,
    tone: 'blue',
  },
  faculty: {
    label: 'Faculty',
    description: 'Student roster and certificate verification',
    icon: Users,
    tone: 'green',
  },
  hod: {
    label: 'HOD',
    description: 'Department oversight and approvals',
    icon: UserRoundCog,
    tone: 'purple',
  },
  ctpo: {
    label: 'CTPO',
    description: 'Class teacher and placement officer',
    icon: ClipboardList,
    tone: 'teal',
  },
  admin: {
    label: 'Admin',
    description: 'Institution-wide management',
    icon: ShieldCheck,
    tone: 'orange',
  },
}

export const ROLE_LIST = Object.values(ROLES)

export function isRole(value) {
  return ROLE_LIST.includes(value)
}

export function roleLabel(role) {
  return ROLE_META[role]?.label ?? 'Unknown'
}

export function dashboardPath(role) {
  return isRole(role) ? `/${role}/dashboard` : '/login'
}

/** Roles that need an approver before they can sign in. */
export const APPROVAL_ROUTE = {
  faculty: 'Admin',
  hod: 'Admin',
  ctpo: 'HOD',
}
