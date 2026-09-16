const { createModel } = require('./_baseSchema');

const Campus = createModel('Campus', 'campuses', {
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  shortName: { type: String },
  established: { type: Number },
  tag: { type: String },
  location: { type: String },
  campusArea: { type: String },
  director: { type: String },
  dean: { type: String },
  accreditation: { type: String },
  totalStudents: { type: Number, default: 0 },
  totalFaculty: { type: Number, default: 0 },
  totalHODs: { type: Number, default: 0 },
  totalBuses: { type: Number, default: 0 },
  totalWorkers: { type: Number, default: 0 },
  placementRate: { type: String },
  highestPackage: { type: String },
  avgPackage: { type: String },
  image: { type: String },
  color: { type: String },
});

module.exports = Campus;
