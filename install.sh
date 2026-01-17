#!/bin/bash

# ShinraGuard - Script de instalación local

set -e

echo "🚀 ShinraGuard - Instalador Local"
echo "=================================="

# Verificar Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js no está instalado. Por favor, instala Node.js 18+"
  exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js detectado: $NODE_VERSION"

# Verificar npm
if ! command -v npm &> /dev/null; then
  echo "❌ npm no está instalado"
  exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm detectado: $NPM_VERSION"

# Instalar Backend
echo ""
echo "📦 Instalando Backend..."
cd backend
npm ci
cd ..
echo "✅ Backend instalado"

# Instalar Frontend
echo ""
echo "📦 Instalando Frontend..."
cd frontend
npm ci
cd ..
echo "✅ Frontend instalado"

# Crear .env si no existe
if [ ! -f "backend/.env" ]; then
  echo ""
  echo "⚙️  Creando archivo .env..."
  cp backend/.env.example backend/.env
  echo "✅ Archivo .env creado en backend/"
  echo "⚠️  Edita backend/.env con tus credenciales"
fi

echo ""
echo "✅ ¡Instalación completada!"
echo ""
echo "📝 Próximos pasos:"
echo "1. Edita backend/.env con tus credenciales de MongoDB"
echo "2. Ejecuta: npm run dev (desde raíz para ambos)"
echo "3. Frontend: http://localhost:3000"
echo "4. Backend: http://localhost:5000"
echo ""
