const Worker = require('../models/Worker');

// @desc    Get campus workers & staff directory from database
// @route   GET /api/admin/workers
// @access  Private (Admin)
const getAdminWorkers = async (req, res, next) => {
  try {
    const campusFilter = req.query.campus;
    let query = {};
    if (campusFilter && campusFilter !== 'All' && campusFilter !== 'ALL') {
      query.campus = { $regex: new RegExp(campusFilter, 'i') };
    }

    const list = await Worker.find(query);

    res.status(200).json({
      success: true,
      totalWorkers: list.length,
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a worker to the directory in database
// @route   POST /api/admin/workers
// @access  Private (Admin)
const addWorker = async (req, res, next) => {
  try {
    const { name, role, category, campus, block, department, shift, contact, phone } = req.body;

    const count = await Worker.countDocuments();
    const newWorker = await Worker.create({
      empId: `KW-${String(count + 1).padStart(4, '0')}`,
      name: name || 'Staff Worker',
      role: role || 'Campus Staff',
      category: category || 'Facilities',
      campus: campus || 'KIET',
      block: block || 'Campus Facilities',
      shift: shift || 'General',
      department: department || 'Maintenance',
      contact: contact || phone || '+91 99999 99999',
      phone: phone || contact || '+91 99999 99999',
      status: 'On Duty',
    });

    res.status(201).json({
      success: true,
      data: newWorker,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminWorkers,
  addWorker,
};
