const express = require('express');
const router = express.Router();
const MediaFile = require('../models/MediaFile');
const { linkAllows } = require('../services/mediaService');

// @desc    Serve an uploaded file. Photos are public; private files need their signed link.
// @route   GET /api/media/:id
// @access  Public / signed link
router.get('/:id', async (req, res, next) => {
  try {
    const media = await MediaFile.findById(String(req.params.id));
    if (!media) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
    if (media.isPrivate && !linkAllows(req.query.token, media._id)) {
      return res.status(401).json({ success: false, message: 'This link has expired. Reload the page and open the file again.' });
    }
    const asciiName = (media.fileName || 'file').replace(/[^\x20-\x7e]|["\\]/g, '_');
    res.set({
      'Content-Type': media.contentType,
      'Content-Length': media.data.length,
      'Content-Disposition': `inline; filename="${asciiName}"`,
      'Cache-Control': media.isPrivate ? 'private, max-age=3600' : 'public, max-age=604800, immutable',
      'X-Content-Type-Options': 'nosniff',
      'Cross-Origin-Resource-Policy': 'cross-origin',
    });
    res.send(media.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
