# API REST de AgileDesk

## Base URL

### Desarrollo local

`http://localhost:3000/api`

### Producción

En despliegue con Vercel se consume con rutas relativas desde el frontend:

`/api/proyectos`

## Formato de respuesta

```json
{
  "exito": true,
  "datos": {},
  "mensaje": "Descripción",
  "codigo": 200
}
```

## Códigos HTTP usados

- `200` solicitud correcta
- `201` recurso creado
- `400` error de validación de entrada
- `404` recurso no encontrado
- `500` error interno

## Endpoints implementados

### Proyectos

- `GET /api/proyectos`
- `GET /api/proyectos/:id`
- `POST /api/proyectos`
- `PUT /api/proyectos/:id`
- `DELETE /api/proyectos/:id`

### Columnas

- `GET /api/proyectos/:proyectoId/columnas`

### Tareas

- `GET /api/proyectos/:proyectoId/columnas/:columnaId/tareas`
- `POST /api/proyectos/:proyectoId/columnas/:columnaId/tareas`
- `PUT /api/proyectos/:proyectoId/columnas/:columnaId/tareas/:tareaId`
- `DELETE /api/proyectos/:proyectoId/columnas/:columnaId/tareas/:tareaId`
- `PATCH /api/proyectos/tareas/:tareaId/mover`

## Observaciones de implementación

- El backend local principal está en `server/src`.
- Para despliegue en Vercel también existe handler serverless en `api/proyectos/index.ts`.
- Ambos exponen el mismo contrato para mantener compatibilidad con el cliente tipado.
