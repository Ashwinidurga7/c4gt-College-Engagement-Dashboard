import { percentage, weightedAverage } from '@/lib/academics'
import { summarizeAttendance } from '@/lib/attendanceSummary'
import { nameOf, pick, toId, toList, toNumber } from '@/services/adapterUtils'

export function toProfile(raw = {}) {
  const source = raw?.student ?? raw?.profile ?? raw ?? {}
  const user = source.user ?? {}
  return {
    id: toId(source, user._id),
    name: pick(source.name, user.name, 'Student'),
    email: pick(source.email, user.email, ''),
    rollNumber: pick(source.rollNumber, source.rollNo, source.registrationNumber),
    phone: pick(source.phone, source.mobile),
    dateOfBirth: pick(source.dateOfBirth, source.dob),
    gender: source.gender ?? null,
    college: pick(source.college, user.college),
    department: nameOf(pick(source.department, user.department)),
    year: toNumber(source.year),
    section: source.section ?? null,
    batch: source.batch ?? null,
    regulation: source.regulation ?? null,
    currentSemester: toNumber(pick(source.currentSemester, source.semester)),
    admissionType: source.admissionType ?? null,
    mentor: nameOf(source.mentor),
    address: source.address ?? null,
    guardianName: pick(source.guardianName, source.parentName),
    guardianPhone: pick(source.guardianPhone, source.parentPhone),
    bio: source.bio ?? null,
  }
}

/** Only the fields the student may edit are sent back. */
export function toProfilePayload(values) {
  return {
    phone: values.phone.trim(),
    address: values.address.trim(),
    guardianName: values.guardianName.trim(),
    guardianPhone: values.guardianPhone.trim(),
    bio: values.bio.trim(),
  }
}

function toActivity(raw) {
  return {
    id: toId(raw),
    type: pick(raw.type, raw.category, 'general'),
    title: pick(raw.title, raw.message, raw.description, 'Activity'),
    date: pick(raw.date, raw.createdAt),
  }
}

function toAnnouncement(raw) {
  return {
    id: toId(raw),
    title: pick(raw.title, 'Announcement'),
    body: pick(raw.body, raw.message, raw.description, ''),
    category: pick(raw.category, raw.priority, 'General'),
    date: pick(raw.date, raw.createdAt),
  }
}

export function toEvent(raw) {
  return {
    id: toId(raw),
    title: pick(raw.title, raw.name, 'Event'),
    organizer: pick(nameOf(raw.organizer), nameOf(raw.club)),
    category: raw.category ?? null,
    date: pick(raw.date, raw.startDate),
    startTime: raw.startTime ?? null,
    endTime: raw.endTime ?? null,
    venue: pick(raw.venue, raw.location),
    college: raw.college ?? null,
    description: pick(raw.description, ''),
    clubId: pick(raw.clubId, raw.club?._id, typeof raw.club === 'string' ? raw.club : null),
  }
}

export function toDashboard(raw = {}) {
  const stats = raw.stats ?? raw
  return {
    student: toProfile(raw.student ?? raw.profile ?? {}),
    stats: {
      attendancePercentage: toNumber(pick(stats.attendancePercentage, stats.attendance?.percentage, stats.attendance)),
      cgpa: toNumber(pick(stats.cgpa, stats.CGPA)),
      activeClubs: toNumber(pick(stats.activeClubs, stats.clubsCount, stats.clubs?.length)),
      upcomingEvents: toNumber(pick(stats.upcomingEvents, stats.upcomingEventsCount)),
    },
    recentActivities: toList(pick(raw.recentActivities, raw.activities)).map(toActivity),
    announcements: toList(pick(raw.announcements, raw.notices, raw.updates)).map(toAnnouncement),
  }
}

export function toAcademic(raw = {}) {
  return {
    batch: raw.batch ?? null,
    regulation: raw.regulation ?? null,
    currentSemester: toNumber(pick(raw.currentSemester, raw.semester)),
    year: toNumber(raw.year),
    section: raw.section ?? null,
    department: nameOf(raw.department),
    college: raw.college ?? null,
    admissionType: raw.admissionType ?? null,
    mentor: nameOf(raw.mentor),
    cgpa: toNumber(pick(raw.cgpa, raw.CGPA)),
    creditsEarned: toNumber(raw.creditsEarned),
    totalCredits: toNumber(raw.totalCredits),
    backlogs: toNumber(raw.backlogs, 0),
  }
}

export function toCourse(raw) {
  return {
    id: pick(raw.code, toId(raw)),
    code: pick(raw.code, raw.courseCode, ''),
    name: pick(raw.name, raw.title, raw.courseName, ''),
    credits: toNumber(raw.credits, 0),
    type: pick(raw.type, 'Theory'),
    faculty: pick(nameOf(raw.faculty), raw.facultyName),
  }
}

function toSubjectAttendance(raw) {
  const conducted = toNumber(pick(raw.conducted, raw.total, raw.totalClasses), 0)
  const attended = toNumber(pick(raw.attended, raw.present, raw.attendedClasses), 0)
  return {
    code: pick(raw.code, raw.subjectCode),
    subject: pick(raw.subject, raw.subjectName, raw.name, 'Subject'),
    conducted,
    attended,
    percentage: toNumber(raw.percentage, percentage(attended, conducted)),
  }
}

export function toAttendance(raw = {}) {
  const records = toList(raw.records).map((record) => ({
    date: record.date,
    subjectCode: pick(record.subjectCode, record.code),
    subject: pick(record.subject, record.subjectName, 'Subject'),
    status: String(pick(record.status, 'present')).toLowerCase(),
  }))
  const derived = summarizeAttendance(records)
  const subjects = raw.subjects?.length ? raw.subjects.map(toSubjectAttendance) : derived.subjects
  const conducted = subjects.reduce((sum, entry) => sum + entry.conducted, 0)
  const attended = subjects.reduce((sum, entry) => sum + entry.attended, 0)
  const monthly = raw.monthly?.length
    ? raw.monthly.map((entry) => ({ month: pick(entry.month, entry.label), percentage: toNumber(entry.percentage, 0) }))
    : derived.monthly

  return {
    percentage: toNumber(pick(raw.overallPercentage, raw.percentage), percentage(attended, conducted)),
    conducted: toNumber(raw.totalClasses, conducted),
    attended: toNumber(raw.attendedClasses, attended),
    subjects,
    monthly,
    records,
  }
}

function toGradeRow(raw) {
  return {
    code: pick(raw.code, raw.courseCode, raw.subjectCode, ''),
    name: pick(raw.name, raw.subject, raw.courseName, ''),
    credits: toNumber(raw.credits, 0),
    internal: toNumber(raw.internal),
    external: toNumber(raw.external),
    total: toNumber(raw.total),
    grade: pick(raw.grade, '—'),
    gradePoints: toNumber(pick(raw.gradePoints, raw.points), 0),
  }
}

export function toAcademicReport(raw = {}) {
  const semesters = toList(pick(raw.semesters, raw.results)).map((entry) => {
    const courses = toList(pick(entry.courses, entry.subjects)).map(toGradeRow)
    return {
      semester: toNumber(entry.semester),
      sgpa: toNumber(entry.sgpa, weightedAverage(courses)),
      credits: toNumber(entry.credits, courses.reduce((sum, course) => sum + course.credits, 0)),
      publishedOn: pick(entry.publishedOn, entry.date),
      courses,
    }
  })
  return {
    cgpa: toNumber(raw.cgpa, weightedAverage(semesters.flatMap((entry) => entry.courses))),
    semesters: semesters.sort((a, b) => a.semester - b.semester),
  }
}
