'use strict';

const jwt = require('jsonwebtoken');
const { authGuard, hashPassword, comparePassword, signToken, verifyToken } = require('../src/utils/authentication');

describe('Authentication Middleware & Utils', () => {
  const mockReq = () => ({
    headers: {},
    user: null
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Token Authentication', () => {
    test('should authenticate valid token', () => {
      const testUser = { id: 1, email: 'test@example.com' };
      const token = signToken(testUser);
      
      const req = mockReq();
      req.headers.authorization = `Bearer ${token}`;
      const res = mockRes();

      authGuard(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(req.user).toMatchObject(testUser);
    });

    test('should reject missing authorization header', () => {
      const req = mockReq();
      const res = mockRes();

      authGuard(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Unauthorized: Missing token'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should reject malformed authorization header', () => {
      const req = mockReq();
      req.headers.authorization = 'InvalidFormat token123';
      const res = mockRes();

      authGuard(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Unauthorized: Missing token'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should reject invalid token', () => {
      const req = mockReq();
      req.headers.authorization = 'Bearer invalid_token';
      const res = mockRes();

      authGuard(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Unauthorized: Invalid or expired token'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should reject expired token', () => {
      const testUser = { id: 1, email: 'test@example.com' };
      const expiredToken = jwt.sign(testUser, process.env.JWT_SECRET || 'change_this_in_env', { expiresIn: '-1h' });
      
      const req = mockReq();
      req.headers.authorization = `Bearer ${expiredToken}`;
      const res = mockRes();

      authGuard(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Unauthorized: Invalid or expired token'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('Password Utilities', () => {
    test('should hash password correctly', async () => {
      const password = 'testpassword123';
      const hashedPassword = await hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(50);
    });

    test('should compare passwords correctly', async () => {
      const password = 'testpassword123';
      const hashedPassword = await hashPassword(password);

      const isValid = await comparePassword(password, hashedPassword);
      const isInvalid = await comparePassword('wrongpassword', hashedPassword);

      expect(isValid).toBe(true);
      expect(isInvalid).toBe(false);
    });

    test('should handle password comparison errors', async () => {
      const result = await comparePassword('password', 'invalid_hash');
      expect(result).toBe(false);
    });
  });

  describe('Token Generation', () => {
    test('should generate valid JWT token', () => {
      const testUser = { id: 1, email: 'test@example.com' };
      const token = signToken(testUser);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      // Verify token can be decoded
      const decoded = verifyToken(token);
      expect(decoded.id).toBe(testUser.id);
      expect(decoded.email).toBe(testUser.email);
    });

    test('should generate different tokens for different users', () => {
      const user1 = { id: 1, email: 'user1@example.com' };
      const user2 = { id: 2, email: 'user2@example.com' };

      const token1 = signToken(user1);
      const token2 = signToken(user2);

      expect(token1).not.toBe(token2);
    });
  });
});