const Event = require('../models/Event');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const notificationService = require('./notificationService');

/**
 * Validate event creation payload.
 */
const validateEventPayload = ({ title, date, targetType, targetYear, targetDepartment, department }) => {
  if (!title || !title.trim()) {
    throw new Error('Event title is required');
  }
  if (!date) {
    throw new Error('Event date is required');
  }
  if (targetType && !['specific_year', 'all_years', 'specific_department_year', 'specific_department_all_years', 'all_departments_all_years'].includes(targetType)) {
    throw new Error('Invalid targetType');
  }
  if (targetType === 'specific_year' && (!targetYear || !String(targetYear).trim())) {
    throw new Error('targetYear is required when targetType is "specific_year"');
  }
};

/**
 * Create a new event and trigger notifications to target audience.
 */
const createEvent = async (eventData, creatorUser) => {
  validateEventPayload(eventData);

  const {
    title,
    description = '',
    date,
    time = '',
    venue = '',
    targetType,
    targetYear,
    targetDepartment,
    department = null,
  } = eventData;

  const resolvedDept = targetDepartment || department || 'all';
  const resolvedYear = targetYear || (targetType === 'all_years' ? 'all' : null);

  const derivedTargetType =
    targetType ||
    (resolvedYear && resolvedYear !== 'all' ? 'specific_year' : 'all_years');

  const newEvent = await Event.create({
    title: title.trim(),
    description: description.trim(),
    date: new Date(date),
    time: time.trim(),
    venue: venue.trim(),
    createdBy: creatorUser ? creatorUser.id || creatorUser._id : null,
    targetType: derivedTargetType,
    targetYear: resolvedYear && resolvedYear !== 'all' ? String(resolvedYear).trim() : 'all',
    targetDepartment: resolvedDept,
    department: resolvedDept,
  });

  // Safely generate notifications without crashing event creation on failure
  let notificationsSent = 0;
  try {
    const notifResult = await notificationService.sendEventNotifications(newEvent);
    notificationsSent = notifResult.totalSent || 0;
  } catch (notifErr) {
    console.error('Event created successfully, but notification dispatch failed:', notifErr.message);
  }

  return {
    event: newEvent,
    notificationsSent,
  };
};

/**
 * Get events with role-aware visibility and optional query filters.
 */
const getEvents = async (query = {}, currentUser = null) => {
  let events = await Event.find();

  // Role-based visibility filtering
  if (currentUser) {
    if (currentUser.role === 'student') {
      const studentProfile = await Student.findOne({ user: currentUser.id });
      const studentYear = studentProfile ? notificationService.getStudentYear(studentProfile) : '';
      const studentDept = studentProfile ? studentProfile.department : null;

      events = events.filter((e) => {
        const targetDept = e.targetDepartment || e.department;
        const targetYr = e.targetYear;

        const deptMatches =
          !targetDept ||
          String(targetDept).toLowerCase() === 'all' ||
          notificationService.doesDepartmentMatch(studentDept, targetDept);

        const yearMatches =
          !targetYr ||
          String(targetYr).toLowerCase() === 'all' ||
          e.targetType === 'all_years' ||
          (studentYear && notificationService.normalizeYear(targetYr) === studentYear);

        return deptMatches && yearMatches;
      });
    } else if (currentUser.role === 'faculty') {
      const facultyProfile = await Faculty.findOne({ user: currentUser.id });
      if (!facultyProfile || !notificationService.isFacultyApprovedAndActive(facultyProfile)) {
        return [];
      }

      events = events.filter((e) => {
        const targetDept = e.targetDepartment || e.department;
        const targetYr = e.targetYear;

        const deptMatches =
          !targetDept ||
          String(targetDept).toLowerCase() === 'all' ||
          notificationService.doesDepartmentMatch(facultyProfile.department, targetDept);

        const yearMatches =
          !targetYr ||
          String(targetYr).toLowerCase() === 'all' ||
          e.targetType === 'all_years' ||
          notificationService.isFacultyAssignedToYear(facultyProfile, targetYr);

        return deptMatches && yearMatches;
      });
    }
  }

  // Explicit query filters
  if (query.targetType) {
    events = events.filter((e) => e.targetType === query.targetType);
  }
  if (query.targetYear) {
    const normYear = notificationService.normalizeYear(query.targetYear);
    events = events.filter((e) => notificationService.normalizeYear(e.targetYear) === normYear);
  }
  if (query.department) {
    events = events.filter(
      (e) =>
        notificationService.doesDepartmentMatch(e.targetDepartment, query.department) ||
        notificationService.doesDepartmentMatch(e.department, query.department)
    );
  }

  // Sort by date ascending (upcoming first)
  events.sort((a, b) => new Date(a.date) - new Date(b.date));

  return events;
};

/**
 * Get event by ID.
 */
const getEventById = async (id) => {
  return await Event.findById(id);
};

/**
 * Update an existing event.
 */
const updateEvent = async (id, updateData) => {
  if (updateData.targetType) {
    if (!['specific_year', 'all_years'].includes(updateData.targetType)) {
      throw new Error('targetType must be either "specific_year" or "all_years"');
    }
    if (updateData.targetType === 'specific_year' && !updateData.targetYear) {
      throw new Error('targetYear is required when targetType is "specific_year"');
    }
    if (updateData.targetType === 'all_years') {
      updateData.targetYear = null;
    }
  }

  const updated = await Event.findByIdAndUpdate(id, updateData, { new: true });
  return updated;
};

/**
 * Delete an event.
 */
const deleteEvent = async (id) => {
  return await Event.findByIdAndDelete(id);
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
