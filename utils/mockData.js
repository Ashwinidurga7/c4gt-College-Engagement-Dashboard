const bcrypt = require('bcryptjs');

class MockQuery {
  constructor(resultPromise) {
    this.resultPromise = resultPromise;
  }

  populate() {
    return this; // chainable mock
  }

  select() {
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

    const _id = 'mock_' + Math.random().toString(36).substr(2, 9);
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

  async findByIdAndUpdate(id, updates, options = {}) {
    const idx = this.data.findIndex((item) => String(item._id) === String(id));
    if (idx === -1) return null;
    this.data[idx] = { ...this.data[idx], ...updates, updatedAt: new Date() };
    return {
      ...this.data[idx],
      toObject: () => ({ ...this.data[idx] }),
    };
  }

  async findOneAndUpdate(query, updates, options = {}) {
    const found = this.data.find((item) => this._matchesQuery(item, query));
    if (!found) return null;
    Object.assign(found, updates, { updatedAt: new Date() });
    return {
      ...found,
      toObject: () => ({ ...found }),
    };
  }

  async findByIdAndDelete(id) {
    const idx = this.data.findIndex((item) => String(item._id) === String(id));
    if (idx === -1) return null;
    const removed = this.data.splice(idx, 1)[0];
    return removed;
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
    isActive: true,
  },
  {
    _id: 'user_student_1',
    name: 'Alice Johnson',
    email: 'alice@student.edu',
    password: samplePasswordHash,
    role: 'student',
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
    department: { _id: 'dept_cse_1', name: 'Computer Science and Engineering', code: 'CSE' },
    batch: '2022-2026',
    semester: 6,
    section: 'A',
    cgpa: 8.9,
    phoneNumber: '+1-555-0199',
  },
];

const mockFaculty = [
  {
    _id: 'faculty_1',
    user: { _id: 'user_faculty_1', name: 'Dr. John Smith', email: 'john.smith@college.edu' },
    employeeId: 'FAC001',
    department: { _id: 'dept_cse_1', name: 'Computer Science and Engineering', code: 'CSE' },
    designation: 'Associate Professor',
    specialization: 'Artificial Intelligence & Machine Learning',
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
    title: 'AWS Certified Cloud Practitioner',
    issuingOrganization: 'Amazon Web Services',
    issueDate: new Date('2026-01-10'),
    credentialId: 'AWS-12345678',
    status: 'pending',
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
  Event: new MockModel('Event', []),
  Notification: new MockModel('Notification', mockNotifications),
};
