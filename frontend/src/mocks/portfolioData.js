/** Portfolio records for the demo student. */

export const certificationsData = [
  {
    _id: 'cert-aws-cp',
    name: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    issueDate: '2026-06-12',
    expiryDate: '2029-06-12',
    credentialId: 'AWS-CCP-58213',
    credentialUrl: 'https://aws.amazon.com/verification',
  },
  {
    _id: 'cert-nptel-python',
    name: 'Python for Data Science',
    issuer: 'NPTEL (IIT Madras)',
    issueDate: '2025-11-04',
    expiryDate: null,
    credentialId: 'NPTEL25CS46S3314',
    credentialUrl: '',
  },
  {
    _id: 'cert-google-da',
    name: 'Google Data Analytics Professional Certificate',
    issuer: 'Coursera',
    issueDate: '2025-05-20',
    expiryDate: null,
    credentialId: 'GDA-7QK2M',
    credentialUrl: 'https://coursera.org/verify',
  },
]

export const certificatesData = [
  { _id: 'crt-hackathon', title: 'Hackathon Participation', category: 'Hackathon', issuedBy: 'AI Hackathon 2026', date: '2026-09-12', status: 'pending', fileName: 'ai-hackathon-2026.pdf' },
  { _id: 'crt-workshop', title: 'Workshop Completion', category: 'Workshop', issuedBy: 'Web Development Workshop', date: '2026-08-20', status: 'verified', fileName: 'webdev-workshop.pdf', verifiedBy: 'Mrs. K. Sirisha' },
  { _id: 'crt-nss', title: 'NSS Volunteer Certificate', category: 'Participation', issuedBy: 'NSS Special Camp', date: '2026-08-15', status: 'verified', fileName: 'nss-special-camp.pdf', verifiedBy: 'Dr. P. Venkata Rao' },
  { _id: 'crt-sports', title: 'Sports Participation', category: 'Sports', issuedBy: 'Inter-College Tournament', date: '2026-04-06', status: 'verified', fileName: 'intercollege-cricket.jpg', verifiedBy: 'Mr. S. Naga Babu' },
  { _id: 'crt-c4gt', title: 'C4GT Certification', category: 'Achievement', issuedBy: 'C4GT Summit 2026', date: '2026-03-10', status: 'pending', fileName: 'c4gt-summit.pdf' },
  { _id: 'crt-robotics', title: 'Robotics Workshop', category: 'Workshop', issuedBy: 'Robotics Club', date: '2026-02-22', status: 'rejected', fileName: 'robotics-workshop.png', remarks: 'Certificate image is unreadable. Upload a clearer copy.' },
]

export const projectsData = [
  {
    _id: 'proj-traffic',
    title: 'Smart Traffic System',
    description: 'A smart traffic management system using AI and real-time data from junction cameras.',
    techStack: ['IoT', 'Python', 'OpenCV'],
    status: 'completed',
    approvalStatus: 'approved',
    startDate: '2026-06-01',
    endDate: '2026-09-10',
    repoUrl: 'https://github.com/ashwini-durga/smart-traffic',
    liveUrl: '',
  },
  {
    _id: 'proj-cems',
    title: 'College Event Management System',
    description: 'System to manage college events, registrations and notifications for clubs.',
    techStack: ['React', 'Node.js', 'MongoDB'],
    status: 'ongoing',
    approvalStatus: 'pending',
    startDate: '2026-08-01',
    endDate: null,
    repoUrl: 'https://github.com/ashwini-durga/cems',
    liveUrl: '',
  },
  {
    _id: 'proj-chatbot',
    title: 'AI Chatbot for Student Support',
    description: 'Chatbot that answers student queries about timetables, fees and exam schedules.',
    techStack: ['Python', 'NLP', 'FastAPI'],
    status: 'completed',
    approvalStatus: 'approved',
    startDate: '2026-03-01',
    endDate: '2026-06-10',
    repoUrl: '',
    liveUrl: 'https://chatbot.example.org',
  },
]

export const internshipsData = [
  {
    _id: 'intern-smartbridge',
    company: 'SmartBridge',
    role: 'AI/ML Virtual Intern',
    mode: 'Remote',
    startDate: '2026-05-15',
    endDate: '2026-07-15',
    stipend: 0,
    description: 'Built and deployed an image classification model as part of the AICTE virtual internship.',
  },
  {
    _id: 'intern-apsfl',
    company: 'AP State FiberNet',
    role: 'Network Operations Intern',
    mode: 'Onsite',
    startDate: '2025-12-01',
    endDate: '2025-12-31',
    stipend: 5000,
    description: 'Assisted the Kakinada NOC team with link monitoring and outage reports.',
  },
]

export const achievementsData = [
  { _id: 'ach-1', title: 'Runner-up, KIET Code Sprint 2026', category: 'Technical', level: 'College', date: '2026-02-28', description: 'Second place among 64 teams in the 24-hour coding sprint.' },
  { _id: 'ach-2', title: 'Best Volunteer, NSS Special Camp', category: 'Service', level: 'University', date: '2025-12-20', description: 'Recognised for coordinating the village health survey.' },
  { _id: 'ach-3', title: 'Merit Scholarship', category: 'Academic', level: 'College', date: '2025-08-30', description: 'Awarded for the top 5% SGPA in the department.' },
]

export const activitiesData = [
  { _id: 'actv-1', title: 'C4GT Hackathon 2026', type: 'Hackathon', organizer: 'C4GT', role: 'Participant', date: '2026-09-27' },
  { _id: 'actv-2', title: 'NSS Tree Plantation Drive', type: 'Social Service', organizer: 'National Service Scheme', role: 'Volunteer', date: '2026-09-05' },
  { _id: 'actv-3', title: 'Web Development Workshop', type: 'Workshop', organizer: 'C4GT', role: 'Participant', date: '2026-08-20' },
  { _id: 'actv-4', title: 'Inter-College Cricket Tournament', type: 'Sports', organizer: 'Sports Committee', role: 'Player', date: '2026-04-06' },
]

export const resumesData = [
  { _id: 'res-2026', fileName: 'Ashwini_Durga_Resume_2026.pdf', size: 184320, uploadedAt: '2026-09-01T10:00:00+05:30', isPrimary: true },
  { _id: 'res-2025', fileName: 'Ashwini_Durga_Resume_2025.pdf', size: 162816, uploadedAt: '2025-11-10T18:30:00+05:30', isPrimary: false },
]
