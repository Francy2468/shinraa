# ⚡ Quick Start - ShinraGuard en Koyeb

## 🎯 En 5 Minutos

### Paso 1: Clonar y Preparar
```bash
git clone https://github.com/TU_USER/shinraa.git
cd shinraa
```

### Paso 2: MongoDB Atlas
1. Ve a https://www.mongodb.com/cloud/atlas
2. Crea cluster (tier M0 gratis)
3. Copia connection string
4. Whitelist: 0.0.0.0/0 en Network Access

### Paso 3: Koyeb - Backend
```bash
koyeb service create shinraguard-backend \
  --git github.com/TU_USER/shinraa \
  --git-branch main \
  --buildpack node \
  --build-command "cd backend && npm ci --production" \
  --run-command "node backend/server.js" \
  --port 5000 \
  --env PORT=5000 \
  --env NODE_ENV=production \
  --env MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/shinraguard" \
  --env JWT_SECRET="tu-secret-key-aqui-minimo-32-caracteres"
```

### Paso 4: Koyeb - Frontend
```bash
koyeb service create shinraguard-frontend \
  --git github.com/TU_USER/shinraa \
  --git-branch main \
  --buildpack node \
  --build-command "cd frontend && npm ci --production && npm run build" \
  --run-command "npx serve -s build -l 3000" \
  --port 3000 \
  --env CI=false \
  --env REACT_APP_API_URL="https://tu-backend.koyeb.app/api"
```

### Paso 5: Dominios Personalizados
1. Koyeb Dashboard → Settings → Custom Domain
2. Añade tu dominio
3. Configura DNS records (CNAME)
4. Actualiza URLs en variables

## ✅ ¡Listo!

Tu ShinraGuard está en:
- Frontend: https://tu-frontend.koyeb.app
- Backend API: https://tu-backend.koyeb.app/api

## 📖 Más Información

- Guía completa: `KOYEB_ES.md`
- Archivos incluidos: `KOYEB_CONFIG.md`
- Documentación técnica: `docs/README.md`

## 🆘 Problemas?

- Verifica MongoDB connection
- Comprueba variables de entorno
- Revisa logs en Koyeb Dashboard
- Discord: https://discord.gg/hgn7Q8DUGu
