# Hooks Personalizados

## Descripción General

Los hooks personalizados encapsulan lógica reutilizable de React. En AgileDesk, tenemos dos hooks principales que abstraen patrones comunes.

## useFetch

### Propósito

Manejar solicitudes HTTP con gestión automática de states (cargando, datos, error).

### Firma

```typescript
function useFetch<T = unknown>(
  url: string,
  opciones?: RequestInit
): EstadoRed & { refrescar: () => Promise<void> }
```

### Valores retornados

```typescript
{
  cargando: boolean;          // True mientras se carga
  error: string | null;       // Mensaje de error o null
  datos: T | null;            // Datos obtenidos o null
  refrescar: () => Promise<void>  // Función para refrescar datos
}
```

### Ejemplo de uso

```tsx
import { useFetch } from '../hooks'

function ListaProyectos() {
  const { cargando, error, datos: proyectos, refrescar } = useFetch(
    '/api/proyectos'
  )

  if (cargando) return <Cargador />
  if (error) return <Alerta tipo="error" mensaje={error} />

  return (
    <>
      {proyectos.map(p => (
        <Tarjeta key={p.id}>{p.nombre}</Tarjeta>
      ))}
      <Boton onClick={refrescar}>Recargar</Boton>
    </>
  )
}
```

### Casos de uso

1. **Cargar datos inicialmente**
   ```tsx
   const { datos, cargando } = useFetch('/api/proyectos')
   ```

2. **Con refrescamiento manual**
   ```tsx
   const { refrescar, cargando } = useFetch('/api/proyectos')
   
   const handleRefresh = async () => {
     await refrescar()
   }
   ```

3. **Con opciones personalizadas**
   ```tsx
   const { datos } = useFetch('/api/proyectos/$n{id}', {
     headers: { 'Authorization': 'Bearer token' }
   })
   ```

### Internals

- Ejecuta fetch en `useEffect` al montar
- Maneja errores automáticamente
- Permite refrescamiento manual
- Cambios de `url` triggean nuevo fetch

---

## useFormulario

### Propósito

Manejar estado compartido de formularios con validación y envío automático.

### Firma

```typescript
function useFormulario<T extends Record<string, unknown>>(
  valoresIniciales: T,
  onSubmit: (valores: T) => Promise<void>
): {
  valores: T;
  errores: Record<string, string>;
  cargando: boolean;
  cambiar: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  enviar: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  establecer: (campo: keyof T, valor: unknown) => void;
  reiniciar: () => void;
}
```

### Valores retornados

```typescript
{
  valores: T;                     // Estado actual del formulario
  errores: Record<string, string>;  // Errores por campo
  cargando: boolean;              // True durante envío
  cambiar: (e) => void;           // Handler para cambios de input
  enviar: (e) => Promise<void>;   // Handler para form submit
  establecer: (campo, valor) => void;  // Set manual de campo
  reiniciar: () => void;          // Reset a valores iniciales
}
```

### Ejemplo de uso

```tsx
import { useFormulario } from '../hooks'

interface FormularioProyectoData {
  nombre: string;
  descripcion: string;
}

function FormularioProyecto() {
  const { valores, errores, cargando, cambiar, enviar, reiniciar } =
    useFormulario<FormularioProyectoData>(
      { nombre: '', descripcion: '' },
      async (valores) => {
        // Lógica de envío
        await fetch('/api/proyectos', {
          method: 'POST',
          body: JSON.stringify(valores),
        })
      }
    )

  return (
    <form onSubmit={enviar} className="space-y-4">
      <Entrada
        etiqueta="Nombre del Proyecto"
        name="nombre"
        value={valores.nombre}
        onChange={cambiar}
        error={errores.nombre}
        disabled={cargando}
      />

      <Entrada
        etiqueta="Descripción"
        name="descripcion"
        value={valores.descripcion}
        onChange={cambiar}
        error={errores.descripcion}
        disabled={cargando}
        as="textarea"
      />

      {errores.general && (
        <Alerta tipo="error" mensaje={errores.general} />
      )}

      <div className="flex gap-3">
        <Boton type="submit" disabled={cargando}>
          {cargando ? 'Guardando...' : 'Guardar'}
        </Boton>
        <Boton variante="secundario" onClick={reiniciar}>
          Limpiar
        </Boton>
      </div>
    </form>
  )
}
```

### Características automáticas

1. **Limpieza de errores**: Al escribir en un campo, su error se borra
2. **Reinicio automático**: Después de envío exitoso, vuelve a valores iniciales
3. **Disable durante carga**: Los inputs se deshabilitan mientras envía
4. **Manejo de errores**: Los errores se capturan en `errores.general`

### Técnicas avanzadas

#### Validación personalizada

```tsx
const handleSubmit = async (valores: FormularioProyectoData) => {
  if (!valores.nombre.trim()) {
    throw new Error('El nombre es obligatorio')
  }
  // Continúa con el envío
}

const form = useFormulario({ nombre: '', descripcion: '' }, handleSubmit)
```

#### Establecer valores dinámicamente

```tsx
// Para editar un proyecto existente
useEffect(() => {
  if (proyecto) {
    establecer('nombre', proyecto.nombre)
    establecer('descripcion', proyecto.descripcion)
  }
}, [proyecto, establecer])
```

#### Validación de campos relacionados

```tsx
const handleSubmit = async (valores) => {
  if (valores.fecha_vencimiento < new Date()) {
    throw new Error('La fecha debe ser futura')
  }
  // ...
}
```

---

## Creando tu propio Hook

### Patrón recomendado

```typescript
/**
 * Descripción clara de qué hace el hook
 * 
 * @template T - Tipo genérico si aplica
 * @param param1 - Descripción del parámetro
 * @returns Objeto controlador
 */
export function useNombreDelHook<T>(
  param1: SomeType
): ReturnType {
  // Estado
  const [estado, setEstado] = useState<SomeType>()

  // Efectos
  useEffect(() => {
    // Lógica
  }, [/* dependencias */])

  // Callbacks memoizados
  const callback = useCallback(() => {
    // Función reutilizable
  }, [/* dependencias */])

  // Retorna interfaz clara
  return {
    estado,
    actualizarEstado: setEstado,
    executeCallback: callback,
  }
}
```

### Ejemplo: useLocalStorage

```typescript
export function useLocalStorage<T>(
  clave: string,
  valorInicial: T
): [T, (valor: T) => void] {
  const [valor, setValor] = useState<T>(() => {
    const item = window.localStorage.getItem(clave)
    return item ? JSON.parse(item) : valorInicial
  })

  const guardar = useCallback((nuevoValor: T) => {
    setValor(nuevoValor)
    window.localStorage.setItem(clave, JSON.stringify(nuevoValor))
  }, [clave])

  return [valor, guardar]
}
```

Uso:
```tsx
const [proyectos, setProyectos] = useLocalStorage('proyectos', [])
```

---

## Best Practices

1. **Nombres prefijados con "use"**: Indica que es un hook de React
2. **Retorna un objeto claro**: Facilita destructuring
3. **Documentación JSDoc**: Explica parámetros y retorno
4. **Dependencias correctas**: useEffect debe tener todas las dependencias
5. **Manejo de errores**: Propagar errores de forma clara
6. **Cleanup functions**: useEffect debe limpiar recursos si es necesario
7. **Memoización apropiada**: useCallback/useMemo solo cuando sea necesario

---

## Testing de Hooks

```typescript
import { renderHook, act } from '@testing-library/react'
import { useFormulario } from './useFormulario'

test('useFormulario actualiza valores', () => {
  const { result } = renderHook(() =>
    useFormulario(
      { nombre: '' },
      async () => {}
    )
  )

  act(() => {
    result.current.establecer('nombre', 'Test')
  })

  expect(result.current.valores.nombre).toBe('Test')
})
```

Esta estructura de hooks reutilizables fomenta código limpio, mantenible y testeable.
