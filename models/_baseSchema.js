const mongoose = require('mongoose');

/**
 * Creates a flexible Mongoose Schema supporting both string IDs and ObjectIds,
 * timestamps, and query normalization for embedded user/student references.
 */
function createModel(modelName, collectionName, additionalFields = {}, schemaOptions = {}) {
  // If model is already compiled, return existing
  if (mongoose.models[modelName]) {
    return mongoose.models[modelName];
  }

  const schemaDefinition = {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    ...additionalFields,
  };

  const schema = new mongoose.Schema(schemaDefinition, {
    timestamps: true,
    strict: false,
    ...schemaOptions,
  });

  // Query normalization hook: matches { user: id } or { 'user._id': id }
  schema.pre(/^find/, function () {
    const q = this.getQuery();
    if (q.user && typeof q.user === 'string') {
      const u = q.user;
      delete q.user;
      this.where({ $or: [{ user: u }, { 'user._id': u }, { 'user.id': u }] });
    }
    if (q.student && typeof q.student === 'string') {
      const s = q.student;
      delete q.student;
      this.where({ $or: [{ student: s }, { 'student._id': s }, { 'student.id': s }, { studentId: s }] });
    }
  });

  return mongoose.model(modelName, schema, collectionName);
}

module.exports = { createModel };
