const request = require('supertest');
const app = require('../app');
const { PrismaClient } = require('../generated/prisma');
const { hashPassword, signToken } = require('../src/utils/authentication');

const prisma = new PrismaClient();

describe('Assignment API', () => {
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

    // Create test data
    const agent = await prisma.agent.create({
      data: {
        name: 'Test Agent',
        email: `agent${testId}@test.com`,
        phone: '+12345678901',
        password: await hashPassword('agent123')
      }
    });

    const lead = await prisma.lead.create({
      data: {
        firstName: 'Test Lead',
        phone: '+12345678901',
        notes: 'Test note'
      }
    });

    await prisma.assignment.create({
      data: {
        agentId: agent.id,
        leadId: lead.id
      }
    });
  });

  afterAll(async () => {
    await prisma.assignment.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.agent.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.$disconnect();
  });

  describe('GET /api/assignments', () => {
    it('should get all assignments', async () => {
      const response = await request(app)
        .get('/api/assignments')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].agent).toBeDefined();
      expect(response.body.data[0].lead).toBeDefined();
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/assignments');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized: Missing token');
    });
  });

  describe('GET /api/assignments/stats', () => {
    it('should get assignment statistics', async () => {
      const response = await request(app)
        .get('/api/assignments/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.totalAssignments).toBe(1);
      expect(response.body.data.totalLeads).toBe(1);
      expect(response.body.data.totalAgents).toBe(1);
      expect(Array.isArray(response.body.data.agentStats)).toBe(true);
      expect(response.body.data.agentStats).toHaveLength(1);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/assignments/stats');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/assignments/agent/:agentId', () => {
    let agentId;

    beforeEach(async () => {
      const agents = await prisma.agent.findMany();
      agentId = agents[0].id;
    });

    it('should get assignments by agent', async () => {
      const response = await request(app)
        .get(`/api/assignments/agent/${agentId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });

    it('should return empty array for agent with no assignments', async () => {
      // Create another agent with no assignments
      const testId2 = Date.now() + Math.random();
      const newAgent = await prisma.agent.create({
        data: {
          name: 'New Agent',
          email: `newagent${testId2}@test.com`,
          phone: '+12345678999',
          password: await hashPassword('agent123')
        }
      });

      const response = await request(app)
        .get(`/api/assignments/agent/${newAgent.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get(`/api/assignments/agent/${agentId}`);

      expect(response.status).toBe(401);
    });
  });
});