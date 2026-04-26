# Componentes Reutilizables

## Descripción General

AgileDesk proporciona un conjunto de componentes reutilizables que forman la base de la interfaz. Cada componente está diseñado con los siguientes principios:

- **Composición**: Combinables para crear interfaces complejas
- **Props tipadas**: TypeScript garantiza uso correcto
- **Accesibilidad**: Semántica HTML apropiada
- **Flexibilidad**: Soporta personalización mediante props

## Componentes Base

### 1. Encabezado

**Propósito**: Mostrar títulos y subtítulos de secciones

**Props**:
```typescript
interface EncabezadoProps {
  titulo: string;           // Texto principal
  subtitulo?: string;       // Texto secundario
  acciones?: ReactNode;     // Botones o elementos de acción
}
```

**Ejemplo de uso**:
```tsx
<Encabezado
  titulo="Mis Proyectos"
  subtitulo="Gestiona todos tus proyectos"
  acciones={<Boton onClick={...}>Nuevo Proyecto</Boton>}
/>
```

**Estilos**:
- Título: 4xl, bold, gris-900
- Subtítulo: gris-600, margen superior
- Acciones: alineadas a la derecha

---

### 2. Tarjeta

**Propósito**: Contenedor versátil para agrupar contenido

**Props**:
```typescript
interface TarjetaProps {
  children: ReactNode;      // Contenido
  className?: string;       // Clases Tailwind adicionales
  onClick?: () => void;     // Callback al hacer clic
}
```

**Ejemplo de uso**:
```tsx
<Tarjeta onClick={() => seleccionarProyecto(id)}>
  <h3 className="font-bold">{proyecto.nombre}</h3>
  <p className="text-gray-600">{proyecto.descripcion}</p>
</Tarjeta>
```

**Estilos**:
- Fondo blanco
- Sombra suave con hover effect
- Border radius lg
- Padding: 1.5rem (p-6)
- Cursor pointer si tiene onClick

---

### 3. Botón

**Propósito**: Elemento interactivo para acciones

**Props**:
```typescript
interface BotonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario' | 'peligro';
  tamaño?: 'pequeño' | 'mediano' | 'grande';
  children: ReactNode;
}
```

**Variantes**:

| Variante | Fondo | Hover | Uso |
|----------|-------|-------|-----|
| primario | primary-500 | primary-600 | Acciones principales |
| secundario | gray-200 | gray-300 | Acciones secundarias |
| peligro | red-500 | red-600 | Eliminar, cancelar |

**Tamaños**:

| Tamaño | Padding | Font Size |
|--------|---------|-----------|
| pequeño | px-3 py-1 | sm |
| mediano | px-4 py-2 | base |
| grande | px-6 py-3 | lg |

**Ejemplo de uso**:
```tsx
<Boton variante="primario" tamaño="grande">
  Crear Proyecto
</Boton>

<Boton variante="peligro" tamaño="pequeño">
  Eliminar
</Boton>
```

---

### 4. Entrada

**Propósito**: Campo de texto para formularios

**Props**:
```typescript
interface EntradaProps extends InputHTMLAttributes<HTMLInputElement> {
  etiqueta?: string;        // Label descriptivo
  error?: string;           // Mensaje de error
}
```

**Ejemplo de uso**:
```tsx
<Entrada
  etiqueta="Nombre de usuario"
  placeholder="ejemplo@email.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errores.email}
/>
```

**Estilos**:
- Border gris-300 normal, rojo-500 si hay error
- Focus: ring-2 primary-500
- Padding: 0.5rem 1rem
- Label: font-medium, gris-700, pequeño

---

### 5. Selector

**Propósito**: Dropdown para seleccionar opciones

**Props**:
```typescript
interface OpcionSelector {
  valor: string | number;
  etiqueta: string;
}

interface SelectorProps extends SelectHTMLAttributes<HTMLSelectElement> {
  etiqueta?: string;
  error?: string;
  opciones: OpcionSelector[];
  placeholder?: string;
}
```

**Ejemplo de uso**:
```tsx
<Selector
  etiqueta="Prioridad"
  opciones={[
    { valor: 'baja', etiqueta: 'Baja' },
    { valor: 'media', etiqueta: 'Media' },
    { valor: 'alta', etiqueta: 'Alta' },
  ]}
  value={prioridad}
  onChange={(e) => setPrioridad(e.target.value)}
/>
```

**Estilos**:
- Similar a Entrada
- Border gris-300, focus primary-500
- Fondo blanco

---

### 6. Modal

**Propósito**: Diálogo modalque requiere interacción

**Props**:
```typescript
interface ModalProps {
  titulo: string;           // Encabezado del modal
  abierto: boolean;         // Controla visibilidad
  onCerrar: () => void;     // Callback al cerrar
  children: ReactNode;      // Contenido
  acciones?: ReactNode;     // Botones de acción (derecha)
}
```

**Ejemplo de uso**:
```tsx
<Modal
  titulo="Crear Nuevo Proyecto"
  abierto={modalAbierto}
  onCerrar={() => setModalAbierto(false)}
  acciones={<Boton onClick={handleSubmit}>Crear</Boton>}
>
  <Entrada etiqueta="Nombre" value={nombre} onChange={...} />
</Modal>
```

**Comportamiento**:
- Overlay oscuro (50% opacity) con click-to-close
- Centrado en pantalla
- Max-width: 28rem (md)
- z-index: 50

---

### 7. Cargador

**Propósito**: Indicador de carga

**Props**: Ninguna props

**Ejemplo de uso**:
```tsx
{cargando ? <Cargador /> : <ContenidoPrincipal />}
```

**Estilos**:
- Spinner animado
- 3rem tamaño
- Color primary-500

---

### 8. Alerta

**Propósito**: Mostrar mensajes de estado

**Props**:
```typescript
interface AlertaProps {
  tipo: 'exito' | 'error' | 'advertencia' | 'informacion';
  titulo: string;
  mensaje: string;
  acciones?: ReactNode;
}
```

**Tipos**:

| Tipo | Color | Ícono |
|------|-------|-------|
| exito | green | ✓ |
| error | red | ✕ |
| advertencia | yellow | ⚠ |
| informacion | blue | ℹ |

**Ejemplo de uso**:
```tsx
{error && (
  <Alerta
    tipo="error"
    titulo="Error"
    mensaje={error}
  />
)}
```

---

### 9. Layout

**Propósito**: Estructura principal de la aplicación

**Estructura**:
```
Layout
├── Navegacion (header)
└── Main (contenido dinámico)
    └── Outlet (react-router)
```

**Propiedades**:
- Fondo gris-50
- Min-height: 100vh
- Container centered

---

### 10. Navegación

**Propósito**: Header con logo y opciones

**Contenido**:
- Logo "AgileDesk"
- Proyecto actual (si existe)
- Link a inicio
- Información del equipo

**Estilos**:
- Fondo blanco
- Shadow md
- Sticky top

---

## Composición de Componentes

### Ejemplo: Tablero Kanban

```tsx
<div className="space-y-6">
  <Encabezado
    titulo={proyecto.nombre}
    acciones={
      <Boton onClick={() => setModalAbierto(true)}>
        Nueva Tarea
      </Boton>
    }
  />

  {error && <Alerta tipo="error" titulo="Error" mensaje={error} />}

  <div className="grid grid-cols-3 gap-6">
    {proyecto.columnas.map(columna => (
      <div key={columna.id}>
        <div className="bg-gray-200 p-4 rounded">
          <h3>{columna.nombre}</h3>
        </div>

        <div className="space-y-3">
          {columna.tareas.map(tarea => (
            <Tarjeta key={tarea.id}>
              <h4>{tarea.titulo}</h4>
              <p className="text-sm text-gray-600">{tarea.descripcion}</p>
            </Tarjeta>
          ))}
        </div>

        <Boton
          variante="secundario"
          className="w-full mt-3"
          onClick={() => agregarTarea(columna.id)}
        >
          + Agregar
        </Boton>
      </div>
    ))}
  </div>

  <Modal
    titulo="Nueva Tarea"
    abierto={modalAbierto}
    onCerrar={() => setModalAbierto(false)}
    acciones={<Boton onClick={manejarCrear}>Crear</Boton>}
  >
    <FormularioTarea />
  </Modal>
</div>
```

## Principios de Uso

1. **Props por defecto**: Los componentes tienen valores sensatos por defecto
2. **Extensión via className**: Los usuarios pueden extender estilos
3. **Tipado completo**: TypeScript garantiza seguridad
4. **Accesibilidad**: Semántica HTML apropiada (`<button>`, `<input>`, etc.)
5. **Consistencia**: Paleta de colores y espaciado uniforme

## Personalización de Estilos

### Tailwind CSS

Todos los componentes usan Tailwind. Para personalizar:

```tsx
// Cambiar colores primarios
<Boton className="bg-blue-500 hover:bg-blue-600">
  
// Agregar margen adicional
<Tarjeta className="mb-4">

// Cambiar tamaño
<Entrada className="text-lg px-6 py-4" />
```

### Configuración Tailwind

En `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        50: "#f0f9ff",
        500: "#0ea5e9",
        600: "#0284c7",
        // ... más colores
      },
    },
  },
}
```

## Testing de Componentes

Ejemplo con React Testing Library:

```tsx
import { render, screen } from '@testing-library/react'
import Boton from './Boton'

test('Boton renders with correct text', () => {
  render(<Boton>Click Me</Boton>)
  expect(screen.getByText('Click Me')).toBeInTheDocument()
})
```

## Migración Futura

Si el proyecto crece, estos componentes pueden:

1. Migrarse a una librería como Headless UI
2. Combinarse con Storybook para documentación
3. Ser parte de un design system compartido
4. Usarse en proyectos hermanos

Esta estructura de componentes proporciona flexibilidad, mantenibilidad y una base sólida para crecer.
