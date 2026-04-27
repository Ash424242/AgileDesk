# Despliegue

## Arquitectura de despliegue actual

AgileDesk se despliega en Vercel con:

- frontend estático generado por Vite (`dist/`)
- función serverless para la API en `api/proyectos/index.ts`
- reescrituras definidas en `vercel.json`

El frontend consume la API mediante rutas relativas (`/api/proyectos`), por lo que no necesita URL absoluta en el código para el caso principal.

## Archivos clave

- `vercel.json`
- `api/proyectos/index.ts`
- `api/_lib/servicioProyectos.ts`

## Pasos de despliegue en Vercel

1. Conectar el repositorio en Vercel.
2. Mantener configuración del proyecto con `buildCommand: npm run build`.
3. Confirmar que `vercel.json` se aplica correctamente.
4. Verificar en producción:
   - carga de frontend
   - `GET /api/proyectos`
   - CRUD de proyectos y tareas

## Prueba local de build

```bash
npm run build
```

## Nota importante

El servicio de datos actual es en memoria, por lo que en serverless no existe persistencia garantizada entre invocaciones. Para una versión productiva persistente se recomienda integrar base de datos.
