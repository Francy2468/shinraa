#!/bin/bash

# Predeploy script for Koyeb

echo "🔧 Running predeploy checks..."

# Check if backend package-lock.json exists
if [ -f "backend/package-lock.json" ]; then
  echo "✅ Backend package-lock.json found"
else
  echo "⚠️  Creating backend package-lock.json"
  cd backend && npm install && cd ..
fi

# Check if frontend package-lock.json exists
if [ -f "frontend/package-lock.json" ]; then
  echo "✅ Frontend package-lock.json found"
else
  echo "⚠️  Creating frontend package-lock.json"
  cd frontend && npm install && cd ..
fi

echo "✅ Predeploy checks complete"
