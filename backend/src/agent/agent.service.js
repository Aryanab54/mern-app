'use strict';

const { PrismaClient } = require('../../generated/prisma');
const { hashPassword } = require('../utils/authentication');

const prisma = new PrismaClient();

class AgentService {
  async createAgent(agentData) {
    const { name, email, phone, password } = agentData;

    // Check if agent already exists
    const existingAgent = await prisma.agent.findUnique({
      where: { email }
    });

    if (existingAgent) {
      throw new Error('Agent with this email already exists');
    }

    const hashedPassword = await hashPassword(password);

    const agent = await prisma.agent.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true
      }
    });

    return agent;
  }

  async getAllAgents() {
    return await prisma.agent.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        _count: {
          select: { assigned: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getAgentById(id) {
    const agent = await prisma.agent.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        assigned: {
          include: {
            lead: true
          }
        }
      }
    });

    if (!agent) {
      throw new Error('Agent not found');
    }

    return agent;
  }
}

module.exports = new AgentService();