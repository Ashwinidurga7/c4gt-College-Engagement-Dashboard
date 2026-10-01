const mongoose = require('mongoose');
const { createModel } = require('./_baseSchema');

// A snapshot in a student's resume history: the builder draft (to restore) and the
// resume as it printed at that moment (to download again).
const ResumeVersion = createModel(
  'ResumeVersion',
  'resumeversions',
  {
    user: { type: String, required: true },
    reason: { type: String, default: 'manual' },
    draft: { type: mongoose.Schema.Types.Mixed, default: {} },
    printModel: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { minimize: false },
  [[{ user: 1, createdAt: -1 }]]
);

module.exports = ResumeVersion;
