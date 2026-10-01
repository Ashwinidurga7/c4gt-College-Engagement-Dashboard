const Certificate = require('../models/Certificate');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const notificationService = require('../services/notificationService');
const { saveUploads, urlFor, removeUnused } = require('../services/mediaService');
const MediaFile = require('../models/MediaFile');

/**
 * A certificate as the portal shows it: the student's name and roll number instead of a
 * bare id, and a fresh signed link to the uploaded file.
 */
const present = (certificate, studentsById) => {
  if (!certificate) return certificate;
  const data = typeof certificate.toObject === 'function' ? certificate.toObject() : { ...certificate };
  if (data.fileId) {
    data.fileUrl = urlFor({ _id: data.fileId, isPrivate: true });
  }
  delete data.fileId;
  if (data.verifiedByName) {
    data.verifiedBy = data.verifiedByName;
  }
  const student = studentsById && studentsById.get(String(data.student));
  if (student) {
    data.student = { _id: student._id, name: student.name, rollNumber: student.rollNumber };
  }
  return data;
};

/** The owning student or an admin. */
const canManage = async (req, cert) => {
  if (req.user.role === 'admin') return true;
  if (req.user.role !== 'student') return false;
  const studentProfile = await Student.findOne({ user: String(req.user.id) });
  return Boolean(studentProfile) && String(cert.student) === String(studentProfile._id);
};

const studentsFor = async (certificates) => {
  const ids = [...new Set(certificates.map((c) => String(c.student)))];
  const students = ids.length ? await Student.find({ _id: { $in: ids } }).lean() : [];
  return new Map(students.map((s) => [String(s._id), s]));
};

// @desc    Get all certificates (filtered by student or status)
// @route   GET /api/certificates
// @access  Private
const getCertificates = async (req, res, next) => {
  try {
    let certificates = await Certificate.find();

    if (req.user.role === 'student') {
      const studentProfile = await Student.findOne({ user: req.user.id });
      if (!studentProfile) {
        return res.status(200).json({ success: true, count: 0, data: [] });
      }
      certificates = certificates.filter((c) => String(c.student) === String(studentProfile._id));
    } else if (req.user.role === 'faculty') {
      const faculty = await Faculty.findOne({ user: req.user.id });
      if (!faculty || !notificationService.isFacultyApprovedAndActive(faculty)) {
        return res.status(200).json({ success: true, count: 0, data: [] });
      }
      const students = await Student.find();
      const authorizedStudentIds = new Set(
        students
          .filter((s) => {
            const deptMatch = notificationService.doesDepartmentMatch(faculty.department, s.department);
            const yearMatch = notificationService.isFacultyAssignedToYear(
              faculty,
              s.year || notificationService.getStudentYear(s)
            );
            return deptMatch && yearMatch;
          })
          .map((s) => String(s._id))
      );
      certificates = certificates.filter((c) => authorizedStudentIds.has(String(c.student)));
      if (req.query.studentId) {
        certificates = certificates.filter((c) => String(c.student) === String(req.query.studentId));
      }
    } else if (req.query.studentId) {
      certificates = certificates.filter((c) => String(c.student) === String(req.query.studentId));
    }

    if (req.query.status) {
      certificates = certificates.filter((c) => c.status === req.query.status);
    }

    const studentsById = await studentsFor(certificates);
    res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates.map((c) => present(c, studentsById)),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single certificate by ID
// @route   GET /api/certificates/:id
// @access  Private
const getCertificateById = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    if (req.user.role === 'student') {
      const studentProfile = await Student.findOne({ user: req.user.id });
      if (!studentProfile || String(certificate.student) !== String(studentProfile._id)) {
        return res.status(403).json({ success: false, message: 'Not authorized to access this certificate' });
      }
    } else if (req.user.role === 'faculty') {
      const faculty = await Faculty.findOne({ user: req.user.id });
      if (!faculty || !notificationService.isFacultyApprovedAndActive(faculty)) {
        return res.status(403).json({ success: false, message: 'Faculty account is pending approval or inactive' });
      }
      const studentRec = await Student.findById(certificate.student);
      if (!studentRec) {
        return res.status(404).json({ success: false, message: 'Associated student not found' });
      }
      const deptMatch = notificationService.doesDepartmentMatch(faculty.department, studentRec.department);
      const yearMatch = notificationService.isFacultyAssignedToYear(
        faculty,
        studentRec.year || notificationService.getStudentYear(studentRec)
      );
      if (!deptMatch || !yearMatch) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You cannot access certificates outside your assigned department and academic year',
        });
      }
    }

    res.status(200).json({ success: true, data: present(certificate, await studentsFor([certificate])) });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new certificate
// @route   POST /api/certificates
// @access  Private (Student)
const createCertificate = async (req, res, next) => {
  try {
    const body = req.body || {};
    const { title, expiryDate, credentialId, credentialUrl, skills, category } = body;
    // The portal's upload form sends issuedBy and date; older clients send issuingOrganization and issueDate.
    const issuingOrganization = body.issuingOrganization || body.issuedBy;
    const issueDate = body.issueDate || body.date;

    if (!title || !issuingOrganization) {
      return res.status(400).json({ success: false, message: 'Title and issuer are required' });
    }

    const studentProfile = await Student.findOne({ user: req.user.id });
    if (!studentProfile) {
      return res.status(404).json({ success: false, message: 'Student profile not found for logged in user' });
    }

    // The uploaded proof (multipart field "certificate") is stored privately.
    const [file] = req.file ? await saveUploads([req.file], { owner: req.user.id, purpose: 'certificate', isPrivate: true }) : [];

    const newCertificate = await Certificate.create({
      student: studentProfile._id,
      title,
      category: category || 'General',
      issuingOrganization,
      issuedBy: issuingOrganization,
      fileId: file ? String(file._id) : undefined,
      fileName: file ? file.fileName : undefined,
      issueDate: issueDate ? new Date(issueDate) : new Date(),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      credentialId: credentialId || '',
      credentialUrl: credentialUrl || '',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map((s) => s.trim()) : []),
      status: 'pending',
      verificationRemarks: null,
    });

    // Safely notify responsible faculty
    try {
      await notificationService.sendApprovalRequestNotification({
        studentProfile,
        studentName: req.user.name || 'Student',
        itemType: 'CERTIFICATE',
        itemTitle: newCertificate.title,
        itemId: newCertificate._id,
      });
    } catch (notifErr) {
      console.error('Failed to notify faculty for certificate submission:', notifErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Certificate submitted for verification',
      data: present(newCertificate, new Map([[String(studentProfile._id), studentProfile]])),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update certificate
// @route   PUT /api/certificates/:id
// @access  Private
const updateCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }
    if (!(await canManage(req, cert))) {
      return res.status(403).json({ success: false, message: 'Only the owner or an admin can change this certificate' });
    }

    // Owners edit the details only; verification goes through PUT /:id/verify.
    const changes = {};
    ['title', 'category', 'issuingOrganization', 'issuedBy', 'issueDate', 'expiryDate', 'credentialId', 'credentialUrl', 'skills'].forEach((field) => {
      if (req.body && req.body[field] !== undefined) changes[field] = req.body[field];
    });

    const updated = await Certificate.findByIdAndUpdate(req.params.id, { $set: changes }, { returnDocument: 'after' });
    res.status(200).json({
      success: true,
      message: 'Certificate updated successfully',
      data: present(updated, await studentsFor([updated])),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private
const deleteCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }
    if (!(await canManage(req, cert))) {
      return res.status(403).json({ success: false, message: 'Only the owner or an admin can delete this certificate' });
    }

    await Certificate.findByIdAndDelete(req.params.id);
    if (cert.fileId) {
      await MediaFile.deleteOne({ _id: cert.fileId });
    }
    res.status(200).json({
      success: true,
      message: 'Certificate removed successfully',
      data: { _id: cert._id },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify/Approve/Reject certificate
// @route   PUT /api/certificates/:id/verify
// @access  Private (Faculty, Admin)
const verifyCertificate = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;
    if (!status || !['verified', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Valid status (verified, rejected, pending) is required' });
    }

    const cert = await Certificate.findById(req.params.id);
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    if (req.user.role === 'faculty') {
      const faculty = await Faculty.findOne({ user: req.user.id });
      if (!faculty || !notificationService.isFacultyApprovedAndActive(faculty)) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Faculty account is pending approval or inactive',
        });
      }

      const studentRec = await Student.findById(cert.student);
      if (!studentRec) {
        return res.status(404).json({ success: false, message: 'Associated student record not found' });
      }

      const deptMatches = notificationService.doesDepartmentMatch(faculty.department, studentRec.department);
      const yearMatches = notificationService.isFacultyAssignedToYear(
        faculty,
        studentRec.year || notificationService.getStudentYear(studentRec)
      );

      if (!deptMatches || !yearMatches) {
        return res.status(403).json({
          success: false,
          message:
            'Forbidden: You can only verify certificates for students in your assigned department and academic year',
        });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only authorized faculty or admin can verify certificates',
      });
    }

    const updated = await Certificate.findByIdAndUpdate(
      req.params.id,
      {
        status,
        verificationRemarks: remarks || null,
        verifiedBy: req.user.id,
        verifiedByName: req.user.name,
        remarks: remarks || null,
        verifiedAt: new Date(),
      },
      { returnDocument: 'after' }
    );

    // Safely notify student of verification result
    try {
      let studentUserId = null;
      const studentRec = await Student.findById(cert.student);
      if (studentRec && studentRec.user) {
        studentUserId = studentRec.user._id || studentRec.user.id || studentRec.user;
      }
      if (studentUserId) {
        await notificationService.sendApprovalResponseNotification({
          studentUserId,
          itemType: 'CERTIFICATE',
          itemTitle: cert.title,
          itemId: cert._id,
          status,
          remarks: remarks || '',
        });
      }
    } catch (notifErr) {
      console.error('Failed to notify student of certificate verification:', notifErr.message);
    }

    res.status(200).json({
      success: true,
      message: `Certificate status updated to ${status}`,
      data: present(updated, await studentsFor([updated])),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  verifyCertificate,
};
