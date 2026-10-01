// 404 Handler
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
  // Body parser errors (invalid JSON, body too large) carry their own 4xx status.
  const errStatus = err.status || err.statusCode;
  const statusCode = res.statusCode !== 200 ? res.statusCode : errStatus >= 400 && errStatus < 500 ? errStatus : 500;
  const isProduction = process.env.NODE_ENV === 'production';
  if (statusCode >= 500) {
    console.error(err);
  }
  res.status(statusCode).json({
    success: false,
    // Internal error details stay in the server log in production.
    message: statusCode >= 500 && isProduction ? 'Internal Server Error' : err.message || 'Internal Server Error',
    stack: isProduction ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
