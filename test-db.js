require('dotenv').config();
const sequelize = require('./src/config/database');

const testDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful.');

    const result = await sequelize.query('SELECT NOW()');
    console.log('Current time from database:', result[0][0].now);

    process.exit(0);
  } catch (error) {
    console.error('Database connection failed:', error.message);

    try {
      const databaseUrl = new URL(process.env.DATABASE_URL);

      if (databaseUrl.hostname.startsWith('db.') && databaseUrl.hostname.endsWith('.supabase.co')) {
        console.error('This is a Supabase direct connection host. It requires IPv6 support.');
        console.error('Use the Supabase Session Pooler connection string if your network only supports IPv4.');
      }
    } catch (_urlError) {
      console.error('DATABASE_URL is missing or is not a valid URL.');
    }

    process.exit(1);
  }
};

testDB();
