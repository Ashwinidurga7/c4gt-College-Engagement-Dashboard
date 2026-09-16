const eventService = require('../services/eventService');

// @desc    Create a new event with target scope and dispatch notifications
// @route   POST /api/events
// @access  Private (Admin, Faculty, Department Head)
const createEvent = async (req, res, next) => {
  try {
    const result = await eventService.createEvent(req.body, req.user);
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: result.event,
      notificationsSent: result.notificationsSent,
    });
  } catch (error) {
    if (
      error.message.includes('required') ||
      error.message.includes('targetType') ||
      error.message.includes('targetYear')
    ) {
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

// @desc    Update event details
// @route   PUT /api/events/:id
// @access  Private (Admin)
const updateEvent = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const updated = await eventService.updateEvent(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updated,
    });
  } catch (error) {
    if (error.message.includes('required') || error.message.includes('targetType')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin)
const deleteEvent = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    await eventService.deleteEvent(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
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
