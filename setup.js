#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Setting up MERN Application...\n');

// Backend setup
console.log('📦 Setting up Backend...');
process.chdir(path.join(__dirname, 'backend'));

try {
  console.log('  - Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('  - Generating Prisma client...');
  execSync('npm run db:generate', { stdio: 'inherit' });
  
  console.log('  - Running database migrations...');
  execSync('npm run db:migrate', { stdio: 'inherit' });
  
  console.log('  - Seeding admin users and agents...');
  execSync('npm run seed:all', { stdio: 'inherit' });
  
  console.log('✅ Backend setup complete!\n');
} catch (error) {
  console.error('❌ Backend setup failed:', error.message);
  process.exit(1);
}

// Frontend setup
console.log('📦 Setting up Frontend...');
process.chdir(path.join(__dirname, 'frontend'));

try {
  console.log('  - Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('✅ Frontend setup complete!\n');
} catch (error) {
  console.error('❌ Frontend setup failed:', error.message);
  process.exit(1);
}

console.log('🎉 Setup Complete!');
console.log('\n📋 Next Steps:');
console.log('1. Start the backend: cd backend && npm run dev');
console.log('2. Start the frontend: cd frontend && npm start');
console.log('\n🔐 Test Credentials:');
console.log('Email: admin@example.com | Password: admin123');
console.log('Email: demo@example.com  | Password: demo123');
console.log('Email: test@example.com  | Password: test123');
console.log('\n🌐 URLs:');
console.log('Frontend: http://localhost:3000');
console.log('Backend: http://localhost:5001');
console.log('Health Check: http://localhost:5001/api/health');