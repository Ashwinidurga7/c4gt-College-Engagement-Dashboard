const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

if (mongoose.models.User) {
  module.exports = mongoose.models.User;
} else {
  const userSchema = new mongoose.Schema(
    {
      _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString(),
      },
      name: { type: String, required: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      password: { type: String, required: true },
      role: {
        type: String,
        enum: ['student', 'faculty', 'hod', 'admin', 'ctpo'],
        default: 'student',
      },
      rollNumber: { type: String, trim: true },
      college: { type: String, default: 'KIET' },
      department: { type: mongoose.Schema.Types.Mixed },
      branch: { type: String },
      year: { type: String },
      semester: { type: Number },
      section: { type: String },
      approvalStatus: { type: String, default: 'approved' },
      isActive: { type: Boolean, default: true },
      // Set while the account still has its issued password (e.g. a roll number); the API
      // only allows changing the password until it is cleared.
      mustChangePassword: { type: Boolean, default: false },
    },
    {
      timestamps: true,
      strict: false,
    }
  );

  // Compare entered password with stored password
  userSchema.methods.matchPassword = async function (enteredPassword) {
    if (typeof enteredPassword !== 'string' || !enteredPassword || !this.password) {
      return false;
    }
    try {
      return await bcrypt.compare(enteredPassword, this.password);
    } catch (e) {
      return false;
    }
  };

  // Pre-save hook to hash password if modified
  userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
      return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  });

  module.exports = mongoose.model('User', userSchema, 'users');
}
