# Despliegue de AgileDesk

Este documento describe cómo desplegar AgileDesk en producción, tanto el frontend como el backend.

## Arquitectura de Despliegue

AgileDesk es una aplicación fullstack que requiere dos despliegues separados:

1. **Frontend**: Sitio estático React en Vercel o Netlify
2. **Backend**: Servidor Node.js/Express en Railway, Render, Fly.io u otro servicio

```
Cliente (Navegador)
    ↓
Vercel (Frontend React)
    ↓
API REST
    ↓
Railway/Render (Backend Express)
```

## Despliegue del Frontend en Vercel

### Requisitos Previos

- Repositorio en GitHub (https://github.com/Ash424242/AgileDesk)
- Cuenta en Vercel (vercel.com)
- Node.js y npm instalados localmente

### Pasos

1. **Conectar el Repositorio**
   - Ve a vercel.com y crea una nueva cuenta o inicia sesión
   - Haz clic en "Add New..." → "Project"
   - Selecciona tu repositorio de GitHub (Ash424242/AgileDesk)

2. **Configurar Variables de Entorno**
   - En la pantalla de configuración, ve a "Environment Variables"
   - Añade la siguiente variable:
     - Nombre: `VITE_API_URL`
     - Valor: URL de tu backend (ej: `https://agiledesk-api.railway.app`)
   - Esta variable será diferente según el ambiente

3. **Configurar por Ambientes**
   - **Production** (rama main): `VITE_API_URL=https://tu-backend-produccion.com`
   - **Preview** (PRs): `VITE_API_URL=https://tu-backend-etapa.com` (opcional)

4. **Despliegue Automático**
   - Vercel se conecta a tu rama `main` de GitHub
   - Cada push a `main` desencadena un nuevo despliegue
   - Los builds anteriores se mantienen para rollback

5. **Verificar la URL**
   - Una vez completado, Vercel proporcionará una URL: `https://agiledesk-xyz.vercel.app`
   - Accede a esa URL y verifica que se carga correctamente

## Despliegue del Backend en Railway

### Requisitos Previos

- Backend Node.js/Express en `server/` dentro del repositorio
- Archivo `server/package.json` con script `start`
- Repositorio en GitHub

### Pasos

1. **Preparar el Servidor**
   - Asegúrate que `server/package.json` tenga un script `start`:
   ```json
   "scripts": {
     "start": "node dist/index.js",
     "build": "tsc -b"
   }
   ```

2. **Conectar en Railway**
   - Ve a https://railway.app y crea una cuenta
   - Haz clic en "New Project" → "Deploy from GitHub repo"
   - Selecciona el repositorio `AgileDesk`
   - Railway automáticamente detectará que es un proyecto Node.js

3. **Configurar Build y Start**
   - Railway debería auto-detectar los scripts
   - Si no, configura manualmente:
     - **Build Command**: `cd server && npm install && npm run build`
     - **Start Command**: `node server/dist/index.js`

4. **Variables de Entorno**
   - En la pestaña de "Variables", añade:
     - `PUERTO`: `3000` (o el puerto que uses)
     - `ORIGEN_PERMITIDO`: `https://agiledesk-xyz.vercel.app` (URL de tu frontend)

5. **Obtener la URL**
   - Railway asignará una URL pública (ej: `https://agiledesk-api.railway.app`)
   - Esta será tu `VITE_API_URL` en Vercel

## Integración Frontend-Backend

### Paso 1: Desplegar el Backend PRIMERO
- Obtén la URL pública del backend
- Por ejemplo: `https://agiledesk-api.railway.app`

### Paso 2: Configurar VITE_API_URL en Vercel
- En Vercel, añade la variable de entorno:
  - `VITE_API_URL=https://agiledesk-api.railway.app`
- Vercel redistribuirá automáticamente

### Paso 3: Verificar la Conexión
1. Accede al frontend desplegado en Vercel
2. Intenta crear un nuevo proyecto
3. Si funciona: ¡Listo! El frontend está comunicándose con el backend
4. Si falla: Revisa los errores en la consola del navegador (F12)

## Solución de Problemas

### Error: "Error al crear proyecto"

**Causa probable**: El frontend no puede conectarse al backend.

**Solución**:
1. Verifica que `VITE_API_URL` está configurado en Vercel
2. Comprueba que el backend está corriendo: visita `https://tu-backend.com/ping`
3. Revisa la consola del navegador (F12 → Network) para ver qué URL se está llamando
4. Asegúrate de que CORS está bien configurado en el backend:
   ```typescript
   aplicacion.use(cors({
     origin: process.env.ORIGEN_PERMITIDO || 'http://localhost:5173',
     credentials: true,
   }))
   ```

### Error de CORS

**Causa**: El backend rechaza requestos del frontend.

**Solución**:
1. Verifica que `ORIGEN_PERMITIDO` en el backend es la URL de tu frontend
2. En Railway, asegúrate que incluya `https://` (no solo el dominio)

### El backend tarda en responder

**Causa**: Railway puede poner el servidor en "sleep" si no recibe tráfico.

**Soluciones**:
- Usa un servicio de ping (ej: Uptime Robot) para mantener el servidor activo
- O considera usar un plan pagado en Railway

## Variables de Entorno Resumen

### Frontend (Vercel)
```
VITE_API_URL=https://agiledesk-api.railway.app
```

### Backend (Railway)
```
PUERTO=3000
ORIGEN_PERMITIDO=https://agiledesk-xyz.vercel.app
```

## URLs Finales

Una vez desplegado, tendrás:

- **Frontend**: https://agiledesk-xyz.vercel.app
- **Backend API**: https://agiledesk-api.railway.app
- **API Ping**: https://agiledesk-api.railway.app/ping

## Monitoreo y Logs

### Vercel
- Ve a tu proyecto en Vercel
- Pestaña "Deployments" para ver el historial
- Pestaña "Settings" → "Functions" para ver logs

### Railway
- Ve a tu proyecto en Railway
- Pestaña "Deployments" para historial
- Pestaña "Logs" para ver salida en tiempo real

## Redeploy

Para volver a desplegar después de cambios:

**Frontend (Vercel)**:
- Push a la rama `main` en GitHub
- Vercel redeploya automáticamente

**Backend (Railway)**:
- Push a la rama `main` en GitHub
- Railway redeploya automáticamente si está bien configurado
- O haz clic en "Redeploy" en la interfaz de Railway

## Referencias

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Railway](https://docs.railway.app)
- [Definición de VITE variables de entorno](https://vitejs.dev/guide/env-and-mode.html)
- [Guía CORS en Express](https://expressjs.com/en/resources/middleware/cors.html)
