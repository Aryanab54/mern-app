#!/usr/bin/env node

const axios = require('axios');

async function testConnection() {
  console.log('🔍 Testing Backend Connection...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5001/api/health');
    console.log('✅ Health check:', healthResponse.data.message);
    
    // Test login endpoint
    console.log('\n2. Testing login endpoint...');
    const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    console.log('✅ Login successful:', loginResponse.data.message);
    
    const token = loginResponse.data.data.token;
    
    // Test protected endpoint
    console.log('\n3. Testing protected endpoint...');
    const agentsResponse = await axios.get('http://localhost:5001/api/agents', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Agents endpoint accessible');
    
    console.log('\n🎉 All connections working properly!');
    console.log('\n📋 Ready to use:');
    console.log('- Backend: http://localhost:5001');
    console.log('- Frontend: http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Connection test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data?.message || error.message);
    } else {
      console.error('Error:', error.message);
    }
    console.log('\n💡 Make sure:');
    console.log('1. Backend is running: cd backend && npm run dev');
    console.log('2. Database is connected');
    console.log('3. Admin user is seeded');
  }
}

testConnection();