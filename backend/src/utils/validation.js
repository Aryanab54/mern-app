'use strict';

const Joi = require('joi');
const { parsePhoneNumberFromString } = require('libphonenumber-js');

// Custom phone validator with country code
const phoneWithCountryCode = Joi.string().custom((value, helpers) => {
  try {
    const phone = parsePhoneNumberFromString(value);
    if (!phone || !phone.isValid()) return helpers.error('any.invalid');
    if (!phone.countryCallingCode) return helpers.error('any.invalid');
    return phone.number; // E.164
  } catch (e) {
    return helpers.error('any.invalid');
  }
}, 'Phone with country code validation');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
});

const createAgentSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: phoneWithCountryCode.required(),
  password: Joi.string().min(6).max(128).required(),
});

const uploadFileSchema = Joi.object({
  // validated via multer, but keep for consistency
  fieldname: Joi.string().required(),
  originalname: Joi.string().required(),
  encoding: Joi.string().required(),
  mimetype: Joi.string().valid(
    'text/csv',
    'text/plain', // CSV files sometimes have this MIME type
    'application/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ).required(),
  size: Joi.number().max(5 * 1024 * 1024).required(), // 5MB limit
  destination: Joi.string().optional(),
  filename: Joi.string().optional(),
  path: Joi.string().optional(),
  buffer: Joi.binary().optional(),
});

function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({ message: 'Validation error', details: error.details.map(d => d.message) });
    }
    req.body = value;
    next();
  };
}

function validateFile(schema) {
  return (req, res, next) => {
    if (!req.file) return res.status(400).json({ message: 'File is required' });
    const { error, value } = schema.validate(req.file, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({ message: 'File validation error', details: error.details.map(d => d.message) });
    }
    req.file = value;
    next();
  };
}

module.exports = {
  // Schemas
  loginSchema,
  createAgentSchema,
  uploadFileSchema,
  // Middlewares
  validateBody,
  validateFile,
};
