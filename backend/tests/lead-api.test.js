const request = require('supertest');
const app = require('../app');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('../generated/prisma');
const { hashPassword, signToken } = require('../src/utils/authentication');

const prisma = new PrismaClient();

describe('Lead API', () => {
  let adminToken;

  beforeEach(async () => {
    const testId = Date.now() + Math.random();
    const hashedPassword = await hashPassword('admin123');
    const admin = await prisma.admin.create({
      data: {
        email: `admin${testId}@example.com`,
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN'
      }
    });

    adminToken = signToken({
      id: admin.id,
      email: admin.email,
      role: admin.role
    });

    // Create test agents
    for (let i = 1; i <= 3; i++) {
      await prisma.agent.create({
        data: {
          name: `Agent ${i}`,
          email: `agent${testId}${i}@test.com`,
          phone: `+1234567890${i}`,
          password: await hashPassword('agent123')
        }
      });
    }
  });

  afterAll(async () => {
    await prisma.assignment.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.agent.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/leads/upload', () => {
    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/leads/upload');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized: Missing token');
    });
  });

  describe('GET /api/leads/distribution', () => {
    beforeEach(async () => {
      // Create some test leads and assignments
      const agents = await prisma.agent.findMany();
      const lead = await prisma.lead.create({
        data: {
          firstName: 'Test Lead',
          phone: '+1234567890',
          notes: 'Test note'
        }
      });

      await prisma.assignment.create({
        data: {
          agentId: agents[0].id,
          leadId: lead.id
        }
      });
    });

    it('should get lead distribution', async () => {
      const response = await request(app)
        .get('/api/leads/distribution')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/leads/distribution');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/leads/agent/:agentId', () => {
    let agentId;

    beforeEach(async () => {
      const agents = await prisma.agent.findMany();
      agentId = agents[0].id;

      const lead = await prisma.lead.create({
        data: {
          firstName: 'Test Lead',
          phone: '+1234567890',
          notes: 'Test note'
        }
      });

      await prisma.assignment.create({
        data: {
          agentId: agentId,
          leadId: lead.id
        }
      });
    });

    it('should get agent leads', async () => {
      const response = await request(app)
        .get(`/api/leads/agent/${agentId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get(`/api/leads/agent/${agentId}`);

      expect(response.status).toBe(401);
    });
  });
});