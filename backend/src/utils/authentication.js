'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Environment
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_in_env';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

// Helpers: Password hashing and comparison
async function hashPassword(plain, saltRounds = 10) {
  if (!plain || typeof plain !== 'string') throw new Error('Password must be a non-empty string');
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(plain, salt);
}

async function comparePassword(plain, hash) {
  if (!plain || !hash) return false;
  return bcrypt.compare(plain, hash);
}

// Helpers: Token creation and verification
function signToken(payload, options = {}) {
  if (!JWT_SECRET || JWT_SECRET === 'change_this_in_env') {
    // Do not block in dev but warn
    // console.warn('JWT_SECRET is not set. Use a strong secret in .env');
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN, ...options });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

function getTokenFromReq(req) {
  // Authorization: Bearer <token>
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (authHeader && typeof authHeader === 'string') {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      return parts[1];
    }
  }
  // Cookie fallback (if using cookie-parser and storing as "token")
  if (req.cookies && req.cookies.token) return req.cookies.token;
  return null;
}

// Express middleware: strict auth
function authGuard(req, res, next) {
  const token = getTokenFromReq(req);
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
  req.user = decoded;
  return next();
}

// Express middleware: optional auth (attach user if present)
function optionalAuth(req, res, next) {
  const token = getTokenFromReq(req);
  if (!token) return next();
  const decoded = verifyToken(token);
  if (decoded) req.user = decoded;
  return next();
}

// Role-based guard
function requireRole(...allowedRoles) {
  return function roleGuard(req, res, next) {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Forbidden: Missing user role' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }
    return next();
  };
}

module.exports = {
  // password helpers
  hashPassword,
  comparePassword,
  // jwt helpers
  signToken,
  verifyToken,
  getTokenFromReq,
  // express middlewares
  authGuard,
  optionalAuth,
  requireRole,
};
