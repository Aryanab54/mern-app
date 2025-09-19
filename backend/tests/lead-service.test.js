'use strict';

const fs = require('fs');
const path = require('path');
const leadService = require('../src/lead/lead.service');
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

describe('Lead Service', () => {
  let testAgent1, testAgent2;

  beforeEach(async () => {
    // Create test agents
    testAgent1 = await prisma.agent.create({
      data: {
        name: 'Test Agent 1',
        email: `agent1_${Date.now()}@test.com`,
        phone: '+12345678901',
        password: 'password123'
      }
    });

    testAgent2 = await prisma.agent.create({
      data: {
        name: 'Test Agent 2',
        email: `agent2_${Date.now()}@test.com`,
        phone: '+12345678902',
        password: 'password123'
      }
    });
  });

  afterEach(() => {
    // Cleanup test files
    const testFiles = ['test-service.csv', 'test-service.xlsx'];
    testFiles.forEach(file => {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  });

  describe('Upload and Distribute Leads', () => {
    test('should upload and distribute leads successfully', async () => {
      // Create test CSV file
      const csvContent = 'FirstName,Phone,Notes\nJohn,+12345678901,Test note\nJane,+12345678902,Another note';
      const filePath = path.join(__dirname, 'test-service.csv');
      fs.writeFileSync(filePath, csvContent);

      const result = await leadService.uploadAndDistributeLeads(filePath);

      expect(result.totalLeads).toBe(2);
      expect(result.totalAgents).toBe(2);
      expect(result.assignments).toHaveLength(2);
      expect(result.distribution).toHaveLength(2);

      // Verify file was cleaned up
      expect(fs.existsSync(filePath)).toBe(false);
    });

    test('should handle Excel file upload', async () => {
      const XLSX = require('xlsx');
      const testData = [
        { FirstName: 'John', Phone: '+12345678901', Notes: 'Test note' },
        { FirstName: 'Jane', Phone: '+12345678902', Notes: 'Another note' }
      ];
      
      const ws = XLSX.utils.json_to_sheet(testData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      
      const filePath = path.join(__dirname, 'test-service.xlsx');
      XLSX.writeFile(wb, filePath);

      const result = await leadService.uploadAndDistributeLeads(filePath);

      expect(result.totalLeads).toBe(2);
      expect(result.assignments).toHaveLength(2);
      expect(fs.existsSync(filePath)).toBe(false);
    });

    test('should distribute leads evenly', async () => {
      // Create CSV with 5 leads for 2 agents
      const csvContent = 'FirstName,Phone,Notes\n' +
        'Lead1,+12345678901,Note1\n' +
        'Lead2,+12345678902,Note2\n' +
        'Lead3,+12345678903,Note3\n' +
        'Lead4,+12345678904,Note4\n' +
        'Lead5,+12345678905,Note5';
      
      const filePath = path.join(__dirname, 'test-service.csv');
      fs.writeFileSync(filePath, csvContent);

      const result = await leadService.uploadAndDistributeLeads(filePath);

      expect(result.totalLeads).toBe(5);
      expect(result.distribution[0].leadsCount).toBe(3); // First agent gets 3
      expect(result.distribution[1].leadsCount).toBe(2); // Second agent gets 2
    });

    test('should handle error when no agents exist', async () => {
      // Delete all agents
      await prisma.assignment.deleteMany();
      await prisma.agent.deleteMany();

      const csvContent = 'FirstName,Phone,Notes\nJohn,+12345678901,Test note';
      const filePath = path.join(__dirname, 'test-service.csv');
      fs.writeFileSync(filePath, csvContent);

      await expect(leadService.uploadAndDistributeLeads(filePath))
        .rejects.toThrow('No agents found');

      // Verify file was cleaned up even on error
      expect(fs.existsSync(filePath)).toBe(false);
    });

    test('should clean up file on parsing error', async () => {
      const invalidContent = 'Invalid CSV content';
      const filePath = path.join(__dirname, 'test-service.csv');
      fs.writeFileSync(filePath, invalidContent);

      await expect(leadService.uploadAndDistributeLeads(filePath))
        .rejects.toThrow();

      // Verify file was cleaned up
      expect(fs.existsSync(filePath)).toBe(false);
    });

    test('should clean up file on parsing error', async () => {
      // Create CSV with no valid data to trigger parsing error
      const csvContent = 'FirstName,Phone,Notes\n,,';
      const filePath = path.join(__dirname, 'test-service.csv');
      fs.writeFileSync(filePath, csvContent);

      await expect(leadService.uploadAndDistributeLeads(filePath))
        .rejects.toThrow('No valid data found');

      // Verify file was cleaned up
      expect(fs.existsSync(filePath)).toBe(false);
    });
  });

  describe('Get Lead Distribution', () => {
    test('should return lead distribution', async () => {
      // Create test leads and assignments
      const lead1 = await prisma.lead.create({
        data: { firstName: 'John', phone: '+12345678901', notes: 'Test' }
      });
      
      const lead2 = await prisma.lead.create({
        data: { firstName: 'Jane', phone: '+12345678902', notes: 'Test' }
      });

      await prisma.assignment.create({
        data: { agentId: testAgent1.id, leadId: lead1.id }
      });

      await prisma.assignment.create({
        data: { agentId: testAgent2.id, leadId: lead2.id }
      });

      const distribution = await leadService.getLeadDistribution();

      expect(distribution).toHaveLength(2);
      expect(distribution[0].agent).toBeDefined();
      expect(distribution[0].leads).toHaveLength(1);
    });

    test('should return empty array when no assignments exist', async () => {
      const distribution = await leadService.getLeadDistribution();
      expect(distribution).toHaveLength(0);
    });

    test('should group leads by agent correctly', async () => {
      // Create multiple leads for same agent
      const lead1 = await prisma.lead.create({
        data: { firstName: 'John', phone: '+12345678901', notes: 'Test' }
      });
      
      const lead2 = await prisma.lead.create({
        data: { firstName: 'Jane', phone: '+12345678902', notes: 'Test' }
      });

      await prisma.assignment.create({
        data: { agentId: testAgent1.id, leadId: lead1.id }
      });

      await prisma.assignment.create({
        data: { agentId: testAgent1.id, leadId: lead2.id }
      });

      const distribution = await leadService.getLeadDistribution();

      expect(distribution).toHaveLength(1);
      expect(distribution[0].leads).toHaveLength(2);
      expect(distribution[0].agent.id).toBe(testAgent1.id);
    });
  });

  describe('Get Agent Leads', () => {
    test('should return leads for specific agent', async () => {
      const lead = await prisma.lead.create({
        data: { firstName: 'John', phone: '+12345678901', notes: 'Test' }
      });

      await prisma.assignment.create({
        data: { agentId: testAgent1.id, leadId: lead.id }
      });

      const leads = await leadService.getAgentLeads(testAgent1.id);

      expect(leads).toHaveLength(1);
      expect(leads[0].firstName).toBe('John');
    });

    test('should return empty array for agent with no leads', async () => {
      const leads = await leadService.getAgentLeads(testAgent1.id);
      expect(leads).toHaveLength(0);
    });

    test('should handle string agent ID', async () => {
      const lead = await prisma.lead.create({
        data: { firstName: 'John', phone: '+12345678901', notes: 'Test' }
      });

      await prisma.assignment.create({
        data: { agentId: testAgent1.id, leadId: lead.id }
      });

      const leads = await leadService.getAgentLeads(testAgent1.id.toString());

      expect(leads).toHaveLength(1);
    });

    test('should return leads in descending order by assignment creation date', async () => {
      const lead1 = await prisma.lead.create({
        data: { firstName: 'John', phone: '+12345678901', notes: 'First' }
      });

      const lead2 = await prisma.lead.create({
        data: { firstName: 'Jane', phone: '+12345678902', notes: 'Second' }
      });

      // Create first assignment
      await prisma.assignment.create({
        data: { agentId: testAgent1.id, leadId: lead1.id }
      });

      // Wait to ensure different timestamps for assignments
      await new Promise(resolve => setTimeout(resolve, 50));

      // Create second assignment
      await prisma.assignment.create({
        data: { agentId: testAgent1.id, leadId: lead2.id }
      });

      const leads = await leadService.getAgentLeads(testAgent1.id);

      expect(leads).toHaveLength(2);
      // Since assignments are ordered by createdAt desc, the second assignment (lead2) should come first
      expect(leads[0].notes).toBe('Second'); // Most recent assignment first
      expect(leads[1].notes).toBe('First');
    });
  });
});