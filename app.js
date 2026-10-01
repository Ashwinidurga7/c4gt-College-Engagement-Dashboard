const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const activityRoutes = require('./routes/activityRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const reportRoutes = require('./routes/reportRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const eventRoutes = require('./routes/eventRoutes');
const courseRoutes = require('./routes/courseRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const certificationRoutes = require('./routes/certificationRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const projectRoutes = require('./routes/projectRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const hodRoutes = require('./routes/hodRoutes');
const ctpoRoutes = require('./routes/ctpoRoutes');
const clubRoutes = require('./routes/clubRoutes');
const realtimeRoutes = require('./routes/realtimeRoutes');
const feeRoutes = require('./routes/feeRoutes');
const transportRoutes = require('./routes/transportRoutes');
const placementRoutes = require('./routes/placementRoutes');
const workerRoutes = require('./routes/workerRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger.json');

const app = express();

// Behind nginx on the same machine, so req.ip is the client and not the proxy.
// Set TRUST_PROXY (a hop count or address list) when the proxy is elsewhere.
const trustProxy = process.env.TRUST_PROXY || 'loopback';
app.set('trust proxy', /^\d+$/.test(trustProxy) ? Number(trustProxy) : trustProxy);

// CORS: only the frontends listed in CORS_ORIGIN (comma separated) may call the API from a browser.
// Requests without an Origin header (curl, server to server, same origin) are not affected.
const DEV_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);
if (!allowedOrigins.length) {
  if (process.env.NODE_ENV === 'production') {
    console.warn('⚠️  CORS_ORIGIN is not set, so browsers on other origins cannot call this API.');
  } else {
    allowedOrigins.push(...DEV_ORIGINS);
  }
}

// Standard Middlewares
app.use(cors({ origin: (origin, callback) => callback(null, !origin || allowedOrigins.includes(origin)) }));
// Resume builder drafts and versions are larger than the default 100kb body limit.
app.use('/api/resumes', express.json({ limit: '1mb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware (logs every request to terminal, without signed link tokens)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const url = req.originalUrl.replace(/([?&]token=)[^&]+/, '$1***');
    console.log(`📡 [${new Date().toLocaleTimeString()}] ${req.method} ${url} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Swagger UI Interactive Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health Check & Root API
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Student Management API is running',
    version: '1.0.0',
    swaggerDocs: '/api-docs',
    healthCheck: '/api/health',
  });
});

// 503 while MongoDB is unreachable, so uptime checks notice a server that cannot serve data.
app.get('/api/health', (req, res) => {
  const database = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(database === 'connected' ? 200 : 503).json({
    status: database === 'connected' ? 'UP' : 'DEGRADED',
    database,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/realtime', realtimeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/hod', hodRoutes);
app.use('/api/ctpo', ctpoRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/placements', placementRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/media', mediaRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
