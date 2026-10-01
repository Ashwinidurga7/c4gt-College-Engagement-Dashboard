/**
 * Creates the real login accounts: the nine students of our team and one account for
 * each staff role. Safe to run again: accounts are matched by email and updated in
 * place, and nothing else in the database is touched.
 *
 *   npm run seed:users                     create missing accounts, keep existing passwords
 *   npm run seed:users -- --reset-passwords   give every seeded account a new password
 *
 * New passwords are random and printed once in the terminal. They are never written to
 * a file. To choose a role's password instead, set SEED_PASSWORD_<ROLE> (for example
 * SEED_PASSWORD_ADMIN); it applies to every account of that role on each run.
 */
const crypto = require('crypto');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Hod = require('../models/Hod');
const Ctpo = require('../models/Ctpo');
const Department = require('../models/Department');

// Branch codes as JNTUK prints them in the roll number (23JN1A4534 -> 45 -> AID).
// All three are CSE specialisations, so they sit under the CSE department.
const BRANCHES = { 42: 'CSM', 43: 'CAI', 45: 'AID' };

// 2026-27: the 2023 batch is in 4th year (semester 7), the 2024 batch in 3rd year (semester 5).
const BATCHES = {
  23: { batch: '2023-2027', year: '4', semester: 7 },
  24: { batch: '2024-2028', year: '3', semester: 5 },
};

// Team 2, K-Hub 2026-27. Sections were not in the team sheet, so everyone is in A for now.
const STUDENTS = [
  { name: 'Bokka Ashwini Durga', rollNumber: '23JN1A4534', college: 'KIEW', email: 'ashwini.bokka@kiew.edu' },
  { name: 'Devaguptapu Venkata Surya Shanmukha', rollNumber: '23JN1A4215', college: 'KIEW', email: 'shanmukha.devaguptapu@kiew.edu' },
  { name: 'Giridhar Shyam Samsani', rollNumber: '23B21A4269', college: 'KIET', email: 'giridhar.samsani@kiet.edu' },
  { name: 'Peddapalli Satya Venkata Siva Durga Prasad', rollNumber: '23B21A4591', college: 'KIET', email: 'durgaprasad.peddapalli@kiet.edu' },
  { name: 'Gandham Sri Lakshmi', rollNumber: '23JN1A4533', college: 'KIEW', email: 'srilakshmi.gandham@kiew.edu' },
  { name: 'Balukula Sampath', rollNumber: '24B21A4345', college: 'KIET', email: 'sampath.balukula@kiet.edu' },
  { name: 'Yuvaraju Bondada', rollNumber: '246Q1A4307', college: 'KIET+', email: 'yuvaraju.bondada@kietplus.edu' },
  { name: 'Monika Kona', rollNumber: '24JN1A4306', college: 'KIEW', email: 'monika.kona@kiew.edu' },
  { name: 'Chintada Ramya Sri', rollNumber: '24JN1A4502', college: 'KIEW', email: 'ramyasri.chintada@kiew.edu' },
].map((student) => ({
  ...student,
  role: 'student',
  branch: BRANCHES[student.rollNumber.slice(6, 8)],
  section: 'A',
  ...BATCHES[student.rollNumber.slice(0, 2)],
}));

// Placeholder staff accounts until the real names and emails are known.
const STAFF = [
  { role: 'admin', name: 'Portal Admin', email: 'admin@kiet.local' },
  { role: 'faculty', name: 'CSE Faculty', email: 'faculty.cse@kiet.local', assignedYears: ['3', '4'] },
  { role: 'hod', name: 'CSE Head of Department', email: 'hod.cse@kiet.local', academicYear: '2026-27' },
  { role: 'ctpo', name: 'CSE Class Teacher', email: 'ctpo.cse@kiet.local', year: '3', section: 'A' },
];

const PROFILE_MODELS = { faculty: Faculty, hod: Hod, ctpo: Ctpo };
const EMPLOYEE_PREFIX = { faculty: 'FAC', hod: 'HOD', ctpo: 'CTPO' };

// No 0/O, 1/l/I, so the password can be read off the terminal without guessing.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

/** 16 random characters in groups of four, e.g. hT7k-Qm2x-9PzR-wd4N (about 92 bits). */
function generatePassword() {
  for (;;) {
    const chars = Array.from({ length: 16 }, () => ALPHABET[crypto.randomInt(ALPHABET.length)]).join('');
    if (/\d/.test(chars) && /[a-z]/.test(chars) && /[A-Z]/.test(chars)) {
      return chars.match(/.{4}/g).join('-');
    }
  }
}

function passwordOverride(role) {
  const value = process.env[`SEED_PASSWORD_${role.toUpperCase()}`];
  if (value === undefined || value === '') return null;
  if (value.length < 10) {
    throw new Error(`SEED_PASSWORD_${role.toUpperCase()} must be at least 10 characters.`);
  }
  return value;
}

async function cseDepartment() {
  const found = await Department.findOne({ code: 'CSE' }).lean();
  if (found) return { _id: found._id, name: found.name, code: found.code };
  return { _id: 'dept_cse', name: 'Computer Science and Engineering', code: 'CSE' };
}

/** Creates or updates the User. Returns the user and the plain password if one was set. */
async function upsertUser(account, resetPasswords) {
  const { email, role } = account;
  let user = await User.findOne({ email: { $eq: email } });
  const isNew = !user;

  const fields = {
    name: account.name,
    role,
    college: account.college || 'KIET',
    approvalStatus: 'approved',
    isActive: true,
  };
  if (role === 'student') {
    Object.assign(fields, {
      rollNumber: account.rollNumber,
      department: 'CSE',
      branch: account.branch,
      year: account.year,
      semester: account.semester,
      section: account.section,
    });
  }

  if (isNew) {
    user = new User({ email, ...fields });
  } else {
    user.set(fields);
  }

  const override = passwordOverride(role);
  let password = null;
  if (override) {
    password = override;
  } else if (isNew || resetPasswords) {
    password = generatePassword();
  }
  // Only set when it changes, so an unchanged account keeps its hash (the model hashes on save).
  if (password && (isNew || !(await user.matchPassword(password)))) {
    user.password = password;
  }

  await user.save();
  return { user, isNew, password: override ? '(SEED_PASSWORD_' + role.toUpperCase() + ')' : password };
}

async function upsertStudentProfile(user, account) {
  const userId = String(user._id);
  // The app finds a student's profile by user; fall back to the roll number for a profile
  // that was imported before its account existed.
  let profile =
    (await Student.findOne({ user: userId })) ||
    (await Student.findOne({ rollNumber: { $eq: account.rollNumber } }));

  const fields = {
    user: userId,
    name: account.name,
    email: account.email,
    rollNumber: account.rollNumber,
    college: account.college,
    department: 'CSE',
    branch: account.branch,
    batch: account.batch,
    year: account.year,
    semester: account.semester,
    section: account.section,
  };

  if (profile) {
    profile.set(fields);
    await profile.save();
  } else {
    profile = await Student.create(fields);
  }
  return profile;
}

async function upsertStaffProfile(user, account, department) {
  const Model = PROFILE_MODELS[account.role];
  if (!Model) return null;

  const userId = String(user._id);
  const fields = {
    user: userId,
    college: 'KIET',
    department,
    approvalStatus: 'approved',
    isActive: true,
  };
  if (account.role === 'faculty') fields.assignedYears = account.assignedYears;
  if (account.role === 'hod') Object.assign(fields, { academicYear: account.academicYear, year: account.academicYear });
  if (account.role === 'ctpo') Object.assign(fields, { year: account.year, academicYear: account.year, section: account.section, class: account.section });

  const profile = await Model.findOne({ user: userId });
  if (profile) {
    profile.set(fields);
    await profile.save();
    return profile;
  }
  return Model.create({ ...fields, employeeId: `${EMPLOYEE_PREFIX[account.role]}${crypto.randomInt(100, 1000)}` });
}

/** Warns when another account already uses a seeded roll number, since login by roll number picks one. */
async function warnOnRollNumberClash(account, user) {
  const clash = await User.findOne({ rollNumber: { $eq: account.rollNumber }, _id: { $ne: user._id } }).lean();
  if (clash) {
    console.warn(`⚠️  ${account.rollNumber} is also used by ${clash.email}. Signing in with the roll number may pick either account.`);
  }
}

async function main() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not set. Add it to .env (see .env.example).');
    process.exit(1);
  }

  const resetPasswords = process.argv.includes('--reset-passwords');
  ['student', ...STAFF.map((s) => s.role)].forEach(passwordOverride); // fail before writing anything

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log(`Connected to ${mongoose.connection.host}/${mongoose.connection.name}`);

  const department = await cseDepartment();
  const rows = [];

  for (const account of STUDENTS) {
    const { user, isNew, password } = await upsertUser(account, resetPasswords);
    await upsertStudentProfile(user, account);
    await warnOnRollNumberClash(account, user);
    rows.push({ role: 'student', name: account.name, email: account.email, rollNumber: account.rollNumber, status: isNew ? 'created' : 'updated', password: password || '(unchanged)' });
  }

  for (const account of STAFF) {
    const { user, isNew, password } = await upsertUser(account, resetPasswords);
    await upsertStaffProfile(user, account, department);
    rows.push({ role: account.role, name: account.name, email: account.email, rollNumber: '', status: isNew ? 'created' : 'updated', password: password || '(unchanged)' });
  }

  console.log('\nSeeded accounts. Passwords are shown only now: hand them out privately and clear this terminal.\n');
  console.table(rows);
  console.log('Students can sign in with their email or roll number.');
  console.log('Run with --reset-passwords to issue new ones (for example if this output was lost).');
}

main()
  .catch((error) => {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
