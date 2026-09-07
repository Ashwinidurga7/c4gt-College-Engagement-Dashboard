const Certificate = require('../models/Certificate');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const notificationService = require('../services/notificationService');

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

    res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates,
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

    res.status(200).json({ success: true, data: certificate });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new certificate
// @route   POST /api/certificates
// @access  Private (Student)
const createCertificate = async (req, res, next) => {
  try {
    const { title, issuingOrganization, issueDate, expiryDate, credentialId, credentialUrl, skills } = req.body;

    if (!title || !issuingOrganization) {
      return res.status(400).json({ success: false, message: 'Title and issuingOrganization are required' });
    }

    const studentProfile = await Student.findOne({ user: req.user.id });
    if (!studentProfile) {
      return res.status(404).json({ success: false, message: 'Student profile not found for logged in user' });
    }

    const newCertificate = await Certificate.create({
      student: studentProfile._id,
      title,
      issuingOrganization,
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
      data: newCertificate,
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

    const updated = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
      success: true,
      message: 'Certificate updated successfully',
      data: updated,
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

    await Certificate.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Certificate removed successfully',
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
        verifiedAt: new Date(),
      },
      { new: true }
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
      data: updated,
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
