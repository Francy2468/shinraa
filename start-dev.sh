#!/bin/bash

# ShinraGuard - Script de desarrollo local

echo "🚀 ShinraGuard - Modo Desarrollo"
echo "================================"

# Terminal 1: Backend
echo "Iniciando Backend..."
cd backend
npm start &
BACKEND_PID=$!

# Terminal 2: Frontend
echo "Iniciando Frontend..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Servicios iniciados:"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
echo ""
echo "Presiona Ctrl+C para detener"
echo ""

# Wait for signals
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
