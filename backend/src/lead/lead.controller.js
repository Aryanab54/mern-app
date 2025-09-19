'use strict';

const leadService = require('./lead.service');

class LeadController {
  async uploadLeads(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const result = await leadService.uploadAndDistributeLeads(req.file.path);
      
      res.status(200).json({
        success: true,
        message: 'Leads uploaded and distributed successfully',
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getLeadDistribution(req, res) {
    try {
      const distribution = await leadService.getLeadDistribution();
      
      res.status(200).json({
        success: true,
        data: distribution
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAgentLeads(req, res) {
    try {
      const leads = await leadService.getAgentLeads(req.params.agentId);
      
      res.status(200).json({
        success: true,
        data: leads
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new LeadController();