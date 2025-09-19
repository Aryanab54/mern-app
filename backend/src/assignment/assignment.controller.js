'use strict';

const assignmentService = require('./assignment.service');

class AssignmentController {
  async getAllAssignments(req, res) {
    try {
      const assignments = await assignmentService.getAllAssignments();
      
      res.status(200).json({
        success: true,
        data: assignments
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAssignmentsByAgent(req, res) {
    try {
      const assignments = await assignmentService.getAssignmentsByAgent(req.params.agentId);
      
      res.status(200).json({
        success: true,
        data: assignments
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAssignmentStats(req, res) {
    try {
      const stats = await assignmentService.getAssignmentStats();
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new AssignmentController();