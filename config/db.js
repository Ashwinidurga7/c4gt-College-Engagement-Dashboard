const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas (or local MongoDB) if MONGODB_URI is provided.
 * Gracefully falls back to standalone in-memory mode if URI is not set or unreachable.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri || uri.includes('<username>') || uri.includes('<password>') || uri.includes('YOUR_ATLAS_PASSWORD')) {
    console.log('ℹ️  No valid MongoDB Atlas connection string found in .env.');
    console.log('   Running in Standalone In-Memory Mode with full institutional seed data.');
    console.log('   To connect to MongoDB Atlas, set MONGODB_URI in c4gt-College-Engagement-Dashboard/.env');
    return;
  }

  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`=========================================`);
    console.log(`🍃 MongoDB Atlas Connected Successfully!`);
    console.log(`📡 Host: ${conn.connection.host}`);
    console.log(`📂 Database: ${conn.connection.name}`);
    console.log(`=========================================`);
  } catch (error) {
    console.error(`❌ MongoDB Atlas Connection Failed: ${error.message}`);
    console.log('⚠️  Falling back to Standalone In-Memory Mode so the server remains fully operational.');
  }
};

module.exports = connectDB;
