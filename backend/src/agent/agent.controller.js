'use strict';

const agentService = require('./agent.service');

class AgentController {
  async createAgent(req, res) {
    try {
      const agent = await agentService.createAgent(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Agent created successfully',
        data: agent
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAllAgents(req, res) {
    try {
      const agents = await agentService.getAllAgents();
      
      res.status(200).json({
        success: true,
        data: agents
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAgentById(req, res) {
    try {
      const agent = await agentService.getAgentById(req.params.id);
      
      res.status(200).json({
        success: true,
        data: agent
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new AgentController();