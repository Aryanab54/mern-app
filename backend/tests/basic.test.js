const request = require('supertest');
const app = require('../app');

describe('Basic API Tests', () => {
  describe('Server Health', () => {
    it('should return server health status', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Server is running');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('Route Validation', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Route not found');
    });
  });

  describe('Authentication Routes', () => {
    it('should have login route available', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      // Should fail validation but route should exist
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation error');
    });
  });

  describe('Protected Routes', () => {
    it('should require authentication for agent routes', async () => {
      const response = await request(app)
        .get('/api/agents');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized: Missing token');
    });

    it('should require authentication for lead routes', async () => {
      const response = await request(app)
        .get('/api/leads/distribution');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized: Missing token');
    });
  });
});