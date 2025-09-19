const { hashPassword, comparePassword, signToken, verifyToken } = require('../src/utils/authentication');
const csvParser = require('../src/utils/csvParser');
const path = require('path');
const fs = require('fs');

describe('Utils', () => {
  describe('Authentication Utils', () => {
    it('should hash and compare passwords', async () => {
      const password = 'testpassword123';
      const hashed = await hashPassword(password);
      
      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(password);
      
      const isValid = await comparePassword(password, hashed);
      expect(isValid).toBe(true);
      
      const isInvalid = await comparePassword('wrongpassword', hashed);
      expect(isInvalid).toBe(false);
    });

    it('should create and verify JWT tokens', () => {
      const payload = { id: 1, email: 'test@test.com', role: 'ADMIN' };
      const token = signToken(payload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      
      const decoded = verifyToken(token);
      expect(decoded.id).toBe(payload.id);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
    });
  });

  describe('CSV Parser', () => {
    it('should parse CSV content correctly', async () => {
      const csvContent = 'FirstName,Phone,Notes\nJohn,+1234567890,Test note\nJane,+1234567891,Another note';
      const testFilePath = path.join(__dirname, 'test-parse.csv');
      fs.writeFileSync(testFilePath, csvContent);

      const result = await csvParser.parseFile(testFilePath);
      
      expect(result).toHaveLength(2);
      expect(result[0].firstName).toBe('John');
      expect(result[0].phone).toBe('+1234567890');
      expect(result[1].firstName).toBe('Jane');

      // Cleanup
      fs.unlinkSync(testFilePath);
    });

    it('should distribute leads equally', () => {
      const leads = [
        { firstName: 'John', phone: '+1', notes: '' },
        { firstName: 'Jane', phone: '+2', notes: '' },
        { firstName: 'Bob', phone: '+3', notes: '' },
        { firstName: 'Alice', phone: '+4', notes: '' },
        { firstName: 'Charlie', phone: '+5', notes: '' }
      ];

      const distribution = csvParser.distributeLeads(leads, 3);
      
      expect(distribution).toHaveLength(3);
      expect(distribution[0]).toHaveLength(2); // 5 % 3 = 2 remainder, so first agent gets 2
      expect(distribution[1]).toHaveLength(2); // second agent gets 2
      expect(distribution[2]).toHaveLength(1); // third agent gets 1
    });
  });
});