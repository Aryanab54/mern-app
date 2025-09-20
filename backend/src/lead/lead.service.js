'use strict';

const { PrismaClient } = require('../../generated/prisma');
const csvParser = require('../utils/csvParser');
const fs = require('fs');

const prisma = new PrismaClient();

class LeadService {
  async uploadAndDistributeLeads(filePath) {
    try {
      // Parse the uploaded file
      const leads = await csvParser.parseFile(filePath);
      
      // Get all agents
      const agents = await prisma.agent.findMany({
        select: { id: true, name: true, email: true }
      });

      if (agents.length === 0) {
        throw new Error('No agents found. Please create agents first.');
      }

      // Distribute leads among agents
      const distributedLeads = csvParser.distributeLeads(leads, agents.length);
      
      // Save leads and assignments to database
      const result = await prisma.$transaction(async (tx) => {
        const savedLeads = [];
        const assignments = [];

        for (let agentIndex = 0; agentIndex < distributedLeads.length; agentIndex++) {
          const agentLeads = distributedLeads[agentIndex];
          const agent = agents[agentIndex];

          for (const leadData of agentLeads) {
            // Create lead
            const lead = await tx.lead.create({
              data: {
                firstName: leadData.firstName,
                phone: leadData.phone,
                notes: leadData.notes
              }
            });

            // Create assignment
            const assignment = await tx.assignment.create({
              data: {
                agentId: agent.id,
                leadId: lead.id
              },
              include: {
                agent: {
                  select: { id: true, name: true, email: true }
                },
                lead: true
              }
            });

            savedLeads.push(lead);
            assignments.push(assignment);
          }
        }

        return { savedLeads, assignments };
      });

      // Clean up uploaded file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return {
        totalLeads: leads.length,
        totalAgents: agents.length,
        assignments: result.assignments,
        distribution: agents.map((agent, index) => ({
          agent: agent,
          leadsCount: distributedLeads[index].length
        }))
      };

    } catch (error) {
      // Clean up file on error
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw error;
    }
  }

  async getLeadDistribution() {
    const assignments = await prisma.assignment.findMany({
      include: {
        agent: {
          select: { id: true, name: true, email: true }
        },
        lead: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Group by agent
    const distribution = {};
    assignments.forEach(assignment => {
      const agentId = assignment.agent.id;
      if (!distribution[agentId]) {
        distribution[agentId] = {
          agentId: assignment.agent.id,
          agentName: assignment.agent.name,
          lists: []
        };
      }
      distribution[agentId].lists.push({
        firstName: assignment.lead.firstName,
        phone: assignment.lead.phone,
        notes: assignment.lead.notes,
        assignedAt: assignment.createdAt
      });
    });

    return Object.values(distribution);
  }

  async getAgentLeads(agentId) {
    const assignments = await prisma.assignment.findMany({
      where: { agentId: parseInt(agentId) },
      include: {
        lead: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return assignments.map(assignment => assignment.lead);
  }
}

module.exports = new LeadService();