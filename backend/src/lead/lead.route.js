'use strict';

const express = require('express');
const leadController = require('./lead.controller');
const { upload } = require('../utils/multer');
const { validateFile, uploadFileSchema } = require('../utils/validation');
const { authGuard, requireRole } = require('../utils/authentication');

const router = express.Router();

router.post('/upload', 
  authGuard, 
  requireRole('ADMIN'), 
  upload.single('file'), 
  validateFile(uploadFileSchema), 
  leadController.uploadLeads
);

router.get('/distribution', 
  authGuard, 
  requireRole('ADMIN'), 
  leadController.getLeadDistribution
);

router.get('/agent/:agentId', 
  authGuard, 
  requireRole('ADMIN'), 
  leadController.getAgentLeads
);

module.exports = router;