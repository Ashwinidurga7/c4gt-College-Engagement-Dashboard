// Standalone mode: No external database connection required.
// In-memory mock data store is used for all API endpoints.

const connectDB = async () => {
  console.log('✅ Running backend in standalone mode (No database connection required)');
};

module.exports = connectDB;
