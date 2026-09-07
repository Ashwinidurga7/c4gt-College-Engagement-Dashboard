const Notification = require('../models/Notification');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Hod = require('../models/Hod');
const User = require('../models/User');
const {
  normalizeCollege,
  normalizeYear,
  doesDepartmentMatch,
} = require('./accessControlService');

/**
 * Derives normalized academic year of a student from explicit `year` property or `semester`.
 */
const getStudentYear = (student) => {
  if (!student) return '';
  if (student.year) {
    return normalizeYear(student.year);
  }
  if (student.semester) {
    const sem = Number(student.semester);
    if (!isNaN(sem) && sem > 0) {
      const yearNum = Math.ceil(sem / 2);
      return String(yearNum);
    }
  }
  return '';
};

/**
 * Checks whether a faculty member is active and approved.
 */
const isFacultyApprovedAndActive = (faculty) => {
  if (!faculty) return false;
  if (faculty.isActive === false) return false;
  if (faculty.approvalStatus && faculty.approvalStatus !== 'approved') return false;
  return true;
};

/**
 * Checks whether a faculty member is assigned to a specific target year.
 */
const isFacultyAssignedToYear = (faculty, targetYear) => {
  if (!faculty || !faculty.assignedYears || !Array.isArray(faculty.assignedYears)) {
    if (faculty && faculty.year) {
      return normalizeYear(faculty.year) === normalizeYear(targetYear);
    }
    return false;
  }
  const normTarget = normalizeYear(targetYear);
  return faculty.assignedYears.some((y) => normalizeYear(y) === normTarget);
};

/**
 * Extracts standard User ID string from an entity or user reference.
 */
const extractUserId = (userRef) => {
  if (!userRef) return null;
  if (typeof userRef === 'string') return userRef;
  return userRef._id || userRef.id || null;
};

/**
 * Create a single notification safely.
 * Prevents accidental duplicates for the same recipient, type, and referenceId.
 */
const createNotification = async ({
  recipient,
  title,
  message,
  type = 'SYSTEM',
  referenceId = null,
  referenceType = null,
}) => {
  try {
    const recipientId = extractUserId(recipient);
    if (!recipientId) {
      console.warn('createNotification: Missing recipient ID');
      return null;
    }

    // Check duplicate if referenceId is provided
    if (referenceId) {
      const existing = await Notification.findOne({
        recipient: recipientId,
        type,
        referenceId: String(referenceId),
      });
      if (existing) {
        return existing;
      }
    }

    const notif = await Notification.create({
      recipient: recipientId,
      title,
      message,
      type,
      referenceId: referenceId ? String(referenceId) : null,
      referenceType: referenceType || null,
      isRead: false,
    });

    return notif;
  } catch (err) {
    console.error(`Failed to create notification for ${recipient}:`, err.message);
    return null;
  }
};

/**
 * Notify a single user.
 */
const notifyUser = async (userId, payload) => {
  return await createNotification({ recipient: userId, ...payload });
};

/**
 * Notify multiple users in bulk safely with duplicate prevention.
 */
const notifyUsers = async (userIds, payload) => {
  try {
    const uniqueUserIds = [...new Set(userIds.map(extractUserId).filter(Boolean))];
    if (uniqueUserIds.length === 0) return [];

    const notificationsToCreate = [];

    for (const uId of uniqueUserIds) {
      if (payload.referenceId) {
        const existing = await Notification.findOne({
          recipient: uId,
          type: payload.type || 'SYSTEM',
          referenceId: String(payload.referenceId),
        });
        if (existing) continue;
      }

      notificationsToCreate.push({
        recipient: uId,
        title: payload.title,
        message: payload.message,
        type: payload.type || 'SYSTEM',
        referenceId: payload.referenceId ? String(payload.referenceId) : null,
        referenceType: payload.referenceType || null,
        isRead: false,
      });
    }

    if (notificationsToCreate.length === 0) return [];

    if (typeof Notification.insertMany === 'function') {
      return await Notification.insertMany(notificationsToCreate);
    } else {
      const created = [];
      for (const item of notificationsToCreate) {
        created.push(await Notification.create(item));
      }
      return created;
    }
  } catch (err) {
    console.error('Failed to notify multiple users:', err.message);
    return [];
  }
};

/**
 * Notify all students of a specific academic year.
 */
const notifyStudentsByYear = async (targetYear, payload) => {
  try {
    const students = await Student.find();
    const normTarget = normalizeYear(targetYear);

    const matchingUserIds = [];
    for (const student of students) {
      if (getStudentYear(student) === normTarget) {
        const uId = extractUserId(student.user);
        if (uId) matchingUserIds.push(uId);
      }
    }

    return await notifyUsers(matchingUserIds, payload);
  } catch (err) {
    console.error(`Failed to notify students of year ${targetYear}:`, err.message);
    return [];
  }
};

/**
 * Notify all approved faculty assigned to a specific academic year.
 */
const notifyFacultyByYear = async (targetYear, payload) => {
  try {
    const facultyList = await Faculty.find();

    const matchingUserIds = [];
    for (const faculty of facultyList) {
      if (isFacultyApprovedAndActive(faculty) && isFacultyAssignedToYear(faculty, targetYear)) {
        const uId = extractUserId(faculty.user);
        if (uId) matchingUserIds.push(uId);
      }
    }

    return await notifyUsers(matchingUserIds, payload);
  } catch (err) {
    console.error(`Failed to notify faculty of year ${targetYear}:`, err.message);
    return [];
  }
};

/**
 * Notify all registered/active students.
 */
const notifyAllStudents = async (payload) => {
  try {
    const students = await Student.find();
    const userIds = students.map((s) => extractUserId(s.user)).filter(Boolean);
    return await notifyUsers(userIds, payload);
  } catch (err) {
    console.error('Failed to notify all students:', err.message);
    return [];
  }
};

/**
 * Notify all registered/active approved faculty.
 */
const notifyAllFaculty = async (payload) => {
  try {
    const facultyList = await Faculty.find();
    const userIds = facultyList
      .filter((f) => isFacultyApprovedAndActive(f))
      .map((f) => extractUserId(f.user))
      .filter(Boolean);
    return await notifyUsers(userIds, payload);
  } catch (err) {
    console.error('Failed to notify all faculty:', err.message);
    return [];
  }
};

/**
 * Format event date/time for notification messages.
 */
const formatEventSchedule = (event) => {
  let scheduleStr = '';
  if (event.date) {
    try {
      const d = new Date(event.date);
      scheduleStr += ` on ${d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    } catch (e) {
      scheduleStr += ` on ${event.date}`;
    }
  }
  if (event.time) {
    scheduleStr += ` at ${event.time}`;
  }
  return scheduleStr;
};

/**
 * Generate and distribute event notifications based on target scope:
 * 1. Specific Department + Specific Year
 * 2. Specific Department + All Years
 * 3. All Departments + All Years
 */
const sendEventNotifications = async (event) => {
  try {
    if (!event) return { studentNotifs: [], facultyNotifs: [], totalSent: 0 };

    const targetDept = event.targetDepartment || event.department;
    const targetYr = event.targetYear;
    const isDeptSpecific = targetDept && String(targetDept).toLowerCase() !== 'all';
    const isYearSpecific = targetYr && String(targetYr).toLowerCase() !== 'all';

    const scheduleStr = formatEventSchedule(event);
    const students = await Student.find();
    const facultyList = await Faculty.find();

    let studentRecipients = [];
    let facultyRecipients = [];

    if (isDeptSpecific && isYearSpecific) {
      // 1. SPECIFIC DEPARTMENT + SPECIFIC YEAR
      const normYr = normalizeYear(targetYr);
      studentRecipients = students.filter(
        (s) => doesDepartmentMatch(s.department, targetDept) && getStudentYear(s) === normYr
      );
      facultyRecipients = facultyList.filter(
        (f) =>
          isFacultyApprovedAndActive(f) &&
          doesDepartmentMatch(f.department, targetDept) &&
          isFacultyAssignedToYear(f, targetYr)
      );
    } else if (isDeptSpecific && !isYearSpecific) {
      // 2. SPECIFIC DEPARTMENT + ALL YEARS
      studentRecipients = students.filter((s) => doesDepartmentMatch(s.department, targetDept));
      facultyRecipients = facultyList.filter(
        (f) => isFacultyApprovedAndActive(f) && doesDepartmentMatch(f.department, targetDept)
      );
    } else if (!isDeptSpecific && isYearSpecific) {
      // ALL DEPARTMENTS + SPECIFIC YEAR
      const normYr = normalizeYear(targetYr);
      studentRecipients = students.filter((s) => getStudentYear(s) === normYr);
      facultyRecipients = facultyList.filter(
        (f) => isFacultyApprovedAndActive(f) && isFacultyAssignedToYear(f, targetYr)
      );
    } else {
      // 3. ALL DEPARTMENTS + ALL YEARS
      studentRecipients = [...students];
      facultyRecipients = facultyList.filter((f) => isFacultyApprovedAndActive(f));
    }

    const studentUserIds = studentRecipients.map((s) => extractUserId(s.user)).filter(Boolean);
    const facultyUserIds = facultyRecipients.map((f) => extractUserId(f.user)).filter(Boolean);

    const message = `${event.title} has been scheduled${scheduleStr}.`;

    const studentNotifs = await notifyUsers(studentUserIds, {
      title: 'New Event Added',
      message,
      type: 'EVENT_CREATED',
      referenceId: event._id,
      referenceType: 'EVENT',
    });

    const facultyNotifs = await notifyUsers(facultyUserIds, {
      title: 'New Event Added',
      message,
      type: 'EVENT_CREATED',
      referenceId: event._id,
      referenceType: 'EVENT',
    });

    return {
      studentNotifs,
      facultyNotifs,
      totalSent: studentNotifs.length + facultyNotifs.length,
    };
  } catch (err) {
    console.error('Error in sendEventNotifications:', err.message);
    return { studentNotifs: [], facultyNotifs: [], totalSent: 0, error: err.message };
  }
};

/**
 * Dispatch notification to administrators upon new faculty registration.
 */
const sendFacultyRegistrationNotification = async ({ facultyUser, facultyName, departmentName, year }) => {
  try {
    const adminUsers = await User.find({ role: 'admin' });
    const adminIds = adminUsers.map((a) => a._id || a.id).filter(Boolean);
    if (adminIds.length === 0) return [];

    const title = 'New Faculty Registration';
    const deptStr = departmentName || 'Assigned Department';
    const yearStr = year || 'Assigned Year';
    const nameStr = facultyName || (facultyUser && facultyUser.name) || 'Faculty Member';
    const message = `New faculty registration request from ${nameStr} - ${deptStr} - ${yearStr}.`;

    return await notifyUsers(adminIds, {
      title,
      message,
      type: 'FACULTY_REGISTRATION',
      referenceId: facultyUser ? (facultyUser._id || facultyUser.id) : null,
      referenceType: 'FACULTY',
    });
  } catch (err) {
    console.error('Failed to send faculty registration notification:', err.message);
    return [];
  }
};

/**
 * Dispatch notification to faculty upon admin approval.
 */
const sendFacultyApprovalNotification = async (facultyUserId) => {
  try {
    return await createNotification({
      recipient: facultyUserId,
      title: 'Faculty Registration Approved',
      message: 'Your faculty registration has been approved. You can now access your assigned department and year data.',
      type: 'FACULTY_APPROVAL',
      referenceId: facultyUserId,
      referenceType: 'FACULTY',
    });
  } catch (err) {
    console.error('Failed to send faculty approval notification:', err.message);
    return null;
  }
};

/**
 * Dispatch notification to faculty upon admin rejection.
 */
const sendFacultyRejectionNotification = async (facultyUserId, remarks = '') => {
  try {
    const message = remarks
      ? `Your faculty registration request has been rejected. Reason: ${remarks}`
      : 'Your faculty registration request has been rejected.';

    return await createNotification({
      recipient: facultyUserId,
      title: 'Faculty Registration Rejected',
      message,
      type: 'FACULTY_REJECTION',
      referenceId: facultyUserId,
      referenceType: 'FACULTY',
    });
  } catch (err) {
    console.error('Failed to send faculty rejection notification:', err.message);
    return null;
  }
};

/**
 * Find responsible faculty for a student's submission (by student's academic year and department).
 * Only returns active, approved faculty.
 */
const findResponsibleFacultyForStudent = async (studentProfile, preferredFacultyId = null) => {
  try {
    const rawFaculty = await Faculty.find();
    if (!rawFaculty || rawFaculty.length === 0) return [];

    const allFaculty = rawFaculty.filter((f) => isFacultyApprovedAndActive(f));
    if (allFaculty.length === 0) return [];

    if (preferredFacultyId) {
      const matchPref = allFaculty.filter(
        (f) => String(f._id) === String(preferredFacultyId) || String(f.user?._id || f.user) === String(preferredFacultyId)
      );
      if (matchPref.length > 0) return matchPref;
    }

    if (!studentProfile) return allFaculty;

    const studentYear = getStudentYear(studentProfile);
    const studentDept = studentProfile.department;

    // 1. Try matching faculty with assignedYear matching student's year and same department
    let matched = allFaculty.filter((f) => {
      const deptMatches = studentDept ? doesDepartmentMatch(f.department, studentDept) : true;
      const yearMatches = studentYear ? isFacultyAssignedToYear(f, studentYear) : true;
      return deptMatches && yearMatches;
    });

    // 2. If no exact match, match any approved faculty assigned to that year
    if (matched.length === 0 && studentYear) {
      matched = allFaculty.filter((f) => isFacultyAssignedToYear(f, studentYear));
    }

    // 3. Fallback to same department
    if (matched.length === 0 && studentDept) {
      matched = allFaculty.filter((f) => doesDepartmentMatch(f.department, studentDept));
    }

    // 4. Fallback to all approved faculty if none matched
    return matched.length > 0 ? matched : allFaculty;
  } catch (err) {
    console.error('Error finding responsible faculty:', err.message);
    return [];
  }
};

/**
 * Send notification to faculty when a student submits an item for review/verification.
 */
const sendApprovalRequestNotification = async ({
  studentProfile,
  studentName = 'A student',
  itemType, // e.g. 'ACTIVITY', 'CERTIFICATE', 'PROJECT'
  itemTitle,
  itemId,
  preferredFacultyId = null,
}) => {
  try {
    const responsibleFaculty = await findResponsibleFacultyForStudent(studentProfile, preferredFacultyId);
    if (!responsibleFaculty || responsibleFaculty.length === 0) return [];

    const facultyUserIds = responsibleFaculty.map((f) => extractUserId(f.user)).filter(Boolean);
    if (facultyUserIds.length === 0) return [];

    const readableType = (itemType || 'Record').replace(/_/g, ' ').toLowerCase();
    const title = 'New Approval Request';
    const message = `${studentName} has submitted a ${readableType} "${itemTitle}" for your review.`;

    return await notifyUsers(facultyUserIds, {
      title,
      message,
      type: 'APPROVAL_REQUEST',
      referenceId: itemId,
      referenceType: itemType,
    });
  } catch (err) {
    console.error('Failed to send approval request notification:', err.message);
    return [];
  }
};

/**
 * Send notification to student when faculty approves or rejects a submission.
 */
const sendApprovalResponseNotification = async ({
  studentUserId,
  itemType, // e.g. 'ACTIVITY', 'CERTIFICATE', 'PROJECT'
  itemTitle,
  itemId,
  status, // 'approved', 'verified', 'rejected'
  remarks = '',
}) => {
  try {
    const recipientId = extractUserId(studentUserId);
    if (!recipientId) return null;

    const readableType = (itemType || 'Record').replace(/_/g, ' ').toLowerCase();
    const isApproved = status === 'approved' || status === 'verified';
    const isCertification = readableType.includes('certificat');

    let notifTitle;
    let notifMessage;
    let notifType;

    if (isApproved) {
      notifTitle = isCertification ? 'Certification Approved' : 'Submission Approved';
      notifMessage = `Your ${readableType} "${itemTitle}" has been approved by Faculty.`;
      notifType = 'APPROVAL_APPROVED';
    } else {
      notifTitle = isCertification ? 'Certification Rejected' : 'Submission Rejected';
      notifMessage = remarks
        ? `Your ${readableType} "${itemTitle}" was rejected by Faculty. Remarks: ${remarks}`
        : `Your ${readableType} "${itemTitle}" was rejected by Faculty. Please check the remarks.`;
      notifType = 'APPROVAL_REJECTED';
    }

    return await createNotification({
      recipient: recipientId,
      title: notifTitle,
      message: notifMessage,
      type: notifType,
      referenceId: itemId,
      referenceType: itemType,
    });
  } catch (err) {
    console.error('Failed to send approval response notification:', err.message);
    return null;
  }
};

/**
 * Helper to explicitly send approval notification to a student.
 */
const sendApprovalApprovedNotification = async ({ studentUserId, itemType = 'Certification', itemTitle, itemId }) => {
  return await sendApprovalResponseNotification({
    studentUserId,
    itemType,
    itemTitle,
    itemId,
    status: 'approved',
  });
};

/**
 * Helper to explicitly send rejection notification to a student.
 */
const sendApprovalRejectedNotification = async ({ studentUserId, itemType = 'Certification', itemTitle, itemId, remarks = '' }) => {
  return await sendApprovalResponseNotification({
    studentUserId,
    itemType,
    itemTitle,
    itemId,
    status: 'rejected',
    remarks,
  });
};

/**
 * Notify admins when a new HOD registers.
 */
const sendHodRegistrationNotification = async (hodData) => {
  try {
    const admins = await User.find({ role: 'admin' });
    const adminIds = (admins || []).map((a) => extractUserId(a)).filter(Boolean);
    if (adminIds.length === 0) return [];

    const name = hodData.name || hodData.user?.name || 'HOD';
    const college = hodData.college || 'KIET';
    const dept = hodData.department?.name || hodData.department?.code || hodData.department || 'Department';
    const year = hodData.academicYear || hodData.year || '';

    return await notifyUsers(adminIds, {
      title: 'New HOD Registration Pending Approval',
      message: `HOD ${name} (${college} - ${dept} - ${year}) has registered and requires admin approval.`,
      type: 'HOD_REGISTRATION',
      referenceId: hodData._id || hodData.id,
      referenceType: 'Hod',
    });
  } catch (err) {
    console.error('Failed to send HOD registration notification:', err.message);
    return [];
  }
};

/**
 * Notify HOD upon admin decision (approval or rejection).
 */
const sendHodApprovalResponseNotification = async ({ hodUserId, status, remarks = '' }) => {
  try {
    const recipientId = extractUserId(hodUserId);
    if (!recipientId) return null;

    const isApproved = status === 'approved';
    return await createNotification({
      recipient: recipientId,
      title: isApproved ? 'HOD Registration Approved' : 'HOD Registration Rejected',
      message: isApproved
        ? 'Your HOD account has been approved by the Administrator. You may now access the HOD portal.'
        : (remarks ? `Your HOD registration was rejected. Reason: ${remarks}` : 'Your HOD registration was rejected by the Administrator.'),
      type: isApproved ? 'HOD_APPROVED' : 'HOD_REJECTED',
    });
  } catch (err) {
    console.error('Failed to send HOD approval response notification:', err.message);
    return null;
  }
};

/**
 * Notify matching HOD(s) when a new CTPO registers.
 */
const sendCtpoRegistrationNotification = async (ctpoData) => {
  try {
    const ctpoCollege = normalizeCollege(ctpoData.college);
    const ctpoYear = normalizeYear(ctpoData.academicYear || ctpoData.year);
    const ctpoDept = ctpoData.department;

    // Find HODs in the same college, department, and academic year
    const allHods = await Hod.find({ approvalStatus: 'approved' });
    const matchingHods = (allHods || []).filter((h) => {
      const matchCol = normalizeCollege(h.college) === ctpoCollege;
      const matchYr = normalizeYear(h.academicYear || h.year) === ctpoYear;
      const matchDp = doesDepartmentMatch(h.department, ctpoDept);
      return matchCol && matchYr && matchDp;
    });

    const hodUserIds = matchingHods.map((h) => extractUserId(h.user)).filter(Boolean);
    if (hodUserIds.length === 0) {
      // If no matching HOD found yet, notify admins as fallback
      const admins = await User.find({ role: 'admin' });
      const adminIds = (admins || []).map((a) => extractUserId(a)).filter(Boolean);
      if (adminIds.length > 0) {
        return await notifyUsers(adminIds, {
          title: 'New CTPO Registration Pending Review',
          message: `CTPO ${ctpoData.name || ctpoData.user?.name || 'User'} (${ctpoData.college} - Sec ${ctpoData.section || ctpoData.class}) has registered. No matching HOD was available.`,
          type: 'CTPO_REGISTRATION',
          referenceId: ctpoData._id || ctpoData.id,
          referenceType: 'Ctpo',
        });
      }
      return [];
    }

    const name = ctpoData.name || ctpoData.user?.name || 'CTPO';
    const sec = ctpoData.section || ctpoData.class || '';
    const yr = ctpoData.academicYear || ctpoData.year || '';

    return await notifyUsers(hodUserIds, {
      title: 'New CTPO Registration Pending Review',
      message: `CTPO ${name} (${ctpoData.college} - ${yr} - Section ${sec}) has registered and requires your approval.`,
      type: 'CTPO_REGISTRATION',
      referenceId: ctpoData._id || ctpoData.id,
      referenceType: 'Ctpo',
    });
  } catch (err) {
    console.error('Failed to send CTPO registration notification:', err.message);
    return [];
  }
};

/**
 * Notify CTPO user upon HOD decision (approval or rejection).
 */
const sendCtpoApprovalResponseNotification = async ({ ctpoUserId, status, remarks = '' }) => {
  try {
    const recipientId = extractUserId(ctpoUserId);
    if (!recipientId) return null;

    const isApproved = status === 'approved';
    return await createNotification({
      recipient: recipientId,
      title: isApproved ? 'CTPO Registration Approved' : 'CTPO Registration Rejected',
      message: isApproved
        ? 'Your CTPO account has been approved by the Head of Department. You may now access the CTPO dashboard.'
        : (remarks ? `Your CTPO registration was rejected. Reason: ${remarks}` : 'Your CTPO registration was rejected by the Head of Department.'),
      type: isApproved ? 'CTPO_APPROVED' : 'CTPO_REJECTED',
    });
  } catch (err) {
    console.error('Failed to send CTPO approval response notification:', err.message);
    return null;
  }
};

module.exports = {
  normalizeYear,
  getStudentYear,
  doesDepartmentMatch,
  isFacultyApprovedAndActive,
  isFacultyAssignedToYear,
  createNotification,
  notifyUser,
  notifyUsers,
  notifyStudentsByYear,
  notifyFacultyByYear,
  notifyAllStudents,
  notifyAllFaculty,
  sendEventNotifications,
  sendApprovalRequestNotification,
  sendApprovalResponseNotification,
  sendApprovalApprovedNotification,
  sendApprovalRejectedNotification,
  sendFacultyRegistrationNotification,
  sendFacultyApprovalNotification,
  sendFacultyRejectionNotification,
  sendHodRegistrationNotification,
  sendHodApprovalResponseNotification,
  sendCtpoRegistrationNotification,
  sendCtpoApprovalResponseNotification,
  findResponsibleFacultyForStudent,
};
