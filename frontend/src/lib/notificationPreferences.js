/** What a user can be notified about, and which roles each category applies to. */
export const NOTIFICATION_CATEGORIES = [
  { key: 'attendance', label: 'Attendance alerts', description: 'When your attendance drops below 75%, and monthly summaries.', roles: ['student'] },
  { key: 'exams', label: 'Examination updates', description: 'JNTUK timetables, fee deadlines, hall tickets and results.', roles: ['student'] },
  { key: 'placements', label: 'Placement announcements', description: 'New drives you are eligible for and changes to your applications.', roles: ['student', 'ctpo', 'hod'] },
  { key: 'events', label: 'Event registration updates', description: 'Confirmations, reminders and changes to events you registered for.', roles: ['student', 'faculty', 'ctpo', 'hod', 'admin'] },
  { key: 'announcements', label: 'Important college announcements', description: 'Holidays, circulars and urgent notices from the college.', roles: ['student', 'faculty', 'ctpo', 'hod', 'admin'] },
]

/** In-app notifications are on for everything; email starts on only for what cannot wait. */
export function defaultNotificationPreferences() {
  return Object.fromEntries(
    NOTIFICATION_CATEGORIES.map((category) => [category.key, { inApp: true, email: ['exams', 'placements', 'announcements'].includes(category.key) }]),
  )
}

export function categoriesFor(role) {
  return NOTIFICATION_CATEGORIES.filter((category) => category.roles.includes(role))
}
