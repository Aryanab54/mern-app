# MERN Stack Application - Agent Management System

A full-stack application for managing agents and distributing CSV data among them.

## Features

- **Admin Authentication**: JWT-based login system
- **Agent Management**: Create and manage agents
- **File Upload**: Upload CSV/Excel files with validation
- **Automatic Distribution**: Distribute data equally among 5 agents
- **Dashboard**: View distribution statistics and agent assignments

## Tech Stack

- **Frontend**: React.js, Bootstrap, Axios
- **Backend**: Node.js, Express.js, Prisma ORM
- **Database**: MySQL
- **Authentication**: JWT tokens

## Quick Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL database running on localhost:8889
- Database named `mern_app_db`

### Installation

1. **Setup Project**:
   ```bash
   npm run setup
   ```

2. **Start Development Servers**:
   ```bash
   ./start-dev.sh
   ```
   
   Or manually:
   ```bash
   # Terminal 1 - Backend
   npm run dev:backend
   
   # Terminal 2 - Frontend  
   npm run dev:frontend
   ```

3. **Test Connection** (optional):
   ```bash
   npm run test-connection
   ```

### Manual Setup (Alternative)

If the setup script fails, run these commands manually:

**Backend Setup:**
```bash
cd backend
npm install
npm run db:generate
npm run db:migrate
npm run seed:admin
npm run dev
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm start
```

## Usage

1. **Login**: Use any of these test credentials
   - Email: `admin@example.com` | Password: `admin123`
   - Email: `demo@example.com` | Password: `demo123`
   - Email: `test@example.com` | Password: `test123`

2. **Add Agents**: Create 5 agents for distribution

3. **Upload CSV**: Upload files with columns:
   - FirstName (required)
   - Phone (required)
   - Notes (optional)

4. **View Distribution**: Check how data is distributed among agents

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Agents
- `POST /api/agents` - Create agent
- `GET /api/agents` - Get all agents

### Leads
- `POST /api/leads/upload` - Upload CSV file
- `GET /api/leads/distribution` - Get distribution data
- `GET /api/leads/agent/:id` - Get agent's leads

### Assignments
- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/stats` - Get assignment statistics

## Environment Variables

**Backend (.env):**
```
DATABASE_URL="mysql://username:password@localhost:8889/mern_app_db"
JWT_SECRET="your_super_secret_jwt_key_change_this_in_production"
JWT_EXPIRES_IN="7d"
PORT=5001
```

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:5001/api
```

## File Upload Requirements

- **Supported formats**: CSV, XLS, XLSX
- **Max file size**: 10MB
- **Required columns**: FirstName, Phone
- **Optional columns**: Notes

## Distribution Logic

- Data is distributed equally among 5 agents
- If total records aren't divisible by 5, remaining items are distributed sequentially
- Example: 23 records = 5,5,5,4,4 distribution

## Testing

Run backend tests:
```bash
cd backend
npm test
```

## Troubleshooting

1. **Database Connection**: Ensure MySQL is running on port 8889
2. **CORS Issues**: Backend allows frontend on port 3000
3. **File Upload**: Check file format and size limits
4. **Authentication**: Ensure JWT token is properly stored

## Project Structure

```
mern_app/
├── backend/
│   ├── src/
│   │   ├── agent/          # Agent management
│   │   ├── assignment/     # Assignment tracking
│   │   ├── lead/          # Lead management
│   │   ├── login/         # Authentication
│   │   └── utils/         # Utilities
│   ├── prisma/            # Database schema
│   └── scripts/           # Seed scripts
└── frontend/
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── context/       # Auth context
    │   ├── pages/         # Main pages
    │   └── services/      # API services
    └── public/
```