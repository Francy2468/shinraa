# 🚀 Guía de Deployment en Koyeb

## Requisitos Previos

- ✅ Cuenta en Koyeb (https://app.koyeb.com)
- ✅ Repositorio GitHub con este código
- ✅ Cluster MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
- ✅ Variables de entorno configuradas

## 📋 Paso 1: Configurar MongoDB Atlas

1. Accede a MongoDB Atlas
2. Crea un nuevo cluster (M0 free tier)
3. Crea usuario con contraseña
4. Obtén la cadena de conexión
5. **Importante**: Añade IP whitelist: `0.0.0.0/0`

## 🔧 Paso 2: Variables de Entorno Koyeb

Configura estas variables en el dashboard de Koyeb:

```
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/shinraguard
JWT_SECRET=tu_clave_secreta_super_segura_aqui
NODE_ENV=production
FRONTEND_URL=https://tu-frontend.koyeb.app
BACKEND_URL=https://tu-backend.koyeb.app
```

## 🎯 Paso 3: Deploy del Backend

### Opción A: Via CLI de Koyeb

```bash
koyeb service create shinraguard-backend \
  --git github.com/TU_USUARIO/shinraa \
  --git-branch main \
  --buildpack node \
  --build-command "cd backend && npm ci --production" \
  --run-command "node backend/server.js" \
  --port 5000 \
  --env PORT=5000 \
  --env NODE_ENV=production
```

### Opción B: Via Dashboard de Koyeb

1. Accede a Koyeb Dashboard
2. Click en "Create" → "Service"
3. Selecciona "GitHub" y conecta tu repositorio
4. Configuración:
   - **Git repo**: `TU_USUARIO/shinraa`
   - **Branch**: `main`
   - **Buildpack**: Node.js
   - **Build command**: `cd backend && npm ci --production`
   - **Run command**: `node backend/server.js`
   - **Port**: 5000
5. Añade variables de entorno
6. Click en "Create Service"

## 🎨 Paso 4: Deploy del Frontend

### Opción A: Via CLI

```bash
koyeb service create shinraguard-frontend \
  --git github.com/TU_USUARIO/shinraa \
  --git-branch main \
  --buildpack node \
  --build-command "cd frontend && npm ci --production && npm run build" \
  --run-command "npx serve -s build -l 3000" \
  --port 3000 \
  --env CI=false \
  --env REACT_APP_API_URL=https://tu-backend.koyeb.app/api
```

### Opción B: Via Dashboard

1. Repite el proceso anterior
2. Configuración:
   - **Build command**: `cd frontend && npm ci --production && npm run build`
   - **Run command**: `npx serve -s build -l 3000`
   - **Port**: 3000
3. Añade variable: `REACT_APP_API_URL=https://tu-backend.koyeb.app/api`

## 🌐 Paso 5: Configurar Dominio Personalizado

1. Ve a Settings del servicio en Koyeb
2. Click en "Custom Domain"
3. Añade tu dominio
4. Sigue instrucciones de DNS
5. **Importante**: Actualiza FRONTEND_URL y BACKEND_URL en variables

## 🔐 Paso 6: Configuración CORS

El backend incluye CORS preconfigurado. Si necesitas cambiar los orígenes permitidos, edita:

`backend/server.js`

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://tu-frontend.koyeb.app'
  ],
  credentials: true
};
```

## 📊 Monitoring y Logs

1. Dashboard de Koyeb → Servicios
2. Click en el servicio
3. Tab "Logs" para ver logs en tiempo real
4. Tab "Metrics" para ver uso de CPU/memoria

## 🐛 Troubleshooting

### Error: "Build Failed"
```bash
# Solución
# Verifica que package-lock.json exista
# Comprueba que Node.js 18.x está disponible
```

### Error: "Port Already in Use"
- Koyeb asigna automáticamente puerto disponible
- No es problema, funciona igual

### Error: "Cannot connect to MongoDB"
- Verifica MONGODB_URI correcta
- Comprueba IP whitelist en MongoDB Atlas (debe ser 0.0.0.0/0)
- Verifica contraseña sin caracteres especiales sin escapar

### CORS Errors
- Actualiza FRONTEND_URL en variables
- Verifica corsOptions en backend/server.js
- Limpia cache del navegador

### Frontend muestra "Cannot GET /dashboard"
- Comprueba que build fue exitoso
- Verifica que REACT_APP_API_URL está correcta
- Borra caché del navegador

## 📈 Performance

- Backend: Ejecutándose en Node.js 18
- Frontend: Compilado como SPA estático con Nginx
- Database: MongoDB Atlas (cloud)

## 💾 Backups Automáticos

MongoDB Atlas proporciona:
- Backups automáticos diarios
- Retención de 30 días
- Copias puntuales bajo demanda

## 🔄 Actualizaciones

Para actualizar tu aplicación:

1. Realiza cambios en GitHub
2. Koyeb redeploya automáticamente si tienes auto-redeploy habilitado
3. O manualmente: Dashboard → Servicio → "Redeploy"

## 🎓 Recursos Útiles

- Docs Koyeb: https://docs.koyeb.com
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Node.js: https://nodejs.org
- React: https://react.dev
- Discord ShinraGuard: https://discord.gg/hgn7Q8DUGu

## ✅ Checklist Pre-Deploy

- [ ] Repositorio en GitHub sincronizado
- [ ] Cuenta Koyeb creada
- [ ] Cluster MongoDB Atlas funcional
- [ ] package-lock.json en backend y frontend
- [ ] .env.production con variables correctas
- [ ] JWT_SECRET es fuerte (min 32 caracteres)
- [ ] MONGODB_URI es correcta
- [ ] IP whitelist en MongoDB (0.0.0.0/0)

## 🚀 ¡Lista para Deploy!

Tras seguir estos pasos, tu ShinraGuard estará disponible globalmente en Koyeb con escalado automático, SSL/TLS, y monitoreo incluido.
