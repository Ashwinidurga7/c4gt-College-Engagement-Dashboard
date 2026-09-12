export const campuses = ['KIET', 'KIET+', "KIET Women's"]

export const branchesByCampus = {
  KIET: [
    { code: 'AIDS', name: 'Artificial Intelligence & Data Science' },
    { code: 'CSM', name: 'Computer Science & AI / Machine Learning' },
    { code: 'CAI', name: 'Computer Science & Artificial Intelligence' },
    { code: 'CSC', name: 'Cyber Security' },
    { code: 'CSD', name: 'Computer Science & Data Science' },
  ],
  'KIET+': [
    { code: 'AIDS', name: 'Artificial Intelligence & Data Science' },
    { code: 'CSM', name: 'Computer Science & AI / Machine Learning' },
    { code: 'CAI', name: 'Computer Science & Artificial Intelligence' },
    { code: 'CSC', name: 'Cyber Security' },
    { code: 'CSD', name: 'Computer Science & Data Science' },
  ],
  "KIET Women's": [
    { code: 'AIDS', name: 'Artificial Intelligence & Data Science' },
    { code: 'CSM', name: 'Computer Science & AI / Machine Learning' },
    { code: 'CAI', name: 'Computer Science & Artificial Intelligence' },
  ],
}

export const years = ['1st Year', '2nd Year', '3rd Year', '4th Year']
export const sections = ['A', 'B', 'C']
export const residenceTypes = ['Day Scholar', 'Hosteler']

export const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// Standard monthly base working days in academic calendar
const standardWorkingDays = [22, 20, 23, 21, 18, 22, 24, 22, 23, 20, 22, 21]

export function generateMonthlyAttendance(varianceSeed = 0) {
  return months.map((month, idx) => {
    const workingDays = standardWorkingDays[idx]
    const absentDays = Math.max(0, Math.min(5, 1 + ((idx * 3 + varianceSeed) % 4)))
    const presentDays = workingDays - absentDays
    return {
      month,
      monthIndex: idx,
      workingDays,
      presentDays,
      absentDays,
    }
  })
}

export function calcAttendanceStats(monthlyAttendance = []) {
  const totalWorking = monthlyAttendance.reduce((acc, m) => acc + (m.workingDays || 0), 0)
  const totalPresent = monthlyAttendance.reduce((acc, m) => acc + (m.presentDays || 0), 0)
  const totalAbsent = monthlyAttendance.reduce((acc, m) => acc + (m.absentDays || 0), 0)
  const percentage = totalWorking > 0 ? Number(((totalPresent / totalWorking) * 100).toFixed(1)) : 0
  return {
    totalWorking,
    totalPresent,
    totalAbsent,
    percentage,
  }
}

// Class Teams 1 to 14 (Practical & Project Teams - 5 Members each)
export const classTeamsMeta = [
  { id: 'team-01', teamId: 'Team 01', name: 'Class Team 01', section: 'A', title: 'Smart Campus Energy & Automation System', status: 'Active Class Team', guide: 'Dr. K. V. Ramana (Faculty Advisor)' },
  { id: 'team-02', teamId: 'Team 02', name: 'Class Team 02', section: 'A', title: 'Automated Student Attendance & Hall Ticket Portal', status: 'Active Class Team', guide: 'Dr. K. V. Ramana (Faculty Advisor)' },
  { id: 'team-03', teamId: 'Team 03', name: 'Class Team 03', section: 'A', title: 'Campus Micro-Grid & Solar Power Management', status: 'Active Class Team', guide: 'Dr. K. V. Ramana (Faculty Advisor)' },
  { id: 'team-04', teamId: 'Team 04', name: 'Class Team 04', section: 'A', title: 'Hostel Mess Inventory & Quality Feedback System', status: 'Active Class Team', guide: 'Dr. K. V. Ramana (Faculty Advisor)' },
  { id: 'team-05', teamId: 'Team 05', name: 'Class Team 05', section: 'A', title: 'Precision Agriculture Soil Moisture & Irrigation Node', status: 'Active Class Team', guide: 'Dr. K. V. Ramana (Faculty Advisor)' },
  { id: 'team-06', teamId: 'Team 06', name: 'Class Team 06', section: 'B', title: 'Intelligent College Traffic & Parking Management', status: 'Active Class Team', guide: 'Dr. K. V. Ramana (Faculty Advisor)' },
  { id: 'team-07', teamId: 'Team 07', name: 'Class Team 07', section: 'B', title: 'Library Book Locator & RFID Inventory Tracker', status: 'Active Class Team', guide: 'Dr. K. V. Ramana (Faculty Advisor)' },
  { id: 'team-08', teamId: 'Team 08', name: 'Class Team 08', section: 'B', title: 'Bilingual Campus Notice Board & Speech Transcriber', status: 'Active Class Team', guide: 'Dr. K. V. Ramana (Faculty Advisor)' },
  { id: 'team-09', teamId: 'Team 09', name: 'Class Team 09', section: 'B', title: 'Anti-Tamper Digital Degree & Marksheet Verification', status: 'Active Class Team', guide: 'Dr. K. V. Ramana (Faculty Advisor)' },
  { id: 'team-10', teamId: 'Team 10', name: 'Class Team 10', section: 'B', title: 'Water Quality & Water Tank Overflow Sensor System', status: 'Active Class Team', guide: 'Dr. K. V. Ramana (Faculty Advisor)' },
  { id: 'team-11', teamId: 'Team 11', name: 'Class Team 11', section: 'C', title: 'High-Speed Campus Gate Entry Biometric Verification', status: 'Active Class Team', guide: 'Dr. K. V. Ramana (Faculty Advisor)' },
  { id: 'team-12', teamId: 'Team 12', name: 'Class Team 12', section: 'C', title: 'Automated Workshop Machine Defect Classifier', status: 'Active Class Team', guide: 'Dr. K. V. Ramana (Faculty Advisor)' },
  { id: 'team-13', teamId: 'Team 13', name: 'Class Team 13', section: 'C', title: 'Electric Campus Vehicle Battery Health Telemetry', status: 'Active Class Team', guide: 'Dr. K. V. Ramana (Faculty Advisor)' },
  { id: 'team-14', teamId: 'Team 14', name: 'Class Team 14', section: 'C', title: 'Student Online Assessment & Exam Problem Solver', status: 'Active Class Team', guide: 'Dr. K. V. Ramana (Faculty Advisor)' },
]

// Backward compatibility alias
export const capstoneProjectsMeta = classTeamsMeta

// Premier Demo Student (Roll: 23JN1A4533 / student@kiet.edu) - G. Sai Vamsi (Day Scholar)
const demoMonthly = [
  { month: 'January', monthIndex: 0, workingDays: 22, presentDays: 20, absentDays: 2 },
  { month: 'February', monthIndex: 1, workingDays: 20, presentDays: 18, absentDays: 2 },
  { month: 'March', monthIndex: 2, workingDays: 23, presentDays: 21, absentDays: 2 },
  { month: 'April', monthIndex: 3, workingDays: 21, presentDays: 19, absentDays: 2 },
  { month: 'May', monthIndex: 4, workingDays: 18, presentDays: 15, absentDays: 3 },
  { month: 'June', monthIndex: 5, workingDays: 22, presentDays: 20, absentDays: 2 },
  { month: 'July', monthIndex: 6, workingDays: 24, presentDays: 22, absentDays: 2 },
  { month: 'August', monthIndex: 7, workingDays: 22, presentDays: 19, absentDays: 3 },
  { month: 'September', monthIndex: 8, workingDays: 23, presentDays: 21, absentDays: 2 },
  { month: 'October', monthIndex: 9, workingDays: 20, presentDays: 17, absentDays: 3 },
  { month: 'November', monthIndex: 10, workingDays: 22, presentDays: 20, absentDays: 2 },
  { month: 'December', monthIndex: 11, workingDays: 21, presentDays: 19, absentDays: 2 },
]

const demoStats = calcAttendanceStats(demoMonthly)

export const demoStudent = {
  id: 'stu-demo-23jn1a4533',
  rollNumber: '23JN1A4533',
  password: '23JN1A4533',
  email: 'student@kiet.edu',
  name: 'G. Sai Vamsi',
  campus: 'KIET',
  college: 'Kakinada Institute of Engineering & Technology (KIET)',
  branch: 'AIDS',
  branchName: 'Artificial Intelligence & Data Science',
  year: '3rd Year',
  semester: 'V Semester',
  section: 'A',
  residence: 'Day Scholar',
  hostelBlock: null,
  busRoute: 'Route 03 · Kakinada RTC to Korangi Campus',
  boardingPoint: 'Bhanugudi Junction, Kakinada',
  teamId: 'Team 01',
  teamRole: 'Team 01 Lead',
  attendance: demoStats.percentage, // 89.5%
  monthlyAttendance: demoMonthly,
  fees: {
    total: 98000,
    paid: 98000,
    due: 0,
    dueDate: '30 Sep 2026',
    status: 'Paid',
    academicYear: '2026–27',
    tuition: 75000,
    specialFee: 15000,
    examFee: 8000,
  },
  transport: {
    route: 'Route 03 · Kakinada to Korangi Campus',
    busNumber: 'AP 05 TJ 4512',
    driverName: 'K. Appa Rao',
    driverPhone: '+91 94401 22891',
    boardingPoint: 'Bhanugudi Junction, Kakinada',
    status: 'Active',
    paid: 18000,
    total: 18000,
    balance: 0,
  },
  results: [
    { semester: 'I', sgpa: '8.42', credits: 21.5, status: 'Pass', backlogs: 0 },
    { semester: 'II', sgpa: '8.65', credits: 21.5, status: 'Pass', backlogs: 0 },
    { semester: 'III', sgpa: '8.80', credits: 22.0, status: 'Pass', backlogs: 0 },
    { semester: 'IV', sgpa: '8.92', credits: 22.0, status: 'Pass', backlogs: 0 },
  ],
  cgpa: '8.92',
  // Backlog & Drive eligibility
  activeBacklogs: 0,
  backlogStatus: 'Zero Backlogs (All Clear)',
  driveEligible: true,
  internship: {
    company: 'AWS Cloud Center of Excellence',
    role: 'Cloud Solutions Architecture Intern',
    stipend: '₹15,000 / mo',
    duration: '6 Months',
    status: 'Active',
    type: 'Industrial / AICTE Internship',
  },
  toastmastersMember: true,
  roboticsMember: true,
  smartCityMember: true,
  kiotAttended: true,
  hackathonAttended: true,
  hubMember: true,
  clubs: ['Toastmasters', 'KIET Robotics Lab', 'Smart City Lab', 'KIOT', 'Hackathons', 'Innovation Hub'],
}

const firstNames = [
  'Aditya Varma', 'Bhavya Sri', 'Charan Teja', 'Deepika', 'Harsha Vardhan',
  'Kavya Lakshmi', 'Manoj Sai', 'Nandini Rao', 'Pranavi', 'Rahul Varma',
  'Sanjana', 'Tejaswini', 'Durga Prasad', 'Akhil Kumar', 'Anusha',
  'Dinesh', 'Hemanth', 'Keerthana', 'Lokesh', 'Mahesh',
  'Navya', 'Pawan Kalyan', 'Rakesh', 'Sravani', 'Tarun'
]

const lastInitials = ['M.', 'K.', 'P.', 'R.', 'S.', 'T.', 'V.', 'Ch.', 'B.', 'D.', 'A.', 'N.', 'Y.', 'L.', 'G.']

const teamRolesList = [
  'Team Lead',
  'System / Web Developer',
  'Hardware & Lab Engineer',
  'Data Analyst',
  'Documentation & QA Lead',
]

export const internshipCompanies = [
  { company: 'Tata Consultancy Services (TCS)', role: 'AI & Data Science Intern', stipend: '₹18,000 / mo', type: 'Industrial Internship' },
  { company: 'AWS Cloud Center of Excellence', role: 'DevOps & Cloud Associate', stipend: '₹16,000 / mo', type: 'Cloud Center CoE' },
  { company: 'Infosys Springboard', role: 'Full Stack & MERN Intern', stipend: '₹14,000 / mo', type: 'Industry CoE' },
  { company: 'Tech Mahindra', role: 'IoT & Smart Sensors Intern', stipend: '₹12,000 / mo', type: 'Industrial Internship' },
  { company: 'Wipro Technologies', role: 'Cybersecurity Associate', stipend: '₹15,000 / mo', type: 'Industry CoE' },
  { company: 'AP Innovation Society (APIS)', role: 'Startup Product Fellow', stipend: '₹10,000 / mo', type: 'Govt. Startup Fellowship' },
  { company: 'KIET Robotics Lab CoE', role: 'Autonomous Systems Engineer', stipend: '₹12,000 / mo', type: 'KIET Institutional Lab' },
]

export const kietHubsMeta = [
  {
    id: 'toastmasters',
    name: 'KIET Toastmasters Club',
    shortName: 'Toastmasters',
    badge: 'International Chapter',
    category: 'Communication & Leadership',
    description: 'Chartered Toastmasters International chapter (Club #06541290) empowering engineering scholars in public speaking, impromptu speech crafting, and executive leadership.',
    image: '/images/kiet/toastmasterslogo.jpg',
    coverImage: '/images/kiet/aboutus_club2.jpg',
    facultyLead: 'Prof. M. S. R. Prasad (Dean & HOD)',
    meetingTime: 'Every Saturday 3:00 PM • Central Seminar Hall',
    color: '#004165',
    accentBg: '#e6f0f7',
    icon: 'mic',
  },
  {
    id: 'robotics',
    name: 'KIET Robotics & Automation Lab',
    shortName: 'Robotics Lab',
    badge: 'Center of Excellence',
    category: 'Robotics & Embedded Systems',
    description: 'Premier robotics research lab equipped with 6-DOF industrial robotic arms, ROS-enabled autonomous rovers, hexacopter drone platforms, and machine vision telemetry.',
    image: '/images/kiet/roboticslogo.jpg',
    coverImage: '/images/kiet/aboutus_club1.jpg',
    facultyLead: 'Dr. K. V. Ramana',
    meetingTime: 'Mon - Fri 4:00 PM • Lab Block II, Robotics Bay',
    color: '#d97706',
    accentBg: '#fef3c7',
    icon: 'cpu',
  },
  {
    id: 'smartcity',
    name: 'KIET Smart City Lab',
    shortName: 'Smart City Lab',
    badge: 'IoT Center of Excellence',
    category: 'Urban IoT & Sensor Networks',
    description: 'Flagship research node deploying LoRaWAN and edge IoT sensor clusters across Korangi, Kakinada and Yanam for smart streetlighting, flood early warnings, and solar telemetry.',
    image: '/images/kiet/smartcitylogo.jpg',
    coverImage: '/images/kiet/aboutus_kiet.jpg',
    facultyLead: 'Dr. Ch. Srinivas',
    meetingTime: 'Tue & Thu 3:30 PM • IoT Innovation Center',
    color: '#059669',
    accentBg: '#d1fae5',
    icon: 'activity',
  },
  {
    id: 'kiot',
    name: 'KIOT — K-IoT & Industrial Tour',
    shortName: 'KIOT Immersion',
    badge: 'Industry Immersion',
    category: 'Experiential Learning & Industrial Visits',
    description: 'Flagship KIET K-IoT initiative integrating intensive hands-on IoT hardware bootcamps, sensor fabrications, and curated industrial visits to tech clusters.',
    image: '/images/kiet/aboutus_kiot.png',
    coverImage: '/images/kiet/aboutus_kiot.png',
    facultyLead: 'Industry Relations & Tech Dean',
    meetingTime: 'Cohort Immersion Cycles & Semester Tours',
    color: '#2563eb',
    accentBg: '#dbeafe',
    icon: 'compass',
  },
  {
    id: 'hackathons',
    name: 'KIET Hackathons & Codeathons Cell',
    shortName: 'Hackathons',
    badge: 'Competitive Innovation',
    category: 'Competitions & Hackathons',
    description: 'High-intensity competitive coding, Smart India Hackathon (SIH) teams, AP Innovation Society challenges, and national 36-hour hackathons.',
    image: '/images/kiet/aboutus_hackathon.jpg',
    coverImage: '/images/kiet/aboutus_hackathon.jpg',
    facultyLead: 'Prof. P. Suresh',
    meetingTime: 'Weekly Code Sprints & Hack Weekends',
    color: '#7c3aed',
    accentBg: '#ede9fe',
    icon: 'zap',
  },
  {
    id: 'innovation_hub',
    name: 'KIET Innovation & Incubation Hub',
    shortName: 'Innovation Hub',
    badge: 'Startup & Patent Cell',
    category: 'Incubation & Entrepreneurship',
    description: 'Autonomous incubator providing prototyping grants, patent filing support, seed funding access, and mentorship from Silicon Valley and JNTUK alumni.',
    image: '/images/kiet/aboutus_club1.jpg',
    coverImage: '/images/kiet/aboutus_kiek.jpg',
    facultyLead: 'Head of Innovation & R&D',
    meetingTime: 'Daily Open Incubator Coworking',
    color: '#dc2626',
    accentBg: '#fee2e2',
    icon: 'award',
  },
]

// Generate complete cohort data across all campuses and branches
function generateAllStudents() {
  const list = []

  const cohortSpecs = [
    // KIET Autonomous
    { campus: 'KIET', branch: 'AIDS', branchName: 'Artificial Intelligence & Data Science', total: 180 },
    { campus: 'KIET', branch: 'CSM', branchName: 'Computer Science & AI / Machine Learning', total: 120 },
    { campus: 'KIET', branch: 'CAI', branchName: 'Computer Science & Artificial Intelligence', total: 60 },
    { campus: 'KIET', branch: 'CSC', branchName: 'Cyber Security', total: 60 },
    { campus: 'KIET', branch: 'CSD', branchName: 'Computer Science & Data Science', total: 60 },
    // KIET+
    { campus: 'KIET+', branch: 'AIDS', branchName: 'Artificial Intelligence & Data Science', total: 120 },
    { campus: 'KIET+', branch: 'CSM', branchName: 'Computer Science & AI / Machine Learning', total: 60 },
    { campus: 'KIET+', branch: 'CAI', branchName: 'Computer Science & Artificial Intelligence', total: 60 },
    { campus: 'KIET+', branch: 'CSC', branchName: 'Cyber Security', total: 60 },
    { campus: 'KIET+', branch: 'CSD', branchName: 'Computer Science & Data Science', total: 60 },
    // KIET Women's
    { campus: "KIET Women's", branch: 'AIDS', branchName: 'Artificial Intelligence & Data Science', total: 120 },
    { campus: "KIET Women's", branch: 'CSM', branchName: 'Computer Science & AI / Machine Learning', total: 60 },
    { campus: "KIET Women's", branch: 'CAI', branchName: 'Computer Science & Artificial Intelligence', total: 60 },
  ]

  cohortSpecs.forEach((spec) => {
    const { campus, branch, branchName, total } = spec
    const isMainAids = (campus === 'KIET' && branch === 'AIDS')

    for (let i = 0; i < total; i++) {
      // In KIET AIDS, index 0 is demoStudent G. Sai Vamsi (23JN1A4533), Day Scholar, Team 01 Lead!
      if (isMainAids && i === 0) {
        list.push(demoStudent)
        continue
      }

      const secIndex = Math.min(2, Math.floor(i / 60))
      const section = sections[secIndex]
      const secNum = (i % 60) + 1

      // Teams 1 to 14: 5 members per team (70 students)
      const teamNum = Math.floor(i / 5) + 1
      const teamId = teamNum <= 14 ? `Team ${String(teamNum).padStart(2, '0')}` : null
      const teamRole = teamId ? teamRolesList[i % 5] : null

      // Residence distribution: exactly 1 in 3 is Hosteler, 2 in 3 are Day Scholars
      // For KIET AIDS: i=0 is Day Scholar. i=1 is Hosteler, i=2 is Day Scholar, and for i>=3: i % 3 === 0 is Hosteler
      // Result: exactly 60 Hostelers, 120 Day Scholars!
      let isHosteler = false
      if (isMainAids) {
        isHosteler = (i === 1 || (i >= 3 && i % 3 === 0))
      } else {
        isHosteler = (i % 3 === 0)
      }

      const residence = isHosteler ? 'Hosteler' : 'Day Scholar'
      const hostelBlock = isHosteler
        ? (campus === "KIET Women's"
            ? `Sarada Girls Hostel - Block ${i % 2 === 0 ? 'A' : 'B'} Rm ${200 + (i % 30)}`
            : `Godavari Boys Hostel - Block ${i % 2 === 0 ? 'A' : 'B'} Rm ${300 + (i % 30)}`)
        : null
      const busRouteNum = String(1 + (i % 12)).padStart(2, '0')
      const busRoute = isHosteler ? null : `Route ${busRouteNum} · Kakinada / Yanam / Samalkota`

      const rollPrefix = campus === 'KIET'
        ? (secIndex === 0 ? '23JN1A' : secIndex === 1 ? '23B21A' : '23K11A')
        : (campus === 'KIET+' ? '23P21A' : '23W21A')
      const branchCodeNum = branch === 'AIDS' ? '45' : branch === 'CSM' ? '42' : branch === 'CAI' ? '43' : branch === 'CSC' ? '44' : '46'
      const rollSuffix = String(secNum).padStart(2, '0')
      const rollNumber = `${rollPrefix}${branchCodeNum}${rollSuffix}`

      const name = `${lastInitials[(i + 1) % lastInitials.length]} ${firstNames[i % firstNames.length]}`
      const studentMonthly = generateMonthlyAttendance(i + 1)
      const isShortage = (i % 11 === 0 && !isHosteler)

      // Calculate realistic active backlogs (0, 1, 2, 3, 4+)
      let activeBacklogs = 0
      if (i % 29 === 0 && i !== 0) {
        activeBacklogs = 4 + (i % 2) // 4 or 5 backlogs
      } else if (i % 19 === 0 && i !== 0) {
        activeBacklogs = 3
      } else if (i % 13 === 0 && i !== 0) {
        activeBacklogs = 2
      } else if (i % 8 === 0 && i !== 0) {
        activeBacklogs = 1
      } else {
        activeBacklogs = 0
      }

      const attendanceVal = activeBacklogs > 2 ? 65.5 + (i % 9) : (isShortage ? 68.5 + (i % 6) : 78.5 + (i % 19))
      const cgpaVal = (activeBacklogs > 2 ? 5.8 + (i % 11) / 10 : (activeBacklogs > 0 ? 6.7 + (i % 12) / 10 : 7.4 + (i % 24) / 10)).toFixed(2)

      // Drive eligibility: CGPA >= 7.0, 0 active backlogs, Attendance >= 75%
      const driveEligible = activeBacklogs === 0 && Number(cgpaVal) >= 7.0 && attendanceVal >= 75.0

      // Active Internships (~20-25% of students)
      const hasInternship = (i % 5 === 0 || i === 3 || i === 7) && activeBacklogs <= 1
      const internship = hasInternship ? {
        ...internshipCompanies[i % internshipCompanies.length],
        duration: '6 Months',
        status: 'Active',
      } : null

      // KIET Official Hubs & Clubs
      const toastmastersMember = (i % 5 === 0 || i % 9 === 0)
      const roboticsMember = (i % 6 === 0 || i % 8 === 0 || (branch === 'AIDS' && i % 4 === 0))
      const smartCityMember = (i % 7 === 0 || i % 10 === 0)
      const kiotAttended = (i % 4 === 0 || i % 9 === 0)
      const hackathonAttended = (i % 5 === 0 || i % 7 === 0 || i % 12 === 0)
      const hubMember = (i % 6 === 0 || i % 11 === 0)

      const clubs = []
      if (toastmastersMember) clubs.push('Toastmasters')
      if (roboticsMember) clubs.push('KIET Robotics Lab')
      if (smartCityMember) clubs.push('Smart City Lab')
      if (kiotAttended) clubs.push('KIOT')
      if (hackathonAttended) clubs.push('Hackathons')
      if (hubMember) clubs.push('Innovation Hub')

      const totalFee = 98000
      const paidFee = (i % 5 === 0) ? 68000 : 98000
      const dueFee = totalFee - paidFee

      list.push({
        id: `stu-${campus}-${branch}-${i + 1}`,
        rollNumber,
        password: rollNumber,
        email: `${rollNumber.toLowerCase()}@student.kietgroup.com`,
        name,
        campus,
        college: campus === 'KIET' ? 'Kakinada Institute of Engineering & Technology (KIET)' : campus === 'KIET+' ? 'KIET+ Advanced Technology Studies' : "KIET Women's Engineering College",
        branch,
        branchName,
        year: '3rd Year',
        semester: 'V Semester',
        section,
        residence,
        hostelBlock,
        busRoute,
        boardingPoint: isHosteler ? 'Hostel Complex' : (i % 2 === 0 ? 'Bhanugudi Junction' : 'RTC Complex Kakinada'),
        teamId,
        teamRole,
        attendance: Number(attendanceVal.toFixed(1)),
        monthlyAttendance: studentMonthly,
        activeBacklogs,
        backlogStatus: activeBacklogs === 0 ? 'Zero Backlogs (All Clear)' : `${activeBacklogs} Backlog${activeBacklogs > 1 ? 's' : ''}`,
        driveEligible,
        internship,
        toastmastersMember,
        roboticsMember,
        smartCityMember,
        kiotAttended,
        hackathonAttended,
        hubMember,
        clubs,
        fees: {
          total: totalFee,
          paid: paidFee,
          due: dueFee,
          dueDate: '30 Sep 2026',
          status: dueFee === 0 ? 'Paid' : 'Payment Due',
          academicYear: '2026–27',
          tuition: 75000,
          specialFee: 15000,
          examFee: 8000,
        },
        transport: {
          route: busRoute || 'Hostel Resident',
          busNumber: isHosteler ? 'N/A' : `AP 05 TJ ${4500 + (i % 15)}`,
          driverName: isHosteler ? 'Campus Resident' : (i % 2 === 0 ? 'M. Subba Rao' : 'V. Srinivas'),
          driverPhone: '+91 98480 11223',
          boardingPoint: isHosteler ? 'Hostel Complex' : 'Main Road Point',
          status: isHosteler ? 'Hosteler' : 'Active',
          paid: isHosteler ? 0 : 18000,
          total: isHosteler ? 0 : 18000,
          balance: 0,
        },
        results: [
          { semester: 'I', sgpa: (7.6 + (i % 12) / 10).toFixed(2), credits: 21.5, status: 'Pass', backlogs: 0 },
          { semester: 'II', sgpa: (7.8 + (i % 10) / 10).toFixed(2), credits: 21.5, status: activeBacklogs >= 1 ? 'Backlog (1)' : 'Pass', backlogs: activeBacklogs >= 1 ? 1 : 0 },
          { semester: 'III', sgpa: (8.0 + (i % 8) / 10).toFixed(2), credits: 22.0, status: activeBacklogs >= 2 ? 'Backlog (1)' : 'Pass', backlogs: activeBacklogs >= 2 ? 1 : 0 },
          { semester: 'IV', sgpa: (8.1 + (i % 7) / 10).toFixed(2), credits: 22.0, status: activeBacklogs >= 3 ? `Backlog (${activeBacklogs - 2})` : 'Pass', backlogs: Math.max(0, activeBacklogs - 2) },
        ],
        cgpa: cgpaVal,
      })
    }
  })

  return list
}

export const students = generateAllStudents()

// Department aggregate stats helper for HOD Portal
export function getDepartmentStats(campus = 'KIET', branch = 'AIDS') {
  const cohort = students.filter(s => s.campus === campus && s.branch === branch)
  const total = cohort.length

  const dayScholars = cohort.filter(s => s.residence === 'Day Scholar')
  const hostelers = cohort.filter(s => s.residence === 'Hosteler')

  const zeroBacklogs = cohort.filter(s => (s.activeBacklogs || 0) === 0)
  const backlogs1 = cohort.filter(s => s.activeBacklogs === 1)
  const backlogs2 = cohort.filter(s => s.activeBacklogs === 2)
  const backlogs3 = cohort.filter(s => s.activeBacklogs === 3)
  const backlogs4Plus = cohort.filter(s => (s.activeBacklogs || 0) >= 4)

  const driveEligible = cohort.filter(s => s.driveEligible)
  const driveIneligible = cohort.filter(s => !s.driveEligible)

  const inInternships = cohort.filter(s => s.internship !== null)

  const toastmasters = cohort.filter(s => s.toastmastersMember)
  const robotics = cohort.filter(s => s.roboticsMember)
  const smartCity = cohort.filter(s => s.smartCityMember)
  const kiot = cohort.filter(s => s.kiotAttended)
  const hackathons = cohort.filter(s => s.hackathonAttended)
  const hub = cohort.filter(s => s.hubMember)

  const avgAttendance = total > 0 ? Number((cohort.reduce((acc, s) => acc + s.attendance, 0) / total).toFixed(1)) : 0
  const avgCgpa = total > 0 ? Number((cohort.reduce((acc, s) => acc + Number(s.cgpa || 0), 0) / total).toFixed(2)) : 0

  return {
    campus,
    branch,
    total,
    dayScholarsCount: dayScholars.length,
    hostelersCount: hostelers.length,
    dayScholarsRatio: total > 0 ? Number(((dayScholars.length / total) * 100).toFixed(1)) : 0,
    hostelersRatio: total > 0 ? Number(((hostelers.length / total) * 100).toFixed(1)) : 0,
    zeroBacklogsCount: zeroBacklogs.length,
    zeroBacklogsRatio: total > 0 ? Number(((zeroBacklogs.length / total) * 100).toFixed(1)) : 0,
    backlogs1Count: backlogs1.length,
    backlogs2Count: backlogs2.length,
    backlogs3Count: backlogs3.length,
    backlogs4PlusCount: backlogs4Plus.length,
    driveEligibleCount: driveEligible.length,
    driveEligibleRatio: total > 0 ? Number(((driveEligible.length / total) * 100).toFixed(1)) : 0,
    driveIneligibleCount: driveIneligible.length,
    inInternshipsCount: inInternships.length,
    toastmastersCount: toastmasters.length,
    roboticsCount: robotics.length,
    smartCityCount: smartCity.length,
    kiotCount: kiot.length,
    hackathonsCount: hackathons.length,
    hubCount: hub.length,
    avgAttendance,
    avgCgpa,
  }
}

// Assemble Class Teams for KIET AIDS (Teams 1 to 14 • 5 Members each)
export const capstoneTeams = classTeamsMeta.map((meta) => {
  const members = students.filter(s => s.campus === 'KIET' && s.branch === 'AIDS' && s.teamId === meta.teamId).slice(0, 5)
  const hostelerCount = members.filter(m => m.residence === 'Hosteler').length
  const dayScholarCount = members.filter(m => m.residence === 'Day Scholar').length
  const avgAttendance = members.length
    ? Number((members.reduce((acc, m) => acc + m.attendance, 0) / members.length).toFixed(1))
    : 85.0
  const avgCgpa = members.length
    ? Number((members.reduce((acc, m) => acc + Number(m.cgpa), 0) / members.length).toFixed(2))
    : 8.25
  return {
    ...meta,
    members,
    hostelerCount,
    dayScholarCount,
    avgAttendance,
    avgCgpa,
    memberCount: members.length,
  }
})

export const getStudentByRoll = (rollOrEmail) => {
  const query = String(rollOrEmail || '').trim().toUpperCase()
  return (
    students.find(
      (s) =>
        s.rollNumber.toUpperCase() === query ||
        s.email.toUpperCase() === query ||
        (query === 'STUDENT@KIET.EDU' && s.rollNumber === '23JN1A4533')
    ) || demoStudent
  )
}

