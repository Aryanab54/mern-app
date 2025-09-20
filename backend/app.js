require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const loginRoutes = require('./src/login/login.route');
const agentRoutes = require('./src/agent/agent.route');
const leadRoutes = require('./src/lead/lead.route');
const assignmentRoutes = require('./src/assignment/assignment.route');

// Routes
app.use('/api/auth', loginRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/assignments', assignmentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;