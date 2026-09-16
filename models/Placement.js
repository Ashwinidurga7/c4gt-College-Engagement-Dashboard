const { createModel } = require('./_baseSchema');

const Placement = createModel('Placement', 'placements', {
  academicYear: { type: String, default: '2025–26' },
  summary: {
    totalEligible: { type: Number, default: 2840 },
    totalPlaced: { type: Number, default: 2470 },
    overallRate: { type: String, default: '87.0%' },
    highestPackage: { type: String, default: '₹31.50 LPA (Amazon AWS)' },
    avgPackage: { type: String, default: '₹6.40 LPA' },
    totalOffers: { type: Number, default: 3120 },
    tier1Offers: { type: Number, default: 480 },
  },
  topRecruiters: { type: Array, default: [] },
  departmentBreakdown: { type: Array, default: [] },
});

module.exports = Placement;
