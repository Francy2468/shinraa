#!/bin/bash

# ShinraGuard Deployment Script for Koyeb

echo "🚀 Deploying ShinraGuard to Koyeb..."

# Update dependencies
cd backend
npm install --production
npm ci

cd ../frontend
npm install --production
npm ci

echo "✅ Dependencies installed successfully"

# Build frontend
npm run build

echo "✅ Frontend built successfully"

cd ..

echo "🎉 ShinraGuard is ready for Koyeb deployment!"
