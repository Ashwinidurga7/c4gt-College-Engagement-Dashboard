// ==========================================================================
// KIET GROUP OF INSTITUTIONS • CENTRAL ADMINISTRATION & MULTI-CAMPUS DATA
// Governing 3 Campuses: KIET (Main Campus), KIET+ (KIET-II), KIET Women's (KIEW)
// Affiliated to JNTUK • Approved by AICTE • NAAC 'A' Grade
// ==========================================================================

export const campusProfiles = [
  {
    code: 'KIET',
    name: 'Kakinada Institute of Engineering & Technology (Main Autonomous Campus)',
    shortName: 'KIET Main Campus',
    established: 2001,
    tag: 'Main Autonomous Campus & Institutional Headquarters',
    location: 'Yanam Road, Korangi, Kakinada District, AP - 533461',
    campusArea: '32 Acres Green Campus',
    director: 'Dr. Ch. Srinivas, Ph.D (Principal & Director)',
    dean: 'Prof. M. S. R. Prasad, M.Tech (Dean Academics & HOD)',
    accreditation: 'NAAC "A" Grade • NBA Accredited • JNTUK Permanent Affiliation',
    totalStudents: 1960,
    totalFaculty: 88,
    totalHODs: 5,
    totalBuses: 12,
    totalWorkers: 42,
    placementRate: '88.5%',
    highestPackage: '₹31.50 LPA',
    avgPackage: '₹6.80 LPA',
    image: '/images/kiet/aboutus_kiet.jpg',
    color: '#0284c7',
  },
  {
    code: 'KIET+',
    name: 'KIET+ Advanced Technology Studies (KIET-II)',
    shortName: 'KIET+ Advanced Tech',
    established: 2008,
    tag: 'Advanced Computing & Innovation Campus',
    location: 'Adjacent Innovation Complex, Korangi Campus, AP',
    campusArea: '22 Acres Tech Park',
    director: 'Dr. P. Suresh, Ph.D (Director & Head of Innovations)',
    dean: 'Dr. P. V. Suresh, Ph.D (Academic Dean KIET+)',
    accreditation: 'Autonomous Status • JNTUK Affiliation • AICTE Approved',
    totalStudents: 1380,
    totalFaculty: 58,
    totalHODs: 5,
    totalBuses: 7,
    totalWorkers: 26,
    placementRate: '84.1%',
    highestPackage: '₹24.00 LPA',
    avgPackage: '₹5.90 LPA',
    image: '/images/kiet/aboutus_kiek.jpg',
    color: '#8b5cf6',
  },
  {
    code: "KIET Women's",
    name: "Kakinada Institute of Engineering & Technology for Women (KIEW)",
    shortName: "KIET Women's College",
    established: 2011,
    tag: "Women's Empowerment & Premier Engineering Campus",
    location: 'Dedicated Women\'s Residential Campus, Korangi, AP',
    campusArea: '18 Acres Protected Campus',
    director: 'Dr. S. K. Padmavathi, Ph.D (Director & Principal KIEW)',
    dean: 'Dr. K. Vijaya Lakshmi, Ph.D (Vice-Principal & Dean)',
    accreditation: 'Autonomous Engineering College for Women • NAAC Accredited',
    totalStudents: 990,
    totalFaculty: 42,
    totalHODs: 3,
    totalBuses: 5,
    totalWorkers: 22,
    placementRate: '85.2%',
    highestPackage: '₹28.00 LPA',
    avgPackage: '₹6.40 LPA',
    image: '/images/kiet/aboutus_kiew.jpg',
    color: '#ec4899',
  },
]

// Year-wise student demographics across the 3 campuses
export const yearWiseDemographics = {
  overall: {
    total: 4330,
    firstYear: 1180,
    secondYear: 1110,
    thirdYear: 1080,
    finalYear: 960,
    dayScholars: 2880,
    hostelers: 1450,
  },
  byCampus: {
    KIET: {
      total: 1960,
      firstYear: 540,
      secondYear: 500,
      thirdYear: 480, // 180 AIDS + 120 CSM + 60 CAI + 60 CSC + 60 CSD
      finalYear: 440,
      dayScholars: 1300,
      hostelers: 660,
      branches: [
        { branch: 'AIDS', firstYear: 180, secondYear: 180, thirdYear: 180, finalYear: 160, total: 700, dayScholars: 460, hostelers: 240 },
        { branch: 'CSM', firstYear: 140, secondYear: 130, thirdYear: 120, finalYear: 110, total: 500, dayScholars: 330, hostelers: 170 },
        { branch: 'CAI', firstYear: 75, secondYear: 65, thirdYear: 60, finalYear: 60, total: 260, dayScholars: 175, hostelers: 85 },
        { branch: 'CSC', firstYear: 75, secondYear: 65, thirdYear: 60, finalYear: 55, total: 255, dayScholars: 170, hostelers: 85 },
        { branch: 'CSD', firstYear: 70, secondYear: 60, thirdYear: 60, finalYear: 55, total: 245, dayScholars: 165, hostelers: 80 },
      ],
    },
    'KIET+': {
      total: 1380,
      firstYear: 380,
      secondYear: 350,
      thirdYear: 360, // 120 AIDS + 60 CSM + 60 CAI + 60 CSC + 60 CSD
      finalYear: 290,
      dayScholars: 920,
      hostelers: 460,
      branches: [
        { branch: 'AIDS', firstYear: 130, secondYear: 120, thirdYear: 120, finalYear: 100, total: 470, dayScholars: 310, hostelers: 160 },
        { branch: 'CSM', firstYear: 65, secondYear: 60, thirdYear: 60, finalYear: 50, total: 235, dayScholars: 155, hostelers: 80 },
        { branch: 'CAI', firstYear: 65, secondYear: 60, thirdYear: 60, finalYear: 50, total: 235, dayScholars: 160, hostelers: 75 },
        { branch: 'CSC', firstYear: 60, secondYear: 55, thirdYear: 60, finalYear: 45, total: 220, dayScholars: 145, hostelers: 75 },
        { branch: 'CSD', firstYear: 60, secondYear: 55, thirdYear: 60, finalYear: 45, total: 220, dayScholars: 150, hostelers: 70 },
      ],
    },
    "KIET Women's": {
      total: 990,
      firstYear: 260,
      secondYear: 260,
      thirdYear: 240, // 120 AIDS + 60 CSM + 60 CAI
      finalYear: 230,
      dayScholars: 660,
      hostelers: 330,
      branches: [
        { branch: 'AIDS', firstYear: 130, secondYear: 130, thirdYear: 120, finalYear: 110, total: 490, dayScholars: 330, hostelers: 160 },
        { branch: 'CSM', firstYear: 65, secondYear: 65, thirdYear: 60, finalYear: 60, total: 250, dayScholars: 165, hostelers: 85 },
        { branch: 'CAI', firstYear: 65, secondYear: 65, thirdYear: 60, finalYear: 60, total: 250, dayScholars: 165, hostelers: 85 },
      ],
    },
  },
}

// Campus Placements & Recruitment Intelligence
export const campusPlacementData = {
  groupSummary: {
    totalEligibleFinalYear: 960,
    totalPlaced: 832,
    placementPercentage: 86.7,
    highestPackageLPA: 31.5,
    averagePackageLPA: 6.65,
    medianPackageLPA: 5.5,
    topRecruitingSector: 'AI, Cloud Architecture & Enterprise Software',
    totalCompaniesVisited: 68,
    activeOngoingDrives: 6,
  },
  byCampus: [
    {
      campus: 'KIET',
      eligible: 440,
      placed: 389,
      placementRate: '88.4%',
      highestPackage: '₹31.50 LPA (Amazon AWS)',
      avgPackage: '₹6.80 LPA',
      offersCount: 512,
      topCompanies: ['Amazon AWS', 'TCS Digital', 'Infosys', 'Tech Mahindra', 'Wipro Turbo'],
    },
    {
      campus: 'KIET+',
      eligible: 290,
      placed: 244,
      placementRate: '84.1%',
      highestPackage: '₹24.00 LPA (ServiceNow)',
      avgPackage: '₹5.90 LPA',
      offersCount: 318,
      topCompanies: ['ServiceNow', 'Tech Mahindra', 'Accenture', 'Cognizant', 'HCL Tech'],
    },
    {
      campus: "KIET Women's",
      eligible: 230,
      placed: 199,
      placementRate: '86.5%',
      highestPackage: '₹28.00 LPA (Microsoft)',
      avgPackage: '₹6.40 LPA',
      offersCount: 264,
      topCompanies: ['Microsoft', 'TCS Prime', 'Infosys Springboard', 'Wipro Elite', 'Capgemini'],
    },
  ],
  topHiringPartners: [
    { name: 'Amazon Web Services (AWS)', category: 'Tier-1 Cloud', packages: '₹18.0 - ₹31.5 LPA', hiredCount: 28, logo: '☁️' },
    { name: 'Tata Consultancy Services (TCS)', category: 'Enterprise IT & AI', packages: '₹7.2 - ₹14.0 LPA', hiredCount: 164, logo: '🏢' },
    { name: 'Infosys Springboard', category: 'Global Systems', packages: '₹6.5 - ₹12.0 LPA', hiredCount: 142, logo: '💻' },
    { name: 'ServiceNow', category: 'Cloud Platform', packages: '₹14.0 - ₹24.0 LPA', hiredCount: 18, logo: '⚡' },
    { name: 'Tech Mahindra IoT Lab', category: 'Smart Devices & Telecom', packages: '₹5.5 - ₹10.5 LPA', hiredCount: 96, logo: '📱' },
    { name: 'Wipro Technologies', category: 'Software & Security', packages: '₹6.5 - ₹11.0 LPA', hiredCount: 110, logo: '🌐' },
    { name: 'AP Innovation Society (APIS)', category: 'Govt. Startup Fellowship', packages: '₹4.8 - ₹8.0 LPA', hiredCount: 36, logo: '🏛️' },
    { name: 'Accenture Technology', category: 'Consulting & Analytics', packages: '₹5.8 - ₹10.0 LPA', hiredCount: 88, logo: '🚀' },
  ],
  recentPlacedStudents: [
    { roll: '22JN1A4508', name: 'M. Harsha Vardhan', campus: 'KIET', branch: 'AIDS', company: 'Amazon AWS', role: 'Cloud Solutions Associate', package: '₹31.5 LPA', date: '04 Sep 2026' },
    { roll: '22W21A4514', name: 'K. Pranavi Sri', campus: "KIET Women's", branch: 'AIDS', company: 'Microsoft', role: 'Software Engineer', package: '₹28.0 LPA', date: '01 Sep 2026' },
    { roll: '22P21A4502', name: 'G. Tejaswini', campus: 'KIET+', branch: 'AIDS', company: 'ServiceNow', role: 'System Developer', package: '₹24.0 LPA', date: '28 Aug 2026' },
    { roll: '22JN1A4211', name: 'Ch. Manoj Sai', campus: 'KIET', branch: 'CSM', company: 'TCS Digital', role: 'AI & Data Specialist', package: '₹14.0 LPA', date: '25 Aug 2026' },
    { roll: '22W21A4205', name: 'V. Sanjana', campus: "KIET Women's", branch: 'CSM', company: 'TCS Prime', role: 'Full Stack Engineer', package: '₹11.5 LPA', date: '22 Aug 2026' },
    { roll: '22P21A4309', name: 'R. Akhil Kumar', campus: 'KIET+', branch: 'CAI', company: 'Infosys Springboard', role: 'Cloud Architect', package: '₹12.0 LPA', date: '18 Aug 2026' },
    { roll: '22JN1A4415', name: 'P. Dinesh', campus: 'KIET', branch: 'CSC', company: 'Wipro CyberSec', role: 'Security Analyst', package: '₹10.5 LPA', date: '15 Aug 2026' },
    { roll: '22JN1A4533', name: 'G. Sai Vamsi', campus: 'KIET', branch: 'AIDS', company: 'AWS Cloud CoE', role: 'Cloud Architect Intern (PPO)', package: '₹16.0 LPA', date: '10 Aug 2026' },
  ],
}

// Complete Institutional Roster of Heads of Departments (HODs)
export const institutionalHods = [
  // KIET Main Campus HODs
  {
    id: 'hod-kiet-aids',
    name: 'Prof. M. S. R. Prasad',
    title: 'Head of Department & Academic Dean',
    qualification: 'M.Tech, (Ph.D) • 22 Years Exp',
    department: 'Artificial Intelligence & Data Science (AIDS)',
    deptCode: 'AIDS',
    campus: 'KIET',
    campusTag: 'KIET Main Campus',
    office: 'R&D Block I, Room 204',
    phone: '+91 94401 88412',
    email: 'hod.aids@kiet.edu',
    cabinHours: '10:00 AM - 4:30 PM',
    photo: null, // Monogram Avatar MP
    specialization: 'Large Scale Data Architecture & Machine Learning',
    publications: 42,
  },
  {
    id: 'hod-kiet-csm',
    name: 'Dr. G. Murali',
    title: 'Head of Department & Professor',
    qualification: 'Ph.D (JNTUK) • 18 Years Exp',
    department: 'Computer Science & AI / ML (CSM)',
    deptCode: 'CSM',
    campus: 'KIET',
    campusTag: 'KIET Main Campus',
    office: 'Computer Science Wing, Room 301',
    phone: '+91 94402 77150',
    email: 'hod.csm@kiet.edu',
    cabinHours: '10:00 AM - 4:00 PM',
    photo: null, // Monogram Avatar GM
    specialization: 'Deep Learning & Computer Vision',
    publications: 36,
  },
  {
    id: 'hod-kiet-cai',
    name: 'Dr. K. Chaitanya',
    title: 'Head of Department & Associate Professor',
    qualification: 'Ph.D • 14 Years Exp',
    department: 'Computer Science & Artificial Intelligence (CAI)',
    deptCode: 'CAI',
    campus: 'KIET',
    campusTag: 'KIET Main Campus',
    office: 'Turing Block, Room 108',
    phone: '+91 94403 66219',
    email: 'hod.cai@kiet.edu',
    cabinHours: '11:00 AM - 4:00 PM',
    photo: null, // Monogram Avatar KC
    specialization: 'Natural Language Processing & LLMs',
    publications: 24,
  },
  {
    id: 'hod-kiet-csc',
    name: 'Dr. S. R. K. Raju',
    title: 'Head of Department & Professor',
    qualification: 'Ph.D (NIT Warangal) • 19 Years Exp',
    department: 'Cyber Security (CSC)',
    deptCode: 'CSC',
    campus: 'KIET',
    campusTag: 'KIET Main Campus',
    office: 'Security Operations Block, Room 202',
    phone: '+91 94404 55188',
    email: 'hod.csc@kiet.edu',
    cabinHours: '9:30 AM - 4:00 PM',
    photo: null, // Monogram Avatar SR
    specialization: 'Cryptographic Protocols & Cloud Defense',
    publications: 31,
  },
  {
    id: 'hod-kiet-csd',
    name: 'Dr. V. Subrahmanyam',
    title: 'Head of Department & Professor',
    qualification: 'Ph.D • 16 Years Exp',
    department: 'Computer Science & Data Science (CSD)',
    deptCode: 'CSD',
    campus: 'KIET',
    campusTag: 'KIET Main Campus',
    office: 'Data Labs Wing, Room 102',
    phone: '+91 94405 44077',
    email: 'hod.csd@kiet.edu',
    cabinHours: '10:00 AM - 3:30 PM',
    photo: null, // Monogram Avatar VS
    specialization: 'Predictive Big Data Modeling',
    publications: 28,
  },

  // KIET+ Advanced Tech HODs
  {
    id: 'hod-kietplus-aids',
    name: 'Dr. P. V. Suresh',
    title: 'Head of Department & Academic Dean (KIET+)',
    qualification: 'Ph.D (Andhra Univ) • 20 Years Exp',
    department: 'Artificial Intelligence & Data Science',
    deptCode: 'AIDS',
    campus: 'KIET+',
    campusTag: 'KIET+ Advanced Tech',
    office: 'Innovation Tower, 4th Floor',
    phone: '+91 94411 33201',
    email: 'hod.aids@kietplus.edu',
    cabinHours: '9:30 AM - 4:30 PM',
    photo: null, // Monogram Avatar PS
    specialization: 'Distributed Intelligence & Edge AI',
    publications: 38,
  },
  {
    id: 'hod-kietplus-csm',
    name: 'Dr. M. Srinivas',
    title: 'Head of Department & Professor',
    qualification: 'Ph.D • 15 Years Exp',
    department: 'Computer Science & AI / ML',
    deptCode: 'CSM',
    campus: 'KIET+',
    campusTag: 'KIET+ Advanced Tech',
    office: 'Tech Park B, Room 210',
    phone: '+91 94412 22199',
    email: 'hod.csm@kietplus.edu',
    cabinHours: '10:00 AM - 4:00 PM',
    photo: null, // Monogram Avatar MS
    specialization: 'Reinforcement Learning & Robotics Vision',
    publications: 22,
  },
  {
    id: 'hod-kietplus-cai',
    name: 'Dr. T. Satyanarayana',
    title: 'Head of Department & Associate Professor',
    qualification: 'Ph.D • 13 Years Exp',
    department: 'Computer Science & Artificial Intelligence',
    deptCode: 'CAI',
    campus: 'KIET+',
    campusTag: 'KIET+ Advanced Tech',
    office: 'Tech Park A, Room 115',
    phone: '+91 94413 11088',
    email: 'hod.cai@kietplus.edu',
    cabinHours: '10:30 AM - 4:00 PM',
    photo: null, // Monogram Avatar TS
    specialization: 'Neural Compute Architectures',
    publications: 19,
  },
  {
    id: 'hod-kietplus-csc',
    name: 'Dr. B. N. Murthy',
    title: 'Head of Department & Professor',
    qualification: 'Ph.D • 17 Years Exp',
    department: 'Cyber Security',
    deptCode: 'CSC',
    campus: 'KIET+',
    campusTag: 'KIET+ Advanced Tech',
    office: 'Tech Park C, Room 304',
    phone: '+91 94414 00977',
    email: 'hod.csc@kietplus.edu',
    cabinHours: '9:30 AM - 4:00 PM',
    photo: null, // Monogram Avatar BM
    specialization: 'Penetration Testing & IoT Network Defense',
    publications: 26,
  },
  {
    id: 'hod-kietplus-csd',
    name: 'Dr. Ch. Rambabu',
    title: 'Head of Department & Professor',
    qualification: 'Ph.D • 16 Years Exp',
    department: 'Computer Science & Data Science',
    deptCode: 'CSD',
    campus: 'KIET+',
    campusTag: 'KIET+ Advanced Tech',
    office: 'Tech Park B, Room 102',
    phone: '+91 94415 99866',
    email: 'hod.csd@kietplus.edu',
    cabinHours: '10:00 AM - 4:00 PM',
    photo: null, // Monogram Avatar CR
    specialization: 'Spatial Data Analytics & Cloud Storage',
    publications: 25,
  },

  // KIET Women's College (KIEW) HODs
  {
    id: 'hod-kiew-aids',
    name: 'Dr. S. K. Padmavathi',
    title: "Principal & Head of Department (KIEW)",
    qualification: 'Ph.D (JNTUH), M.Tech • 21 Years Exp',
    department: 'Artificial Intelligence & Data Science',
    deptCode: 'AIDS',
    campus: "KIET Women's",
    campusTag: "KIET Women's College",
    office: "Women's Administrative Wing, Room 101",
    phone: '+91 94421 88755',
    email: 'principal.kiew@kiet.edu',
    cabinHours: '9:30 AM - 5:00 PM',
    photo: null, // Monogram Avatar SP
    specialization: 'Intelligent Systems & Computational Optimization',
    publications: 46,
  },
  {
    id: 'hod-kiew-csm',
    name: 'Dr. K. Vijaya Lakshmi',
    title: 'Vice-Principal & Head of Department',
    qualification: 'Ph.D • 17 Years Exp',
    department: 'Computer Science & AI / ML',
    deptCode: 'CSM',
    campus: "KIET Women's",
    campusTag: "KIET Women's College",
    office: "Women's Tech Block, Room 204",
    phone: '+91 94422 77644',
    email: 'hod.csm@kiew.edu',
    cabinHours: '10:00 AM - 4:00 PM',
    photo: null, // Monogram Avatar KL
    specialization: 'Pattern Recognition & Machine Vision',
    publications: 29,
  },
  {
    id: 'hod-kiew-cai',
    name: 'Dr. M. Hymavathi',
    title: 'Head of Department & Associate Professor',
    qualification: 'Ph.D • 14 Years Exp',
    department: 'Computer Science & Artificial Intelligence',
    deptCode: 'CAI',
    campus: "KIET Women's",
    campusTag: "KIET Women's College",
    office: "Women's Tech Block, Room 105",
    phone: '+91 94423 66533',
    email: 'hod.cai@kiew.edu',
    cabinHours: '10:30 AM - 4:00 PM',
    photo: null, // Monogram Avatar MH
    specialization: 'Cognitive Computing & Expert Systems',
    publications: 22,
  },
]

// Representative Faculty Roster across all 3 campuses
export const institutionalFaculty = [
  // KIET Main Campus
  { id: 'fac-01', name: 'Dr. K. V. Ramana', designation: 'Professor & Capstone Coordinator', department: 'AIDS', campus: 'KIET', qualification: 'Ph.D (JNTUK)', experience: '16 Years', phone: '+91 98480 22001', email: 'ramana.kv@kiet.edu' },
  { id: 'fac-02', name: 'Dr. P. Suresh', designation: 'Professor & Robotics Lead', department: 'AIDS', campus: 'KIET', qualification: 'Ph.D (IITM)', experience: '18 Years', phone: '+91 98480 22002', email: 'suresh.p@kiet.edu' },
  { id: 'fac-03', name: 'Mrs. D. Lakshmi', designation: 'Associate Professor', department: 'AIDS', campus: 'KIET', qualification: 'M.Tech, (Ph.D)', experience: '11 Years', phone: '+91 98480 22003', email: 'lakshmi.d@kiet.edu' },
  { id: 'fac-04', name: 'Mr. N. V. Rao', designation: 'Assistant Professor', department: 'AIDS', campus: 'KIET', qualification: 'M.Tech', experience: '8 Years', phone: '+91 98480 22004', email: 'nvrao@kiet.edu' },
  { id: 'fac-05', name: 'Dr. Ch. Srinivas', designation: 'Professor & Smart City CoE Lead', department: 'CSM', campus: 'KIET', qualification: 'Ph.D', experience: '19 Years', phone: '+91 98480 22005', email: 'srinivas.ch@kiet.edu' },
  { id: 'fac-06', name: 'Mrs. B. Swathi', designation: 'Associate Professor', department: 'CSM', campus: 'KIET', qualification: 'M.Tech', experience: '10 Years', phone: '+91 98480 22006', email: 'swathi.b@kiet.edu' },
  { id: 'fac-07', name: 'Mr. K. Mahesh', designation: 'Assistant Professor', department: 'CSM', campus: 'KIET', qualification: 'M.Tech', experience: '7 Years', phone: '+91 98480 22007', email: 'mahesh.k@kiet.edu' },
  { id: 'fac-08', name: 'Dr. R. Venkat', designation: 'Professor & Toastmasters Mentor', department: 'CAI', campus: 'KIET', qualification: 'Ph.D', experience: '15 Years', phone: '+91 98480 22008', email: 'venkat.r@kiet.edu' },
  { id: 'fac-09', name: 'Mrs. T. Anitha', designation: 'Assistant Professor', department: 'CAI', campus: 'KIET', qualification: 'M.Tech', experience: '6 Years', phone: '+91 98480 22009', email: 'anitha.t@kiet.edu' },
  { id: 'fac-10', name: 'Dr. G. Satish', designation: 'Associate Professor', department: 'CSC', campus: 'KIET', qualification: 'Ph.D', experience: '12 Years', phone: '+91 98480 22010', email: 'satish.g@kiet.edu' },
  { id: 'fac-11', name: 'Mr. V. Kiran', designation: 'Assistant Professor', department: 'CSD', campus: 'KIET', qualification: 'M.Tech', experience: '7 Years', phone: '+91 98480 22011', email: 'kiran.v@kiet.edu' },

  // KIET+ Advanced Tech Campus
  { id: 'fac-12', name: 'Dr. Y. Prasad', designation: 'Professor & Innovation Incharge', department: 'AIDS', campus: 'KIET+', qualification: 'Ph.D', experience: '14 Years', phone: '+91 98481 33001', email: 'prasad.y@kietplus.edu' },
  { id: 'fac-13', name: 'Mrs. S. Madhavi', designation: 'Associate Professor', department: 'AIDS', campus: 'KIET+', qualification: 'M.Tech', experience: '9 Years', phone: '+91 98481 33002', email: 'madhavi.s@kietplus.edu' },
  { id: 'fac-14', name: 'Mr. K. Raju', designation: 'Assistant Professor', department: 'AIDS', campus: 'KIET+', qualification: 'M.Tech', experience: '6 Years', phone: '+91 98481 33003', email: 'raju.k@kietplus.edu' },
  { id: 'fac-15', name: 'Dr. A. Srinivas', designation: 'Professor & Hackathon Mentor', department: 'CSM', campus: 'KIET+', qualification: 'Ph.D', experience: '15 Years', phone: '+91 98481 33004', email: 'srinivas.a@kietplus.edu' },
  { id: 'fac-16', name: 'Mr. P. Naveen', designation: 'Assistant Professor', department: 'CSM', campus: 'KIET+', qualification: 'M.Tech', experience: '8 Years', phone: '+91 98481 33005', email: 'naveen.p@kietplus.edu' },
  { id: 'fac-17', name: 'Mrs. R. Geetha', designation: 'Associate Professor', department: 'CAI', campus: 'KIET+', qualification: 'M.Tech', experience: '11 Years', phone: '+91 98481 33006', email: 'geetha.r@kietplus.edu' },
  { id: 'fac-18', name: 'Mr. M. Vamsi', designation: 'Assistant Professor', department: 'CSC', campus: 'KIET+', qualification: 'M.Tech', experience: '7 Years', phone: '+91 98481 33007', email: 'vamsi.m@kietplus.edu' },
  { id: 'fac-19', name: 'Dr. L. Ram Babu', designation: 'Professor', department: 'CSD', campus: 'KIET+', qualification: 'Ph.D', experience: '16 Years', phone: '+91 98481 33008', email: 'rambabu.l@kietplus.edu' },

  // KIET Women's College
  { id: 'fac-20', name: 'Dr. P. Kalyani', designation: "Professor & Women's Club Lead", department: 'AIDS', campus: "KIET Women's", qualification: 'Ph.D', experience: '17 Years', phone: '+91 98482 44001', email: 'kalyani.p@kiew.edu' },
  { id: 'fac-21', name: 'Mrs. V. Sireesha', designation: 'Associate Professor', department: 'AIDS', campus: "KIET Women's", qualification: 'M.Tech', experience: '10 Years', phone: '+91 98482 44002', email: 'sireesha.v@kiew.edu' },
  { id: 'fac-22', name: 'Ms. G. Bhavani', designation: 'Assistant Professor', department: 'AIDS', campus: "KIET Women's", qualification: 'M.Tech', experience: '5 Years', phone: '+91 98482 44003', email: 'bhavani.g@kiew.edu' },
  { id: 'fac-23', name: 'Dr. Ch. Vani', designation: 'Professor', department: 'CSM', campus: "KIET Women's", qualification: 'Ph.D', experience: '14 Years', phone: '+91 98482 44004', email: 'vani.ch@kiew.edu' },
  { id: 'fac-24', name: 'Mrs. K. Sunitha', designation: 'Associate Professor', department: 'CSM', campus: "KIET Women's", qualification: 'M.Tech', experience: '9 Years', phone: '+91 98482 44005', email: 'sunitha.k@kiew.edu' },
  { id: 'fac-25', name: 'Mrs. M. Deepa', designation: 'Assistant Professor', department: 'CAI', campus: "KIET Women's", qualification: 'M.Tech', experience: '7 Years', phone: '+91 98482 44006', email: 'deepa.m@kiew.edu' },
]

// Complete Transport Fleet & 24 Bus Drivers across the 3 Campuses
export const transportDrivers = [
  // KIET Main Campus Fleet (Routes 01 to 12)
  { busId: 'BUS-01', busNumber: 'AP 05 TJ 4501', driverName: 'K. Subba Rao', phone: '+91 98480 11201', license: 'DL05-201200451', route: 'Route 01 · Samalkota Railway Station to Korangi', destination: 'Samalkota Junction', campus: 'KIET', capacity: 55, studentsAssigned: 52, status: 'Active / GPS Monitored' },
  { busId: 'BUS-02', busNumber: 'AP 05 TJ 4502', driverName: 'M. Venkatesh', phone: '+91 98480 11202', license: 'DL05-201100342', route: 'Route 02 · Yanam Ferry Point to Korangi Campus', destination: 'Yanam Bridge Point', campus: 'KIET', capacity: 55, studentsAssigned: 54, status: 'Active / GPS Monitored' },
  { busId: 'BUS-03', busNumber: 'AP 05 TJ 4503', driverName: 'K. Appa Rao', phone: '+91 94401 22891', license: 'DL05-200900118', route: 'Route 03 · Kakinada Bhanugudi Junction & RTC', destination: 'Bhanugudi & RTC Complex', campus: 'KIET', capacity: 60, studentsAssigned: 58, status: 'Active / GPS Monitored' },
  { busId: 'BUS-04', busNumber: 'AP 05 TJ 4504', driverName: 'Ch. Prasad', phone: '+91 98480 11204', license: 'DL05-201300892', route: 'Route 04 · Ramachandrapuram Bus Stand to Korangi', destination: 'Ramachandrapuram', campus: 'KIET', capacity: 55, studentsAssigned: 51, status: 'Active / GPS Monitored' },
  { busId: 'BUS-05', busNumber: 'AP 05 TJ 4505', driverName: 'P. Satyanarayana', phone: '+91 98480 11205', license: 'DL05-201400231', route: 'Route 05 · Draksharamam Temple Gate to Campus', destination: 'Draksharamam Gate', campus: 'KIET', capacity: 55, studentsAssigned: 53, status: 'Active / GPS Monitored' },
  { busId: 'BUS-06', busNumber: 'AP 05 TJ 4506', driverName: 'G. Suresh', phone: '+91 98480 11206', license: 'DL05-201000673', route: 'Route 06 · Peddapuram Main Road to Korangi', destination: 'Peddapuram Town', campus: 'KIET', capacity: 55, studentsAssigned: 50, status: 'Active / GPS Monitored' },
  { busId: 'BUS-07', busNumber: 'AP 05 TJ 4507', driverName: 'V. Srinivas', phone: '+91 98480 11207', license: 'DL05-201500411', route: 'Route 07 · Kakinada Jagannaickpur Bridge to Campus', destination: 'Jagannaickpur Kakinada', campus: 'KIET', capacity: 55, studentsAssigned: 52, status: 'Active / GPS Monitored' },
  { busId: 'BUS-08', busNumber: 'AP 05 TJ 4508', driverName: 'T. Rama Rao', phone: '+91 98480 11208', license: 'DL05-201100912', route: 'Route 08 · Coromandel Gate & Port Road Kakinada', destination: 'Port Road & Coromandel', campus: 'KIET', capacity: 55, studentsAssigned: 49, status: 'Active / GPS Monitored' },
  { busId: 'BUS-09', busNumber: 'AP 05 TJ 4509', driverName: 'B. Krishna', phone: '+91 98480 11209', license: 'DL05-201200155', route: 'Route 09 · Thallarevu & Georgepet to Korangi', destination: 'Thallarevu Center', campus: 'KIET', capacity: 55, studentsAssigned: 52, status: 'Active / GPS Monitored' },
  { busId: 'BUS-10', busNumber: 'AP 05 TJ 4510', driverName: 'S. Nageswara Rao', phone: '+91 98480 11210', license: 'DL05-201600741', route: 'Route 10 · Kakinada Indrapalem & Madhavapatnam', destination: 'Indrapalem Bypass', campus: 'KIET', capacity: 55, studentsAssigned: 53, status: 'Active / GPS Monitored' },
  { busId: 'BUS-11', busNumber: 'AP 05 TJ 4511', driverName: 'Y. Veerabhadra Rao', phone: '+91 98480 11211', license: 'DL05-200800392', route: 'Route 11 · Gollapalem & Matlapalem Junction', destination: 'Matlapalem Junction', campus: 'KIET', capacity: 55, studentsAssigned: 54, status: 'Active / GPS Monitored' },
  { busId: 'BUS-12', busNumber: 'AP 05 TJ 4512', driverName: 'A. Rambabu', phone: '+91 98480 11212', license: 'DL05-201700201', route: 'Route 12 · Yanam Bypass & Pillaraya Temple', destination: 'Yanam Bypass & Pillaraya', campus: 'KIET', capacity: 55, studentsAssigned: 51, status: 'Active / GPS Monitored' },

  // KIET+ Advanced Tech Fleet (Routes 13 to 19)
  { busId: 'BUS-13', busNumber: 'AP 05 TJ 4513', driverName: 'M. Chinna Rao', phone: '+91 98481 22101', license: 'DL05-201300551', route: 'Route 13 · Kakinada Cinema Road to KIET+', destination: 'Cinema Road Kakinada', campus: 'KIET+', capacity: 55, studentsAssigned: 50, status: 'Active / GPS Monitored' },
  { busId: 'BUS-14', busNumber: 'AP 05 TJ 4514', driverName: 'K. Dharma Rao', phone: '+91 98481 22102', license: 'DL05-201200412', route: 'Route 14 · Samalkota Main Bazaar to KIET+', destination: 'Samalkota Bazaar', campus: 'KIET+', capacity: 55, studentsAssigned: 52, status: 'Active / GPS Monitored' },
  { busId: 'BUS-15', busNumber: 'AP 05 TJ 4515', driverName: 'P. Nani', phone: '+91 98481 22103', license: 'DL05-201400619', route: 'Route 15 · Yanam Beach Road to KIET+', destination: 'Yanam Beach Road', campus: 'KIET+', capacity: 55, studentsAssigned: 53, status: 'Active / GPS Monitored' },
  { busId: 'BUS-16', busNumber: 'AP 05 TJ 4516', driverName: 'G. Kondababu', phone: '+91 98481 22104', license: 'DL05-201100188', route: 'Route 16 · Kakinada Dairy Farm to KIET+', destination: 'Dairy Farm Center', campus: 'KIET+', capacity: 55, studentsAssigned: 49, status: 'Active / GPS Monitored' },
  { busId: 'BUS-17', busNumber: 'AP 05 TJ 4517', driverName: 'V. Appanna', phone: '+91 98481 22105', license: 'DL05-201500331', route: 'Route 17 · Draksharamam Rural & Kotipalli to KIET+', destination: 'Kotipalli Ferry Junction', campus: 'KIET+', capacity: 55, studentsAssigned: 48, status: 'Active / GPS Monitored' },
  { busId: 'BUS-18', busNumber: 'AP 05 TJ 4518', driverName: 'S. Manikanta', phone: '+91 98481 22106', license: 'DL05-201600812', route: 'Route 18 · Ramachandrapuram Clock Tower to KIET+', destination: 'Clock Tower RC Puram', campus: 'KIET+', capacity: 55, studentsAssigned: 51, status: 'Active / GPS Monitored' },
  { busId: 'BUS-19', busNumber: 'AP 05 TJ 4519', driverName: 'T. Govindu', phone: '+91 98481 22107', license: 'DL05-201000994', route: 'Route 19 · Thallarevu Panchayat Road to KIET+', destination: 'Thallarevu Panchayat', campus: 'KIET+', capacity: 55, studentsAssigned: 50, status: 'Active / GPS Monitored' },

  // KIET Women's College (KIEW) Fleet (Routes 20 to 24) - Protected Escorted Fleet
  { busId: 'BUS-20', busNumber: 'AP 05 TJ 4520', driverName: 'B. Tatarao', phone: '+91 98482 33101', license: 'DL05-200900711', route: "Route 20 · Kakinada Women's Special: Bhanugudi to KIEW", destination: 'Bhanugudi & Main Road', campus: "KIET Women's", capacity: 55, studentsAssigned: 53, status: 'Active / Woman Escort Onboard' },
  { busId: 'BUS-21', busNumber: 'AP 05 TJ 4521', driverName: 'K. Somaraju', phone: '+91 98482 33102', license: 'DL05-201200632', route: "Route 21 · Samalkota Town to KIEW", destination: 'Samalkota Bus Complex', campus: "KIET Women's", capacity: 55, studentsAssigned: 52, status: 'Active / Woman Escort Onboard' },
  { busId: 'BUS-22', busNumber: 'AP 05 TJ 4522', driverName: 'M. Bangarraju', phone: '+91 98482 33103', license: 'DL05-201300481', route: "Route 22 · Yanam French Town to KIEW", destination: 'Yanam French Center', campus: "KIET Women's", capacity: 55, studentsAssigned: 54, status: 'Active / Woman Escort Onboard' },
  { busId: 'BUS-23', busNumber: 'AP 05 TJ 4523', driverName: 'P. Nookaraju', phone: '+91 98482 33104', license: 'DL05-201100318', route: "Route 23 · Ramachandrapuram to KIEW", destination: 'RC Puram Old Bus Stand', campus: "KIET Women's", capacity: 55, studentsAssigned: 51, status: 'Active / Woman Escort Onboard' },
  { busId: 'BUS-24', busNumber: 'AP 05 TJ 4524', driverName: 'D. Suribabu', phone: '+91 98482 33105', license: 'DL05-201400299', route: "Route 24 · Peddapuram & ADB Road to KIEW", destination: 'ADB Road Kakinada', campus: "KIET Women's", capacity: 55, studentsAssigned: 50, status: 'Active / Woman Escort Onboard' },
]

// Operations, Campus Workers, Technicians & Support Staff across the 3 Campuses
export const campusWorkers = [
  // KIET Main Campus Workers
  { empId: 'WRK-101', name: 'M. Kondal Rao', role: 'Chief Campus Facility Engineer', category: 'Facilities & Power', campus: 'KIET', block: 'Campus Power Substation & Utilities', phone: '+91 97010 44001', shift: 'General (8 AM - 5 PM)', status: 'Active' },
  { empId: 'WRK-102', name: 'K. Trimurtulu', role: 'Senior Electrician & Solar Plant Incharge', category: 'Facilities & Power', campus: 'KIET', block: 'Solar Array & Generator Room', phone: '+91 97010 44002', shift: 'Morning Shift', status: 'Active' },
  { empId: 'WRK-103', name: 'G. Satyanarayana', role: 'Chief Hostel Warden (Godavari Boys Hostel)', category: 'Hostel Administration', campus: 'KIET', block: 'Godavari Boys Hostel Block A', phone: '+91 97010 44003', shift: 'Resident (24x7)', status: 'Active' },
  { empId: 'WRK-104', name: 'P. Veerabhadra Rao', role: 'Assistant Warden (Godavari Boys Hostel)', category: 'Hostel Administration', campus: 'KIET', block: 'Godavari Boys Hostel Block B', phone: '+91 97010 44004', shift: 'Night Duty & Security', status: 'Active' },
  { empId: 'WRK-105', name: 'Ch. Subrahmanyam', role: 'Chief Dining Hall & Mess Supervisor', category: 'Hostel & Food', campus: 'KIET', block: 'Central Student Dining Hall', phone: '+91 97010 44005', shift: 'Morning/Evening Split', status: 'Active' },
  { empId: 'WRK-106', name: 'B. Appa Rao', role: 'Robotics & Hardware Lab Technician', category: 'Laboratory Technical', campus: 'KIET', block: 'Robotics Center of Excellence, Block II', phone: '+91 97010 44006', shift: 'General (9 AM - 5 PM)', status: 'Active' },
  { empId: 'WRK-107', name: 'V. Krishna Murthy', role: 'Smart City & IoT Sensor Technician', category: 'Laboratory Technical', campus: 'KIET', block: 'IoT Innovation Bay', phone: '+91 97010 44007', shift: 'General (9 AM - 5 PM)', status: 'Active' },
  { empId: 'WRK-108', name: 'T. Srinivasa Rao', role: 'AI High-Performance Server Administrator', category: 'IT Systems & Network', campus: 'KIET', block: 'Central Server Room, Turing Block', phone: '+91 97010 44008', shift: 'General (9 AM - 6 PM)', status: 'Active' },
  { empId: 'WRK-109', name: 'S. Nookaraju', role: 'Campus Security In-Charge (Main Gate)', category: 'Security & Safety', campus: 'KIET', block: 'Main Gate 1 & Biometric Turnstiles', phone: '+91 97010 44009', shift: 'Day Shift (6 AM - 2 PM)', status: 'Active' },
  { empId: 'WRK-110', name: 'Y. Venkata Rao', role: 'Security Supervisor (Night Curfew Patrol)', category: 'Security & Safety', campus: 'KIET', block: 'Perimeter Wall & Gate 2', phone: '+91 97010 44010', shift: 'Night Shift (10 PM - 6 AM)', status: 'Active' },
  { empId: 'WRK-111', name: 'M. Babji', role: 'Water Treatment & RO Plant Operator', category: 'Facilities & Power', campus: 'KIET', block: 'Central Water Filtration Facility', phone: '+91 97010 44011', shift: 'Morning (6 AM - 2 PM)', status: 'Active' },
  { empId: 'WRK-112', name: 'K. Durga Rao', role: 'Sanitation & Hygiene Team Lead', category: 'Sanitation & Housekeeping', campus: 'KIET', block: 'Academic Blocks A & B', phone: '+91 97010 44012', shift: 'Morning & Afternoon', status: 'Active' },

  // KIET+ Advanced Tech Campus Workers
  { empId: 'WRK-201', name: 'A. Rambabu', role: 'Senior Lab Technician (AI & Cloud Labs)', category: 'Laboratory Technical', campus: 'KIET+', block: 'Tech Park B, 3rd Floor Cloud Center', phone: '+91 97011 55001', shift: 'General (9 AM - 5 PM)', status: 'Active' },
  { empId: 'WRK-202', name: 'N. Prasad', role: 'Innovation Incubator Prototype Machinist', category: 'Laboratory Technical', campus: 'KIET+', block: 'Incubation Maker Space', phone: '+91 97011 55002', shift: 'General (9 AM - 5 PM)', status: 'Active' },
  { empId: 'WRK-203', name: 'R. Sanyasi Rao', role: 'Hostel Supervisor (KIET+ Boys Residency)', category: 'Hostel Administration', campus: 'KIET+', block: 'Tech Residency Block C', phone: '+91 97011 55003', shift: 'Resident Staff', status: 'Active' },
  { empId: 'WRK-204', name: 'G. Dharma Raju', role: 'Electrician & Network Cabling Tech', category: 'Facilities & Power', campus: 'KIET+', block: 'Tech Park A & B Cabling Nodes', phone: '+91 97011 55004', shift: 'General Shift', status: 'Active' },
  { empId: 'WRK-205', name: 'B. Tata Rao', role: 'Security Supervisor (Tech Park Gate)', category: 'Security & Safety', campus: 'KIET+', block: 'KIET+ Entry Gate', phone: '+91 97011 55005', shift: 'Rotational Shift', status: 'Active' },
  { empId: 'WRK-206', name: 'K. Sanyasi', role: 'Sanitation & Environmental Maintenance', category: 'Sanitation & Housekeeping', campus: 'KIET+', block: 'KIET+ Academic Plaza', phone: '+91 97011 55006', shift: 'Morning Shift', status: 'Active' },

  // KIET Women's Campus Workers
  { empId: 'WRK-301', name: 'Mrs. K. Mary Ratnam', role: 'Chief Resident Matron (Sarada Girls Hostel)', category: 'Hostel Administration', campus: "KIET Women's", block: 'Sarada Girls Hostel Block A', phone: '+91 97012 66001', shift: 'Resident (24x7)', status: 'Active' },
  { empId: 'WRK-302', name: 'Mrs. S. Parvathi', role: 'Assistant Matron (Hostel Block B)', category: 'Hostel Administration', campus: "KIET Women's", block: 'Sarada Girls Hostel Block B', phone: '+91 97012 66002', shift: 'Night Incharge', status: 'Active' },
  { empId: 'WRK-303', name: 'Mrs. T. Annapurna', role: "Women's Dining & Diet Supervisor", category: 'Hostel & Food', campus: "KIET Women's", block: "Women's Central Dining Hall", phone: '+91 97012 66003', shift: 'Meal Shift', status: 'Active' },
  { empId: 'WRK-304', name: 'Ms. P. Swaroopa', role: 'Computer & Language Lab Technician', category: 'Laboratory Technical', campus: "KIET Women's", block: 'Women Academic Wing Labs', phone: '+91 97012 66004', shift: 'General (9 AM - 4:30 PM)', status: 'Active' },
  { empId: 'WRK-305', name: 'Mrs. B. Saraswathi', role: "Head of Women's Campus Security", category: 'Security & Safety', campus: "KIET Women's", block: "Protected Gate 1 & Reception", phone: '+91 97012 66005', shift: 'Day Shift (7 AM - 3 PM)', status: 'Active' },
  { empId: 'WRK-306', name: 'Mr. V. Appa Rao', role: 'Facility Maintenance & Generator Operator', category: 'Facilities & Power', campus: "KIET Women's", block: 'Utility Enclosure & RO Plant', phone: '+91 97012 66006', shift: 'General (8 AM - 5 PM)', status: 'Active' },
  { empId: 'WRK-307', name: 'Mrs. G. Nagamani', role: 'Housekeeping & Cleanliness Incharge', category: 'Sanitation & Housekeeping', campus: "KIET Women's", block: "Hostel & Classroom Blocks", phone: '+91 97012 66007', shift: 'Morning Shift', status: 'Active' },
]

// Aggregate helper for Admin Portal stats
export function getAdminStats(campusFilter = 'ALL') {
  const isAll = campusFilter === 'ALL'

  // Student counts
  let totalStudents = 0
  let firstYear = 0
  let secondYear = 0
  let thirdYear = 0
  let finalYear = 0
  let dayScholars = 0
  let hostelers = 0

  if (isAll) {
    totalStudents = yearWiseDemographics.overall.total
    firstYear = yearWiseDemographics.overall.firstYear
    secondYear = yearWiseDemographics.overall.secondYear
    thirdYear = yearWiseDemographics.overall.thirdYear
    finalYear = yearWiseDemographics.overall.finalYear
    dayScholars = yearWiseDemographics.overall.dayScholars
    hostelers = yearWiseDemographics.overall.hostelers
  } else {
    const d = yearWiseDemographics.byCampus[campusFilter]
    if (d) {
      totalStudents = d.total
      firstYear = d.firstYear
      secondYear = d.secondYear
      thirdYear = d.thirdYear
      finalYear = d.finalYear
      dayScholars = d.dayScholars
      hostelers = d.hostelers
    }
  }

  // HODs
  const hodsList = isAll ? institutionalHods : institutionalHods.filter(h => h.campus === campusFilter)
  // Faculty
  const facultyList = isAll ? institutionalFaculty : institutionalFaculty.filter(f => f.campus === campusFilter)
  // Drivers
  const driversList = isAll ? transportDrivers : transportDrivers.filter(d => d.campus === campusFilter)
  // Workers
  const workersList = isAll ? campusWorkers : campusWorkers.filter(w => w.campus === campusFilter)

  // Placements
  let eligiblePlaced = 0
  let totalPlaced = 0
  let placementRate = 0
  let highestPackage = '₹31.50 LPA'
  let avgPackage = '₹6.65 LPA'

  if (isAll) {
    eligiblePlaced = campusPlacementData.groupSummary.totalEligibleFinalYear
    totalPlaced = campusPlacementData.groupSummary.totalPlaced
    placementRate = campusPlacementData.groupSummary.placementPercentage
    highestPackage = '₹31.50 LPA'
    avgPackage = '₹6.65 LPA'
  } else {
    const p = campusPlacementData.byCampus.find(c => c.campus === campusFilter)
    if (p) {
      eligiblePlaced = p.eligible
      totalPlaced = p.placed
      placementRate = parseFloat(p.placementRate)
      highestPackage = p.highestPackage
      avgPackage = p.avgPackage
    }
  }

  return {
    campus: campusFilter,
    totalStudents,
    firstYear,
    secondYear,
    thirdYear,
    finalYear,
    dayScholars,
    hostelers,
    dayScholarsPct: totalStudents > 0 ? Number(((dayScholars / totalStudents) * 100).toFixed(1)) : 0,
    hostelersPct: totalStudents > 0 ? Number(((hostelers / totalStudents) * 100).toFixed(1)) : 0,
    totalHODs: hodsList.length,
    totalFaculty: facultyList.length,
    totalDrivers: driversList.length,
    totalWorkers: workersList.length,
    totalStaff: hodsList.length + facultyList.length + driversList.length + workersList.length,
    eligiblePlaced,
    totalPlaced,
    placementRate,
    highestPackage,
    avgPackage,
    hodsList,
    facultyList,
    driversList,
    workersList,
  }
}
