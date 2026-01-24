// Test script to verify all backend routes
const axios = require('axios');

const BASE_URL = 'http://localhost:4000/api';

async function testRoutes() {
  console.log('🧪 Testing Backend Routes...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get('http://localhost:4000/health');
    console.log('✅ Health check:', healthResponse.data.message);

    // Test signup
    console.log('\n2. Testing signup...');
    const signupData = {
      fullname: 'Test User',
      username: 'testuser123',
      password: 'password123',
      phone: '1234567890',
      address: 'Test Address'
    };

    try {
      const signupResponse = await axios.post(`${BASE_URL}/signup`, signupData);
      console.log('✅ Signup success:', signupResponse.data.message);
    } catch (signupError) {
      if (signupError.response?.status === 409) {
        console.log('ℹ️  User already exists (this is okay)');
      } else {
        console.log('❌ Signup error:', signupError.response?.data?.message);
      }
    }

    // Test login
    console.log('\n3. Testing login...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/login`, {
        username: 'testuser123',
        password: 'password123'
      });
      console.log('✅ Login success:', loginResponse.data.message);
      
      const token = loginResponse.data.token;
      
      // Test protected routes with token
      const headers = { Authorization: `Bearer ${token}` };

      console.log('\n4. Testing /me endpoint...');
      const meResponse = await axios.get(`${BASE_URL}/me`, { headers });
      console.log('✅ User data retrieved:', meResponse.data.fullname);

      console.log('\n5. Testing dashboard...');
      const _dashboardResponse = await axios.get(`${BASE_URL}/dashboard`, { headers });
      console.log('✅ Dashboard data retrieved');

      console.log('\n6. Testing donation...');
      const donationData = {
        blood_type: 'O+',
        units: 2,
        donation_date: new Date().toISOString()
      };
      const donationResponse = await axios.post(`${BASE_URL}/donate`, donationData, { headers });
      console.log('✅ Donation recorded:', donationResponse.data.message);

    } catch (loginError) {
      console.log('❌ Login failed:', loginError.response?.data?.message);
    }

    // Test public routes
    console.log('\n7. Testing stats endpoint...');
    const statsResponse = await axios.get(`${BASE_URL}/stats`);
    console.log('✅ Stats retrieved:', `${statsResponse.data.totalDonations} total donations`);

    console.log('\n8. Testing donations list...');
    const donationsResponse = await axios.get(`${BASE_URL}/donations`);
    console.log('✅ Donations list retrieved:', `${donationsResponse.data.length} donations`);

    console.log('\n9. Testing Python service status...');
    const pythonStatusResponse = await axios.get(`${BASE_URL}/python-status`);
    console.log('✅ Python services status:', pythonStatusResponse.data.services);

    console.log('\n10. Testing top donors...');
    const _topDonorsResponse = await axios.get(`${BASE_URL}/top-donors`);
    console.log('✅ Top donors retrieved');

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testRoutes();
