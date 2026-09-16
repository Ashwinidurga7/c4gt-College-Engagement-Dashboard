const Certification = require('../models/Certification');
const Student = require('../models/Student');

/**
 * Custom Error class with HTTP status code.
 */
class ServiceError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Validates whether a string is a valid HTTP/HTTPS URL.
 */
const isValidUrl = (string) => {
  if (!string) return true;
  try {
    const parsed = new URL(string);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

/**
 * Helper to get the student profile corresponding to a logged-in user.
 */
const getStudentProfileForUser = async (userId) => {
  const student = await Student.findOne({ user: userId });
  return student;
};

/**
 * Formats certification entity for API output.
 */
const formatCertification = (cert) => {
  if (!cert) return null;
  const raw = cert.toObject ? cert.toObject() : cert;
  const studentId = raw.studentId || (raw.student?._id || raw.student);
  const fileUrl = raw.certificateFileUrl || raw.certificateUrl || '';

  return {
    id: raw._id,
    _id: raw._id,
    studentId,
    student: studentId,
    title: raw.title || raw.certificationName || '',
    certificationName: raw.certificationName || raw.title || '',
    issuingOrganization: raw.issuingOrganization || raw.platform || '',
    platform: raw.platform || raw.issuingOrganization || '',
    issueDate: raw.issueDate,
    credentialId: raw.credentialId || '',
    credentialUrl: raw.credentialUrl || '',
    certificateFileUrl: fileUrl,
    certificateUrl: fileUrl,
    description: raw.description || '',
    createdAt: raw.createdAt || new Date(),
    updatedAt: raw.updatedAt || new Date(),
  };
};

/**
 * Create a new student-managed certification.
 * NO faculty approval workflow. NO approval request notifications.
 */
const createCertification = async (data, currentUser) => {
  if (currentUser.role !== 'student') {
    throw new ServiceError('Only students can create certifications', 403);
  }

  const studentProfile = await getStudentProfileForUser(currentUser.id);
  if (!studentProfile) {
    throw new ServiceError('Student profile not found for logged in user', 404);
  }

  const title = (data.title || data.certificationName || '').trim();
  const issuingOrganization = (data.issuingOrganization || data.platform || '').trim();
  const platform = (data.platform || data.issuingOrganization || '').trim();
  const issueDate = data.issueDate ? new Date(data.issueDate) : new Date();
  const credentialId = (data.credentialId || '').trim();
  const credentialUrl = (data.credentialUrl || data.website || data.websiteLink || '').trim();
  const certificateFileUrl = (
    data.certificateFileUrl ||
    data.certificateUrl ||
    data.documentUrl ||
    data.fileUrl ||
    ''
  ).trim();
  const description = (data.description || '').trim();

  if (!title) {
    throw new ServiceError('Title / certification name is required', 400);
  }
  if (!issuingOrganization) {
    throw new ServiceError('Issuing organization is required', 400);
  }
  if (data.issueDate && isNaN(issueDate.getTime())) {
    throw new ServiceError('Please provide a valid issue date', 400);
  }
  if (credentialUrl && !isValidUrl(credentialUrl)) {
    throw new ServiceError('Please provide a valid URL for credentialUrl', 400);
  }

  const now = new Date();
  const newCert = await Certification.create({
    student: studentProfile._id,
    studentId: studentProfile._id,
    title,
    certificationName: title,
    issuingOrganization,
    platform: platform || issuingOrganization,
    issueDate,
    credentialId,
    credentialUrl,
    certificateFileUrl,
    certificateUrl: certificateFileUrl,
    description,
    createdAt: now,
    updatedAt: now,
  });

  return formatCertification(newCert);
};

/**
 * Get certifications scoped by student identity.
 * Student can ONLY view their own certifications.
 */
const getCertifications = async (query = {}, currentUser) => {
  const allCerts = await Certification.find();

  if (currentUser.role === 'student') {
    const studentProfile = await getStudentProfileForUser(currentUser.id);
    if (!studentProfile) return [];

    const studentIdStr = String(studentProfile._id);
    const owned = allCerts.filter((c) => {
      const cStudent = String(c.student?._id || c.student || c.studentId || '');
      return cStudent === studentIdStr;
    });

    return owned.map(formatCertification);
  }

  if (currentUser.role === 'admin') {
    let result = allCerts;
    if (query.studentId) {
      result = result.filter(
        (c) => String(c.student?._id || c.student || c.studentId) === String(query.studentId)
      );
    }
    return result.map(formatCertification);
  }

  if (currentUser.role === 'faculty') {
    let result = allCerts;
    if (query.studentId) {
      result = result.filter(
        (c) => String(c.student?._id || c.student || c.studentId) === String(query.studentId)
      );
    }
    return result.map(formatCertification);
  }

  return [];
};

/**
 * Get a single certification with ownership authorization check.
 */
const getCertificationById = async (id, currentUser) => {
  const cert = await Certification.findById(id);
  if (!cert) {
    throw new ServiceError('Certification not found', 404);
  }

  const certOwnerId = String(cert.student?._id || cert.student || cert.studentId || '');

  if (currentUser.role === 'student') {
    const studentProfile = await getStudentProfileForUser(currentUser.id);
    if (!studentProfile || certOwnerId !== String(studentProfile._id)) {
      throw new ServiceError('You are not authorized to view this certification', 403);
    }
  }

  return formatCertification(cert);
};

/**
 * Update certification with ownership checks.
 * Student can update only their own certification.
 * Changes to student ownership are strictly ignored/prevented.
 */
const updateCertification = async (id, updateData, currentUser) => {
  const cert = await Certification.findById(id);
  if (!cert) {
    throw new ServiceError('Certification not found', 404);
  }

  const certOwnerId = String(cert.student?._id || cert.student || cert.studentId || '');

  if (currentUser.role === 'student') {
    const studentProfile = await getStudentProfileForUser(currentUser.id);
    if (!studentProfile || certOwnerId !== String(studentProfile._id)) {
      throw new ServiceError('You are not authorized to update this certification', 403);
    }
  } else if (currentUser.role !== 'admin') {
    throw new ServiceError('Not authorized to update this certification', 403);
  }

  // Prevent tampering with ownership or ID
  delete updateData.student;
  delete updateData.studentId;
  delete updateData.user;
  delete updateData._id;
  delete updateData.id;

  // Validate credential URL if provided
  if (updateData.credentialUrl !== undefined) {
    const credUrl = String(updateData.credentialUrl).trim();
    if (credUrl && !isValidUrl(credUrl)) {
      throw new ServiceError('Please provide a valid URL for credentialUrl', 400);
    }
    updateData.credentialUrl = credUrl;
  }

  // Synchronize title / certificationName
  if (updateData.title) {
    updateData.certificationName = updateData.title;
  } else if (updateData.certificationName) {
    updateData.title = updateData.certificationName;
  }

  // Synchronize file URL
  if (updateData.certificateFileUrl) {
    updateData.certificateUrl = updateData.certificateFileUrl;
  } else if (updateData.certificateUrl) {
    updateData.certificateFileUrl = updateData.certificateUrl;
  }

  updateData.updatedAt = new Date();

  const updated = await Certification.findByIdAndUpdate(id, updateData, { new: true });
  return formatCertification(updated);
};

/**
 * Delete certification with ownership check.
 * Student can delete ONLY their own certification.
 */
const deleteCertification = async (id, currentUser) => {
  const cert = await Certification.findById(id);
  if (!cert) {
    throw new ServiceError('Certification not found', 404);
  }

  const certOwnerId = String(cert.student?._id || cert.student || cert.studentId || '');

  if (currentUser.role === 'student') {
    const studentProfile = await getStudentProfileForUser(currentUser.id);
    if (!studentProfile || certOwnerId !== String(studentProfile._id)) {
      throw new ServiceError('You are not authorized to delete this certification', 403);
    }
  } else if (currentUser.role !== 'admin') {
    throw new ServiceError('Only the owning student or an admin can delete a certification', 403);
  }

  await Certification.findByIdAndDelete(id);
  return { success: true, message: 'Certification deleted successfully' };
};

/**
 * Legacy compatibility stub for verifyCertification (NO-OP since approvals are removed).
 */
const verifyCertification = async (id, payload, verifierUser) => {
  const cert = await Certification.findById(id);
  if (!cert) {
    throw new ServiceError('Certification not found', 404);
  }
  return formatCertification(cert);
};

module.exports = {
  createCertification,
  getCertifications,
  getCertificationById,
  updateCertification,
  deleteCertification,
  verifyCertification,
  isValidUrl,
  ServiceError,
};
