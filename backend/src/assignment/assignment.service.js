'use strict';

const { PrismaClient } = require('../../generated/prisma');

const prisma = new PrismaClient();

class AssignmentService {
  async getAllAssignments() {
    return await prisma.assignment.findMany({
      include: {
        agent: {
          select: { id: true, name: true, email: true }
        },
        lead: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getAssignmentsByAgent(agentId) {
    return await prisma.assignment.findMany({
      where: { agentId: parseInt(agentId) },
      include: {
        lead: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getAssignmentStats() {
    const totalAssignments = await prisma.assignment.count();
    const totalLeads = await prisma.lead.count();
    const totalAgents = await prisma.agent.count();
    
    const agentStats = await prisma.agent.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: { assigned: true }
        }
      }
    });

    return {
      totalAssignments,
      totalLeads,
      totalAgents,
      agentStats
    };
  }
}

module.exports = new AssignmentService();