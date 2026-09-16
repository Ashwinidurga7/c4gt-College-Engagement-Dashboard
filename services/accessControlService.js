/**
 * Centralized Access Control & Scoping Service
 * Manages institutional college validation, department matching,
 * academic year normalization, and role-based scope boundaries.
 */

const VALID_COLLEGES = ['KIET', 'KIET+', 'KIEW'];

/**
 * Normalizes college name to ensure strict institutional consistency.
 * Accepts exact casing or variations like 'kiet', 'kiet+', 'kiew'.
 */
const normalizeCollege = (val) => {
  if (!val) return 'KIET';
  const clean = String(val).trim().toUpperCase();
  if (clean.includes('KIET+') || clean.includes('PLUS')) return 'KIET+';
  if (clean.includes('KIEW') || clean.includes('WOMEN') || clean.includes('KIET-W')) return 'KIEW';
  if (clean.includes('KIET') || clean.includes('KAKINADA')) return 'KIET';
  return clean;
};

/**
 * Validates whether a college identifier is one of the three institution colleges.
 */
const isValidCollege = (val) => {
  const norm = normalizeCollege(val);
  return VALID_COLLEGES.includes(norm);
};

/**
 * Normalizes academic year string or number into a standard single digit ('1', '2', '3', '4').
 */
const normalizeYear = (val) => {
  if (val === undefined || val === null) return '';
  const str = String(val).toLowerCase().trim();
  if (str.includes('1') || str.includes('first')) return '1';
  if (str.includes('2') || str.includes('second')) return '2';
  if (str.includes('3') || str.includes('third')) return '3';
  if (str.includes('4') || str.includes('fourth')) return '4';
  return str;
};

/**
 * Normalizes section/class string (e.g. 'A', 'Section A', 'sec-a' -> 'A').
 */
const normalizeSection = (val) => {
  if (!val) return '';
  const str = String(val).trim().toUpperCase();
  const match = str.match(/([A-Z0-9]+)$/);
  return match ? match[1] : str;
};

/**
 * Checks whether two department references match (by ID, code, or name).
 */
const doesDepartmentMatch = (deptA, deptB) => {
  if (!deptA || !deptB) return false;
  const aId = typeof deptA === 'object' ? (deptA._id || deptA.id || deptA.code || deptA.name) : deptA;
  const aCode = typeof deptA === 'object' ? deptA.code : null;
  const bId = typeof deptB === 'object' ? (deptB._id || deptB.id || deptB.code || deptB.name) : deptB;
  const bCode = typeof deptB === 'object' ? deptB.code : null;

  if (String(aId).toLowerCase() === String(bId).toLowerCase()) return true;
  if (aCode && bCode && String(aCode).toLowerCase() === String(bCode).toLowerCase()) return true;
  if (aCode && String(aCode).toLowerCase() === String(bId).toLowerCase()) return true;
  if (bCode && String(bCode).toLowerCase() === String(aId).toLowerCase()) return true;
  return false;
};

/**
 * Predicate: Can HOD access the student?
 * Scope rule: student.college == hod.college AND student.department == hod.department AND student.year == hod.academicYear
 */
const canHodAccessStudent = (hod, student) => {
  if (!hod || !student) return false;
  if (hod.approvalStatus !== 'approved' || hod.isActive === false) return false;

  const hodCollege = normalizeCollege(hod.college);
  const studentCollege = normalizeCollege(student.college || 'KIET');
  if (hodCollege !== studentCollege) return false;

  if (!doesDepartmentMatch(hod.department, student.department)) return false;

  const hodYear = normalizeYear(hod.academicYear || hod.year);
  const studentYear = normalizeYear(student.year || student.academicYear);
  if (hodYear !== studentYear) return false;

  return true;
};

/**
 * Predicate: Can CTPO access the student?
 * Scope rule: student.college == ctpo.college AND student.department == ctpo.department
 *            AND student.year == ctpo.academicYear AND student.section == ctpo.section
 */
const canCtpoAccessStudent = (ctpo, student) => {
  if (!ctpo || !student) return false;
  if (ctpo.approvalStatus !== 'approved' || ctpo.isActive === false) return false;

  const ctpoCollege = normalizeCollege(ctpo.college);
  const studentCollege = normalizeCollege(student.college || 'KIET');
  if (ctpoCollege !== studentCollege) return false;

  if (!doesDepartmentMatch(ctpo.department, student.department)) return false;

  const ctpoYear = normalizeYear(ctpo.academicYear || ctpo.year);
  const studentYear = normalizeYear(student.year || student.academicYear);
  if (ctpoYear !== studentYear) return false;

  const ctpoSec = normalizeSection(ctpo.section || ctpo.class);
  const studentSec = normalizeSection(student.section || student.class);
  if (ctpoSec !== studentSec) return false;

  return true;
};

/**
 * Predicate: Can HOD approve/reject a CTPO registration?
 * Rule: hod.college == ctpo.college AND hod.department == ctpo.department AND hod.academicYear == ctpo.academicYear
 */
const canHodApproveCtpo = (hod, ctpo) => {
  if (!hod || !ctpo) return false;
  if (hod.approvalStatus !== 'approved' || hod.isActive === false) return false;

  const hodCollege = normalizeCollege(hod.college);
  const ctpoCollege = normalizeCollege(ctpo.college);
  if (hodCollege !== ctpoCollege) return false;

  if (!doesDepartmentMatch(hod.department, ctpo.department)) return false;

  const hodYear = normalizeYear(hod.academicYear || hod.year);
  const ctpoYear = normalizeYear(ctpo.academicYear || ctpo.year);
  if (hodYear !== ctpoYear) return false;

  return true;
};

/**
 * Predicate: Can Faculty access student? (Preserves existing faculty logic with college check)
 */
const canFacultyAccessStudent = (faculty, student) => {
  if (!faculty || !student) return false;
  if (faculty.approvalStatus !== 'approved' || faculty.isActive === false) return false;

  if (faculty.college && student.college) {
    if (normalizeCollege(faculty.college) !== normalizeCollege(student.college)) return false;
  }

  if (!doesDepartmentMatch(faculty.department, student.department)) return false;

  const assignedYears = faculty.assignedYears || (faculty.year ? [faculty.year] : []);
  const studentYear = normalizeYear(student.year || student.academicYear);

  return assignedYears.some((y) => normalizeYear(y) === studentYear);
};

module.exports = {
  VALID_COLLEGES,
  normalizeCollege,
  isValidCollege,
  normalizeYear,
  normalizeSection,
  doesDepartmentMatch,
  canHodAccessStudent,
  canCtpoAccessStudent,
  canHodApproveCtpo,
  canFacultyAccessStudent,
};
