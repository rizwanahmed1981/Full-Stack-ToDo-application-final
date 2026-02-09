#!/bin/bash

# Start both backend and frontend servers concurrently
# This script is designed for the hackathon demo

echo "Starting Todo App servers..."

# Change to project root directory to ensure correct paths
cd "$(dirname "$0")"

# Start backend server in background
echo "Starting backend server..."
cd backend
uv run python -m todo_app.main > backend.log 2>&1 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Check if backend started successfully
if ps -p $BACKEND_PID > /dev/null; then
    echo "✅ Backend server started successfully (PID: $BACKEND_PID)"
else
    echo "❌ Failed to start backend server"
    echo "Backend log output:"
    tail -10 backend.log
    exit 1
fi

# Start frontend server
echo "Starting frontend server..."
cd ../frontend
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

# Check if frontend started successfully
if ps -p $FRONTEND_PID > /dev/null; then
    echo "✅ Frontend server started successfully (PID: $FRONTEND_PID)"
    echo ""
    echo "🚀 Todo App is now running!"
    echo "   Backend: http://localhost:8000"
    echo "   Frontend: http://localhost:3000"
    echo ""
    echo "💡 To stop the servers, press Ctrl+C"
    echo ""

    # Keep the script running to keep both servers alive
    wait $BACKEND_PID $FRONTEND_PID

    # If we reach here, one of the processes exited
    echo "Servers stopped."
else
    echo "❌ Failed to start frontend server"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi