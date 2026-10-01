const eventService = require('../services/eventService');
const { buildGallery, removeUnused } = require('../services/mediaService');

const isInputError = (error) =>
  error.status === 400 ||
  ['required', 'targetType', 'targetYear', 'format'].some((word) => error.message.includes(word));

// @desc    Create a new event with target scope and dispatch notifications
// @route   POST /api/events (JSON, or multipart with photos in "images")
// @access  Private (Admin, Faculty, Department Head)
const createEvent = async (req, res, next) => {
  try {
    const body = req.body || {};
    eventService.eventFieldsFrom(body); // reject bad dates before any photo is stored
    const images = await buildGallery({ body: {}, files: req.files, user: req.user }, [], 'event');
    const result = await eventService.createEvent(body, req.user, images);
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: result.event,
      event: result.event,
      notificationsSent: result.notificationsSent,
    });
  } catch (error) {
    if (isInputError(error)) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Get all events (filtered by role visibility or query)
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res, next) => {
  try {
    const events = await eventService.getEvents(req.query, req.user);
    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Private
const getEventById = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event details (and its photos when sent as multipart)
// @route   PUT /api/events/:id
// @access  Private (Admin)
const updateEvent = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const body = req.body || {};
    const changes = eventService.eventFieldsFrom(body);
    if (changes.title === null || changes.date === null) {
      return res.status(400).json({ success: false, message: 'Event title and date are required' });
    }
    ['targetType', 'targetYear', 'targetDepartment'].forEach((field) => {
      if (body[field] !== undefined) changes[field] = body[field];
    });
    if (body.keepImages !== undefined || (req.files && req.files.length)) {
      changes.images = await buildGallery(req, event.images, 'event');
    }

    const updated = await eventService.updateEvent(req.params.id, changes);
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updated,
    });
  } catch (error) {
    if (isInputError(error)) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Delete event (and its stored photos)
// @route   DELETE /api/events/:id
// @access  Private (Admin)
const deleteEvent = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    await eventService.deleteEvent(req.params.id);
    await removeUnused((event.images || []).map((photo) => photo.url || photo), []);
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: { _id: event._id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
