'use strict';

require('dotenv').config();
const { PrismaClient } = require('../generated/prisma');
const { hashPassword } = require('../src/utils/authentication');

const prisma = new PrismaClient();

async function seedAdmin() {
  try {
    const users = [
      { email: 'admin@example.com', password: 'admin123', name: 'Admin User', role: 'ADMIN' },
      { email: 'demo@example.com', password: 'demo123', name: 'Demo Admin', role: 'ADMIN' },
      { email: 'test@example.com', password: 'test123', name: 'Test Admin', role: 'ADMIN' }
    ];

    console.log('Creating admin users...');
    
    for (const userData of users) {
      const existing = await prisma.admin.findUnique({ where: { email: userData.email } });
      
      if (!existing) {
        const hashedPassword = await hashPassword(userData.password);
        await prisma.admin.create({
          data: {
            email: userData.email,
            password: hashedPassword,
            name: userData.name,
            role: userData.role
          }
        });
        console.log(`✅ Created: ${userData.email}`);
      } else {
        console.log(`⚠️  Exists: ${userData.email}`);
      }
    }

    console.log('\n🔐 Login Credentials:');
    console.log('Email: admin@example.com | Password: admin123');
    console.log('Email: demo@example.com  | Password: demo123');
    console.log('Email: test@example.com  | Password: test123');

  } catch (error) {
    console.error('Error creating admin users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();