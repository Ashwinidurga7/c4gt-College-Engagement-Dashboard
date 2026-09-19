/** Query keys include the role and filters so cached data never leaks between roles or views. */
export const queryKeys = {
  me: ['auth', 'me'],
  student: {
    all: ['student'],
    dashboard: ['student', 'dashboard'],
    profile: ['student', 'profile'],
    academic: ['student', 'academic'],
    courses: (query) => ['student', 'courses', query],
    attendance: ['student', 'attendance'],
    academicReport: ['student', 'academic-report'],
    upcomingEvents: ['student', 'upcoming-events'],
    /** Portfolio resources: certifications, certificates, projects, internships, resumes, achievements, activities. */
    resource: (name, query) => (query === undefined ? ['student', name] : ['student', name, query]),
  },
  clubs: (role, query) => [role, 'clubs', query],
  club: (role, id) => [role, 'club', id],
  events: (role, query) => [role, 'events', query],
  event: (role, id) => [role, 'event', id],
  notifications: (role, query) => (query === undefined ? [role, 'notifications'] : [role, 'notifications', query]),
  unreadCount: (role) => [role, 'notifications', 'unread'],
  roster: (role, query) => (query === undefined ? [role, 'roster'] : [role, 'roster', query]),
  certificateQueue: (role, query) => (query === undefined ? [role, 'certificate-queue'] : [role, 'certificate-queue', query]),
  facultyMe: ['faculty', 'me'],
  hod: {
    all: ['hod'],
    dashboard: ['hod', 'dashboard'],
    students: (query) => ['hod', 'students', query],
    attendance: ['hod', 'attendance'],
    academicReport: ['hod', 'academic-report'],
    pendingCtpos: ['hod', 'ctpos', 'pending'],
  },
  ctpo: {
    dashboard: ['ctpo', 'dashboard'],
    students: (query) => ['ctpo', 'students', query],
    attendance: ['ctpo', 'attendance'],
    academicReport: ['ctpo', 'academic-report'],
  },
}
