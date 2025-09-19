'use strict';

const express = require('express');
const loginController = require('./login.controller');
const { validateBody, loginSchema } = require('../utils/validation');

const router = express.Router();

router.post('/login', validateBody(loginSchema), loginController.login);

module.exports = router;