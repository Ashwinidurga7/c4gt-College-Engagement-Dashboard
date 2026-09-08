const bcrypt = require('bcryptjs');

class MockQuery {
  constructor(resultPromise) {
    this.resultPromise = resultPromise;
  }

  populate() {
    return this; // chainable mock
  }

  select(fields) {
    if (fields && typeof fields === 'string' && fields.includes('-password')) {
      const strippedPromise = this.resultPromise.then((data) => {
        if (!data) return data;
        if (Array.isArray(data)) {
          return data.map((item) => {
            if (item && typeof item === 'object') {
              const copy = { ...item };
              delete copy.password;
              return copy;
            }
            return item;
          });
        } else if (typeof data === 'object') {
          const copy = { ...data };
          delete copy.password;
          return copy;
        }
        return data;
      });
      return new MockQuery(strippedPromise);
    }
    return this; // chainable mock
  }

  sort() {
    return this; // chainable mock
  }

  limit(n) {
    return this.then((data) => (Array.isArray(data) ? data.slice(0, n) : data));
  }

  then(resolve, reject) {
    return this.resultPromise.then(resolve, reject);
  }

  catch(reject) {
    return this.resultPromise.catch(reject);
  }
}

class MockModel {
  constructor(name, initialData = []) {
    this.name = name;
    this.data = [...initialData];
  }

  _matchesQuery(item, query = {}) {
    if (!query || Object.keys(query).length === 0) return true;
    for (const key of Object.keys(query)) {
      const qVal = query[key];
      const itemVal = item[key];

      const itemValStr = itemVal && typeof itemVal === 'object' && (itemVal._id || itemVal.id)
        ? String(itemVal._id || itemVal.id)
        : String(itemVal);
      const qValStr = qVal && typeof qVal === 'object' && (qVal._id || qVal.id)
        ? String(qVal._id || qVal.id)
        : String(qVal);

      if (qVal && typeof qVal === 'object' && qVal.$in) {
        if (!qVal.$in.map(String).includes(itemValStr)) return false;
      } else if (itemValStr !== qValStr) {
        return false;
      }
    }
    return true;
  }

  find(query = {}) {
    const promise = Promise.resolve().then(() => {
      const results = this.data.filter((item) => this._matchesQuery(item, query));
      return results.map((r) => ({
        ...r,
        toObject: () => ({ ...r }),
      }));
    });
    return new MockQuery(promise);
  }

  findOne(query = {}) {
    const promise = Promise.resolve().then(() => {
      const found = this.data.find((item) => this._matchesQuery(item, query));
      if (!found) return null;
      return {
        ...found,
        id: found._id,
        matchPassword: async function (entered) {
          return await bcrypt.compare(entered, found.password);
        },
        save: async function () {
          return this;
        },
        toObject: () => ({ ...found, id: found._id }),
      };
    });
    return new MockQuery(promise);
  }

  findById(id) {
    const promise = Promise.resolve().then(() => {
      const found = this.data.find((item) => String(item._id) === String(id));
      if (!found) return null;
      return {
        ...found,
        id: found._id,
        matchPassword: async function (entered) {
          return await bcrypt.compare(entered, found.password);
        },
        save: async function () {
          return this;
        },
        toObject: () => ({ ...found, id: found._id }),
      };
    });
    return new MockQuery(promise);
  }

  async create(itemData) {
    let password = itemData.password;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
    }

    const _id = 'mock_' + Math.random().toString(36).slice(2, 11);
    const newItem = {
      _id,
      id: _id,
      ...itemData,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.data.push(newItem);
    return {
      ...newItem,
      matchPassword: async function (entered) {
        return await bcrypt.compare(entered, newItem.password);
      },
      save: async function () {
        return this;
      },
      toObject: () => ({ ...newItem }),
    };
  }

  findByIdAndUpdate(id, updates, options = {}) {
    const promise = Promise.resolve().then(() => {
      const idx = this.data.findIndex((item) => String(item._id) === String(id));
      if (idx === -1) return null;
      this.data[idx] = { ...this.data[idx], ...updates, updatedAt: new Date() };
      return {
        ...this.data[idx],
        toObject: () => ({ ...this.data[idx] }),
      };
    });
    return new MockQuery(promise);
  }

  findOneAndUpdate(query, updates, options = {}) {
    const promise = Promise.resolve().then(() => {
      const found = this.data.find((item) => this._matchesQuery(item, query));
      if (!found) return null;
      Object.assign(found, updates, { updatedAt: new Date() });
      return {
        ...found,
        toObject: () => ({ ...found }),
      };
    });
    return new MockQuery(promise);
  }

  async findByIdAndDelete(id) {
    const idx = this.data.findIndex((item) => String(item._id) === String(id));
    if (idx === -1) return null;
    const removed = this.data.splice(idx, 1)[0];
    return removed;
  }

  async findOneAndDelete(query = {}) {
    const idx = this.data.findIndex((item) => this._matchesQuery(item, query));
    if (idx === -1) return null;
    const removed = this.data.splice(idx, 1)[0];
    return removed;
  }

  async insertMany(items = []) {
    const createdItems = [];
    for (const item of items) {
      createdItems.push(await this.create(item));
    }
    return createdItems;
  }

  async deleteMany(query = {}) {
    this.data = this.data.filter((item) => !this._matchesQuery(item, query));
    return { deletedCount: 1 };
  }

  async updateMany(query = {}, updates = {}) {
    let count = 0;
    for (const item of this.data) {
      if (this._matchesQuery(item, query)) {
        Object.assign(item, updates);
        count++;
      }
    }
    return { modifiedCount: count };
  }

  async countDocuments(query = {}) {
    return this.data.filter((item) => this._matchesQuery(item, query)).length;
  }
}

// Initial Mock Seed Data
const samplePasswordHash = bcrypt.hashSync('password123', 10);

const mockUsers = [
  {
    _id: 'user_admin_1',
    name: 'System Admin',
    email: 'admin@college.edu',
    password: samplePasswordHash,
    role: 'admin',
    isActive: true,
  },
  {
    _id: 'user_faculty_1',
    name: 'Dr. John Smith',
    email: 'john.smith@college.edu',
    password: samplePasswordHash,
    role: 'faculty',
    approvalStatus: 'approved',
    isActive: true,
  },
  {
    _id: 'user_faculty_2',
    name: 'Dr. Robert Taylor',
    email: 'robert.taylor@college.edu',
    password: samplePasswordHash,
    role: 'faculty',
    approvalStatus: 'approved',
    isActive: true,
  },
  {
    _id: 'user_student_1',
    name: 'Alice Johnson',
    email: 'alice@student.edu',
    password: samplePasswordHash,
    role: 'student',
    college: 'KIET',
    isActive: true,
  },
  {
    _id: 'user_student_2',
    name: 'Bob Martin',
    email: 'bob@student.edu',
    password: samplePasswordHash,
    role: 'student',
    college: 'KIET',
    isActive: true,
  },
  {
    _id: 'user_student_3',
    name: 'Charlie Davis',
    email: 'charlie@student.edu',
    password: samplePasswordHash,
    role: 'student',
    college: 'KIET',
    isActive: true,
  },
  {
    _id: 'user_student_6',
    name: 'Farooq Ahmed',
    email: 'farooq@student.edu',
    password: samplePasswordHash,
    role: 'student',
    college: 'KIET+',
    isActive: true,
  },
  {
    _id: 'user_student_7',
    name: 'Geeta Priya',
    email: 'geeta@student.edu',
    password: samplePasswordHash,
    role: 'student',
    college: 'KIEW',
    isActive: true,
  },
  {
    _id: 'user_hod_1',
    name: 'Ravi Kumar',
    email: 'hod.cse@college.edu',
    password: samplePasswordHash,
    role: 'hod',
    college: 'KIET',
    approvalStatus: 'approved',
    isActive: true,
  },
  {
    _id: 'user_hod_2',
    name: 'Dr. Anitha Rao',
    email: 'hod.ece@college.edu',
    password: samplePasswordHash,
    role: 'hod',
    college: 'KIET',
    approvalStatus: 'approved',
    isActive: true,
  },
  {
    _id: 'user_ctpo_1',
    name: 'Suresh Kumar',
    email: 'ctpo.cse@college.edu',
    password: samplePasswordHash,
    role: 'ctpo',
    college: 'KIET',
    approvalStatus: 'approved',
    isActive: true,
  },
  {
    _id: 'user_ctpo_2',
    name: 'Manoj Verma',
    email: 'ctpo.cseb@college.edu',
    password: samplePasswordHash,
    role: 'ctpo',
    college: 'KIET',
    approvalStatus: 'approved',
    isActive: true,
  },
];

const mockDepartments = [
  {
    _id: 'dept_cse_1',
    name: 'Computer Science and Engineering',
    code: 'CSE',
    description: 'Department of Computer Science & Engineering',
    headOfDepartment: { _id: 'user_faculty_1', name: 'Dr. John Smith', email: 'john.smith@college.edu' },
  },
  {
    _id: 'dept_ece_1',
    name: 'Electronics and Communication Engineering',
    code: 'ECE',
    description: 'Department of Electronics & Communication',
    headOfDepartment: null,
  },
];

const mockStudents = [
  {
    _id: 'student_1',
    user: { _id: 'user_student_1', name: 'Alice Johnson', email: 'alice@student.edu' },
    rollNumber: '21CS001',
    college: 'KIET',
    department: { _id: 'dept_cse_1', name: 'Computer Science and Engineering', code: 'CSE' },
    batch: '2022-2026',
    semester: 6,
    year: '3rd Year',
    section: 'A',
    cgpa: 8.9,
    regulation: 'R20',
    branch: 'Computer Science and Engineering',
    dateOfBirth: '2004-05-14',
    gender: 'Female',
    phoneNumber: '+1-555-0199',
    address: '12-34 Main Road, Kakinada, AP',
    city: 'Kakinada',
    area: 'Sarpavaram',
    latitude: 16.9891,
    longitude: 82.2475,
    location: {
      city: 'Kakinada',
      area: 'Sarpavaram',
      latitude: 16.9891,
      longitude: 82.2475,
    },
    linkedinUrl: 'https://linkedin.com/in/alice-johnson',
    githubUrl: 'https://github.com/alicejohnson',
    portfolioUrl: 'https://alicejohnson.dev',
  },
  {
    _id: 'student_2',
    user: { _id: 'user_student_2', name: 'Bob Martin', email: 'bob@student.edu' },
    rollNumber: '24CS002',
    college: 'KIET',
    department: { _id: 'dept_cse_1', name: 'Computer Science and Engineering', code: 'CSE' },
    batch: '2024-2028',
    semester: 2,
    year: '1st Year',
    section: 'B',
    cgpa: 8.2,
    regulation: 'R23',
    branch: 'Computer Science and Engineering',
    dateOfBirth: '2006-08-22',
    gender: 'Male',
    phoneNumber: '+1-555-0200',
    address: '56 College Road, Kakinada, AP',
    city: 'Kakinada',
    area: 'Bhanugudi',
    latitude: 16.9604,
    longitude: 82.2382,
    location: {
      city: 'Kakinada',
      area: 'Bhanugudi',
      latitude: 16.9604,
      longitude: 82.2382,
    },
    linkedinUrl: 'https://linkedin.com/in/bob-martin',
    githubUrl: 'https://github.com/bobmartin',
    portfolioUrl: 'https://bobmartin.dev',
  },
  {
    _id: 'student_3',
    user: { _id: 'user_student_3', name: 'Charlie Davis', email: 'charlie@student.edu' },
    rollNumber: '21EC003',
    college: 'KIET',
    department: { _id: 'dept_ece_1', name: 'Electronics and Communication Engineering', code: 'ECE' },
    batch: '2022-2026',
    semester: 6,
    year: '3rd Year',
    section: 'A',
    cgpa: 8.5,
    regulation: 'R20',
    branch: 'Electronics and Communication Engineering',
    dateOfBirth: '2004-11-03',
    gender: 'Male',
    phoneNumber: '+1-555-0201',
    address: '78 Beach Road, Kakinada, AP',
    city: 'Kakinada',
    area: 'Collectorate',
    latitude: 16.9535,
    longitude: 82.2325,
    location: {
      city: 'Kakinada',
      area: 'Collectorate',
      latitude: 16.9535,
      longitude: 82.2325,
    },
    linkedinUrl: 'https://linkedin.com/in/charlie-davis',
    githubUrl: 'https://github.com/charliedavis',
    portfolioUrl: 'https://charliedavis.dev',
  },
  {
    _id: 'student_4',
    user: { _id: 'user_student_4', name: 'David Lee', email: 'david.lee@student.edu' },
    rollNumber: '21CS045',
    college: 'KIET',
    department: { _id: 'dept_cse_1', name: 'Computer Science and Engineering', code: 'CSE' },
    batch: '2022-2026',
    semester: 6,
    year: '3rd Year',
    section: 'B',
    cgpa: 8.4,
    regulation: 'R20',
    branch: 'Computer Science and Engineering',
    gender: 'Male',
  },
  {
    _id: 'student_5',
    user: { _id: 'user_student_5', name: 'Eva Green', email: 'eva.green@student.edu' },
    rollNumber: '23CS012',
    college: 'KIET',
    department: { _id: 'dept_cse_1', name: 'Computer Science and Engineering', code: 'CSE' },
    batch: '2023-2027',
    semester: 4,
    year: '2nd Year',
    section: 'A',
    cgpa: 8.7,
    regulation: 'R20',
    branch: 'Computer Science and Engineering',
    gender: 'Female',
  },
  {
    _id: 'student_6',
    user: { _id: 'user_student_6', name: 'Farooq Ahmed', email: 'farooq@student.edu' },
    rollNumber: '21CS_P01',
    college: 'KIET+',
    department: { _id: 'dept_cse_1', name: 'Computer Science and Engineering', code: 'CSE' },
    batch: '2022-2026',
    semester: 6,
    year: '3rd Year',
    section: 'A',
    cgpa: 8.6,
    regulation: 'R20',
    branch: 'Computer Science and Engineering',
    gender: 'Male',
  },
  {
    _id: 'student_7',
    user: { _id: 'user_student_7', name: 'Geeta Priya', email: 'geeta@student.edu' },
    rollNumber: '21CS_W01',
    college: 'KIEW',
    department: { _id: 'dept_cse_1', name: 'Computer Science and Engineering', code: 'CSE' },
    batch: '2022-2026',
    semester: 6,
    year: '3rd Year',
    section: 'A',
    cgpa: 9.1,
    regulation: 'R20',
    branch: 'Computer Science and Engineering',
    gender: 'Female',
  },
];

const mockFaculty = [
  {
    _id: 'faculty_1',
    user: { _id: 'user_faculty_1', name: 'Dr. John Smith', email: 'john.smith@college.edu' },
    employeeId: 'FAC001',
    college: 'KIET',
    department: { _id: 'dept_cse_1', name: 'Computer Science and Engineering', code: 'CSE' },
    designation: 'Associate Professor',
    specialization: 'Artificial Intelligence & Machine Learning',
    assignedYears: ['3rd Year'],
    approvalStatus: 'approved',
    isActive: true,
  },
  {
    _id: 'faculty_2',
    user: { _id: 'user_faculty_2', name: 'Dr. Robert Taylor', email: 'robert.taylor@college.edu' },
    employeeId: 'FAC002',
    college: 'KIET',
    department: { _id: 'dept_cse_1', name: 'Computer Science and Engineering', code: 'CSE' },
    designation: 'Assistant Professor',
    specialization: 'Computer Networks',
    assignedYears: ['1st Year'],
    approvalStatus: 'approved',
    isActive: true,
  },
];

const mockHods = [
  {
    _id: 'hod_1',
    user: { _id: 'user_hod_1', name: 'Ravi Kumar', email: 'hod.cse@college.edu' },
    employeeId: 'HOD001',
    college: 'KIET',
    department: { _id: 'dept_cse_1', name: 'Computer Science and Engineering', code: 'CSE' },
    designation: 'Head of Department',
    academicYear: '3rd Year',
    year: '3rd Year',
    approvalStatus: 'approved',
    isActive: true,
  },
  {
    _id: 'hod_2',
    user: { _id: 'user_hod_2', name: 'Dr. Anitha Rao', email: 'hod.ece@college.edu' },
    employeeId: 'HOD002',
    college: 'KIET',
    department: { _id: 'dept_ece_1', name: 'Electronics and Communication Engineering', code: 'ECE' },
    designation: 'Head of Department',
    academicYear: '3rd Year',
    year: '3rd Year',
    approvalStatus: 'approved',
    isActive: true,
  },
];

const mockCtpos = [
  {
    _id: 'ctpo_1',
    user: { _id: 'user_ctpo_1', name: 'Suresh Kumar', email: 'ctpo.cse@college.edu' },
    employeeId: 'CTPO001',
    college: 'KIET',
    department: { _id: 'dept_cse_1', name: 'Computer Science and Engineering', code: 'CSE' },
    designation: 'Class Teacher & Placement Officer',
    academicYear: '3rd Year',
    year: '3rd Year',
    section: 'A',
    class: 'A',
    approvalStatus: 'approved',
    isActive: true,
  },
  {
    _id: 'ctpo_2',
    user: { _id: 'user_ctpo_2', name: 'Manoj Verma', email: 'ctpo.cseb@college.edu' },
    employeeId: 'CTPO002',
    college: 'KIET',
    department: { _id: 'dept_cse_1', name: 'Computer Science and Engineering', code: 'CSE' },
    designation: 'Class Teacher & Placement Officer',
    academicYear: '3rd Year',
    year: '3rd Year',
    section: 'B',
    class: 'B',
    approvalStatus: 'approved',
    isActive: true,
  },
];

const mockCategories = [
  { _id: 'cat_hackathon', name: 'Hackathons', code: 'HACK', defaultPoints: 20, maxPointsAllowed: 100 },
  { _id: 'cat_workshop', name: 'Workshops & Seminars', code: 'WORK', defaultPoints: 10, maxPointsAllowed: 50 },
  { _id: 'cat_sports', name: 'Sports & Athletics', code: 'SPORT', defaultPoints: 15, maxPointsAllowed: 60 },
  { _id: 'cat_cert', name: 'Professional Certifications', code: 'CERT', defaultPoints: 25, maxPointsAllowed: 100 },
];

const mockActivities = [
  {
    _id: 'act_1',
    student: { _id: 'student_1', user: { _id: 'user_student_1', name: 'Alice Johnson', email: 'alice@student.edu' } },
    title: 'Smart India Hackathon 2025 Finalist',
    category: { _id: 'cat_hackathon', name: 'Hackathons', code: 'HACK', defaultPoints: 20 },
    description: 'Developed an AI-powered smart irrigation monitoring system',
    activityDate: new Date('2025-11-15'),
    academicYear: '2025-2026',
    pointsRequested: 25,
    pointsAwarded: 25,
    status: 'approved',
  },
  {
    _id: 'act_2',
    student: { _id: 'student_1', user: { _id: 'user_student_1', name: 'Alice Johnson', email: 'alice@student.edu' } },
    title: 'AWS Certified Cloud Practitioner',
    category: { _id: 'cat_cert', name: 'Professional Certifications', code: 'CERT', defaultPoints: 25 },
    description: 'Completed AWS cloud practitioner foundational credential',
    activityDate: new Date('2026-01-10'),
    academicYear: '2025-2026',
    pointsRequested: 25,
    pointsAwarded: 0,
    status: 'pending',
  },
];

const mockCertifications = [
  {
    _id: 'cert_1',
    student: 'student_1',
    studentId: 'student_1',
    title: 'Python Programming Certification',
    certificationName: 'Python Programming Certification',
    issuingOrganization: 'Infosys Springboard',
    platform: 'Infosys Springboard',
    issueDate: new Date('2026-08-20'),
    credentialId: 'PY12345',
    credentialUrl: 'https://example.com/certificate/PY12345',
    certificateFileUrl: '/uploads/certificates/python-certificate.png',
    certificateUrl: '/uploads/certificates/python-certificate.png',
    description: 'Python programming certification covering OOP and data structures.',
    createdAt: new Date('2026-08-20T10:00:00Z'),
    updatedAt: new Date('2026-08-20T10:00:00Z'),
  },
  {
    _id: 'cert_2',
    student: 'student_1',
    studentId: 'student_1',
    title: 'AWS Certified Cloud Practitioner',
    certificationName: 'AWS Certified Cloud Practitioner',
    issuingOrganization: 'Amazon Web Services',
    platform: 'Amazon Web Services',
    issueDate: new Date('2026-01-10'),
    credentialId: 'AWS-12345678',
    credentialUrl: 'https://aws.amazon.com/verification/AWS-12345678',
    certificateFileUrl: '/uploads/certificates/aws-cloud-practitioner.pdf',
    certificateUrl: '/uploads/certificates/aws-cloud-practitioner.pdf',
    description: 'Foundational cloud architectural principles and AWS services.',
    createdAt: new Date('2026-01-10T09:00:00Z'),
    updatedAt: new Date('2026-01-10T09:00:00Z'),
  },
  {
    _id: 'cert_3',
    student: 'student_2',
    studentId: 'student_2',
    title: 'Introduction to Data Science & Python',
    certificationName: 'Introduction to Data Science & Python',
    issuingOrganization: 'Coursera / IBM',
    platform: 'Coursera',
    issueDate: new Date('2026-02-15'),
    credentialId: 'IBM-DS-54321',
    credentialUrl: 'https://coursera.org/verify/IBM-DS-54321',
    certificateFileUrl: '/uploads/certificates/ibm-data-science.png',
    certificateUrl: '/uploads/certificates/ibm-data-science.png',
    description: 'Data science methodologies and Python data libraries.',
    createdAt: new Date('2026-02-15T11:00:00Z'),
    updatedAt: new Date('2026-02-15T11:00:00Z'),
  },
];

const mockInternships = [
  {
    _id: 'intern_1',
    student: 'student_1',
    companyName: 'Tech Innovations Corp',
    role: 'Full Stack Web Developer Intern',
    mode: 'remote',
    startDate: new Date('2025-06-01'),
    endDate: new Date('2025-08-31'),
    stipend: 15000,
    status: 'approved',
  },
];

const mockAchievements = [
  {
    _id: 'achieve_1',
    student: 'student_1',
    title: '1st Prize - State Level Hackathon',
    category: 'Hackathon',
    level: 'state',
    position: '1st Place',
    date: new Date('2025-10-20'),
  },
];

const mockNotifications = [
  {
    _id: 'notif_1',
    recipient: 'user_student_1',
    title: 'Activity Approved',
    message: 'Your activity "Smart India Hackathon 2025 Finalist" has been approved (25 points).',
    type: 'verification',
    isRead: false,
    createdAt: new Date(),
  },
];

const mockCourses = [
  {
    _id: 'course_1',
    code: 'CS301',
    name: 'Data Structures & Algorithms',
    title: 'Data Structures & Algorithms',
    department: 'dept_cse_1',
    credits: 4,
    semester: 3,
    instructor: 'user_faculty_1',
    description: 'Fundamental data structures and algorithmic complexity analysis.',
    syllabus: 'Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Sorting Algorithms, Dynamic Programming',
    capacity: 60,
    enrolledStudents: ['student_1'],
    status: 'active',
  },
  {
    _id: 'course_2',
    code: 'CS402',
    name: 'Cloud Computing & DevOps',
    title: 'Cloud Computing & DevOps',
    department: 'dept_cse_1',
    credits: 3,
    semester: 6,
    instructor: 'user_faculty_1',
    description: 'Introduction to virtualization, cloud architectures, container orchestration, and CI/CD pipelines.',
    syllabus: 'Virtual Machines, Docker, Kubernetes, AWS / Azure services, Terraform, GitHub Actions',
    capacity: 50,
    enrolledStudents: [],
    status: 'active',
  },
  {
    _id: 'course_3',
    code: 'EC201',
    name: 'Digital Signal Processing',
    title: 'Digital Signal Processing',
    department: 'dept_ece_1',
    credits: 4,
    semester: 4,
    instructor: null,
    description: 'Study of discrete-time signals, filtering techniques, and digital transform algorithms.',
    syllabus: 'Signals, Systems, Z-Transform, Discrete Fourier Transform, FFT, FIR and IIR filters',
    capacity: 45,
    enrolledStudents: [],
    status: 'active',
  },
];

const mockCertificates = [
  {
    _id: 'cert_1',
    student: 'student_1',
    title: 'AWS Certified Cloud Practitioner',
    issuingOrganization: 'Amazon Web Services',
    issueDate: new Date('2026-01-10'),
    expiryDate: new Date('2029-01-10'),
    credentialId: 'AWS-12345678',
    credentialUrl: 'https://aws.amazon.com/verification/AWS-12345678',
    skills: ['Cloud Computing', 'AWS', 'DevOps'],
    status: 'verified',
    verificationRemarks: 'Verified against official AWS certificate portal.',
  },
  {
    _id: 'cert_2',
    student: 'student_1',
    title: 'Deep Learning Specialization',
    issuingOrganization: 'DeepLearning.AI / Coursera',
    issueDate: new Date('2025-11-20'),
    expiryDate: null,
    credentialId: 'COURSERA-DL-9988',
    credentialUrl: 'https://coursera.org/verify/COURSERA-DL-9988',
    skills: ['Neural Networks', 'PyTorch', 'Computer Vision'],
    status: 'pending',
    verificationRemarks: null,
  },
];


const mockProjects = [
  {
    _id: 'proj_1',
    student: 'student_1',
    title: 'Smart Irrigation IoT System',
    description: 'An automated solar-powered irrigation and soil moisture monitoring platform with mobile web dashboard.',
    technologies: ['Node.js', 'React', 'C++', 'MQTT', 'MongoDB'],
    githubUrl: 'https://github.com/alice/smart-irrigation',
    liveUrl: 'https://smart-irrigation-demo.app',
    startDate: new Date('2025-08-01'),
    endDate: new Date('2025-11-30'),
    status: 'completed',
    teamMembers: ['Alice Johnson', 'Bob Miller'],
    guideFaculty: 'Dr. John Smith',
  },
  {
    _id: 'proj_2',
    student: 'student_1',
    title: 'College Activity & Placement Tracker',
    description: 'Full stack web application for tracking student activities, certifications, and generating professional resumes.',
    technologies: ['React', 'Express', 'Node.js', 'MongoDB'],
    githubUrl: 'https://github.com/alice/college-portal',
    liveUrl: null,
    startDate: new Date('2026-01-15'),
    endDate: null,
    status: 'ongoing',
    teamMembers: ['Alice Johnson'],
    guideFaculty: 'Dr. John Smith',
  },
];

const mockResumes = [
  {
    _id: 'resume_1',
    student: 'student_1',
    title: 'Alice Johnson - Software Engineer Resume',
    summary: 'Passionate Computer Science student with experience in Full Stack Development, Cloud technologies, and IoT solutions. Winner of State Hackathon 2025.',
    template: 'modern',
    isDefault: true,
    skills: ['JavaScript', 'TypeScript', 'Node.js', 'React', 'Python', 'MongoDB', 'AWS', 'Docker'],
    education: [
      {
        institution: 'College of Engineering & Technology',
        degree: 'B.Tech in Computer Science and Engineering',
        startYear: '2022',
        endYear: '2026',
        cgpa: '8.9',
      },
    ],
    experience: [
      {
        role: 'Full Stack Web Developer Intern',
        company: 'Tech Innovations Corp',
        duration: 'June 2025 - August 2025',
        description: 'Developed microservices, REST APIs, and frontend dashboards.',
      },
    ],
    projects: ['proj_1', 'proj_2'],
    certifications: ['cert_1'],
    fileUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockEvents = [
  {
    _id: 'event_1',
    title: 'AI & Machine Learning Innovation Summit',
    description: 'Hands-on symposium exploring deep learning architectures, generative AI, and agentic workflows.',
    date: new Date('2026-10-15T09:30:00Z'),
    time: '09:30 AM - 04:30 PM',
    venue: 'KIET Campus, Main Auditorium',
    city: 'Kakinada',
    area: 'Yanam Road',
    latitude: 16.9890,
    longitude: 82.2470,
    targetDepartment: 'CSE',
    targetYear: '3rd Year',
    targetType: 'specific_year',
    status: 'upcoming',
  },
  {
    _id: 'event_2',
    title: 'Embedded Systems & VLSI Workshop',
    description: 'Practical lab session on FPGA synthesis and microcontroller interfacing.',
    date: new Date('2026-10-20T10:00:00Z'),
    time: '10:00 AM - 03:00 PM',
    venue: 'ECE Advanced Hardware Lab',
    city: 'Kakinada',
    area: 'Campus Block B',
    latitude: 16.9895,
    longitude: 82.2480,
    targetDepartment: 'ECE',
    targetYear: '3rd Year',
    targetType: 'specific_year',
    status: 'upcoming',
  },
  {
    _id: 'event_3',
    title: 'Annual College Hackathon & Tech Expo',
    description: 'College-wide hackathon with open tracks in AI, Web3, IoT, and Social Good.',
    date: new Date('2026-11-05T09:00:00Z'),
    time: '09:00 AM - 06:00 PM',
    venue: 'College Open Air Auditorium',
    city: 'Kakinada',
    area: 'City Center',
    latitude: 16.9750,
    longitude: 82.2400,
    targetDepartment: 'all',
    targetYear: 'all',
    targetType: 'all_years',
    status: 'upcoming',
  },
  {
    _id: 'event_4',
    title: 'Python for Beginners & Data Structures',
    description: 'Foundational programming workshop for first-year engineering students.',
    date: new Date('2026-10-25T11:00:00Z'),
    time: '11:00 AM - 01:00 PM',
    venue: 'Computing Center Lab 2',
    city: 'Kakinada',
    area: 'Campus Block A',
    latitude: 16.9885,
    longitude: 82.2465,
    targetDepartment: 'CSE',
    targetYear: '1st Year',
    targetType: 'specific_year',
    status: 'upcoming',
  },
  {
    _id: 'event_5',
    title: 'National Software Conclave & Developer Meetup',
    description: 'Regional software development industry convention with hiring partners.',
    date: new Date('2026-11-12T10:00:00Z'),
    time: '10:00 AM - 05:00 PM',
    venue: 'Convention Centre, Beach Road',
    city: 'Visakhapatnam',
    area: 'Beach Road',
    latitude: 17.6868,
    longitude: 83.2185,
    targetDepartment: 'all',
    targetYear: 'all',
    targetType: 'all_years',
    status: 'upcoming',
  },
];

const mockAttendance = [
  {
    _id: 'att_student_1',
    student: 'student_1',
    rollNumber: '21CS001',
    academicYear: '2025-2026',
    semester: 6,
    overallPercentage: 86.4,
    totalWorkingDays: 24,
    daysPresent: 21,
    daysAbsent: 3,
    subjectWise: [
      { subjectCode: 'CS601PC', subjectName: 'Machine Learning', attendedHours: 36, totalHours: 40, percentage: 90.0 },
      { subjectCode: 'CS602PC', subjectName: 'Cloud Computing', attendedHours: 32, totalHours: 38, percentage: 84.2 },
      { subjectCode: 'CS603PC', subjectName: 'Compiler Design', attendedHours: 30, totalHours: 36, percentage: 83.3 },
      { subjectCode: 'CS604PE', subjectName: 'Cryptography & Network Security', attendedHours: 34, totalHours: 38, percentage: 89.5 },
      { subjectCode: 'CS605PC', subjectName: 'Machine Learning Lab', attendedHours: 28, totalHours: 30, percentage: 93.3 },
    ],
    monthlyRecords: {
      '2026-09': {
        month: 'September',
        year: 2026,
        percentage: 87.5,
        totalDays: 24,
        presentDays: 21,
        absentDays: 3,
        dailyRecords: [
          { date: '2026-09-01', dayOfWeek: 'Tuesday', status: 'Present', periods: ['P', 'P', 'P', 'P', 'P', 'P'] },
          { date: '2026-09-02', dayOfWeek: 'Wednesday', status: 'Present', periods: ['P', 'P', 'P', 'P', 'P', 'P'] },
          { date: '2026-09-03', dayOfWeek: 'Thursday', status: 'Absent', periods: ['A', 'A', 'A', 'A', 'A', 'A'] },
          { date: '2026-09-04', dayOfWeek: 'Friday', status: 'Present', periods: ['P', 'P', 'P', 'P', 'P', 'P'] },
          { date: '2026-09-05', dayOfWeek: 'Saturday', status: 'Present', periods: ['P', 'P', 'P', 'P', 'P', 'P'] },
          { date: '2026-09-07', dayOfWeek: 'Monday', status: 'Present', periods: ['P', 'P', 'P', 'P', 'P', 'P'] },
        ],
      },
    },
  },
  {
    _id: 'att_student_2',
    student: 'student_2',
    rollNumber: '24CS002',
    academicYear: '2025-2026',
    semester: 2,
    overallPercentage: 81.2,
    totalWorkingDays: 24,
    daysPresent: 19,
    daysAbsent: 5,
    subjectWise: [
      { subjectCode: 'CS201PC', subjectName: 'Data Structures', attendedHours: 32, totalHours: 40, percentage: 80.0 },
      { subjectCode: 'MA201BS', subjectName: 'Linear Algebra', attendedHours: 35, totalHours: 40, percentage: 87.5 },
    ],
    monthlyRecords: {
      '2026-09': {
        month: 'September',
        year: 2026,
        percentage: 79.2,
        totalDays: 24,
        presentDays: 19,
        absentDays: 5,
        dailyRecords: [
          { date: '2026-09-01', dayOfWeek: 'Tuesday', status: 'Present', periods: ['P', 'P', 'P', 'P', 'P', 'P'] },
          { date: '2026-09-02', dayOfWeek: 'Wednesday', status: 'Absent', periods: ['A', 'A', 'A', 'A', 'A', 'A'] },
        ],
      },
    },
  },
];

const mockAcademicReports = [
  {
    _id: 'acad_rep_student_1',
    student: 'student_1',
    rollNumber: '21CS001',
    regulation: 'R20',
    batch: '2022-2026',
    department: 'Computer Science and Engineering',
    year: '3rd Year',
    semester: 6,
    semesterName: 'Semester VI',
    cgpa: 8.90,
    sgpa: 8.85,
    totalCredits: 21.5,
    subjects: [
      {
        code: 'CS601PC',
        name: 'Machine Learning',
        type: 'Theory',
        internalMarks: 28,
        externalMarks: 58,
        totalMarks: 86,
        grade: 'A+',
        gradePoints: 9,
        credits: 3.0,
        status: 'Pass',
      },
      {
        code: 'CS602PC',
        name: 'Cloud Computing',
        type: 'Theory',
        internalMarks: 27,
        externalMarks: 54,
        totalMarks: 81,
        grade: 'A',
        gradePoints: 8,
        credits: 3.0,
        status: 'Pass',
      },
      {
        code: 'CS603PC',
        name: 'Compiler Design',
        type: 'Theory',
        internalMarks: 26,
        externalMarks: 56,
        totalMarks: 82,
        grade: 'A',
        gradePoints: 8,
        credits: 3.0,
        status: 'Pass',
      },
      {
        code: 'CS604PE',
        name: 'Cryptography & Network Security',
        type: 'Theory',
        internalMarks: 29,
        externalMarks: 60,
        totalMarks: 89,
        grade: 'A+',
        gradePoints: 9,
        credits: 3.0,
        status: 'Pass',
      },
      {
        code: 'CS605PC',
        name: 'Machine Learning Lab',
        type: 'Practical',
        internalMarks: 29,
        externalMarks: 65,
        totalMarks: 94,
        grade: 'O',
        gradePoints: 10,
        credits: 1.5,
        status: 'Pass',
      },
      {
        code: 'CS606PC',
        name: 'Cloud Computing Lab',
        type: 'Practical',
        internalMarks: 28,
        externalMarks: 64,
        totalMarks: 92,
        grade: 'O',
        gradePoints: 10,
        credits: 1.5,
        status: 'Pass',
      },
      {
        code: 'CS607PR',
        name: 'Industry Oriented Mini Project',
        type: 'Project',
        internalMarks: 48,
        externalMarks: 45,
        totalMarks: 93,
        grade: 'O',
        gradePoints: 10,
        credits: 2.0,
        status: 'Pass',
      },
    ],
  },
  {
    _id: 'acad_rep_student_2',
    student: 'student_2',
    rollNumber: '24CS002',
    regulation: 'R23',
    batch: '2024-2028',
    department: 'Computer Science and Engineering',
    year: '1st Year',
    semester: 2,
    semesterName: 'Semester II',
    cgpa: 8.20,
    sgpa: 8.10,
    totalCredits: 19.5,
    subjects: [
      {
        code: 'CS201PC',
        name: 'Data Structures',
        type: 'Theory',
        internalMarks: 25,
        externalMarks: 50,
        totalMarks: 75,
        grade: 'B+',
        gradePoints: 7,
        credits: 3.0,
        status: 'Pass',
      },
      {
        code: 'MA201BS',
        name: 'Linear Algebra & Calculus',
        type: 'Theory',
        internalMarks: 28,
        externalMarks: 55,
        totalMarks: 83,
        grade: 'A',
        gradePoints: 8,
        credits: 3.5,
        status: 'Pass',
      },
    ],
  },
];

const mockClubs = [
  {
    _id: 'club_1',
    name: 'Global Coding Club',
    code: 'GCC',
    description: 'Premier competitive coding, software engineering, and open development club empowering students to excel in coding competitions and industry projects.',
    college: 'KIET',
    category: 'Technical',
    facultyCoordinator: 'Dr. John Smith',
    studentLead: 'Alice Johnson',
    leadEmail: 'alice@student.edu',
    membersCount: 150,
    status: 'active',
    isActive: true,
    meetingSchedule: 'Wednesdays & Fridays, 4:00 PM',
    venue: 'Seminar Hall 1, KIET Campus',
    contactEmail: 'gcc@kiet.edu',
    banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    tags: ['Coding', 'Algorithms', 'Hackathons', 'Open Source'],
    createdAt: new Date('2024-01-15T00:00:00.000Z'),
    updatedAt: new Date('2024-01-15T00:00:00.000Z'),
  },
  {
    _id: 'club_2',
    name: 'C4GT-Hub',
    code: 'C4GT',
    description: 'Code for GovTech community chapter solving real-world governance, digital public infrastructure, and societal challenges through open-source technology.',
    college: 'KIET',
    category: 'Open Source',
    facultyCoordinator: 'Dr. Robert Taylor',
    studentLead: 'Bob Martin',
    leadEmail: 'bob@student.edu',
    membersCount: 110,
    status: 'active',
    isActive: true,
    meetingSchedule: 'Tuesdays & Thursdays, 4:30 PM',
    venue: 'Innovation Hub, KIET Campus',
    contactEmail: 'c4gt@kiet.edu',
    banner: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
    tags: ['GovTech', 'Open Source', 'DPI', 'Web Development'],
    createdAt: new Date('2024-02-10T00:00:00.000Z'),
    updatedAt: new Date('2024-02-10T00:00:00.000Z'),
  },
  {
    _id: 'club_3',
    name: 'Toastmaster Club',
    code: 'TMC',
    description: 'International public speaking and leadership incubator helping students develop confidence, interpersonal communication, speech delivery, and debate skills.',
    college: 'KIET+',
    category: 'Literary & Leadership',
    facultyCoordinator: 'Dr. Sarah Wilson',
    studentLead: 'Farooq Ahmed',
    leadEmail: 'farooq@student.edu',
    membersCount: 85,
    status: 'active',
    isActive: true,
    meetingSchedule: 'Saturdays, 10:00 AM',
    venue: 'Auditorium Block B, KIET+ Campus',
    contactEmail: 'toastmasters@kietplus.edu',
    banner: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80',
    tags: ['Public Speaking', 'Debate', 'Communication', 'Leadership'],
    createdAt: new Date('2024-03-01T00:00:00.000Z'),
    updatedAt: new Date('2024-03-01T00:00:00.000Z'),
  },
  {
    _id: 'club_4',
    name: 'NCC & NSS',
    code: 'NCC-NSS',
    description: 'National Cadet Corps and National Service Scheme chapters uniting students for national service, discipline, disaster relief, leadership camps, and community outreach.',
    college: 'KIEW',
    category: 'Social Service & Defense',
    facultyCoordinator: 'Dr. Anitha Rao',
    studentLead: 'Geeta Priya',
    leadEmail: 'geeta@student.edu',
    membersCount: 200,
    status: 'active',
    isActive: true,
    meetingSchedule: 'Mondays & Saturdays, 6:30 AM',
    venue: 'Parade Grounds, KIEW Campus',
    contactEmail: 'nccnss@kiew.edu',
    banner: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80',
    tags: ['Community Service', 'Cadet Corps', 'Discipline', 'Volunteering'],
    createdAt: new Date('2024-01-20T00:00:00.000Z'),
    updatedAt: new Date('2024-01-20T00:00:00.000Z'),
  },
  {
    _id: 'club_inactive_1',
    name: 'Robotics Guild (Archived)',
    code: 'RGA',
    description: 'Legacy hardware robotics club currently inactive for restructuring.',
    college: 'KIET',
    category: 'Robotics',
    facultyCoordinator: 'Dr. John Smith',
    studentLead: 'Alumni Lead',
    leadEmail: 'robotics@kiet.edu',
    membersCount: 25,
    status: 'inactive',
    isActive: false,
    meetingSchedule: 'N/A',
    venue: 'Old Lab 4',
    contactEmail: 'robotics@kiet.edu',
    banner: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
    tags: ['Robotics', 'Hardware', 'Archived'],
    createdAt: new Date('2023-08-10T00:00:00.000Z'),
    updatedAt: new Date('2023-12-01T00:00:00.000Z'),
  },
];

const mockSystemSettings = {
  academicYear: '2025-2026',
  currentSemester: 'Even (Spring 2026)',
  portalMaintenance: false,
  allowStudentRegistration: true,
  pointsApprovalThreshold: 100,
  maxPointsPerSemester: 150,
  contactSupportEmail: 'support@college.edu',
  lastUpdated: new Date(),
};

// Export Models
module.exports = {
  User: new MockModel('User', mockUsers),
  Department: new MockModel('Department', mockDepartments),
  Student: new MockModel('Student', mockStudents),
  Faculty: new MockModel('Faculty', mockFaculty),
  ActivityCategory: new MockModel('ActivityCategory', mockCategories),
  Activity: new MockModel('Activity', mockActivities),
  Evidence: new MockModel('Evidence', []),
  Verification: new MockModel('Verification', []),
  Achievement: new MockModel('Achievement', mockAchievements),
  Internship: new MockModel('Internship', mockInternships),
  Certification: new MockModel('Certification', mockCertifications),
  Certificate: new MockModel('Certificate', mockCertificates),
  Course: new MockModel('Course', mockCourses),
  Project: new MockModel('Project', mockProjects),
  Resume: new MockModel('Resume', mockResumes),
  Event: new MockModel('Event', mockEvents),
  Notification: new MockModel('Notification', mockNotifications),
  Attendance: new MockModel('Attendance', mockAttendance),
  AcademicReport: new MockModel('AcademicReport', mockAcademicReports),
  Hod: new MockModel('Hod', mockHods),
  Ctpo: new MockModel('Ctpo', mockCtpos),
  Club: new MockModel('Club', mockClubs),
  mockSystemSettings,
};
