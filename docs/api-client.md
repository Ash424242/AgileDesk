# Cliente HTTP Tipado

## Descripción General

El cliente HTTP (`src/api/cliente.ts`) proporciona una interfaz tipada para comunicarse con la API REST. Implementa:

- **Type Safety**: Todo tipado con TypeScript
- **Gestión de Errores**: Manejo consistente de errores
- **Configuración Centralizada**: Un único lugar para la URL base
- **Reutilización**: Funciones confiables para todas las operaciones

## Configuración Base

```typescript
const URL_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
```

### Variables de Entorno

Crear archivo `.env.local`:

```
VITE_API_URL=http://localhost:3000
```

Para producción, en variables de GitHub Actions o del proveedor de hosting:

```
VITE_API_URL=https://agiledesk-api.railway.app
```

## Función Base: solicitud()

```typescript
async function solicitud<T>(
  ruta: string,
  opciones: RequestInit = {}
): Promise<T>
```

Proporciona:
- Headers automáticos
- Manejo centralizador de errores
- Consistencia en las respuestas

### Ejemplo de uso interno:

```typescript
// En ClienteAPI.obtenerProyectos()
return solicitud('/api/proyectos')
```

## API de Proyectos

### ClienteAPI.obtenerProyectos()

Obtiene todos los proyectos.

```typescript
const respuesta = await ClienteAPI.obtenerProyectos()
// RespuestaAPI<Proyecto[]>

if (respuesta.exito) {
  console.log(respuesta.datos)  // Proyecto[]
} else {
  console.error(respuesta.mensaje)
}
```

---

### ClienteAPI.obtenerProyecto(id)

Obtiene un proyecto específico.

```typescript
const respuesta = await ClienteAPI.obtenerProyecto('proyecto-1')
// RespuestaAPI<Proyecto>

const proyecto = respuesta.datos
```

---

### ClienteAPI.crearProyecto(proyecto)

Crea un nuevo proyecto.

```typescript
const nuevoProyecto = await ClienteAPI.crearProyecto({
  nombre: 'Mi Nuevo Proyecto',
  descripcion: 'Una descripción',
  columnas: [
    {
      id: 'col-1',
      nombre: 'Por Hacer',
      descripcion: 'Tareas pendientes',
      posicion: 1,
      tareas: [],
    },
  ],
})

if (nuevoProyecto.exito) {
  console.log('Proyecto creado:', nuevoProyecto.datos.id)
}
```

---

### ClienteAPI.actualizarProyecto(id, proyecto)

Actualiza un proyecto existente.

```typescript
const actualizado = await ClienteAPI.actualizarProyecto('proyecto-1', {
  nombre: 'Nombre Actualizado',
  descripcion: 'Nueva descripción',
})
```

---

### ClienteAPI.eliminarProyecto(id)

Elimina un proyecto.

```typescript
const respuesta = await ClienteAPI.eliminarProyecto('proyecto-1')

if (respuesta.exito) {
  console.log('Proyecto eliminado')
}
```

---

## API de Tareas

### ClienteAPI.crearTarea(columnaId, tarea)

Crea una nueva tarea en una columna.

```typescript
const nuevaTarea = await ClienteAPI.crearTarea('col-1', {
  titulo: 'Implementar validación',
  descripcion: 'Agregar validación de inputs',
  estado: 'pendiente',
  prioridad: 'alta',
  etiquetas: ['backend', 'importante'],
})

console.log(nuevaTarea.datos.id)  // ID de la tarea creada
```

---

### ClienteAPI.actualizarTarea(columnaId, tareaId, tarea)

Actualiza una tarea existente.

```typescript
const actualizada = await ClienteAPI.actualizarTarea(
  'col-1',
  'tarea-1',
  {
    estado: 'enProgreso',
    prioridad: 'media',
  }
)
```

---

### ClienteAPI.eliminarTarea(columnaId, tareaId)

Elimina una tarea.

```typescript
const respuesta = await ClienteAPI.eliminarTarea('col-1', 'tarea-1')

if (respuesta.exito) {
  console.log('Tarea eliminada')
}
```

---

### ClienteAPI.moverTarea(tareaId, columnaBefore, columnaAfter)

Mueve una tarea entre columnas.

```typescript
const tareaMovida = await ClienteAPI.moverTarea(
  'tarea-1',
  'col-1',       // De esta columna
  'col-2'        // A esta columna
)

console.log('Tarea movida a:', tareaMovida.datos.estado)
```

---

## Manejo de Errores

### Try-Catch

```typescript
try {
  const respuesta = await ClienteAPI.obtenerProyectos()
  console.log(respuesta.datos)
} catch (error) {
  if (error instanceof Error) {
    console.error('Error:', error.message)
  }
}
```

### Con validación de respuesta

```typescript
const respuesta = await ClienteAPI.obtenerProyectos()

if (!respuesta.exito) {
  console.error(respuesta.mensaje)
  // Mostrar alerta al usuario
  return
}

// Procede con seguridad
const proyectos = respuesta.datos
```

---

## Integración con Context

El Context API usa internamente el ClienteAPI:

```typescript
// En ProyectoContext.tsx
const cargarProyectos = useCallback(async () => {
  try {
    const respuesta = await ClienteAPI.obtenerProyectos()
    if (!respuesta.exito) throw new Error(respuesta.mensaje)
    setProyectos(respuesta.datos)
  } catch (error) {
    console.error('Error:', error)
    // Carga desde LocalStorage como fallback
  }
}, [])
```

---

## Integración con useFetch

Para solicitudes simples sin gestión de estado compleja:

```typescript
import { useFetch } from '../hooks'

function ListaProyectos() {
  const { cargando, error, datos: respuesta } = useFetch(
    '/api/proyectos'
  )

  if (cargando) return <Cargador />
  if (error) return <Alerta tipo="error" mensaje={error} />

  const proyectos = respuesta?.datos || []
  return (
    <div>
      {proyectos.map(p => (
        <Tarjeta key={p.id}>{p.nombre}</Tarjeta>
      ))}
    </div>
  )
}
```

---

## Tipos Compartidos

Todos los tipos se definen en `src/types/index.ts`:

```typescript
export interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  columnas: Columna[];
}

export interface RespuestaAPI<T = unknown> {
  exito: boolean;
  datos: T;
  mensaje: string;
  codigo: number;
}
```

El cliente está 100% tipado, garantizando que:
- Los datos pasados sean válidos
- Las respuestas sean las esperadas
- Los errores se deteñen en compilación si es posible

---

## Ejemplos de Flujos Complejos

### Crear Proyecto y Cargar Inmediatamente

```typescript
async function crearYCargarProyecto(datos) {
  try {
    // 1. Crear proyecto
    const respuesta = await ClienteAPI.crearProyecto(datos)
    if (!respuesta.exito) throw new Error(respuesta.mensaje)

    const nuevoProyecto = respuesta.datos

    // 2. Obtener detalles completos (si es necesario)
    const detalles = await ClienteAPI.obtenerProyecto(nuevoProyecto.id)

    // 3. Retornar proyecto con detalles
    return detalles.datos
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
```

### Mover Tarea y Actualizar Estado Local

```typescript
async function moverTareaYActualizar(tareaId, columnaBefore, columnaAfter) {
  try {
    // 1. Mueve en servidor
    const respuesta = await ClienteAPI.moverTarea(
      tareaId,
      columnaBefore,
      columnaAfter
    )

    if (!respuesta.exito) {
      throw new Error(respuesta.mensaje)
    }

    // 2. Actualiza estado local (ya que Context sincroniza)
    await cargarProyectos()

    // 3. Muestra confirmación
    mostrarAlerta('Tarea movida exitosamente')
  } catch (error) {
    mostrarAlerta(`Error: ${error.message}`, 'error')
    throw error
  }
}
```

---

## Testing del Cliente

### Mock de Responses

```typescript
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  rest.get('/api/proyectos', (req, res, ctx) => {
    return res(
      ctx.json({
        exito: true,
        datos: [{ id: '1', nombre: 'Test' }],
        mensaje: 'OK',
        codigo: 200,
      })
    )
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('obtenerProyectos retorna proyectos', async () => {
  const respuesta = await ClienteAPI.obtenerProyectos()
  expect(respuesta.exito).toBe(true)
  expect(respuesta.datos).toHaveLength(1)
})
```

---

## Extensiones Futuras

### Agregar Caché

```typescript
const caché = new Map()

async function solicitudConCaché<T>(
  ruta: string,
  opciones: RequestInit = {}
): Promise<T> {
  if (caché.has(ruta)) {
    return caché.get(ruta)
  }

  const resultado = await solicitud<T>(ruta, opciones)
  caché.set(ruta, resultado)
  return resultado
}
```

### Agregar Retry

```typescript
async function solicitudConReintento<T>(
  ruta: string,
  opciones: RequestInit = {},
  intentos: number = 3
): Promise<T> {
  for (let i = 0; i < intentos; i++) {
    try {
      return await solicitud<T>(ruta, opciones)
    } catch (error) {
      if (i === intentos - 1) throw error
      await delay(1000 * (i + 1))  // Espera exponencial
    }
  }
  throw new Error('No se pudo completar la solicitud')
}
```

### Agregar Interceptores

```typescript
interface Interceptor {
  onRequest?(config: RequestInit): RequestInit;
  onResponse?(response: Response): Response;
  onError?(error: Error): Error;
}

const interceptor: Interceptor = {
  onRequest: (config) => ({
    ...config,
    headers: {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    },
  }),
}
```

El cliente HTTP proporciona una capa robusta y tipada entre la UI y la API, garantizando la coherencia y facilitando el mantenimiento.
