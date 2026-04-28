const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/auth';

const testAuth = async () => {
  try {
    console.log('🧪 Testing Authentication System...\n');

    // Test 1: Register
    console.log('Test 1: Register new user...');
    const registerRes = await axios.post(`${BASE_URL}/register`, {
      name: 'Test User',
      email: `test${Date.now()}@school.com`,
      password: 'password123',
      role: 'teacher'
    });
    console.log('✅ Register successful');
    console.log('Token:', registerRes.data.data.token.substring(0, 20) + '...');
    
    const token = registerRes.data.data.token;

    // Test 2: Login
    console.log('\nTest 2: Login existing user...');
    const loginRes = await axios.post(`${BASE_URL}/login`, {
      email: 'john@school.com',
      password: 'password123'
    });
    console.log('✅ Login successful');
    console.log('User:', loginRes.data.data.user.name);

    // Test 3: Get Profile
    console.log('\nTest 3: Get profile with token...');
    const profileRes = await axios.get(`${BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profile fetched');
    console.log('User:', profileRes.data.data.user.name);

    console.log('\n✅ All authentication tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

// Run if axios is installed
testAuth();