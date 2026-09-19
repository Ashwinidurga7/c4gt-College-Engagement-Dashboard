/** Campus-wide mock content shared by the student dashboard and, later, the events and clubs pages. */

export const clubMemberships = [
  { clubId: 'club-c4gt', name: 'C4GT', college: 'KIET', role: 'Member', joinedOn: '2026-09-15' },
  { clubId: 'club-gcc', name: 'Google Developer Student Clubs', college: 'KIET', role: 'Member', joinedOn: '2025-08-20' },
  { clubId: 'club-nss', name: 'National Service Scheme', college: 'KIET', role: 'Volunteer', joinedOn: '2024-01-10' },
]

export const campusEvents = [
  {
    _id: 'ev-webdev-workshop',
    title: 'Web Development Workshop',
    organizer: 'C4GT',
    category: 'Workshop',
    date: '2026-09-25',
    startTime: '10:00',
    endTime: '13:00',
    venue: 'Lab 2, KIET',
    college: 'KIET',
  },
  {
    _id: 'ev-c4gt-hackathon',
    title: 'C4GT Hackathon 2026',
    organizer: 'C4GT',
    category: 'Hackathon',
    date: '2026-09-27',
    startTime: '09:00',
    endTime: '21:00',
    venue: 'Tech Block',
    college: 'KIET',
  },
  {
    _id: 'ev-open-source-drive',
    title: 'Open Source Contribution Drive',
    organizer: 'Google Developer Student Clubs',
    category: 'Drive',
    date: '2026-10-05',
    startTime: '14:00',
    endTime: '16:00',
    venue: 'Lab 1, KIET',
    college: 'KIET',
  },
  {
    _id: 'ev-tech-talk-scaling',
    title: 'Tech Talk: Building Scalable Web Apps',
    organizer: 'C4GT',
    category: 'Tech Talk',
    date: '2026-10-12',
    startTime: '11:00',
    endTime: '12:30',
    venue: 'Seminar Hall',
    college: 'KIET+',
  },
  {
    _id: 'ev-cricket-intercollege',
    title: 'Inter-College Cricket Tournament',
    organizer: 'Sports Committee',
    category: 'Sports',
    date: '2026-10-15',
    startTime: '08:00',
    endTime: '17:00',
    venue: 'KIET Ground',
    college: 'KIEW',
  },
  {
    _id: 'ev-nss-plantation',
    title: 'NSS Tree Plantation Drive',
    organizer: 'National Service Scheme',
    category: 'Social Service',
    date: '2026-09-05',
    startTime: '07:30',
    endTime: '10:30',
    venue: 'College Grounds',
    college: 'KIET',
  },
]

export const recentActivities = [
  { _id: 'act-1', type: 'club', title: 'You have been added to the C4GT club', date: '2026-09-15T10:20:00+05:30' },
  { _id: 'act-2', type: 'project', title: 'Your project "Smart Traffic System" has been approved', date: '2026-09-12T16:05:00+05:30' },
  { _id: 'act-3', type: 'event', title: 'NSS Tree Plantation Drive registration completed', date: '2026-09-02T09:40:00+05:30' },
  { _id: 'act-4', type: 'result', title: 'Semester 4 results are available', date: '2025-08-06T18:00:00+05:30' },
]

export const campusAnnouncements = [
  {
    _id: 'notice-midterms',
    title: 'Mid-term examinations begin on 6 October',
    body: 'The detailed timetable for all branches is available on the examinations notice board.',
    category: 'Important',
    date: '2026-09-17',
  },
  {
    _id: 'notice-fee-deadline',
    title: 'Semester fee payment closes on 30 September',
    body: 'Pay through the accounts office or the college payment portal to avoid a late fee.',
    category: 'Urgent',
    date: '2026-09-16',
  },
  {
    _id: 'notice-library',
    title: 'Central library open until 9 PM during exams',
    body: 'Extended hours apply from 28 September to 18 October on all working days.',
    category: 'General',
    date: '2026-09-14',
  },
]

/** Reference "today" for mock data so upcoming/past splits stay stable. */
export const MOCK_TODAY = '2026-09-19'
