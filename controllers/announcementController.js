const Announcement = require('../models/Announcement');

const FIELDS = ['title', 'body', 'category', 'date'];

const pickFields = (body = {}) => {
  const data = {};
  FIELDS.forEach((field) => {
    if (body[field] !== undefined) data[field] = typeof body[field] === 'string' ? body[field].trim() : body[field];
  });
  return data;
};

// @desc    List announcements, newest first
// @route   GET /api/announcements
// @access  Private
const getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1, createdAt: -1 }).lean();
    res.status(200).json({ success: true, count: announcements.length, data: announcements });
  } catch (error) {
    next(error);
  }
};

// @desc    Publish an announcement
// @route   POST /api/announcements
// @access  Private (Admin)
const createAnnouncement = async (req, res, next) => {
  try {
    const data = pickFields(req.body);
    if (!data.title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    const announcement = await Announcement.create({
      ...data,
      date: data.date || new Date().toISOString().slice(0, 10),
      createdBy: String(req.user.id),
    });
    res.status(201).json({ success: true, message: 'Announcement published', data: announcement });
  } catch (error) {
    next(error);
  }
};

// @desc    Edit an announcement
// @route   PUT /api/announcements/:id
// @access  Private (Admin)
const updateAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      String(req.params.id),
      { $set: pickFields(req.body) },
      { returnDocument: 'after', runValidators: true }
    );
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    res.status(200).json({ success: true, message: 'Announcement updated', data: announcement });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Admin)
const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(String(req.params.id));
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    res.status(200).json({ success: true, message: 'Announcement deleted', data: { _id: announcement._id } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement };
