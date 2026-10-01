const jwt = require('jsonwebtoken');
const MediaFile = require('../models/MediaFile');

const LINK_PURPOSE = 'media-file';

// The first bytes of each accepted type, so a renamed file cannot pass as an image or PDF.
const SIGNATURES = {
  'image/jpeg': (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  'image/png': (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  'image/webp': (b) => b.subarray(0, 4).toString('latin1') === 'RIFF' && b.subarray(8, 12).toString('latin1') === 'WEBP',
  'application/pdf': (b) => b.subarray(0, 5).toString('latin1') === '%PDF-',
};

const matchesType = (file) => Boolean(SIGNATURES[file.mimetype] && SIGNATURES[file.mimetype](file.buffer));

/** Path to a stored file. Private files get a signed link that expires after an hour. */
const urlFor = (media) => {
  if (!media) return null;
  const id = String(media._id);
  if (!media.isPrivate) return `/api/media/${id}`;
  const token = jwt.sign({ purpose: LINK_PURPOSE, media: id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return `/api/media/${id}?token=${token}`;
};

/**
 * Stores multer uploads. Throws a 400-style error when a file's contents do not match
 * its type, before anything is saved.
 */
const saveUploads = async (files = [], { owner, purpose, isPrivate = false }) => {
  const bad = files.find((file) => !matchesType(file));
  if (bad) {
    const error = new Error(`${bad.originalname || 'A file'} is not a valid ${bad.mimetype === 'application/pdf' ? 'PDF' : 'image'}.`);
    error.status = 400;
    throw error;
  }
  return Promise.all(
    files.map((file) =>
      MediaFile.create({
        owner: owner ? String(owner) : undefined,
        purpose,
        isPrivate,
        fileName: String(file.originalname || 'file').slice(0, 150),
        contentType: file.mimetype,
        size: file.size,
        data: file.buffer,
      })
    )
  );
};

/** Media ids referenced by a list of our own media URLs. */
const idsFromUrls = (urls = []) =>
  urls.map((url) => String(url).match(/^\/api\/media\/([a-f0-9]{24})/)).filter(Boolean).map((m) => m[1]);

/** Deletes stored photos that were dropped from a gallery. */
const removeUnused = async (previousUrls = [], keptUrls = []) => {
  const kept = new Set(idsFromUrls(keptUrls));
  const dropped = idsFromUrls(previousUrls).filter((id) => !kept.has(id));
  if (dropped.length) await MediaFile.deleteMany({ _id: { $in: dropped } });
};

/** Verifies the token on a private file link. */
const linkAllows = (token, id) => {
  try {
    const link = jwt.verify(String(token || ''), process.env.JWT_SECRET, { algorithms: ['HS256'] });
    return link.purpose === LINK_PURPOSE && link.media === String(id);
  } catch (e) {
    return false;
  }
};

/**
 * The gallery after an edit: the photos the form kept (`keepImages`, a JSON list of URLs
 * that must already be in the gallery) followed by the new uploads in req.files.
 * Photos that were dropped are deleted from storage. Returns [{ url, caption }].
 */
const buildGallery = async (req, previous = [], purpose) => {
  const before = (previous || []).map((photo) => (typeof photo === 'string' ? { url: photo } : photo)).filter((photo) => photo && photo.url);
  let keptUrls = before.map((photo) => photo.url);
  if (req.body && req.body.keepImages !== undefined) {
    let requested = [];
    try {
      requested = JSON.parse(req.body.keepImages);
    } catch (e) {
      requested = [];
    }
    const allowed = new Set(keptUrls);
    keptUrls = (Array.isArray(requested) ? requested : []).filter((url) => allowed.has(url));
  }
  const saved = await saveUploads(req.files || [], { owner: req.user && req.user.id, purpose });
  await removeUnused(before.map((photo) => photo.url), keptUrls);
  const kept = keptUrls.map((url) => before.find((photo) => photo.url === url));
  return [...kept, ...saved.map((media) => ({ url: urlFor(media), caption: '' }))];
};

module.exports = { saveUploads, urlFor, removeUnused, linkAllows, idsFromUrls, buildGallery };
