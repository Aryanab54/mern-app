'use strict';

const fs = require('fs');
const path = require('path');
const csvParser = require('../src/utils/csvParser');

describe('CSV Parser Utility', () => {
  const testDir = __dirname;

  afterEach(() => {
    // Cleanup test files
    const testFiles = ['test-parser.csv', 'test-parser.xlsx', 'invalid.txt'];
    testFiles.forEach(file => {
      const filePath = path.join(testDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  });

  describe('CSV Parsing', () => {
    test('should parse valid CSV file', async () => {
      const csvContent = 'FirstName,Phone,Notes\nJohn,+12345678901,Test note\nJane,+12345678902,Another note';
      const filePath = path.join(testDir, 'test-parser.csv');
      fs.writeFileSync(filePath, csvContent);

      const result = await csvParser.parseFile(filePath);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        firstName: 'John',
        phone: '+12345678901',
        notes: 'Test note'
      });
      expect(result[1]).toEqual({
        firstName: 'Jane',
        phone: '+12345678902',
        notes: 'Another note'
      });
    });

    test('should handle CSV with missing notes', async () => {
      const csvContent = 'FirstName,Phone,Notes\nJohn,+12345678901,\nJane,+12345678902,';
      const filePath = path.join(testDir, 'test-parser.csv');
      fs.writeFileSync(filePath, csvContent);

      const result = await csvParser.parseFile(filePath);

      expect(result).toHaveLength(2);
      expect(result[0].notes).toBe('');
      expect(result[1].notes).toBe('');
    });

    test('should filter out rows with missing required fields', async () => {
      const csvContent = 'FirstName,Phone,Notes\nJohn,+12345678901,Valid\n,+12345678902,Missing name\nJane,,Missing phone';
      const filePath = path.join(testDir, 'test-parser.csv');
      fs.writeFileSync(filePath, csvContent);

      const result = await csvParser.parseFile(filePath);

      expect(result).toHaveLength(1);
      expect(result[0].firstName).toBe('John');
    });

    test('should reject empty CSV file', async () => {
      const csvContent = 'FirstName,Phone,Notes\n';
      const filePath = path.join(testDir, 'test-parser.csv');
      fs.writeFileSync(filePath, csvContent);

      await expect(csvParser.parseFile(filePath)).rejects.toThrow('No valid data found');
    });

    test('should handle CSV parsing errors', async () => {
      const csvContent = 'Invalid CSV content with "unclosed quotes';
      const filePath = path.join(testDir, 'test-parser.csv');
      fs.writeFileSync(filePath, csvContent);

      await expect(csvParser.parseFile(filePath)).rejects.toThrow('No valid data found');
    });
  });

  describe('Excel Parsing', () => {
    test('should parse valid Excel file', async () => {
      const XLSX = require('xlsx');
      const testData = [
        { FirstName: 'John', Phone: '+12345678901', Notes: 'Test note' },
        { FirstName: 'Jane', Phone: '+12345678902', Notes: 'Another note' }
      ];
      
      const ws = XLSX.utils.json_to_sheet(testData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      
      const filePath = path.join(testDir, 'test-parser.xlsx');
      XLSX.writeFile(wb, filePath);

      const result = await csvParser.parseFile(filePath);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        firstName: 'John',
        phone: '+12345678901',
        notes: 'Test note'
      });
    });

    test('should handle Excel with missing data', async () => {
      const XLSX = require('xlsx');
      const testData = [
        { FirstName: 'John', Phone: '+12345678901' }, // Missing Notes
        { FirstName: '', Phone: '+12345678902', Notes: 'Missing name' }, // Missing FirstName
        { FirstName: 'Jane', Phone: '', Notes: 'Missing phone' } // Missing Phone
      ];
      
      const ws = XLSX.utils.json_to_sheet(testData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      
      const filePath = path.join(testDir, 'test-parser.xlsx');
      XLSX.writeFile(wb, filePath);

      const result = await csvParser.parseFile(filePath);

      expect(result).toHaveLength(1);
      expect(result[0].firstName).toBe('John');
      expect(result[0].notes).toBe('');
    });

    test('should reject empty Excel file', async () => {
      const XLSX = require('xlsx');
      const ws = XLSX.utils.json_to_sheet([]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      
      const filePath = path.join(testDir, 'test-parser.xlsx');
      XLSX.writeFile(wb, filePath);

      await expect(csvParser.parseFile(filePath)).rejects.toThrow('No valid data found');
    });
  });

  describe('File Format Validation', () => {
    test('should reject unsupported file formats', async () => {
      const filePath = path.join(testDir, 'invalid.txt');
      fs.writeFileSync(filePath, 'Some text content');

      await expect(csvParser.parseFile(filePath)).rejects.toThrow('Unsupported file format');
    });
  });

  describe('Lead Distribution', () => {
    test('should distribute leads evenly among agents', () => {
      const leads = [
        { firstName: 'Lead1', phone: '+1', notes: '' },
        { firstName: 'Lead2', phone: '+2', notes: '' },
        { firstName: 'Lead3', phone: '+3', notes: '' },
        { firstName: 'Lead4', phone: '+4', notes: '' },
        { firstName: 'Lead5', phone: '+5', notes: '' }
      ];

      const distribution = csvParser.distributeLeads(leads, 2);

      expect(distribution).toHaveLength(2);
      expect(distribution[0]).toHaveLength(3); // 3 leads
      expect(distribution[1]).toHaveLength(2); // 2 leads
    });

    test('should handle more agents than leads', () => {
      const leads = [
        { firstName: 'Lead1', phone: '+1', notes: '' },
        { firstName: 'Lead2', phone: '+2', notes: '' }
      ];

      const distribution = csvParser.distributeLeads(leads, 5);

      expect(distribution).toHaveLength(5);
      expect(distribution[0]).toHaveLength(1);
      expect(distribution[1]).toHaveLength(1);
      expect(distribution[2]).toHaveLength(0);
      expect(distribution[3]).toHaveLength(0);
      expect(distribution[4]).toHaveLength(0);
    });

    test('should handle single agent', () => {
      const leads = [
        { firstName: 'Lead1', phone: '+1', notes: '' },
        { firstName: 'Lead2', phone: '+2', notes: '' }
      ];

      const distribution = csvParser.distributeLeads(leads, 1);

      expect(distribution).toHaveLength(1);
      expect(distribution[0]).toHaveLength(2);
    });

    test('should handle empty leads array', () => {
      const distribution = csvParser.distributeLeads([], 3);

      expect(distribution).toHaveLength(3);
      expect(distribution[0]).toHaveLength(0);
      expect(distribution[1]).toHaveLength(0);
      expect(distribution[2]).toHaveLength(0);
    });
  });
});