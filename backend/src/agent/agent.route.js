'use strict';

const express = require('express');
const agentController = require('./agent.controller');
const { validateBody, createAgentSchema } = require('../utils/validation');
const { authGuard, requireRole } = require('../utils/authentication');

const router = express.Router();

router.post('/', authGuard, requireRole('ADMIN'), validateBody(createAgentSchema), agentController.createAgent);
router.get('/', authGuard, requireRole('ADMIN'), agentController.getAllAgents);
router.get('/:id', authGuard, requireRole('ADMIN'), agentController.getAgentById);

module.exports = router;