# Despliegue de AgileDesk

Este documento describe cómo desplegar AgileDesk en producción como una aplicación unificada.

## Arquitectura de Despliegue Simplificada

AgileDesk es una aplicación fullstack completamente integrada donde el frontend compilado y el backend se sirven desde el mismo servidor Express.

```
Cliente (Navegador)
    ↓
Vercel (Frontend React compilado + Backend Node.js)
    ↓
Archivos estáticos (index.html, CSS, JavaScript) + API REST
```

**Ventajas:**
- Una única URL para toda la aplicación
- Sin configuración de variables de entorno necesaria
- Despliegue simplificado en una sola plataforma
- Sin problemas de CORS entre dominios

## Despliegue en Vercel

### Requisitos Previos

- Repositorio en GitHub
- Cuenta en Vercel (https://vercel.com)
- Node.js y npm instalados localmente

### Pasos de Despliegue

1. **Conectar el Repositorio a Vercel**
   - Ve a https://vercel.com e inicia sesión
   - Haz clic en "Add New..." → "Project"
   - Selecciona tu repositorio de GitHub

2. **Configuración Automática**
   - Vercel detectará que es un proyecto Node.js
   - Usará el archivo `vercel.json` para:
     - Ejecutar `npm run build` (compila Vite + TypeScript)
     - Ejecutar `npm start` (inicia el servidor Express)

3. **Sin Variables de Entorno**
   - La aplicación NO necesita `VITE_API_URL`
   - Todo funciona automáticamente porque comparten la misma URL

4. **Verificar el Despliegue**
   - Vercel proporcionará una URL: `https://tu-proyecto.vercel.app`
   - Accede a esa URL y verifica que se carga correctamente
   - Intenta crear un proyecto: el botón "Crear Proyecto" debe enviar datos a `/api/proyectos`

### Despliegue Automático

- Cada push a la rama `main` desencadena automáticamente un nuevo despliegue
- Los despliegues anteriores se mantienen para rollback rápido

## Despliegue Local

Para probar la aplicación localmente antes de desplegar:

```bash
# Compilar frontend y backend
npm run build

# Iniciar el servidor de producción
npm run server

# Acceder a http://localhost:3000
```

## Solución de Problemas

### Error: "No se pudo conectar al servidor"

**Causa:** El frontend no puede alcanzar la API

**Solución:**
1. Verifica que el servidor Express está corriendo en Vercel
2. Asegúrate que el archivo `vercel.json` está en la raíz del repositorio
3. Revisa los logs de Vercel en el panel de administración

### Error: "Cannot find module"

**Causa:** Las dependencias no se instalaron correctamente

**Solución:**
1. Ejecuta `npm install` localmente
2. Verifica que `package.json` incluye todas las dependencias
3. Intenta hacer push nuevamente

## Desarrollo Local

Para desarrollar con ambos servidores corriendo simultáneamente:

```bash
npm run dev
```

Esto ejecuta:
- Vite (frontend) en http://localhost:5173
- Express (backend) en http://localhost:3000

Vite automáticamente proxy las solicitudes a `/api/*` al servidor backend.

## Estructura de Construcción

El proceso de construcción:

1. **Vite compila el frontend:**
   - Compila el código React + TypeScript
   - Genera archivos estáticos en la carpeta `dist/`

2. **TypeScript compila el backend:**
   - Compila el código TypeScript del servidor
   - Genera archivos JavaScript en `server/dist/`

3. **Express sirve todo:**
   - Sirve los archivos estáticos del frontend desde `dist/`
   - Sirve la API REST desde rutas en `/api/`
   - Para rutas no encontradas, sirve `index.html` (para React Router)

