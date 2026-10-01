const mongoose = require('mongoose');
const { createModel } = require('./_baseSchema');

// The resume builder draft: one per student, replaced on every save.
const ResumeDraft = createModel(
  'ResumeDraft',
  'resumedrafts',
  {
    user: { type: String, required: true, unique: true },
    draft: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { minimize: false }
);

module.exports = ResumeDraft;
