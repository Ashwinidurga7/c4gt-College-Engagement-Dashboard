const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Campus = require('../models/Campus');
const Worker = require('../models/Worker');
const Transport = require('../models/Transport');
const Placement = require('../models/Placement');
const Fee = require('../models/Fee');
const Student = require('../models/Student');
const User = require('../models/User');

const initialCampuses = [
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
];

const initialFleetRoutes = [
  { _id: 'dr_01', busNumber: 'AP 05 TJ 4510', driverName: 'M. Satyanarayana', driverPhone: '+91 94401 22891', phone: '+91 94401 22891', license: 'AP05-2012-DR-410', route: 'Kakinada RTC Complex Express via Jagannaickpur', destination: 'KIET Main Gate', campus: 'KIET', capacity: 56, allocatedStudents: 52, isFleetRoute: true, status: 'Active' },
  { _id: 'dr_02', busNumber: 'AP 05 TJ 4512', driverName: 'K. Appa Rao', driverPhone: '+91 98480 33412', phone: '+91 98480 33412', license: 'AP05-2010-DR-112', route: 'Kakinada Bhanugudi Junction & Cinema Road', destination: 'KIET Main Bay', campus: 'KIET', capacity: 56, allocatedStudents: 54, isFleetRoute: true, status: 'Active' },
  { _id: 'dr_03', busNumber: 'AP 05 TJ 4515', driverName: 'S. Trinadh', driverPhone: '+91 99592 11045', phone: '+91 99592 11045', license: 'AP05-2015-DR-515', route: 'Ramachandrapuram RTC & Draksharamam Route', destination: 'KIET Engineering Porch', campus: 'KIET', capacity: 56, allocatedStudents: 53, isFleetRoute: true, status: 'Active' },
  { _id: 'dr_04', busNumber: 'AP 05 TJ 4518', driverName: 'P. Venkat Rao', driverPhone: '+91 94412 88701', phone: '+91 94412 88701', license: 'AP05-2014-DR-318', route: 'Samalkot Railway Station & Peddapuram Bypass', destination: 'KIET+ Tech Park Gate', campus: 'KIET+', capacity: 56, allocatedStudents: 55, isFleetRoute: true, status: 'Active' },
  { _id: 'dr_05', busNumber: 'AP 05 TJ 4522', driverName: 'B. Krishna Murthy', driverPhone: '+91 98661 54320', phone: '+91 98661 54320', license: 'AP05-2011-DR-222', route: 'Yanam Bridge Point & Tallarevu Highway', destination: "KIET Women's Porch", campus: "KIET Women's", capacity: 56, allocatedStudents: 50, isFleetRoute: true, status: 'Active' },
  { _id: 'dr_06', busNumber: 'AP 05 TJ 4525', driverName: 'Ch. Rambabu', driverPhone: '+91 94405 66712', phone: '+91 94405 66712', license: 'AP05-2016-DR-625', route: 'Rajahmundry Kambala Park & Morampudi Route', destination: 'KIET Main Campus', campus: 'KIET', capacity: 56, allocatedStudents: 52, isFleetRoute: true, status: 'Active' },
  { _id: 'dr_07', busNumber: 'AP 05 TJ 4528', driverName: 'V. Suribabu', driverPhone: '+91 99491 88203', phone: '+91 99491 88203', license: 'AP05-2017-DR-728', route: 'Anaparthi Canal Road & Mandapeta Flyover', destination: 'KIET+ Tech Complex', campus: 'KIET+', capacity: 56, allocatedStudents: 49, isFleetRoute: true, status: 'Active' },
  { _id: 'dr_08', busNumber: 'AP 05 TJ 4531', driverName: 'G. Nageswara Rao', driverPhone: '+91 98492 77410', phone: '+91 98492 77410', license: 'AP05-2018-DR-831', route: 'Pithapuram Town & Gollaprolu Highway Line', destination: "KIET Women's Porch", campus: "KIET Women's", capacity: 56, allocatedStudents: 48, isFleetRoute: true, status: 'Active' },
];

const initialWorkers = [
  { _id: 'wk_01', empId: 'KW-0101', name: 'M. Kondal Rao', role: 'Head of Campus Security', category: 'Security', campus: 'KIET', block: 'Main Campus Security Post & Gate 1', shift: 'Day (06:00 - 18:00)', department: 'Security & Surveillance', contact: '+91 94402 33100', phone: '+91 94402 33100', status: 'On Duty' },
  { _id: 'wk_02', empId: 'KW-0102', name: 'P. Nageswara Rao', role: 'Chief Electrician & DG Operator', category: 'Electrical', campus: 'KIET', block: 'Central Substation & Generator Bay', shift: 'Day (08:00 - 17:00)', department: 'Electrical & Power Supply', contact: '+91 98481 22904', phone: '+91 98481 22904', status: 'On Duty' },
  { _id: 'wk_03', empId: 'KW-0103', name: 'Ch. Venkanna', role: 'Plumbing & Water Systems Lead', category: 'Maintenance', campus: 'KIET+', block: 'R&D Block & RO Water Filtration Plant', shift: 'Day (07:30 - 16:30)', department: 'Campus Maintenance', contact: '+91 99590 88214', phone: '+91 99590 88214', status: 'On Duty' },
  { _id: 'wk_04', empId: 'KW-0104', name: 'B. Dhanalakshmi', role: 'Housekeeping Supervisor', category: 'Housekeeping', campus: "KIET Women's", block: "Women's Hostel A, B & Academic Wing", shift: 'Morning (06:30 - 15:00)', department: 'Housekeeping & Sanitization', contact: '+91 94411 77320', phone: '+91 94411 77320', status: 'On Duty' },
  { _id: 'wk_05', empId: 'KW-0105', name: 'G. Veerabhadra Rao', role: 'Campus Gardening & Landscaping Head', category: 'Gardening', campus: 'KIET', block: 'Central Green Lawn & Herbal Garden', shift: 'Morning (07:00 - 14:00)', department: 'Environment & Green Campus', contact: '+91 98660 44102', phone: '+91 98660 44102', status: 'On Duty' },
  { _id: 'wk_06', empId: 'KW-0106', name: 'K. Subba Rao', role: 'Hostel Maintenance Lead', category: 'Maintenance', campus: 'KIET+', block: 'Godavari Boys Hostel Block 1 & 2', shift: 'Rotational', department: 'Residential Facilities', contact: '+91 99882 11409', phone: '+91 99882 11409', status: 'On Duty' },
  { _id: 'wk_07', empId: 'KW-0107', name: 'S. Parvathi', role: 'Girls Hostel Warden & Caretaker', category: 'Residential', campus: "KIET Women's", block: "Sarada Girls Hostel Block A", shift: 'Evening (14:00 - 22:00)', department: 'Student Residential Care', contact: '+91 94408 11290', phone: '+91 94408 11290', status: 'On Duty' },
  { _id: 'wk_08', empId: 'KW-0108', name: 'D. Satyanarayana', role: 'Carpenter & Furniture Repair Lead', category: 'Maintenance', campus: 'KIET', block: 'Central Workshop & Seminar Halls', shift: 'Day (08:30 - 17:30)', department: 'Workshop Facilities', contact: '+91 98493 55102', phone: '+91 98493 55102', status: 'On Duty' },
];

const initialPlacement = {
  _id: 'placement_2025_26',
  academicYear: '2025–26',
  summary: {
    totalEligible: 2840,
    totalPlaced: 2470,
    overallRate: '87.0%',
    highestPackage: '₹31.50 LPA (Amazon AWS)',
    avgPackage: '₹6.40 LPA',
    totalOffers: 3120,
    tier1Offers: 480,
  },
  topRecruiters: [
    { name: 'Amazon AWS', offers: 18, package: '₹31.50 LPA', role: 'Cloud Support / SDE' },
    { name: 'ServiceNow', offers: 24, package: '₹24.00 LPA', role: 'Associate Software Engineer' },
    { name: 'TCS Digital', offers: 142, package: '₹9.00 LPA', role: 'Systems Engineer' },
    { name: 'Wipro Turbo', offers: 110, package: '₹8.50 LPA', role: 'Project Engineer' },
    { name: 'Infosys SP', offers: 85, package: '₹9.50 LPA', role: 'Specialist Programmer' },
    { name: 'Accenture Advantage', offers: 320, package: '₹6.50 LPA', role: 'Advanced App Dev' },
  ],
  departmentBreakdown: [
    { branch: 'AIDS', eligible: 340, placed: 312, rate: '91.8%', avgLPA: '7.40' },
    { branch: 'CSM', eligible: 320, placed: 290, rate: '90.6%', avgLPA: '7.10' },
    { branch: 'CAI', eligible: 260, placed: 232, rate: '89.2%', avgLPA: '6.80' },
    { branch: 'CSC', eligible: 280, placed: 245, rate: '87.5%', avgLPA: '6.50' },
    { branch: 'CSD', eligible: 300, placed: 258, rate: '86.0%', avgLPA: '6.20' },
  ],
};

const demoStudentFee = {
  _id: 'fee_user_student_vamsi',
  user: 'user_student_vamsi',
  rollNumber: ' ',
  academicYear: '2026–27',
  total: 98000,
  paid: 98000,
  due: 0,
  dueDate: '30 Sep 2026',
  status: 'Paid',
  tuition: 75000,
  specialFee: 15000,
  examFee: 8000,
  history: [
    { id: 'tx_101', date: '12 Aug 2026', amount: 50000, type: 'Tuition Fee (Part 1)', mode: 'Online UPI', status: 'Success', refNo: 'TXN-9824-KIET' },
    { id: 'tx_102', date: '04 Sep 2026', amount: 25000, type: 'Tuition Fee (Part 2)', mode: 'Net Banking', status: 'Success', refNo: 'TXN-9910-KIET' },
    { id: 'tx_103', date: '10 Sep 2026', amount: 23000, type: 'Special & Exam Fees', mode: 'Debit Card', status: 'Success', refNo: 'TXN-9955-KIET' },
  ],
};

const demoStudentTransport = {
  _id: 'trans_user_student_vamsi',
  user: 'user_student_vamsi',
  rollNumber: ' ',
  route: 'Route 03 · Kakinada RTC to Korangi Campus',
  routeNumber: 'Route 03',
  busNumber: 'AP 05 TJ 4512',
  driverName: 'K. Appa Rao',
  driverPhone: '+91 94401 22891',
  boardingPoint: 'Bhanugudi Junction, Kakinada',
  status: 'Active',
  paid: 18000,
  total: 18000,
  balance: 0,
  passValidTill: '30 Jun 2027',
  passType: 'Annual Institutional Pass',
  isFleetRoute: false,
};

async function seedAll() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected!');

  // 1. Seed Campuses
  console.log('Seeding Campuses...');
  for (const c of initialCampuses) {
    await Campus.findByIdAndUpdate(c.code, c, { upsert: true, new: true });
  }
  console.log(`✅ Campuses seeded: ${initialCampuses.length}`);

  // 2. Seed Fleet Routes & Student Transport
  console.log('Seeding Transport...');
  for (const t of initialFleetRoutes) {
    await Transport.findByIdAndUpdate(t._id, t, { upsert: true, new: true });
  }
  await Transport.findByIdAndUpdate(demoStudentTransport._id, demoStudentTransport, { upsert: true, new: true });
  console.log(`✅ Transports seeded: ${initialFleetRoutes.length + 1}`);

  // 3. Seed Campus Workers
  console.log('Seeding Workers...');
  for (const w of initialWorkers) {
    await Worker.findByIdAndUpdate(w._id, w, { upsert: true, new: true });
  }
  console.log(`✅ Workers seeded: ${initialWorkers.length}`);

  // 4. Seed Placements
  console.log('Seeding Placements...');
  await Placement.findByIdAndUpdate(initialPlacement._id, initialPlacement, { upsert: true, new: true });
  console.log(`✅ Placements seeded`);

  // 5. Seed Fees
  console.log('Seeding Fees...');
  await Fee.findByIdAndUpdate(demoStudentFee._id, demoStudentFee, { upsert: true, new: true });
  console.log(`✅ Fees seeded`);

  console.log('ALL INSTITUTIONAL DATA SEEDED DIRECTLY INTO MONGODB ATLAS!');
  process.exit(0);
}

seedAll().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
