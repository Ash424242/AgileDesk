# Rutas y Navegación

## Descripción General

AgileDesk utiliza React Router v6 para manejar la navegación. El sistema de rutas proporciona una experiencia fluida y estructurada.

## Configuración de Rutas

### Estructura Principal

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProyectoProvider } from './context/ProyectoContext'
import Layout from './components/Layout'
import PaginaPrincipal from './pages/PaginaPrincipal'
import Pagina404 from './pages/Pagina404'

function App() {
  return (
    <ProyectoProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<PaginaPrincipal />} />
            <Route path="*" element={<Pagina404 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProyectoProvider>
  )
}

export default App
```

### Estructura Jerárquica

```
/
├── / (Página Principal - Tablero Kanban)
├── /proyectos/:id (Detalles del proyecto - futuro)
├── /configuracion (Configuración - futuro)
├── 404 (Página no encontrada)
```

## Componentes de Routing

### Layout

El `Layout` proporciona una envoltura común para todas las páginas:

```tsx
// src/components/Layout.tsx
export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navegacion />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
```

**Características**:
- Navegación siempre visible
- Contenido dinámico via `<Outlet>`
- Estilos consistentes

### Páginas

#### PaginaPrincipal

URL: `/`

Displays:
- Lista de proyectos existentes
- Tablero Kanban del proyecto seleccionado
- Modal para crear nuevo proyecto

```tsx
export function PaginaPrincipal() {
  const { proyectos, proyectoActual } = useProyecto()
  // ...
  return <div>{/* Contenido */}</div>
}
```

#### Pagina404

URL: `*` (any unmatched route)

Displays:
- Mensaje amigable de página no encontrada
- Link para volver al inicio

```tsx
export function Pagina404() {
  return (
    <div>
      <h1>404 - Página No Encontrada</h1>
      <Link to="/">Volver al Inicio</Link>
    </div>
  )
}
```

## Navegación Programática

### Link vs Navigate

#### Link: Navegación de Usuario

```tsx
import { Link } from 'react-router-dom'

// En componente
<Link to="/">Volver al Inicio</Link>

// Con parámetros
<Link to={`/proyectos/${proyecto.id}`}>Ver Proyecto</Link>
```

#### useNavigate: Navegación Programática

```tsx
import { useNavigate } from 'react-router-dom'

function FormularioProyecto() {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/')  // Redirige después de éxito
  }

  return <form onSubmit={handleSuccess}>{/* ... */}</form>
}
```

## Parámetros en Rutas

### Dynamic Routes (Futuro)

```tsx
import { useParams } from 'react-router-dom'

// Definir ruta con parámetro
<Route path="/proyectos/:id" element={<DetallesProyecto />} />

// Uso del parámetro
function DetallesProyecto() {
  const { id } = useParams<{ id: string }>()

  return <h1>Proyecto: {id}</h1>
}
```

## Query Parameters

```tsx
import { useSearchParams } from 'react-router-dom'

function ListaProyectos() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filtro = searchParams.get('filtro')  // /?filtro=valor

  const handleFiltro = (valor) => {
    setSearchParams({ filtro: valor })
  }

  return (
    <div>
      <input onChange={(e) => handleFiltro(e.target.value)} />
    </div>
  )
}
```

## Rutas Protegidas (Futuro)

```tsx
import { Navigate } from 'react-router-dom'

function RutaProtegida({ element }) {
  const { usuario } = useAutenticacion()

  return usuario ? element : <Navigate to="/login" />
}

// Uso
<Route
  path="/admin"
  element={<RutaProtegida element={<PaginaAdmin />} />}
/>
```

## Scroll al Cambiar Ruta

```typescript
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

// Usa en App
<ScrollToTop />
<Routes>{/* ... */}</Routes>
```

## Lazy Loading de Rutas

Para optimizar el bundle size:

```tsx
import { Suspense, lazy } from 'react'

const PaginaPrincipal = lazy(() =>
  import('./pages/PaginaPrincipal').then(mod => ({
    default: mod.PaginaPrincipal
  }))
)

<Suspense fallback={<Cargador />}>
  <Route path="/" element={<PaginaPrincipal />} />
</Suspense>
```

## Historial de Navegación

```tsx
import { useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()

  return (
    <button onClick={() => navigate(-1)}>Volver Atrás</button>
  )
}
```

## Redirecciones

```tsx
import { Navigate } from 'react-router-dom'

// Redirigir automáticamente
<Route path="/home" element={<Navigate to="/" />} />

// Redirigir condicionalmente
function RutaAdmin() {
  if (!esAdmin()) {
    return <Navigate to="/" replace />
  }
  return <DetallesAdmin />
}
```

## Rutas Anidadas

Estructura para aplicaciones más complejas:

```tsx
<Routes>
  <Route element={<Layout />}>
    <Route path="/" element={<PaginaPrincipal />} />
    
    <Route path="/proyectos" element={<ProyectosLayout />}>
      <Route index element={<ListaProyectos />} />
      <Route path=":id" element={<DetallesProyecto />} />
      <Route path=":id/editar" element={<EditarProyecto />} />
    </Route>
    
    <Route path="*" element={<Pagina404 />} />
  </Route>
</Routes>
```

## Outlet para Rutas Anidadas

```tsx
import { Outlet } from 'react-router-dom'

function ProyectosLayout() {
  return (
    <div className="space-y-6">
      <Encabezado titulo="Proyectos" />
      <Outlet />  {/* Renderiza la ruta anidada */}
    </div>
  )
}
```

## Estado en la Navegación

Pasar estado al navegar:

```tsx
import { useLocation } from 'react-router-dom'

// Navegar con estado
navigate('/proyectos/nuevo', {
  state: { fromDashboard: true }
})

// Acceder al estado
function PaginaNuevoProyecto() {
  const location = useLocation()
  const { fromDashboard } = location.state || {}

  return <div>{fromDashboard && 'Viniste del dashboard'}</div>
}
```

## Manejo de Errores en Rutas

```tsx
import { useRouteError } from 'react-router-dom'

function ErrorBoundary() {
  const error = useRouteError()

  return (
    <div>
      <h1>Error encontrado</h1>
      <p>{error.message}</p>
    </div>
  )
}

// En definición de ruta
<Route
  path="/"
  element={<App />}
  errorElement={<ErrorBoundary />}
/>
```

## Testing de Rutas

```typescript
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

test('Navega a página 404', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )

  // Simular navegación
  window.history.pushState({}, 'Página no encontrada', '/ruta-inexistente')

  expect(screen.getByText('404')).toBeInTheDocument()
})
```

## Convenciones de Rutas

### Nombrado

```tsx
// ✓ Bueno: Nombres descriptivos
<Route path="/proyectos" element={<ListaProyectos />} />
<Route path="/proyectos/:id" element={<DetallesProyecto />} />

// ✗ Evitar: Rutas genéricas
<Route path="/p" element={<Component />} />
```

### Jerárquico

```tsx
// ✓ Bueno: Estructura clara
/admin/usuarios
/admin/proyectos
/admin/configuracion

// ✗ Evitar: Rutas planas sin estructura
/usuarios-admin
/proyectos-admin
/config-admin
```

### RESTful

```tsx
// GET /proyectos - lista
// GET /proyectos/:id - detalles
// POST /proyectos - crear
// PUT /proyectos/:id - actualizar
// DELETE /proyectos/:id - eliminar

// En rutas
<Route path="/proyectos/:id" element={<DetallesProyecto />} />
```

## Future Route Expansion

Rutas para agregar después del MVP:

```tsx
// Autenticación
/login
/signup
/olvide-contraseña

// Proyectos
/proyectos/:id
/proyectos/:id/configuracion

// Usuarios
/perfil
/configuracion

// Admin
/admin/usuarios
/admin/proyectos
/admin/estadísticas
```

El sistema de routing en AgileDesk proporciona una base flexible que puede crecer con el proyecto manteniendo claridad y estructura.
