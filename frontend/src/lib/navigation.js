import {
  BarChart3,
  Bell,
  BookOpen,
  Building2,
  BusFront,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  ClipboardCheck,
  FileBarChart,
  FileCheck2,
  FolderKanban,
  GraduationCap,
  IndianRupee,
  LayoutDashboard,
  Library,
  MapPin,
  NotebookPen,
  PieChart,
  Settings,
  ShieldCheck,
  UserCheck,
  UserRound,
  Users,
  UsersRound,
} from 'lucide-react'

/**
 * Single source of truth for every role's sidebar, routes, breadcrumbs and page titles.
 * `phase` is the build phase that delivers the real page.
 * `preview` marks modules that have no backend endpoint and always run on mock data.
 */
export const NAVIGATION = {
  student: [
    {
      section: 'Overview',
      items: [
        { path: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, phase: 1 },
        { path: 'profile', label: 'Profile', icon: UserRound, phase: 1 },
      ],
    },
    {
      section: 'Academics',
      items: [
        { path: 'academic', label: 'Academic Info', icon: GraduationCap, phase: 1 },
        { path: 'courses', label: 'Courses', icon: BookOpen, phase: 1 },
        { path: 'attendance', label: 'Attendance', icon: CalendarCheck, phase: 1 },
        { path: 'academic-report', label: 'Results', icon: BarChart3, phase: 1 },
        { path: 'timetable', label: 'Timetable', icon: CalendarClock, phase: 6, preview: true },
        { path: 'exams', label: 'Exams', icon: NotebookPen, phase: 6, preview: true },
      ],
    },
    {
      section: 'Portfolio and campus',
      items: [
        { path: 'portfolio', label: 'Portfolio', icon: FolderKanban, phase: 2 },
        { path: 'clubs', label: 'Clubs', icon: UsersRound, phase: 2 },
        { path: 'events', label: 'Events', icon: CalendarDays, phase: 2 },
        { path: 'notifications', label: 'Notifications', icon: Bell, phase: 2 },
      ],
    },
    {
      section: 'Services',
      items: [
        { path: 'fees', label: 'Fees', icon: IndianRupee, phase: 6, preview: true },
        { path: 'bus-pass', label: 'Bus Pass', icon: BusFront, phase: 6, preview: true },
        { path: 'facilities', label: 'Facilities', icon: MapPin, phase: 6, preview: true },
        { path: 'settings', label: 'Settings', icon: Settings, phase: 6, preview: true },
      ],
    },
  ],
  faculty: [
    {
      section: 'Overview',
      items: [
        { path: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, phase: 3 },
        { path: 'notifications', label: 'Notifications', icon: Bell, phase: 3 },
      ],
    },
    {
      section: 'Students',
      items: [
        { path: 'students', label: 'Student Roster', icon: Users, phase: 3 },
        { path: 'certificates', label: 'Certificate Queue', icon: FileCheck2, phase: 3 },
        { path: 'lecture-attendance', label: 'Take Attendance', icon: ClipboardCheck, phase: 6, preview: true },
        { path: 'timetable', label: 'Timetable', icon: CalendarClock, phase: 6, preview: true },
      ],
    },
    {
      section: 'Services',
      items: [
        { path: 'facilities', label: 'Facilities', icon: MapPin, phase: 6, preview: true },
        { path: 'settings', label: 'Settings', icon: Settings, phase: 6, preview: true },
      ],
    },
  ],
  ctpo: [
    {
      section: 'My class',
      items: [
        { path: 'dashboard', label: 'Class Dashboard', icon: LayoutDashboard, phase: 3 },
        { path: 'students', label: 'Section Students', icon: Users, phase: 3 },
        { path: 'attendance', label: 'Section Attendance', icon: CalendarCheck, phase: 3 },
        { path: 'academic-report', label: 'Academic Report', icon: BarChart3, phase: 3 },
        { path: 'timetable', label: 'Timetable', icon: CalendarClock, phase: 6, preview: true },
      ],
    },
    {
      section: 'Services',
      items: [{ path: 'settings', label: 'Settings', icon: Settings, phase: 6, preview: true }],
    },
  ],
  hod: [
    {
      section: 'Department',
      items: [
        { path: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, phase: 4 },
        { path: 'students', label: 'Students', icon: Users, phase: 4 },
        { path: 'attendance', label: 'Attendance Analytics', icon: CalendarCheck, phase: 4 },
        { path: 'academic-report', label: 'Grade Distribution', icon: PieChart, phase: 4 },
        { path: 'ctpo-approvals', label: 'CTPO Approvals', icon: UserCheck, phase: 4 },
      ],
    },
    {
      section: 'Planning',
      items: [
        { path: 'timetable', label: 'Timetable', icon: CalendarClock, phase: 6, preview: true },
        { path: 'courses', label: 'Courses', icon: Library, phase: 6, preview: true },
        { path: 'reports', label: 'Reports', icon: FileBarChart, phase: 6, preview: true },
        { path: 'settings', label: 'Settings', icon: Settings, phase: 6, preview: true },
      ],
    },
  ],
  admin: [
    {
      section: 'Institution',
      items: [
        { path: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, phase: 5 },
        { path: 'users', label: 'All Users', icon: Users, phase: 5 },
        { path: 'approvals', label: 'Approvals', icon: UserCheck, phase: 5 },
        { path: 'verifications', label: 'Verifications', icon: ShieldCheck, phase: 5 },
      ],
    },
    {
      section: 'Campus',
      items: [
        { path: 'clubs', label: 'Clubs', icon: UsersRound, phase: 5 },
        { path: 'events', label: 'Events', icon: CalendarDays, phase: 5 },
      ],
    },
    {
      section: 'Administration',
      items: [
        { path: 'departments', label: 'Departments', icon: Building2, phase: 6, preview: true },
        { path: 'courses', label: 'Courses', icon: Library, phase: 6, preview: true },
        { path: 'timetable', label: 'Timetable', icon: CalendarClock, phase: 6, preview: true },
        { path: 'exams', label: 'Exams', icon: NotebookPen, phase: 6, preview: true },
        { path: 'fees', label: 'Fees', icon: IndianRupee, phase: 6, preview: true },
        { path: 'reports', label: 'Reports', icon: FileBarChart, phase: 6, preview: true },
        { path: 'settings', label: 'Settings', icon: Settings, phase: 6, preview: true },
      ],
    },
  ],
}

export function navItemsFor(role) {
  return (NAVIGATION[role] ?? []).flatMap((group) => group.items)
}

export function findNavItem(role, pathname) {
  const segment = pathname.split('/').filter(Boolean)[1]
  return navItemsFor(role).find((item) => item.path === segment) ?? null
}
