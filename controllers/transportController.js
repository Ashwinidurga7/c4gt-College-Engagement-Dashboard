const Transport = require('../models/Transport');
const Student = require('../models/Student');
const { broadcastRealtimeEvent } = require('../services/realtimeService');

// @desc    Get student transport / bus pass from database
// @route   GET /api/students/transport
// @access  Private (Student)
const getStudentTransport = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const rollNumber = req.user?.rollNumber;

    let transport = await Transport.findOne({
      $or: [
        { user: userId },
        { 'user._id': userId },
        { rollNumber: rollNumber },
      ],
      isFleetRoute: { $ne: true },
    });

    if (!transport) {
      const student = await Student.findOne({
        $or: [{ rollNumber }, { user: userId }, { 'user._id': userId }],
      });

      transport = await Transport.create({
        user: userId,
        rollNumber: rollNumber || student?.rollNumber || ' ',
        route: student?.busRoute || 'Route 03 · Kakinada RTC to Korangi Campus',
        routeNumber: 'Route 03',
        busNumber: 'AP 05 TJ 4512',
        driverName: 'K. Appa Rao',
        driverPhone: '+91 94401 22891',
        boardingPoint: student?.boardingPoint || 'Bhanugudi Junction, Kakinada',
        status: 'Active',
        paid: 18000,
        total: 18000,
        balance: 0,
        passValidTill: '30 Jun 2027',
        passType: 'Annual Institutional Pass',
        isFleetRoute: false,
      });
    }

    res.status(200).json({
      success: true,
      data: transport,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complete institutional transport fleet from database
// @route   GET /api/admin/transport
// @access  Private (Admin)
const getAdminFleet = async (req, res, next) => {
  try {
    const fleet = await Transport.find({ isFleetRoute: true });

    const totalCapacity = fleet.reduce((acc, f) => acc + (Number(f.capacity) || 56), 0);
    const totalAllocated = fleet.reduce((acc, f) => acc + (Number(f.allocatedStudents) || 0), 0);

    res.status(200).json({
      success: true,
      totalBuses: fleet.length,
      totalCapacity,
      totalAllocated,
      data: fleet,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create / Add bus route to fleet in database
// @route   POST /api/admin/transport
// @access  Private (Admin)
const addFleetRoute = async (req, res, next) => {
  try {
    const { name, driverName, phone, routeNumber, routeName, route, busNumber, capacity, campus, destination } = req.body;

    const newRoute = await Transport.create({
      driverName: driverName || name || 'Driver',
      driverPhone: phone || '+91 99999 99999',
      phone: phone || '+91 99999 99999',
      routeNumber: routeNumber || 'Route New',
      route: route || routeName || 'New Campus Route',
      busNumber: busNumber || 'AP 05 TJ 9999',
      capacity: Number(capacity) || 56,
      allocatedStudents: 0,
      destination: destination || 'KIET Main Campus',
      status: 'Active',
      campus: campus || 'KIET',
      isFleetRoute: true,
    });

    broadcastRealtimeEvent({
      category: 'Transport',
      title: `New Transport Route Added: ${newRoute.routeNumber} (${newRoute.route})`,
      user: req.user?.name || 'Administrator',
    });

    res.status(201).json({
      success: true,
      data: newRoute,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentTransport,
  getAdminFleet,
  getAdminTransport: getAdminFleet,
  addFleetRoute,
};
