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
  },
}
