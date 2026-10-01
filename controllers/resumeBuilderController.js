const ResumeDraft = require('../models/ResumeDraft');
const ResumeVersion = require('../models/ResumeVersion');

// Older versions beyond this are dropped when a new one is saved.
const MAX_VERSIONS = 30;
const REASON_PATTERN = /^[a-z][a-z-]{0,31}$/;

// Every query is scoped to the signed-in student. The $eq operator also keeps the
// _baseSchema find hook from widening the match to embedded user shapes, so these
// lookups use the user index.
const ownedBy = (req) => ({ user: { $eq: String(req.user.id) } });

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

const toVersion = (doc) => ({
  _id: doc._id,
  reason: doc.reason,
  createdAt: doc.createdAt,
  draft: doc.draft,
  printModel: doc.printModel ?? null,
});

// @desc    Get the student's resume builder draft (null when there is none)
// @route   GET /api/resumes/builder-draft
// @access  Private (Student)
const getBuilderDraft = async (req, res, next) => {
  try {
    const doc = await ResumeDraft.findOne(ownedBy(req)).lean();
    res.status(200).json({
      success: true,
      data: doc ? { draft: doc.draft, updatedAt: doc.updatedAt } : null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save (replace) the student's resume builder draft
// @route   PUT /api/resumes/builder-draft
// @access  Private (Student)
const saveBuilderDraft = async (req, res, next) => {
  try {
    const { draft } = req.body || {};
    if (!isPlainObject(draft)) {
      return res.status(400).json({ success: false, message: 'draft must be an object' });
    }

    const save = () =>
      ResumeDraft.findOneAndUpdate(
        ownedBy(req),
        { $set: { draft } },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      ).lean();

    let doc;
    try {
      doc = await save();
    } catch (error) {
      // Two first saves racing each other: the unique index on user lets only one insert,
      // so the other retries as an update.
      if (error.code !== 11000) throw error;
      doc = await save();
    }

    res.status(200).json({
      success: true,
      data: { draft: doc.draft, updatedAt: doc.updatedAt },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    List the student's resume versions, newest first
// @route   GET /api/resumes/builder-versions
// @access  Private (Student)
const getBuilderVersions = async (req, res, next) => {
  try {
    const versions = await ResumeVersion.find(ownedBy(req))
      .sort({ createdAt: -1, _id: -1 })
      .limit(MAX_VERSIONS)
      .lean();

    res.status(200).json({
      success: true,
      count: versions.length,
      data: versions.map(toVersion),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save a resume version, keeping only the newest MAX_VERSIONS
// @route   POST /api/resumes/builder-versions
// @access  Private (Student)
const createBuilderVersion = async (req, res, next) => {
  try {
    const { reason, draft, printModel } = req.body || {};
    if (!isPlainObject(draft)) {
      return res.status(400).json({ success: false, message: 'draft must be an object' });
    }
    if (printModel !== undefined && printModel !== null && !isPlainObject(printModel)) {
      return res.status(400).json({ success: false, message: 'printModel must be an object' });
    }

    const version = await ResumeVersion.create({
      user: String(req.user.id),
      reason: typeof reason === 'string' && REASON_PATTERN.test(reason) ? reason : 'manual',
      draft,
      printModel: printModel ?? null,
    });

    const stale = await ResumeVersion.find(ownedBy(req))
      .sort({ createdAt: -1, _id: -1 })
      .skip(MAX_VERSIONS)
      .select('_id')
      .lean();
    if (stale.length) {
      await ResumeVersion.deleteMany({ ...ownedBy(req), _id: { $in: stale.map((v) => v._id) } });
    }

    res.status(201).json({
      success: true,
      message: 'Resume version saved',
      data: toVersion(version.toObject()),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete one of the student's resume versions
// @route   DELETE /api/resumes/builder-versions/:id
// @access  Private (Student)
const deleteBuilderVersion = async (req, res, next) => {
  try {
    const deleted = await ResumeVersion.findOneAndDelete({
      ...ownedBy(req),
      _id: { $eq: String(req.params.id) },
    }).lean();

    // Another student's version reads as not found, so ids cannot be probed.
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Resume version not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Resume version deleted',
      data: { _id: deleted._id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBuilderDraft,
  saveBuilderDraft,
  getBuilderVersions,
  createBuilderVersion,
  deleteBuilderVersion,
};
