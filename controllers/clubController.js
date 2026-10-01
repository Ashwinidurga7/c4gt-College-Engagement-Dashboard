const Club = require('../models/Club');
const { isValidCollege, normalizeCollege } = require('../services/accessControlService');
const { buildGallery, removeUnused } = require('../services/mediaService');

/**
 * @desc    Get college clubs
 *          IMPORTANT: All active college clubs are visible to authenticated students
 *          from all colleges (KIET, KIET+, KIEW). Student's college is NEVER used to filter clubs.
 * @route   GET /api/clubs
 * @access  Private (Authenticated users: Student, Faculty, HOD, CTPO, Admin)
 */
const getClubs = async (req, res, next) => {
  try {
    const allClubs = await Club.find();
    const isAdmin = req.user && req.user.role === 'admin';
    const { status, college, category, search, includeInactive } = req.query;

    let clubs = allClubs;

    // Visibility rule:
    // Students and non-admins ALWAYS see all ACTIVE clubs regardless of the student's college.
    // student.college == club.college MUST NOT be implemented.
    if (!isAdmin) {
      clubs = clubs.filter((c) => c.status === 'active' || c.isActive === true);
    } else {
      // For Admin, allow status filtering or includeInactive toggle
      if (status) {
        clubs = clubs.filter((c) => String(c.status).toLowerCase() === String(status).toLowerCase());
      } else if (includeInactive !== 'true' && status === undefined) {
        // If query specifies nothing, by default return all (both active and inactive) for admin
      }
    }

    // Optional user-initiated filtering by college (e.g. ?college=KIET)
    if (college && String(college).toLowerCase() !== 'all') {
      const normCollege = normalizeCollege(college);
      clubs = clubs.filter((c) => normalizeCollege(c.college) === normCollege);
    }

    // Optional filtering by category (e.g. ?category=Technical)
    if (category && String(category).toLowerCase() !== 'all') {
      clubs = clubs.filter(
        (c) => c.category && String(c.category).toLowerCase() === String(category).toLowerCase()
      );
    }

    // Optional text search in club name, description, or code
    if (search) {
      const term = String(search).toLowerCase();
      clubs = clubs.filter(
        (c) =>
          (c.name && c.name.toLowerCase().includes(term)) ||
          (c.description && c.description.toLowerCase().includes(term)) ||
          (c.code && c.code.toLowerCase().includes(term))
      );
    }

    res.status(200).json({
      success: true,
      count: clubs.length,
      data: clubs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single club by ID
 * @route   GET /api/clubs/:id
 * @access  Private
 */
const getClubById = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    const isAdmin = req.user && req.user.role === 'admin';
    if (!isAdmin && (club.status === 'inactive' || club.isActive === false)) {
      return res.status(404).json({ success: false, message: 'Club not found or inactive' });
    }

    res.status(200).json({
      success: true,
      data: club,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new club across any college
 * @route   POST /api/clubs
 * @access  Private (Admin only)
 */
const createClub = async (req, res, next) => {
  try {
    const {
      name,
      code,
      description,
      college,
      category,
      facultyCoordinator,
      studentLead,
      leadEmail,
      membersCount,
      meetingSchedule,
      venue,
      contactEmail,
      banner,
      tags,
      status,
      isActive,
      fullName,
      tagline,
      coordinator,
      email,
      founded,
      focusAreas,
    } = req.body || {};

    if (!name) {
      return res.status(400).json({ success: false, message: 'Club name is required' });
    }

    // Clubs are open to all three colleges; KIET is the home college unless one is given.
    const normCollege = normalizeCollege(college || 'KIET');
    if (!isValidCollege(normCollege)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid college. Must be KIET, KIET+, or KIEW',
      });
    }

    const clubStatus = status ? String(status).toLowerCase() : (isActive === false ? 'inactive' : 'active');
    const clubIsActive = isActive !== undefined ? Boolean(isActive) : clubStatus === 'active';

    const newClub = await Club.create({
      name: name.trim(),
      code: code ? code.trim().toUpperCase() : name.trim().slice(0, 4).toUpperCase(),
      description: description || '',
      college: normCollege,
      category: category || 'General',
      facultyCoordinator: facultyCoordinator || '',
      studentLead: studentLead || '',
      leadEmail: leadEmail || '',
      membersCount: Number(membersCount) || 0,
      meetingSchedule: meetingSchedule || '',
      venue: venue || '',
      contactEmail: contactEmail || '',
      banner: banner || '',
      tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
      status: clubStatus,
      isActive: clubIsActive,
      // Fields the portal's club form edits
      fullName: fullName || '',
      tagline: tagline || '',
      coordinator: coordinator || facultyCoordinator || '',
      email: email || contactEmail || '',
      founded: founded ? Number(founded) : null,
      focusAreas: Array.isArray(focusAreas) ? focusAreas : [],
      photos: [],
      stats: { projects: 0, workshops: 0, hackathons: 0 },
      socials: {},
    });

    res.status(201).json({
      success: true,
      message: 'Club created successfully',
      data: newClub,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update club details
 * @route   PUT /api/clubs/:id
 * @access  Private (Admin only)
 */
const updateClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    // Photos change through PUT /api/clubs/:id/photos, and the id never changes.
    const { _id, photos, ...updates } = req.body || {};

    if (updates.college) {
      const normCollege = normalizeCollege(updates.college);
      if (!isValidCollege(normCollege)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid college. Must be KIET, KIET+, or KIEW',
        });
      }
      updates.college = normCollege;
    }

    if (updates.status !== undefined && updates.isActive === undefined) {
      updates.isActive = String(updates.status).toLowerCase() === 'active';
    } else if (updates.isActive !== undefined && updates.status === undefined) {
      updates.status = updates.isActive ? 'active' : 'inactive';
    }

    const updated = await Club.findByIdAndUpdate(req.params.id, updates, { new: true });

    res.status(200).json({
      success: true,
      message: 'Club updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a club
 * @route   DELETE /api/clubs/:id
 * @access  Private (Admin only)
 */
const deleteClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    await Club.findByIdAndDelete(req.params.id);
    await removeUnused((club.get('photos') || []).map((photo) => photo.url || photo), []);

    res.status(200).json({
      success: true,
      message: 'Club deleted successfully',
      data: { _id: club._id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle or set club status (active / inactive)
 * @route   PATCH /api/clubs/:id/status
 * @access  Private (Admin only)
 */
const toggleClubStatus = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    let newStatus;
    let newIsActive;

    if (req.body && req.body.status !== undefined) {
      newStatus = String(req.body.status).toLowerCase();
      newIsActive = newStatus === 'active';
    } else if (req.body && req.body.isActive !== undefined) {
      newIsActive = Boolean(req.body.isActive);
      newStatus = newIsActive ? 'active' : 'inactive';
    } else {
      // Toggle current state
      newIsActive = !(club.isActive === true || club.status === 'active');
      newStatus = newIsActive ? 'active' : 'inactive';
    }

    const updated = await Club.findByIdAndUpdate(
      req.params.id,
      { status: newStatus, isActive: newIsActive },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Club status updated to ${newStatus}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Activate club
 * @route   PUT /api/clubs/:id/activate
 * @access  Private (Admin only)
 */
const activateClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    const updated = await Club.findByIdAndUpdate(
      req.params.id,
      { status: 'active', isActive: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Club activated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Deactivate club
 * @route   PUT /api/clubs/:id/deactivate
 * @access  Private (Admin only)
 */
const deactivateClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    const updated = await Club.findByIdAndUpdate(
      req.params.id,
      { status: 'inactive', isActive: false },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Club deactivated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Replace a club's gallery: photos kept (keepImages) plus new uploads (images)
 * @route   PUT /api/clubs/:id/photos
 * @access  Private (Admin only)
 */
const updateClubPhotos = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }
    const photos = await buildGallery(req, club.get('photos'), 'club');
    const updated = await Club.findByIdAndUpdate(req.params.id, { $set: { photos } }, { returnDocument: 'after' });
    res.status(200).json({ success: true, message: 'Club photos updated', data: updated });
  } catch (error) {
    if (error.status === 400) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

module.exports = {
  getClubs,
  getClubById,
  createClub,
  updateClub,
  deleteClub,
  toggleClubStatus,
  activateClub,
  deactivateClub,
  updateClubPhotos,
};
