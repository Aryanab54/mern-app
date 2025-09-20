# MERN Stack Backend - Machine Test

A complete backend implementation for the MERN stack machine test with admin login, agent management, and CSV upload/distribution functionality.

## Features

- ✅ **Admin Authentication** with JWT
- ✅ **Agent Management** (Create, Read, List)
- ✅ **CSV/Excel Upload** with validation
- ✅ **Lead Distribution** among agents
- ✅ **MySQL Database** with Prisma ORM
- ✅ **Complete Testing Suite** with Jest & Supertest

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer with validation
- **Testing**: Jest, Supertest
- **Validation**: Joi

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed admin user
npm run seed:admin
```

### 3. Environment Configuration
Update `.env` file with your database credentials:
```env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
PORT=5001
JWT_SECRET="your_super_secret_jwt_key"
JWT_EXPIRES_IN="7d"
```

### 4. Start Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Agent Management
- `POST /api/agents` - Create new agent
- `GET /api/agents` - Get all agents
- `GET /api/agents/:id` - Get specific agent

### Lead Management
- `POST /api/leads/upload` - Upload CSV and distribute leads
- `GET /api/leads/distribution` - View lead distribution
- `GET /api/leads/agent/:agentId` - Get agent's leads

### Assignment Management
- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/stats` - Get assignment statistics

## Testing

### Run All Tests
```bash
npm test
```

### Run Specific Tests
```bash
# All API tests (Authentication, Agents, Leads, Assignments)
npm run test:api

# Individual API test suites
npm run test:auth
npm run test:agents
npm run test:leads
npm run test:assignments

# Utility function tests
npm run test:utils

# Integration tests
npm run test:integration

# Basic API tests
npm test -- tests/basic.test.js
```

### Test Coverage
```bash
npm run test:coverage
```

### Watch Mode
```bash
npm run test:watch
```

## Default Admin Credentials

After running `npm run seed:admin`:
- **Email**: admin@example.com
- **Password**: admin123

## File Upload Support

Supports the following file formats:
- CSV (.csv)
- Excel (.xlsx, .xls)

Required CSV format:
```csv
FirstName,Phone,Notes
John,+1234567890,Test note
Jane,+1234567891,Another note
```

## Lead Distribution Logic

- Leads are distributed equally among all available agents
- If total leads are not divisible by agent count, remaining leads are distributed sequentially
- Example: 25 leads ÷ 5 agents = 5 leads per agent
- Example: 23 leads ÷ 5 agents = 5,5,5,4,4 distribution

## Project Structure

```
backend/
├── src/
│   ├── agent/          # Agent management
│   ├── assignment/     # Assignment tracking
│   ├── lead/          # Lead management & CSV upload
│   ├── login/         # Authentication
│   └── utils/         # Utilities (auth, validation, file handling)
├── tests/             # Test files
├── prisma/            # Database schema & migrations
├── scripts/           # Utility scripts
└── uploads/           # File upload directory
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- File upload validation
- Rate limiting
- Input validation with Joi

## Error Handling

- Comprehensive error handling throughout the application
- Proper HTTP status codes
- Detailed error messages for development
- Database transaction support for data consistency

## Production Considerations

- Environment variables for configuration
- Database connection pooling
- File cleanup after processing
- Proper logging and monitoring
- CORS configuration for frontend integration