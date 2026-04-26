# Context API y Gestión de Estado Global

## Descripción General

AgileDesk utiliza React Context API para gestionar el estado global de proyectos y tareas. This provides a centralized single source of truth and eliminates prop drilling.

## ProyectoContext

### Propósito

Proporcionar acceso a:
- Lista de proyectos disponibles
- Proyecto actualmente seleccionado
- Funciones CRUD para proyectos
- Funciones CRUD para tareas

### Interface

```typescript
interface InfrastructuraProyecto {
  // Estado
  proyectos: Proyecto[];
  proyectoActual: Proyecto | null;

  // Proyectos
  cargarProyectos: () => Promise<void>;
  crearProyecto: (proyecto: Omit<Proyecto, ...>) => Promise<void>;
  actualizarProyecto: (id: string, proyecto: Partial<Proyecto>) => Promise<void>;
  eliminarProyecto: (id: string) => Promise<void>;
  establecerProyectoActual: (id: string | null) => void;

  // Tareas
  agregarTarea: (columnId: string, tarea: Omit<Tarea, ...>) => Promise<void>;
  actualizarTarea: (columnId: string, tareaId: string, tarea: Partial<Tarea>) => Promise<void>;
  eliminarTarea: (columnId: string, tareaId: string) => Promise<void>;
  moverTarea: (tareaId: string, columnaBefore: string, columnaAfter: string) => Promise<void>;
}
```

## Estructuración del Componente

### ProyectoProvider

Envuelve la aplicación para proporcionar el contexto:

```tsx
import { ProyectoProvider } from './context/ProyectoContext'

function App() {
  return (
    <ProyectoProvider>
      {/* Resto de la aplicación */}
    </ProyectoProvider>
  )
}
```

### useProyecto Hook

Hook personalizado para acceder al contexto:

```typescript
export function useProyecto(): InfrastructuraProyecto {
  const contexto = useContext(ProyectoContext)
  if (!contexto) {
    throw new Error('useProyecto debe usarse dentro de ProyectoProvider')
  }
  return contexto
}
```

Esta verificación previene errores si se usa fuera del Provider.

## Ejemplos de Uso

### Cargar Proyectos al Montar

```tsx
function PaginaPrincipal() {
  const { proyectos, cargarProyectos } = useProyecto()

  useEffect(() => {
    cargarProyectos()
  }, [cargarProyectos])

  return (
    <div>
      {proyectos.map(p => (
        <Tarjeta key={p.id}>{p.nombre}</Tarjeta>
      ))}
    </div>
  )
}
```

### Crear Nuevo Proyecto

```tsx
function FormularioProyecto() {
  const { crearProyecto } = useProyecto()

  const handleSubmit = async (datos) => {
    try {
      await crearProyecto({
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        columnas: [...columnasDefault],
      })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return <form onSubmit={handleSubmit}>{/* ... */}</form>
}
```

### Seleccionar Proyecto Activo

```tsx
function ListaProyectos() {
  const { proyectos, proyectoActual, establecerProyectoActual } = useProyecto()

  return (
    <div className="space-y-2">
      {proyectos.map(p => (
        <button
          key={p.id}
          onClick={() => establecerProyectoActual(p.id)}
          className={proyectoActual?.id === p.id ? 'font-bold' : ''}
        >
          {p.nombre}
        </button>
      ))}
    </div>
  )
}
```

### Agregar Tarea a Columna

```tsx
function FormularioTarea() {
  const { agregarTarea } = useProyecto()
  const columnId = 'col-123' // Del contexto o props

  const handleAgregarTarea = async (titulo, descripcion) => {
    await agregarTarea(columnId, {
      titulo,
      descripcion,
      estado: 'pendiente',
      prioridad: 'media',
      etiquetas: [],
    })
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleAgregarTarea(titulo, descripcion)
    }}>
      {/* Campos del formulario */}
    </form>
  )
}
```

### Actualizar Tarea

```tsx
function TareaEditora({ tareaId, columnId }) {
  const { actualizarTarea } = useProyecto()

  const handleActualizar = async (nuevosDatos) => {
    await actualizarTarea(columnId, tareaId, {
      titulo: nuevosDatos.titulo,
      prioridad: nuevosDatos.prioridad,
    })
  }

  return (
    <button onClick={() => handleActualizar(datos)}>
      Guardar cambios
    </button>
  )
}
```

## Flujo de Datos

### Cargar Proyectos

```
Usuario accede a la app
       ↓
useEffect en PaginaPrincipal
       ↓
Llama cargarProyectos()
       ↓
Intenta fetch('/api/proyectos')
       ↓
      ✓ Éxito: setProyectos(datos)
      ✗ Error: Carga desde LocalStorage
       ↓
render con proyectos actualizado
```

### Crear Tarea

```
Usuario click en "Agregar Tarea"
       ↓
Modal se abre con formulario
       ↓
Usuario llena datos y submite
       ↓
handleCrearTarea() → agregarTarea()
       ↓
fetch POST '/api/columnas/{id}/tareas'
       ↓
      ✓ Éxito: cargarProyectos() (sincroniza estado)
       ↓
UI se actualiza automáticamente
```

## Sincronización con Backend

### Estrategia

1. **Capa de Red**: ClienteAPI maneja requests HTTP
2. **Context**: Mantiene estado sincronizado
3. **LocalStorage**: Fallback si API no disponible

### Handler Genérico de Errores

```typescript
try {
  const respuesta = await fetch(url)
  if (!respuesta.ok) {
    throw new Error(`Error: ${respuesta.statusText}`)
  }
  const datos = await respuesta.json()
  setProyectos(datos)
} catch (error) {
  console.error('Error:', error)
  // Carga desde localStorage
}
```

## Patterns Avanzados

### Optimistic Updates

Para mejor UX, actualizar UI antes de confirmación del servidor:

```typescript
const actualizarTareaBacking = useCallback(async (... datos) => {
  // Actualiza estado inmediatamente (optimistic)
  const proyectoAnterior = proyectoActual
  setProyectoActual(previo => ({...previo, tareas: [...]}))

  try {
    // Confirma en servidor
    await fetch('/api/tareas', { ... })
  } catch (error) {
    // Revierte si falla
    setProyectoActual(proyectoAnterior)
  }
}, [])
```

### Memoización de Valores

Para evitar renders innecesarios:

```typescript
const valor = useMemo(() => ({
  proyectos,
  proyectoActual,
  cargarProyectos,
  // ... más funciones
}), [proyectos, proyectoActual])

return (
  <ProyectoContext.Provider value={valor}>
    {children}
  </ProyectoContext.Provider>
)
```

## Testing

### Mock del Contexto

```typescript
import { renderHook, act } from '@testing-library/react'
import { ProyectoProvider } from './ProyectoContext'

test('useProyecto retorna proyectos', () => {
  const wrapper = ({ children }) => (
    <ProyectoProvider>{children}</ProyectoProvider>
  )

  const { result } = renderHook(() => useProyecto(), { wrapper })

  act(() => {
    result.current.cargarProyectos()
  })

  expect(result.current.proyectos).toBeDefined()
})
```

## Escalabilidad

### Para proyectos más grandes:

1. **Dividir contextos**: Un contexto por dominio (Proyectos, Usuarios, etc.)
2. **Migrara Redux**: Si el estado es muy complejo
3. **Usar Zustand**: Alternativa ligera a Redux
4. **Implementar Redux Middleware**: Para manejo de efectos secundarios

### Ejemplo de múltiples contextos:

```tsx
<ProyectoProvider>
  <UsuarioProvider>
    <NotificacionesProvider>
      <App />
    </NotificacionesProvider>
  </UsuarioProvider>
</ProyectoProvider>
```

## Performance Optimization

### Evitar renders innecesarios

```typescript
// ❌ Malo: Se renderiza todo cambio
const valor = {
  proyectos,
  incrementarContador: () => setContador(c => c + 1),
}

// ✓ Bueno: Usa useMemo
const valor = useMemo(() => ({
  proyectos,
  incrementarContador: useCallback(() => ..., []),
}), [proyectos])
```

### Selectors (Future optimization)

```typescript
const obtenerProyectosPorPrioridad = (prioridad) => {
  return proyectos.filter(p => p.prioridad === prioridad)
}
```

El Context API de AgileDesk proporciona una base sólida para gestión de estado que puede evolucionar según las necesidades del proyecto.
