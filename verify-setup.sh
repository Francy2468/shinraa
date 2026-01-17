#!/bin/bash

# ShinraGuard - Setup Verification Script

echo "✅ VERIFICANDO CONFIGURACIÓN KOYEB"
echo "===================================="
echo ""

# Verificar archivos críticos
declare -a files=(
  "backend/package-lock.json"
  "frontend/package-lock.json"
  "Procfile"
  "requirements.txt"
  ".node-version"
  "KOYEB_ES.md"
  "QUICK_START.md"
  "backend/.env.production"
)

count=0
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
    ((count++))
  else
    echo "❌ $file - FALTA"
  fi
done

echo ""
echo "===================================="
echo "✅ $count / ${#files[@]} archivos presentes"
echo ""
echo "📚 DOCUMENTACIÓN DISPONIBLE:"
echo "  - QUICK_START.md (Empieza aquí - 5 min)"
echo "  - KOYEB_ES.md (Guía completa español)"
echo "  - KOYEB_DEPLOYMENT.md (Guía inglés)"
echo "  - SETUP_COMPLETE.md (Resumen)"
echo ""
echo "🚀 PRÓXIMO PASO:"
echo "  1. Lee QUICK_START.md"
echo "  2. Configura MongoDB Atlas"
echo "  3. Deploy en Koyeb"
echo ""
