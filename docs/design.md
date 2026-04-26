# Arquitectura de la Aplicación

## Descripción General

AgileDesk sigue una arquitectura de **tres capas** (frontend, API, backend) con responsabilidades claramente separadas. Esto permite escalabilidad, mantenibilidad y facilita pruebas.

## Arquitectura de Capas

```
┌─────────────────────────────────────┐
│     Frontend (React + TypeScript)    │
│  - Componentes UI                   │
│  - Gestión de estado (Context API)  │
│  - Enrutamiento                     │
└──────────────┬──────────────────────┘
               │ HTTP REST
┌──────────────v──────────────────────┐
│     API REST (Express)              │
│  - Validación de inputs             │
│  - Manejo de rutas                  │
│  - Manejo de errores                │
└──────────────┬──────────────────────┘
               │ Objetos de negocio
┌──────────────v──────────────────────┐
│     Backend (Servicios)             │
│  - Lógica de negocio                │
│  - Gestión de datos                 │
│  - Persistencia                     │
└─────────────────────────────────────┘
```

## Estructura del Frontend

### Carpetas Principales

```
src/
├── components/        # Componentes reutilizables
│   ├── Encabezado.tsx
│   ├── Tarjeta.tsx
│   ├── Boton.tsx
│   ├── Entrada.tsx
│   ├── Selector.tsx
│   ├── Modal.tsx
│   ├── Cargador.tsx
│   ├── Alerta.tsx
│   ├── Layout.tsx
│   ├── Navegacion.tsx
│   └── index.ts       # Exports principales
│
├── pages/             # Páginas/vistas de la aplicación
│   ├── PaginaPrincipal.tsx
│   ├── Pagina404.tsx
│   └── componentes/   # Componentes específicos de páginas
│       ├── FormularioProyecto.tsx
│       └── TableroKanban.tsx
│
├── context/           # Context API para estado global
│   └── ProyectoContext.tsx
│
├── hooks/             # Hooks personalizados
│   ├── useFetch.ts
│   ├── useFormulario.ts
│   └── index.ts
│
├── api/               # Cliente HTTP tipado
│   └── cliente.ts
│
├── types/             # Definiciones de tipos TypeScript
│   └── index.ts
│
├── utils/             # Funciones utilitarias
│   └── (a rellenar según necesidad)
│
├── App.tsx            # Componente raíz
├── App.css            # Estilos globales
├── index.css          # Reset y estilos de Tailwind
└── main.tsx           # Punto de entrada
```

### Flujo de Componentes

```
App
├── ProyectoProvider (Context)
└── BrowserRouter
    └── Routes
        ├── Layout
        │   ├── Navegacion
        │   └── PaginaPrincipal
        │       ├── Encabezado
        │       ├── Tarjeta (proyectos)
        │       ├── Modal (nuevo proyecto)
        │       │   └── FormularioProyecto
        │       └── TableroKanban
        │           ├── Columna
        │           ├── Tarjeta (tareas)
        │           └── Modal (nueva tarea)
        └── Pagina404
```

## Estructura del Backend

### Carpetas Principales

```
server/
├── src/
│   ├── index.ts              # Punto de entrada
│   │
│   ├── routes/
│   │   └── proyectos.ts      # Definición de rutas
│   │
│   ├── controllers/
│   │   └── ControladorProyectos.ts  # Manejadores de solicitudes
│   │
│   ├── services/
│   │   └── ServicioProyectos.ts     # Lógica de negocio
│   │
│   └── config/
│       └── (configuración según necesidad)
│
├── dist/                     # Salida compilada
├── tsconfig.json
└── package.json
```

### Arquitectura MVC del Backend

```
Request HTTP
    ↓
Router (rutas.ts)
    ↓
Controlador (validación, formato respuesta)
    ↓
Servicio (lógica de negocio)
    ↓
Base de datos / Almacenamiento
    ↓
Respuesta HTTP
```

## Flujo de Datos

### Obtener Proyectos

```
Usuario → UI (PaginaPrincipal)
  ↓
  useEffect → cargarProyectos()
  ↓
  useProyecto → ProyectoContext
  ↓
  ClienteAPI.obtenerProyectos()
  ↓
  fetch('/api/proyectos')
  ↓
  Express Router
  ↓
  ControladorProyectos.obtenerTodos()
  ↓
  ServicioProyectos.obtenerTodos()
  ↓
  Retorna array de Proyectos
  ↓
  Renderiza en UI
```

### Crear Nueva Tarea

```
Usuario → Formulario
  ↓
  onClick "Crear" → manejarCrearTarea()
  ↓
  useProyecto.agregarTarea()
  ↓
  ClienteAPI.crearTarea()
  ↓
  fetch POST '/api/columnas/{columnId}/tareas'
  ↓
  ControladorProyectos.crearTarea()
  ↓
  Validación de inputs
  ↓
  ServicioProyectos.agregarTarea()
  ↓
  Persiste en estructura de datos
  ↓
  Retorna tarea creada
  ↓
  Actualiza UI con nueva tarea
```

## Tipos de Datos Principales

### Proyecto

```typescript
interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  columnas: Columna[];
}
```

### Columna

```typescript
interface Columna {
  id: string;
  nombre: string;
  descripcion: string;
  posicion: number;
  tareas: Tarea[];
}
```

### Tarea

```typescript
interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  estado: 'pendiente' | 'enProgreso' | 'completada';
  prioridad: 'baja' | 'media' | 'alta';
  fechaCreacion: Date;
  fechaVencimiento?: Date;
  asignadoA?: string;
  etiquetas: string[];
}
```

## Gestión de Estado Global

### Context API

Se utiliza `ProyectoContext` para:
- Mantener lista de proyectos
- Proyecto actualmente seleccionado
- Funciones para CRUD de proyectos y tareas
- Suscripción a cambios desde cualquier componente

```typescript
const {
  proyectos,
  proyectoActual,
  cargarProyectos,
  crearProyecto,
  establecerProyectoActual,
} = useProyecto()
```

## Comunicación Frontend - Backend

### API REST

Endpoints implementados:

```
GET    /api/proyectos              # Obtener todos
GET    /api/proyectos/:id          # Obtener por ID
POST   /api/proyectos              # Crear
PUT    /api/proyectos/:id          # Actualizar
DELETE /api/proyectos/:id          # Eliminar

POST   /api/proyectos/:id/columnas/:columnId/tareas
PUT    /api/proyectos/:id/columnas/:columnId/tareas/:tareaId
DELETE /api/proyectos/:id/columnas/:columnId/tareas/:tareaId
PATCH  /api/tareas/:tareaId/mover
```

### Formato de Respuesta

Todas las respuestas siguen este contrato:

```typescript
interface RespuestaAPI<T> {
  exito: boolean;
  datos: T;
  mensaje: string;
  codigo: number;
}
```

Ejemplo exitoso:
```json
{
  "exito": true,
  "datos": [{...}, {...}],
  "mensaje": "Proyectos obtenidos correctamente",
  "codigo": 200
}
```

Ejemplo error:
```json
{
  "exito": false,
  "datos": null,
  "mensaje": "Proyecto no encontrado",
  "codigo": 404
}
```

## Decisiones de Arquitectura

### 1. Context API vs Redux

**Decisión**: Usar Context API

**Razón**: Para el MVP, el estado es relativamente simple. Context es más ligero que Redux, evita boilerplate y es suficiente para este nivel de complejidad.

**Escalabilidad**: Si en futuro hay estado muy complejo, se puede migrar a Redux/Zustand.

### 2. Persistencia

**Decisión**: LocalStorage como fallback, API como principal

**Razón**: 
- LocalStorage permite funcionalidad offline básica
- API como fuente de verdad para datos importantes
- Flexibilidad para cambiar a BD completa

### 3. Tipado Compartido

**Decisión**: Interfaces de tipos compartidas entre frontend y backend

**Razón**:
- Garantiza consistencia
- Evita bugs por inconsistencia de tipos
- Facilita contrato claro entre cliente y servidor

### 4. Validación

**Decisión**: Validación en dos niveles (frontend y backend)

**Razón**:
- Frontend: UX inmediata, evita requests innecesarias
- Backend: Seguridad, evita datos inválidos en BD

## Performance

### Optimizaciones Implementadas

1. **useCallback**: Funciones memoizadas para evitar renders innecesarios
2. **useMemo**: Cálculos costosos memoizados
3. **Lazy Loading**: Ruta código splitado si es necesario
4. **Virtualización**: Si tablero tiene muchas tareas

### Estrategia de Caché

- **Frontend**: React query podría usarse en futuro
- **Backend**: Caché en memoria para lecturas frecuentes

## Seguridad

### Considera para versiones futuras:

1. Autenticación OAuth/JWT
2. HTTPS para comunicaciones
3. Rate limiting en API
4. Sanitización de inputs contra XSS
5. CORS restringido a orígenes específicos

## Testing

### Estrategia de Testing

- **Unit**: Funciones de servicios y lógica pura
- **Integration**: Context API + Servicios
- **E2E**: Flujos completos de usuario

## Diagrama de Despliegue

```
┌─────────────────────┐
│   Vercel/Netlify    │
│   (Frontend)        │
│   - Hosting         │
│   - HTTPS           │
│   - CDN edges       │
└──────────┬──────────┘
           │ fetch
┌──────────v──────────┐
│  Railway/Render     │
│  (Backend)          │
│  - Express.js       │
│  - Node.js          │
│  - Persistencia     │
└─────────────────────┘
```

## Escalabilidad Futura

Para escalar AgileDesk:

1. **Base de datos real**: PostgreSQL/MongoDB remoto
2. **Autenticación**: Sistema de usuarios y permisos
3. **Microservicios**: Separar servicios por dominio
4. **WebSockets**: Actualizaciones en tiempo real
5. **Queue de mensajes**: Para operaciones asincrónicas
6. **Caché distribuido**: Redis para performance

Esta arquitectura proporciona una base sólida y fácil de entender, mientras mantiene espacio para crecimiento y evolución.
