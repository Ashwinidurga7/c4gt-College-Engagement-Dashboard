/**
 * In-memory sliding window rate limiter for high-risk authentication endpoints.
 */
const createRateLimiter = ({ windowMs = 15 * 60 * 1000, max = 5, message = 'Too many requests. Please try again later.' }) => {
  const requests = new Map();

  // Periodic cleanup of stale IP records every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of requests.entries()) {
      const active = timestamps.filter((t) => now - t < windowMs);
      if (active.length === 0) {
        requests.delete(ip);
      } else {
        requests.set(ip, active);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();
    const timestamps = (requests.get(ip) || []).filter((t) => now - t < windowMs);

    if (timestamps.length >= max) {
      const oldest = timestamps[0];
      const retryAfterSeconds = Math.ceil((windowMs - (now - oldest)) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({
        success: false,
        message,
        detail: message,
      });
    }

    timestamps.push(now);
    requests.set(ip, timestamps);
    next();
  };
};

const forgotPasswordLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  message: 'Too many password reset requests from this IP. Please try again in 15 minutes.',
});

module.exports = {
  createRateLimiter,
  forgotPasswordLimiter,
};
