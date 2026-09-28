import { branchesOf } from '@/lib/colleges'

const CSE_FAMILY = branchesOf('CSE')

/** Placement drives for the 2026-27 season, each with the criteria the company sent. */
export const placementDrives = [
  {
    id: 'tcs-ninja-2027',
    company: 'TCS',
    role: 'Ninja (Assistant System Engineer)',
    package: '₹3.6 LPA',
    driveDate: '2026-10-08',
    criteria: { minCgpa: 6, maxActiveBacklogs: 0, allowClearedBacklogs: true, minAttendance: 75, graduationYear: 2027, branches: [...CSE_FAMILY, 'IT', 'ECE', 'EEE'] },
  },
  {
    id: 'infosys-se-2027',
    company: 'Infosys',
    role: 'Systems Engineer',
    package: '₹3.6 LPA',
    driveDate: '2026-10-22',
    criteria: { minCgpa: 6.5, maxActiveBacklogs: 0, allowClearedBacklogs: true, minAttendance: 0, graduationYear: 2027, branches: [...CSE_FAMILY, 'IT', 'ECE'] },
  },
  {
    id: 'accenture-ase-2027',
    company: 'Accenture',
    role: 'Associate Software Engineer',
    package: '₹4.5 LPA',
    driveDate: '2026-09-12',
    criteria: { minCgpa: 6.5, maxActiveBacklogs: 1, allowClearedBacklogs: true, minAttendance: 0, graduationYear: 2027, branches: [] },
  },
  {
    id: 'cognizant-genc-2027',
    company: 'Cognizant',
    role: 'GenC Programmer Analyst',
    package: '₹4.0 LPA',
    driveDate: '2026-11-05',
    criteria: { minCgpa: 6, maxActiveBacklogs: 1, allowClearedBacklogs: true, minAttendance: 70, graduationYear: 2027, branches: [] },
  },
  {
    id: 'amazon-intern-2028',
    company: 'Amazon',
    role: 'SDE Intern (summer 2027)',
    package: '₹80,000 per month',
    driveDate: '2026-11-18',
    criteria: { minCgpa: 8, maxActiveBacklogs: 0, allowClearedBacklogs: false, minAttendance: 80, graduationYear: 2028, branches: [...CSE_FAMILY, 'IT'] },
  },
]
