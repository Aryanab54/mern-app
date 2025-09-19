'use strict';

const { PrismaClient } = require('../../generated/prisma');
const { comparePassword, signToken } = require('../utils/authentication');

const prisma = new PrismaClient();

class LoginService {
  async authenticateAdmin(email, password) {
    const admin = await prisma.admin.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, role: true, password: true }
    });

    if (!admin) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await comparePassword(password, admin.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = signToken({
      id: admin.id,
      email: admin.email,
      role: admin.role
    });

    return {
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    };
  }
}

module.exports = new LoginService();