require('dotenv').config();

const testConnection = async () => {
  console.log('🔍 Testing Supabase connection...\n');
  
  // Check if DATABASE_URL exists
  if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL not found in .env file!');
    return;
  }
  
  // Check if password is still placeholder
  if (process.env.DATABASE_URL.includes('[YOUR-PASSWORD]')) {
    console.log('❌ Please replace [YOUR-PASSWORD] with your actual password!');
    console.log('\nYour current DATABASE_URL has a placeholder.');
    console.log('Go to Supabase Dashboard → Settings → Database → Reset password');
    return;
  }
  
  console.log('✅ DATABASE_URL found in .env');
  console.log('Connection string format:', 
    process.env.DATABASE_URL.substring(0, 30) + '...[hidden]');
  
  // Try to connect
  const { Sequelize } = require('sequelize');
  
  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });
  
  try {
    await sequelize.authenticate();
    console.log('✅ Connection successful!');
    
    // Test query
    const [results] = await sequelize.query('SELECT NOW() as current_time');
    console.log('✅ Database time:', results[0].current_time);
    
    console.log('\n🎉 Everything is working! You can now start the server.\n');
    process.exit(0);
  } catch (error) {
    console.log('❌ Connection failed!');
    console.log('Error:', error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.log('\n💡 Solution:');
      console.log('1. Go to Supabase Dashboard');
      console.log('2. Settings → Database');
      console.log('3. Scroll to "Database password"');
      console.log('4. Click "Reset database password"');
      console.log('5. Set a new password (e.g., MyPassword123)');
      console.log('6. Update .env file with new password');
    }
    
    process.exit(1);
  }
};

testConnection();