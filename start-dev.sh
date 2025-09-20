#!/bin/bash

echo "🚀 Starting MERN Application in Development Mode..."

# Function to kill background processes on exit
cleanup() {
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Set up trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Start backend
echo "📦 Starting Backend Server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🌐 Starting Frontend Server..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Both servers are starting..."
echo "📋 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5001"
echo "   Health:   http://localhost:5001/api/health"
echo ""
echo "🔐 Test Credentials:"
echo "   admin@example.com | admin123"
echo "   demo@example.com  | demo123"
echo "   test@example.com  | test123"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for background processes
wait