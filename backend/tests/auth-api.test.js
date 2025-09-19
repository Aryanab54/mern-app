const request = require('supertest');
const app = require('../app');
const { PrismaClient } = require('../generated/prisma');
const { hashPassword } = require('../src/utils/authentication');

const prisma = new PrismaClient();

describe('Authentication API', () => {
  beforeEach(async () => {
    // Use unique email for each test
    const testId = Date.now() + Math.random();
    const hashedPassword = await hashPassword('admin123');
    await prisma.admin.create({
      data: {
        email: `admin${testId}@example.com`,
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN'
      }
    });
  });

  afterAll(async () => {
    await prisma.admin.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      // Get the created admin email
      const admin = await prisma.admin.findFirst();
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: admin.email,
          password: 'admin123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe(admin.email);
      expect(response.body.data.user.role).toBe('ADMIN');
    });

    it('should fail with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@email.com',
          password: 'admin123'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should fail with invalid password', async () => {
      const admin = await prisma.admin.findFirst();
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: admin.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should fail with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation error');
    });
  });
});