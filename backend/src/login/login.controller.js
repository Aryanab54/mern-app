'use strict';

const loginService = require('./login.service');

class LoginController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await loginService.authenticateAdmin(email, password);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new LoginController();