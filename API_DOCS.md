# API Documentation

## Base URL
```
http://localhost:5001/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Authentication

#### POST /auth/login
Login admin user

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "name": "Admin User",
      "role": "ADMIN"
    }
  }
}
```

### Agents

#### GET /agents
Get all agents (Protected)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST /agents
Create new agent (Protected)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Agent created successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}
```

### Leads

#### POST /leads/upload
Upload CSV file and distribute among agents (Protected)

**Request:**
- Content-Type: multipart/form-data
- Field: `file` (CSV/XLS/XLSX file)

**CSV Format:**
```csv
FirstName,Phone,Notes
John,+1234567890,Sample note
Jane,+0987654321,Another note
```

**Response:**
```json
{
  "success": true,
  "message": "File uploaded and distributed successfully",
  "data": {
    "totalRecords": 10,
    "distributedTo": 5,
    "distribution": [
      {
        "agentId": 1,
        "agentName": "Agent 1",
        "assignedCount": 2
      }
    ]
  }
}
```

#### GET /leads/distribution
Get distribution data (Protected)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "agentId": 1,
      "agentName": "John Doe",
      "lists": [
        {
          "firstName": "Customer 1",
          "phone": "+1234567890",
          "notes": "Sample note",
          "assignedAt": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  ]
}
```

#### GET /leads/agent/:id
Get leads assigned to specific agent (Protected)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "firstName": "Customer 1",
      "phone": "+1234567890",
      "notes": "Sample note",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Assignments

#### GET /assignments
Get all assignments (Protected)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "agentId": 1,
      "leadId": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "agent": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "lead": {
        "firstName": "Customer 1",
        "phone": "+1234567890"
      }
    }
  ]
}
```

#### GET /assignments/stats
Get assignment statistics (Protected)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalAssignments": 25,
    "totalAgents": 5,
    "totalLeads": 25,
    "averagePerAgent": 5,
    "distribution": [
      {
        "agentName": "John Doe",
        "count": 5
      }
    ]
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized: Missing or invalid token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Test Credentials

```
Email: admin@example.com | Password: admin123
Email: demo@example.com  | Password: demo123
Email: test@example.com  | Password: test123
```

## Rate Limiting
- 100 requests per 15 minutes per IP
- 429 status code when limit exceeded

## File Upload Limits
- Max file size: 10MB
- Supported formats: CSV, XLS, XLSX
- Required columns: FirstName, Phone
- Optional columns: Notes