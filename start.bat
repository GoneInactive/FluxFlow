#!/bin/bash

# FluxFlow Start Script
# This script starts the development server and opens FluxFlow in your browser

echo "🚀 Starting FluxFlow..."
echo "================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the FluxFlow project directory."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to install dependencies"
        exit 1
    fi
fi

# Start the development server in background
echo "🔧 Starting development server..."
npm run dev &
SERVER_PID=$!

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping FluxFlow server..."
    kill $SERVER_PID 2>/dev/null
    exit 0
}

# Set up cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for server to start (give it a few seconds)
echo "⏳ Waiting for server to start..."
sleep 3

# Detect OS and open browser accordingly
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows (Git Bash, WSL, etc.)
    echo "🌐 Opening FluxFlow in your browser..."
    start "http://localhost:5173"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "🌐 Opening FluxFlow in your browser..."
    open "http://localhost:5173"
else
    # Linux
    echo "🌐 Opening FluxFlow in your browser..."
    xdg-open "http://localhost:5173" 2>/dev/null || {
        echo "🔗 FluxFlow is running at: http://localhost:5173"
        echo "📱 Open this URL in your browser manually"
    }
fi

echo ""
echo "✅ FluxFlow is now running!"
echo "🔗 URL: http://localhost:5173"
echo "💡 Press Ctrl+C to stop the server"
echo "================================"

# Keep script running and show server output
wait $SERVER_PID