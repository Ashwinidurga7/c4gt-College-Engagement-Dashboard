/** Mock record for the demo student account (see authMock). */
export const studentProfile = {
  _id: 'u-student-01',
  name: 'B. Ashwini Durga',
  email: 'ashwini.durga@kiet.edu',
  rollNumber: '24JN1A0534',
  phone: '9876543210',
  dateOfBirth: '2005-03-14',
  gender: 'Female',
  college: 'KIET',
  department: 'CSE',
  year: 3,
  section: 'A',
  batch: '2024-2028',
  regulation: 'R23',
  currentSemester: 5,
  admissionType: 'Regular (AP EAPCET)',
  mentor: 'Mrs. K. Sirisha',
  address: 'D.No 12-4-18, Gandhi Nagar, Kakinada, Andhra Pradesh 533004',
  guardianName: 'B. Srinivasa Rao',
  guardianPhone: '9848012345',
  bio: 'Third-year CSE student interested in machine learning and building tools for campus life.',
}

/** Courses of the current semester. Theory courses carry attendance schedules in attendanceData. */
export const currentCourses = [
  { code: 'CS501', name: 'Artificial Intelligence and Machine Learning', shortName: 'AI & ML', credits: 3, type: 'Theory', faculty: 'Dr. P. Venkata Rao' },
  { code: 'CS502', name: 'Database Management Systems', shortName: 'DBMS', credits: 3, type: 'Theory', faculty: 'Mrs. K. Sirisha' },
  { code: 'CS503', name: 'Web Development', shortName: 'Web Development', credits: 3, type: 'Theory', faculty: 'Mr. Ch. Ravi Kumar' },
  { code: 'CS504', name: 'Data Science', shortName: 'Data Science', credits: 3, type: 'Theory', faculty: 'Dr. M. Anitha' },
  { code: 'MA501', name: 'Probability and Statistics', shortName: 'Mathematics', credits: 3, type: 'Theory', faculty: 'Mr. S. Naga Babu' },
  { code: 'CS502L', name: 'Database Management Systems Lab', shortName: 'DBMS Lab', credits: 1.5, type: 'Lab', faculty: 'Mrs. K. Sirisha' },
  { code: 'CS503L', name: 'Web Development Lab', shortName: 'Web Lab', credits: 1.5, type: 'Lab', faculty: 'Mr. Ch. Ravi Kumar' },
  { code: 'HS501', name: 'Soft Skills', shortName: 'Soft Skills', credits: 2, type: 'Skill', faculty: 'Mrs. G. Lavanya' },
]

/** Courses of completed semesters; marks and grades are generated in resultsData. */
export const pastSemesterCourses = {
  1: [
    ['MA101', 'Linear Algebra and Calculus', 3],
    ['PH101', 'Engineering Physics', 3],
    ['CS101', 'Introduction to Programming', 3],
    ['EE101', 'Basic Electrical and Electronics Engineering', 3],
    ['ME101', 'Engineering Graphics', 3],
    ['HS101', 'Communicative English', 2],
    ['CS101L', 'Computer Programming Lab', 1.5],
    ['PH101L', 'Engineering Physics Lab', 1],
  ],
  2: [
    ['MA201', 'Differential Equations and Vector Calculus', 3],
    ['CH201', 'Engineering Chemistry', 3],
    ['CS201', 'Data Structures', 3],
    ['CS202', 'Digital Logic and Computer Organisation', 3],
    ['ME201', 'Basic Civil and Mechanical Engineering', 3],
    ['CS201L', 'Data Structures Lab', 1.5],
    ['HS201L', 'English Communication Skills Lab', 1],
  ],
  3: [
    ['MA301', 'Discrete Mathematics and Graph Theory', 3],
    ['CS301', 'Object Oriented Programming through Java', 3],
    ['CS302', 'Advanced Data Structures and Algorithm Analysis', 3],
    ['CS303', 'Software Engineering', 3],
    ['HS301', 'Universal Human Values', 3],
    ['CS301L', 'Java Programming Lab', 1.5],
    ['CS302L', 'Advanced Data Structures Lab', 1.5],
  ],
  4: [
    ['MA401', 'Optimisation Techniques', 3],
    ['CS401', 'Operating Systems', 3],
    ['CS402', 'Computer Networks', 3],
    ['CS403', 'Formal Languages and Automata Theory', 3],
    ['MB401', 'Managerial Economics and Financial Analysis', 2],
    ['CS401L', 'Operating Systems Lab', 1.5],
    ['CS402L', 'Computer Networks Lab', 1.5],
  ],
}
