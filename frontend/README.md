# MERN Stack Frontend Application

This is the frontend application for the MERN stack project with admin login, agent management, and CSV file upload/distribution functionality.

## Features

1. **Admin User Login**
   - JWT-based authentication
   - Form validation with Formik and Yup
   - Protected routes

2. **Agent Management**
   - Add new agents with validation
   - View all agents in a table
   - Mobile number with country code validation

3. **CSV File Upload & Distribution**
   - Upload CSV, XLS, XLSX files
   - File format validation
   - Automatic distribution among 5 agents
   - Progress tracking during upload

4. **Distribution View**
   - View distributed lists per agent
   - Accordion-style interface
   - Distribution summary

## Tech Stack

- **React 19.1.1** - Frontend framework
- **React Router DOM** - Client-side routing
- **React Bootstrap** - UI components
- **Formik & Yup** - Form handling and validation
- **Axios** - HTTP client
- **Bootstrap 5** - CSS framework

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on port 5001

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env` file in the root directory:
   ```
   REACT_APP_API_URL=http://localhost:5001/api
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/
│   ├── Navbar.js          # Navigation component
│   └── ProtectedRoute.js  # Route protection wrapper
├── context/
│   └── AuthContext.js     # Authentication context
├── pages/
│   ├── Login.js           # Login page
│   ├── Dashboard.js       # Main dashboard
│   ├── Agents.js          # Agent management
│   ├── Upload.js          # File upload
│   └── Distribution.js    # View distributed lists
├── services/
│   └── api.js             # API service layer
├── App.js                 # Main app component
├── App.css                # Global styles
└── index.js               # App entry point
```

## API Integration

The frontend communicates with the backend through the following endpoints:

- `POST /api/auth/login` - User authentication
- `GET /api/agents` - Fetch all agents
- `POST /api/agents` - Create new agent
- `POST /api/lists/upload` - Upload and distribute CSV
- `GET /api/lists/distributed` - Get distributed lists

## Features in Detail

### Authentication
- JWT token stored in localStorage
- Automatic token inclusion in API requests
- Protected routes redirect to login if not authenticated

### Form Validation
- Email format validation
- Mobile number with country code format (+1234567890)
- Password minimum length requirements
- File type validation (CSV, XLS, XLSX only)

### File Upload
- Drag & drop support
- Progress bar during upload
- File size display
- Format validation before upload

### Responsive Design
- Bootstrap-based responsive layout
- Mobile-friendly interface
- Accessible components

## Error Handling

- API error messages displayed to users
- Form validation errors
- File upload error handling
- Network error handling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Notes

- Uses React 19 with modern hooks
- Context API for state management
- Axios interceptors for token management
- Bootstrap components for consistent UI
- Formik for form state management

## Troubleshooting

1. **CORS Issues:** Ensure backend allows requests from localhost:3000
2. **API Connection:** Verify backend is running on port 5001
3. **Token Issues:** Clear localStorage and login again
4. **File Upload:** Check file format and size limits

## Future Enhancements

- Real-time notifications
- Bulk agent operations
- Advanced file validation
- Export functionality
- User role management