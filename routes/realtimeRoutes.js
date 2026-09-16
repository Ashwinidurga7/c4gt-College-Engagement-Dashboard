const express = require('express');
const router = express.Router();
const { addSseClient, broadcastRealtimeEvent, getClientCount } = require('../services/realtimeService');

// @desc    Connect to Server-Sent Events (SSE) realtime stream
// @route   GET /api/realtime/events
// @access  Public
router.get('/events', (req, res) => {
  addSseClient(req, res);
});

// @desc    Emit an event to the realtime stream
// @route   POST /api/realtime/emit
// @access  Public
router.post('/emit', (req, res) => {
  const payload = req.body || {};
  const event = broadcastRealtimeEvent(payload);
  res.status(200).json({ success: true, event });
});

// @desc    Get realtime status & active connection count
// @route   GET /api/realtime/status
// @access  Public
router.get('/status', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    activeClients: getClientCount(),
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
