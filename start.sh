#!/bin/bash

# HRMS Lite - Quick Start Script

echo "🚀 Starting HRMS Lite Application..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Start Backend
echo -e "${BLUE}Starting Backend API (Port 8001)...${NC}"
python3 -m uvicorn main:app --reload --port 8001 > backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
echo ""

# Wait for backend to start
sleep 3

# Start Frontend
echo -e "${BLUE}Starting Frontend (Port 3000)...${NC}"
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
echo ""

# Display URLs
echo -e "${GREEN}✓ Application Started!${NC}"
echo ""
echo "📍 Frontend URL: http://localhost:3000"
echo "📍 Backend API: http://localhost:8001"
echo "📍 API Docs: http://localhost:8001/docs"
echo ""
echo "Press CTRL+C to stop the application"
echo ""

# Keep script running
wait
