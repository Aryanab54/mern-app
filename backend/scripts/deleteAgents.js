'use strict';

require('dotenv').config();
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function deleteAgents() {
  try {
    const agentsToDelete = [
      'mike.davis@company.com',
      'lisa.wilson@company.com', 
      'david.brown@company.com'
    ];

    console.log('Deleting 3 agents...');
    
    for (const email of agentsToDelete) {
      // First delete assignments
      const agent = await prisma.agent.findUnique({ where: { email } });
      if (agent) {
        await prisma.assignment.deleteMany({ where: { agentId: agent.id } });
        await prisma.agent.delete({ where: { email } });
        console.log(`✅ Deleted: ${email}`);
      } else {
        console.log(`⚠️  Not found: ${email}`);
      }
    }

    console.log('\n🎯 Agents deleted successfully!');

  } catch (error) {
    console.error('Error deleting agents:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAgents();