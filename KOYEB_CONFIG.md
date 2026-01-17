# 📋 Archivos de Configuración para Koyeb

## Resumen de Archivos Creados

### 📦 Dependencias
- ✅ `backend/package-lock.json` - Lock file para backend Node.js
- ✅ `frontend/package-lock.json` - Lock file para frontend React
- ✅ `requirements.txt` - Requisitos del proyecto
- ✅ `backend/.env.production` - Configuración para producción

### 🚀 Deployment
- ✅ `Procfile` - Configuración Heroku/Koyeb
- ✅ `koyeb.yml` - Configuración Koyeb avanzada
- ✅ `.node-version` - Versión Node.js (18.x)
- ✅ `.npmrc` - Configuración npm

### 📚 Documentación
- ✅ `KOYEB_DEPLOYMENT.md` - Guía en inglés
- ✅ `KOYEB_ES.md` - Guía en español (¡Recomendado!)
- ✅ `KOYEB_CONFIG.md` - Este archivo

### 🐳 Docker
- ✅ `backend/Dockerfile.koyeb` - Dockerfile optimizado para backend
- ✅ `frontend/Dockerfile.koyeb` - Dockerfile optimizado para frontend
- ✅ `.dockerignore` - Archivos ignorados en build

### 🛠️ Scripts
- ✅ `install.sh` - Script de instalación local
- ✅ `start-dev.sh` - Script para iniciar desarrollo
- ✅ `deploy.sh` - Script de deployment
- ✅ `predeploy.sh` - Pre-checks antes del deploy

### 🔒 Configuración
- ✅ `backend/.gitignore` - Gitignore para backend
- ✅ `frontend/.gitignore` - Gitignore para frontend
- ✅ `.gitignore` - Gitignore raíz

## 📖 Pasos Quick Start para Koyeb

### 1️⃣ Preparar tu Repositorio
```bash
# Asegurate de que todos los cambios estén en GitHub
git add .
git commit -m "Agregar configuración Koyeb"
git push origin main
```

### 2️⃣ Configurar MongoDB Atlas
1. Ve a https://www.mongodb.com/cloud/atlas
2. Crea un cluster (tier M0 es gratis)
3. Copia la conexión string
4. **Importante**: Whitelist 0.0.0.0/0 en Network Access

### 3️⃣ Crear Servicios en Koyeb

#### Backend
```bash
koyeb service create shinraguard-backend \
  --git github.com/TU_USER/shinraa \
  --git-branch main \
  --buildpack node \
  --build-command "cd backend && npm ci --production" \
  --run-command "node backend/server.js" \
  --port 5000
```

**Variables de Entorno**:
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/shinraguard
JWT_SECRET=tu-secret-key-super-largo-aqui
FRONTEND_URL=https://tu-frontend.koyeb.app
```

#### Frontend
```bash
koyeb service create shinraguard-frontend \
  --git github.com/TU_USER/shinraa \
  --git-branch main \
  --buildpack node \
  --build-command "cd frontend && npm ci --production && npm run build" \
  --run-command "npx serve -s build -l 3000" \
  --port 3000
```

**Variables de Entorno**:
```
REACT_APP_API_URL=https://tu-backend.koyeb.app/api
CI=false
```

### 4️⃣ Configurar Dominios
1. Dashboard Koyeb → Settings → Custom Domain
2. Añade tu dominio
3. Configura DNS records
4. Actualiza URLs en variables

## ✨ Características Incluidas

- ✅ **Node.js 18** - Runtime moderno
- ✅ **Production Mode** - npm ci --production
- ✅ **Health Checks** - Healthcheck endpoints
- ✅ **CORS Configurado** - Para Koyeb
- ✅ **SSL/TLS Automático** - Incluido en Koyeb
- ✅ **Auto-scaling** - Automático en Koyeb
- ✅ **Logs en Tiempo Real** - Via Koyeb Dashboard
- ✅ **MongoDB Atlas** - Base de datos cloud

## 🔐 Variables de Entorno Requeridas

### Backend
```
PORT=5000
NODE_ENV=production
MONGODB_URI=<tu-mongodb-uri>
JWT_SECRET=<32+ caracteres aleatorios>
FRONTEND_URL=<url-frontend>
```

### Frontend
```
REACT_APP_API_URL=<url-api-backend>
CI=false
```

## 📊 Comparativa: Local vs Koyeb

| Aspecto | Local | Koyeb |
|---------|-------|-------|
| Setup | Requiere Node.js | Automático |
| Database | Local MongoDB | MongoDB Atlas |
| Escalado | Manual | Automático |
| SSL/TLS | Requires setup | Incluido |
| CDN | No | Sí |
| Logs | Console | Dashboard |
| Backups | Manual | Automático |
| Cost | $0 | Free tier disponible |

## 🚨 Common Issues & Solutions

### Build Failed: Cannot find module
**Solución**: Verifica que `package-lock.json` existe en el directorio correcto

### CORS Errors
**Solución**: Actualiza `FRONTEND_URL` en variables de entorno del backend

### Cannot connect to MongoDB
**Solución**: 
1. Verifica MONGODB_URI correcta
2. Whitelist 0.0.0.0/0 en MongoDB Atlas
3. Valida usuario/password sin caracteres especiales

### Frontend Shows Blank Page
**Solución**:
1. Verifica que `npm run build` completed exitosamente
2. Borra caché del navegador
3. Verifica `REACT_APP_API_URL` correcta

## 📞 Support

- **Koyeb Docs**: https://docs.koyeb.com
- **ShinraGuard Discord**: https://discord.gg/hgn7Q8DUGu
- **MongoDB Support**: https://support.mongodb.com

## ✅ Pre-Deploy Checklist

- [ ] Repository en GitHub
- [ ] package-lock.json en backend/
- [ ] package-lock.json en frontend/
- [ ] .env.production configurado
- [ ] MongoDB Atlas cluster creado
- [ ] Koyeb account creado
- [ ] JWT_SECRET es aleatorio y largo
- [ ] MONGODB_URI es correcto
- [ ] IP whitelist 0.0.0.0/0 en MongoDB

## 🎯 Next Steps

1. Lee `KOYEB_ES.md` para instrucciones detalladas
2. Configura MongoDB Atlas
3. Deploy Backend
4. Deploy Frontend
5. Configura dominio personalizado
6. ¡Disfruta tu ShinraGuard en Koyeb! 🚀

---

**Versión**: 1.0.0  
**Última actualización**: 17 Enero 2026  
**Estado**: ✅ Listo para Koyeb
