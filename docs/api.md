# API REST - Documentación

## Base URL

```
http://localhost:3000/api
```

En producción:
```
https://agiledesk-api.herokuapp.com/api
```

## Formato de Respuesta

Todas las respuestas siguen este formato:

### Respuesta Exitosa

```json
{
  "exito": true,
  "datos": { /* Datos solicitados */ },
  "mensaje": "Descripción de lo que sucedió",
  "codigo": 200
}
```

### Respuesta con Error

```json
{
  "exito": false,
  "datos": null,
  "mensaje": "Descripción del error",
  "codigo": 400
}
```

## Códigos HTTP

| Código | Significado |
|--------|------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Error en los datos enviados |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

## Endpoints

### Proyectos

#### GET /api/proyectos

Obtiene todos los proyectos.

**Parámetros**: Ninguno

**Respuesta**:
```json
{
  "exito": true,
  "datos": [
    {
      "id": "proyecto-1",
      "nombre": "Mi Aplicación",
      "descripcion": "Una app TODO",
      "fechaCreacion": "2024-01-15T10:00:00Z",
      "fechaModificacion": "2024-01-20T14:30:00Z",
      "columnas": [...]
    }
  ],
  "mensaje": "Proyectos obtenidos correctamente",
  "codigo": 200
}
```

**Ejemplo de uso**:
```bash
curl -X GET http://localhost:3000/api/proyectos
```

---

#### GET /api/proyectos/:id

Obtiene un proyecto específico por ID.

**Parámetros**:
- `id` (ruta): ID del proyecto

**Respuesta**:
```json
{
  "exito": true,
  "datos": {
    "id": "proyecto-1",
    "nombre": "Mi Aplicación",
    "descripcion": "Una app TODO",
    "fechaCreacion": "2024-01-15T10:00:00Z",
    "fechaModificacion": "2024-01-20T14:30:00Z",
    "columnas": [...]
  },
  "mensaje": "Proyecto obtenido correctamente",
  "codigo": 200
}
```

**Ejemplo de uso**:
```bash
curl -X GET http://localhost:3000/api/proyectos/proyecto-1
```

---

#### POST /api/proyectos

Crea un nuevo proyecto.

**Body**:
```json
{
  "nombre": "Nuevo Proyecto",
  "descripcion": "Descripción del proyecto",
  "columnas": [
    {
      "id": "col-1",
      "nombre": "Por Hacer",
      "descripcion": "Tareas pendientes",
      "posicion": 1,
      "tareas": []
    }
  ]
}
```

**Respuesta**:
```json
{
  "exito": true,
  "datos": {
    "id": "proyecto-2",
    "nombre": "Nuevo Proyecto",
    "descripcion": "Descripción del proyecto",
    "fechaCreacion": "2024-01-25T10:00:00Z",
    "fechaModificacion": "2024-01-25T10:00:00Z",
    "columnas": [...]
  },
  "mensaje": "Proyecto creado correctamente",
  "codigo": 201
}
```

**Ejemplo de uso**:
```bash
curl -X POST http://localhost:3000/api/proyectos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Nuevo Proyecto",
    "descripcion": "Mi proyecto",
    "columnas": []
  }'
```

---

#### PUT /api/proyectos/:id

Actualiza un proyecto existente.

**Parámetros**:
- `id` (ruta): ID del proyecto

**Body** (campos a actualizar):
```json
{
  "nombre": "Nombre Actualizado",
  "descripcion": "Nueva descripción"
}
```

**Respuesta**:
```json
{
  "exito": true,
  "datos": {
    "id": "proyecto-1",
    "nombre": "Nombre Actualizado",
    "descripcion": "Nueva descripción",
    "fechaCreacion": "2024-01-15T10:00:00Z",
    "fechaModificacion": "2024-01-25T15:00:00Z",
    "columnas": [...]
  },
  "mensaje": "Proyecto actualizado correctamente",
  "codigo": 200
}
```

---

#### DELETE /api/proyectos/:id

Elimina un proyecto.

**Parámetros**:
- `id` (ruta): ID del proyecto

**Respuesta**:
```json
{
  "exito": true,
  "datos": null,
  "mensaje": "Proyecto eliminado correctamente",
  "codigo": 200
}
```

---

### Tareas

#### POST /api/proyectos/:proyectoId/columnas/:columnaId/tareas

Crea una nueva tarea en una columna.

**Parámetros**:
- `proyectoId` (ruta): ID del proyecto
- `columnaId` (ruta): ID de la columna

**Body**:
```json
{
  "titulo": "Implementar login",
  "descripcion": "Crear formulario de login con validación",
  "estado": "pendiente",
  "prioridad": "alta",
  "etiquetas": ["backend", "urgente"]
}
```

**Respuesta**:
```json
{
  "exito": true,
  "datos": {
    "id": "tarea-1",
    "titulo": "Implementar login",
    "descripcion": "Crear formulario de login con validación",
    "estado": "pendiente",
    "prioridad": "alta",
    "fechaCreacion": "2024-01-25T10:00:00Z",
    "etiquetas": ["backend", "urgente"]
  },
  "mensaje": "Tarea creada correctamente",
  "codigo": 201
}
```

---

#### PUT /api/proyectos/:proyectoId/columnas/:columnaId/tareas/:tareaId

Actualiza una tarea.

**Parámetros**:
- `proyectoId` (ruta): ID del proyecto
- `columnaId` (ruta): ID de la columna
- `tareaId` (ruta): ID de la tarea

**Body** (campos a actualizar):
```json
{
  "titulo": "Nuevo título",
  "prioridad": "media",
  "estado": "enProgreso"
}
```

**Respuesta**: Tarea actualizada

---

#### DELETE /api/proyectos/:proyectoId/columnas/:columnaId/tareas/:tareaId

Elimina una tarea.

**Parámetros**:
- `proyectoId` (ruta): ID del proyecto
- `columnaId` (ruta): ID de la columna
- `tareaId` (ruta): ID de la tarea

**Respuesta**:
```json
{
  "exito": true,
  "datos": null,
  "mensaje": "Tarea eliminada correctamente",
  "codigo": 200
}
```

---

#### PATCH /api/tareas/:tareaId/mover

Mueve una tarea de una columna a otra.

**Parámetros**:
- `tareaId` (ruta): ID de la tarea

**Body**:
```json
{
  "columnaBefore": "col-1",
  "columnaAfter": "col-2"
}
```

**Respuesta**: Tarea movida

---

## Tipos de Datos

### Proyecto

```typescript
{
  id: string;                      // ID único
  nombre: string;                  // Nombre del proyecto
  descripcion: string;             // Descripción
  fechaCreacion: Date;             // Fecha de creación
  fechaModificacion: Date;         // Fecha de última modificación
  columnas: Columna[];             // Array de columnas
}
```

### Columna

```typescript
{
  id: string;                      // ID único
  nombre: string;                  // Nombre de la columna
  descripcion: string;             // Descripción
  posicion: number;                // Posición en el tablero
  tareas: Tarea[];                 // Array de tareas
}
```

### Tarea

```typescript
{
  id: string;                      // ID único
  titulo: string;                  // Título de la tarea
  descripcion: string;             // Descripción detallada
  estado: 'pendiente' | 'enProgreso' | 'completada';  // Estado
  prioridad: 'baja' | 'media' | 'alta';  // Prioridad
  fechaCreacion: Date;             // Fecha de creación
  fechaVencimiento?: Date;         // Fecha de vencimiento (opcional)
  asignadoA?: string;              // Usuario asignado (opcional)
  etiquetas: string[];             // Array de etiquetas
}
```

---

## Errores Comunes

### 400 - Bad Request

El nombre del proyecto es requerido:
```json
{
  "exito": false,
  "datos": null,
  "mensaje": "El nombre del proyecto es requerido",
  "codigo": 400
}
```

### 404 - Not Found

Proyecto no encontrado:
```json
{
  "exito": false,
  "datos": null,
  "mensaje": "Proyecto no encontrado",
  "codigo": 404
}
```

### 500 - Internal Server Error

Error del servidor:
```json
{
  "exito": false,
  "datos": null,
  "mensaje": "Error interno del servidor",
  "codigo": 500
}
```

---

## Rate Limiting (Futuro)

Para versiones futuras, se implementará:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1234567890
```

---

## Autenticación (Futuro)

Se usará JWT:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## CORS

La API acepta solicitudes desde:

```
http://localhost:5173     // Desarrollo
https://agiledesk.vercel.app  // Producción
```

---

## Ejemplos en Different Lenguajes

### JavaScript Fetch

```javascript
// Obtener proyectos
const respuesta = await fetch('http://localhost:3000/api/proyectos')
const datos = await respuesta.json()
console.log(datos.datos)

// Crear proyecto
const proyecto = await fetch('http://localhost:3000/api/proyectos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nombre: 'Mi Proyecto',
    descripcion: 'Descripción',
    columnas: []
  })
})
```

### Python Requests

```python
import requests

# Obtener proyectos
response = requests.get('http://localhost:3000/api/proyectos')
print(response.json())

# Crear proyecto
data = {
    'nombre': 'Mi Proyecto',
    'descripcion': 'Descripción',
    'columnas': []
}
response = requests.post('http://localhost:3000/api/proyectos', json=data)
print(response.json())
```

### cURL

```bash
# Obtener proyectos
curl -X GET http://localhost:3000/api/proyectos

# Crear proyecto
curl -X POST http://localhost:3000/api/proyectos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Mi Proyecto","descripcion":"Desc","columnas":[]}'
```

---

## Paginación (Futuro)

```
GET /api/proyectos?pagina=1&limite=10
```

---

## Búsqueda y Filtrado (Futuro)

```
GET /api/proyectos?nombre=*TODO*&estado=activo
```

La API de AgileDesk proporciona una interfaz REST clara y bien documentada para gestionar proyectos y tareas.
