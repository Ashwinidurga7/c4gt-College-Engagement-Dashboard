const { createModel } = require('./_baseSchema');

const Transport = createModel('Transport', 'transports', {
  user: { type: Object },
  student: { type: Object },
  rollNumber: { type: String },
  route: { type: String },
  routeNumber: { type: String },
  busNumber: { type: String },
  driverName: { type: String },
  driverPhone: { type: String },
  license: { type: String },
  destination: { type: String },
  boardingPoint: { type: String },
  capacity: { type: Number, default: 56 },
  allocatedStudents: { type: Number, default: 0 },
  campus: { type: String, default: 'KIET' },
  status: { type: String, default: 'Active' },
  paid: { type: Number, default: 18000 },
  total: { type: Number, default: 18000 },
  balance: { type: Number, default: 0 },
  passValidTill: { type: String, default: '30 Jun 2027' },
  passType: { type: String, default: 'Annual Institutional Pass' },
  isFleetRoute: { type: Boolean, default: false },
});

module.exports = Transport;
