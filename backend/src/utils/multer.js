'use strict';

const path = require('path');
const fs = require('fs');
const multer = require('multer');

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const UPLOAD_DIR = path.join(__dirname, '../../uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Allowed mime types
const allowedMimes = new Set([
  'text/csv',
  'text/plain', // CSV files sometimes have this MIME type
  'application/csv',
  'application/vnd.ms-excel', // .xls and sometimes csv
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
]);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '';
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const unique = Date.now() + '_' + Math.round(Math.random() * 1e9);
    cb(null, `${base}_${unique}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  // Check extension first for safety
  const ext = (path.extname(file.originalname) || '').toLowerCase();
  
  if (!['.csv', '.xlsx', '.xls'].includes(ext)) {
    return cb(new Error('Invalid file extension. Only csv, xlsx, xls files are allowed'));
  }
  
  cb(null, true);
}

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter,
});

module.exports = { upload, UPLOAD_DIR, MAX_SIZE_BYTES };
