const Certificate = require('../models/Certificate');
const Student = require('../models/Student');

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
