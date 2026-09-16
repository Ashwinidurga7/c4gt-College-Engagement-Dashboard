const certificationService = require('../services/certificationService');

// @desc    Create a new certification
// @route   POST /api/certifications
// @access  Private (Student)
const createCertification = async (req, res, next) => {
  try {
    const cert = await certificationService.createCertification(req.body, req.user);
    res.status(201).json({
      success: true,
      message: 'Certification added successfully',
      data: cert,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Get certifications
// @route   GET /api/certifications
// @access  Private
const getCertifications = async (req, res, next) => {
  try {
    const certs = await certificationService.getCertifications(req.query, req.user);
    res.status(200).json({
      success: true,
      count: certs.length,
      data: certs,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Get single certification by ID
// @route   GET /api/certifications/:id
// @access  Private
const getCertificationById = async (req, res, next) => {
  try {
    const cert = await certificationService.getCertificationById(req.params.id, req.user);
    res.status(200).json({
      success: true,
      data: cert,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Update certification
// @route   PUT /api/certifications/:id
// @access  Private
const updateCertification = async (req, res, next) => {
  try {
    const updated = await certificationService.updateCertification(req.params.id, req.body, req.user);
    res.status(200).json({
      success: true,
      message: 'Certification updated successfully',
      data: updated,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Delete certification
// @route   DELETE /api/certifications/:id
// @access  Private (Owner Student, Admin)
const deleteCertification = async (req, res, next) => {
  try {
    const result = await certificationService.deleteCertification(req.params.id, req.user);
    res.status(200).json(result);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Verify/Approve/Reject certification
// @route   PUT /api/certifications/:id/verify
// @access  Private (Faculty, Admin, Department Head)
const verifyCertification = async (req, res, next) => {
  try {
    const updated = await certificationService.verifyCertification(req.params.id, req.body, req.user);
    res.status(200).json({
      success: true,
      message: `Certification status updated to ${updated.status}`,
      data: updated,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    next(error);
  }
};

module.exports = {
  createCertification,
  getCertifications,
  getCertificationById,
  updateCertification,
  deleteCertification,
  verifyCertification,
};
