const Fee = require('../models/Fee');
const Student = require('../models/Student');
const User = require('../models/User');
const { broadcastRealtimeEvent } = require('../services/realtimeService');

// @desc    Get student fee details from database
// @route   GET /api/students/fees
// @access  Private (Student)
const getStudentFees = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const rollNumber = req.user?.rollNumber;

    let feeRecord = await Fee.findOne({
      $or: [
        { user: userId },
        { 'user._id': userId },
        { rollNumber: rollNumber },
      ],
    });

    if (!feeRecord) {
      // If not in Fee collection yet, check student's profile in Atlas
      const student = await Student.findOne({
        $or: [{ rollNumber }, { user: userId }, { 'user._id': userId }],
      });

      const initialData = student?.fees || {
        total: 98000,
        paid: 98000,
        due: 0,
        dueDate: '30 Sep 2026',
        status: 'Paid',
        academicYear: '2026–27',
        tuition: 75000,
        specialFee: 15000,
        examFee: 8000,
        history: [],
      };

      feeRecord = await Fee.create({
        user: userId,
        rollNumber: rollNumber || student?.rollNumber || '',
        ...initialData,
      });
    }

    res.status(200).json({
      success: true,
      data: feeRecord,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record a student fee payment in database
// @route   POST /api/students/fees/pay
// @access  Private (Student)
const payStudentFees = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const rollNumber = req.user?.rollNumber;
    const { amount, type = 'Tuition Fee', mode = 'Online UPI' } = req.body;

    const numAmount = Number(amount) || 0;
    if (numAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid payment amount' });
    }

    let feeRecord = await Fee.findOne({
      $or: [
        { user: userId },
        { 'user._id': userId },
        { rollNumber: rollNumber },
      ],
    });

    if (!feeRecord) {
      feeRecord = await Fee.create({
        user: userId,
        rollNumber: rollNumber || ' ',
        total: 98000,
        paid: 0,
        due: 98000,
        status: 'Due',
      });
    }

    const newPaid = Number(feeRecord.paid || 0) + numAmount;
    const newDue = Math.max(0, Number(feeRecord.total || 98000) - newPaid);
    const newStatus = newDue === 0 ? 'Paid' : 'Partial';

    const newTx = {
      id: `tx_${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      amount: numAmount,
      type,
      mode,
      status: 'Success',
      refNo: `TXN-${Math.floor(1000 + Math.random() * 9000)}-KIET`,
    };

    feeRecord.paid = newPaid;
    feeRecord.due = newDue;
    feeRecord.status = newStatus;
    feeRecord.history = [newTx, ...(feeRecord.history || [])];
    await feeRecord.save();

    // Broadcast real-time payment event
    broadcastRealtimeEvent({
      category: 'Finance',
      title: `Fee Payment Received: ₹${numAmount.toLocaleString('en-IN')} (${type})`,
      user: req.user?.name || 'Student',
    });

    res.status(200).json({
      success: true,
      message: 'Payment recorded in database successfully',
      data: feeRecord,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentFees,
  payStudentFees,
};
