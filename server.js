require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/config/database');

const PORT = process.env.PORT || 3000;

/**
 * Start server
 */
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync database (use { alter: true } for updates without data loss)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized');

    // Start Express server
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`\n🔐 Auth endpoints:`);
      console.log(`   POST http://localhost:${PORT}/api/auth/register`);
      console.log(`   POST http://localhost:${PORT}/api/auth/login`);
      console.log(`   GET  http://localhost:${PORT}/api/auth/me`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();