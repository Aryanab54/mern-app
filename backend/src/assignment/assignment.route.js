'use strict';

const express = require('express');
const assignmentController = require('./assignment.controller');
const { authGuard, requireRole } = require('../utils/authentication');

const router = express.Router();

router.get('/', authGuard, requireRole('ADMIN'), assignmentController.getAllAssignments);
router.get('/agent/:agentId', authGuard, requireRole('ADMIN'), assignmentController.getAssignmentsByAgent);
router.get('/stats', authGuard, requireRole('ADMIN'), assignmentController.getAssignmentStats);

module.exports = router;