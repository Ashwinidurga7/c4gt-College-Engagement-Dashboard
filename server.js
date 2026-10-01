const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Tokens are signed with JWT_SECRET, so refuse to start without a real one.
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is not set. Add it to .env (see .env.example) and start the server again.');
  process.exit(1);
}
if (process.env.NODE_ENV === 'production' && process.env.JWT_SECRET.length < 32) {
  console.error('❌ JWT_SECRET must be at least 32 characters in production.');
  process.exit(1);
}

const app = require('./app');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`=========================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});

// Handle uncaught exceptions: the process state is unknown after one, so exit and let pm2 restart it
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.stack || err.message}`);
  process.exit(1);
});
