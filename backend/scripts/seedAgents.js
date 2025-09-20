'use strict';

require('dotenv').config();
const { PrismaClient } = require('../generated/prisma');
const { hashPassword } = require('../src/utils/authentication');

const prisma = new PrismaClient();

async function seedAgents() {
  try {
    const agents = [
      { name: 'John Smith', email: 'john.smith@company.com', phone: '+1-555-0101', password: 'agent123' },
      { name: 'Sarah Johnson', email: 'sarah.johnson@company.com', phone: '+1-555-0102', password: 'agent123' },
      { name: 'Mike Davis', email: 'mike.davis@company.com', phone: '+1-555-0103', password: 'agent123' },
      { name: 'Lisa Wilson', email: 'lisa.wilson@company.com', phone: '+1-555-0104', password: 'agent123' },
      { name: 'David Brown', email: 'david.brown@company.com', phone: '+1-555-0105', password: 'agent123' }
    ];

    console.log('Creating 5 agents for distribution...');
    
    for (const agentData of agents) {
      const existing = await prisma.agent.findUnique({ where: { email: agentData.email } });
      
      if (!existing) {
        const hashedPassword = await hashPassword(agentData.password);
        await prisma.agent.create({
          data: {
            name: agentData.name,
            email: agentData.email,
            phone: agentData.phone,
            password: hashedPassword
          }
        });
        console.log(`✅ Created: ${agentData.name}`);
      } else {
        console.log(`⚠️  Exists: ${agentData.name}`);
      }
    }

    console.log('\n🎯 5 agents ready for CSV distribution!');

  } catch (error) {
    console.error('Error creating agents:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAgents();