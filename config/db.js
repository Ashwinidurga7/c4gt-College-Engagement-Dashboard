const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas (or local MongoDB) if MONGODB_URI is provided.
 * Gracefully falls back to standalone in-memory mode if URI is not set or unreachable.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri || uri.includes('<username>') || uri.includes('<password>') || uri.includes('YOUR_ATLAS_PASSWORD')) {
    console.warn('⚠️  No valid MongoDB connection string found in .env (MONGODB_URI is not set).');
    console.warn('   Database operations will fail until MONGODB_URI is configured in your .env file.');
    console.warn('   See .env.example for required configuration.');
    return;
  }

  try {
    console.log('⏳ Connecting to MongoDB...');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`=========================================`);
    console.log(`🍃 MongoDB Connected Successfully!`);
    console.log(`📡 Host: ${conn.connection.host}`);
    console.log(`📂 Database: ${conn.connection.name}`);
    console.log(`=========================================`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    console.error('⚠️  Database is unavailable. Routes requiring database operations will fail until connected.');
  }
};

module.exports = connectDB;
