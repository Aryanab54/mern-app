const request = require('supertest');
const app = require('../app');
const { PrismaClient } = require('../generated/prisma');
const { hashPassword, signToken } = require('../src/utils/authentication');

const prisma = new PrismaClient();

describe('Agent API', () => {
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
  });

  afterAll(async () => {
    await prisma.agent.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/agents', () => {
    it('should create agent with valid data', async () => {
      const testId = Date.now() + Math.random();
      const agentData = {
        name: 'Test Agent',
        email: `agent${testId}@test.com`,
        phone: '+12345678901', // Valid US format
        password: 'agent123'
      };

      const response = await request(app)
        .post('/api/agents')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(agentData);

      if (response.status !== 201) {
        console.log('Agent creation failed:', response.body);
      }
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(agentData.name);
      expect(response.body.data.email).toBe(agentData.email);
      expect(response.body.data.phone).toBe('+12345678901');
      expect(response.body.data.password).toBeUndefined();
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/agents')
        .send({
          name: 'Test Agent',
          email: 'agent@test.com',
          phone: '+1234567890',
          password: 'agent123'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized: Missing token');
    });

    it('should fail with invalid phone format', async () => {
      const response = await request(app)
        .post('/api/agents')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Agent',
          email: 'agent@test.com',
          phone: 'invalid-phone',
          password: 'agent123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation error');
    });
  });

  describe('GET /api/agents', () => {
    beforeEach(async () => {
      const testId = Date.now() + Math.random();
      const hashedPassword = await hashPassword('agent123');
      await prisma.agent.create({
        data: {
          name: 'Test Agent',
          email: `agent${testId}@test.com`,
          phone: '+12345678901',
          password: hashedPassword
        }
      });
    });

    it('should get all agents', async () => {
      const response = await request(app)
        .get('/api/agents')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Test Agent');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/agents');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/agents/:id', () => {
    let agentId;

    beforeEach(async () => {
      const testId = Date.now() + Math.random();
      const hashedPassword = await hashPassword('agent123');
      const agent = await prisma.agent.create({
        data: {
          name: 'Test Agent',
          email: `agent${testId}@test.com`,
          phone: '+12345678901',
          password: hashedPassword
        }
      });
      agentId = agent.id;
    });

    it('should get specific agent', async () => {
      const response = await request(app)
        .get(`/api/agents/${agentId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(agentId);
      expect(response.body.data.name).toBe('Test Agent');
    });

    it('should fail for non-existent agent', async () => {
      const response = await request(app)
        .get('/api/agents/99999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});