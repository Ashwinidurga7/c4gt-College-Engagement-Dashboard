const express = require('express');
const cors = require('cors');
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
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger.json');

const app = express();

// Standard Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
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

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
