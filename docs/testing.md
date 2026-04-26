# Testing y Quality Assurance

## Estrategia de Testing

AgileDesk implementa una estrategia de testing en tres capas:

1. **Unit Tests**: Funciones aisladas y lógica pura
2. **Integration Tests**: Componentes + Context + API
3. **E2E Tests**: Flujos completos de usuario

## Setup de Testing

### Dependencias Recomendadas

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "vitest": "^0.34.0",
    "jsdom": "^22.1.0"
  }
}
```

### Configuración de Vitest

En `vite.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

---

## Unit Tests

### Testing de Hooks

#### Ejemplo: useFormulario

```typescript
// src/hooks/__tests__/useFormulario.test.ts
import { renderHook, act } from '@testing-library/react'
import { useFormulario } from '../useFormulario'

describe('useFormulario', () => {
  test('inicializa con valores correctos', () => {
    const { result } = renderHook(() =>
      useFormulario(
        { nombre: '', email: '' },
        async () => {}
      )
    )

    expect(result.current.valores.nombre).toBe('')
    expect(result.current.valores.email).toBe('')
  })

  test('actualiza valores al cambiar input', () => {
    const { result } = renderHook(() =>
      useFormulario(
        { nombre: '' },
        async () => {}
      )
    )

    act(() => {
      result.current.cambiar({
        target: { name: 'nombre', value: 'Test' },
      } as any)
    })

    expect(result.current.valores.nombre).toBe('Test')
  })

  test('llama onSubmit cuando se envía', async () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() =>
      useFormulario({ nombre: 'Test' }, onSubmit)
    )

    await act(async () => {
      await result.current.enviar({
        preventDefault: () => {},
      } as any)
    })

    expect(onSubmit).toHaveBeenCalledWith({ nombre: 'Test' })
  })

  test('reinicia formulario', () => {
    const { result } = renderHook(() =>
      useFormulario({ nombre: 'Inicial' }, async () => {})
    )

    act(() => {
      result.current.establecer('nombre', 'Cambio')
    })

    expect(result.current.valores.nombre).toBe('Cambio')

    act(() => {
      result.current.reiniciar()
    })

    expect(result.current.valores.nombre).toBe('Inicial')
  })
})
```

#### Ejemplo: useFetch

```typescript
// src/hooks/__tests__/useFetch.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { useFetch } from '../useFetch'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

const server = setupServer(
  rest.get('/api/test', (req, res, ctx) => {
    return res(ctx.json({ exito: true, datos: [1, 2, 3] }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('useFetch', () => {
  test('carga datos exitosamente', async () => {
    const { result } = renderHook(() => useFetch('/api/test'))

    expect(result.current.cargando).toBe(true)

    await waitFor(() => {
      expect(result.current.cargando).toBe(false)
    })

    expect(result.current.datos).toEqual({ exito: true, datos: [1, 2, 3] })
    expect(result.current.error).toBe(null)
  })
})
```

---

### Testing de Servicios

#### Ejemplo: ServicioProyectos

```typescript
// server/src/services/__tests__/ServicioProyectos.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { ServicioProyectos } from '../ServicioProyectos'

describe('ServicioProyectos', () => {
  let servicio: ServicioProyectos

  beforeEach(() => {
    servicio = new ServicioProyectos()
  })

  test('crea un proyecto', () => {
    const proyecto = servicio.crear({
      nombre: 'Test Proyecto',
      descripcion: 'Descripción',
      columnas: [],
    })

    expect(proyecto.id).toBeDefined()
    expect(proyecto.nombre).toBe('Test Proyecto')
  })

  test('obtiene proyecto por ID', () => {
    const creado = servicio.crear({
      nombre: 'Test',
      descripcion: '',
      columnas: [],
    })

    const obtenido = servicio.obtenerPorId(creado.id)
    expect(obtenido).toEqual(creado)
  })

  test('elimina proyecto', () => {
    const creado = servicio.crear({
      nombre: 'Test',
      descripcion: '',
      columnas: [],
    })

    const eliminado = servicio.eliminar(creado.id)
    expect(eliminado).toBe(true)

    const obtenido = servicio.obtenerPorId(creado.id)
    expect(obtenido).toBe(null)
  })
})
```

---

## Component Tests

### Testing de Componentes

#### Ejemplo: Boton

```typescript
// src/components/__tests__/Boton.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Boton } from '../Boton'

describe('Boton', () => {
  test('renderiza con texto', () => {
    render(<Boton>Click me</Boton>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  test('ejecuta callback al hacer clic', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    render(<Boton onClick={onClick}>Click me</Boton>)

    await user.click(screen.getByText('Click me'))
    expect(onClick).toHaveBeenCalled()
  })

  test('se deshabilita cuando tiene disabled prop', () => {
    render(<Boton disabled>Disabled</Boton>)
    expect(screen.getByText('Disabled')).toBeDisabled()
  })

  test('aplica variantes correctamente', () => {
    const { container } = render(
      <Boton variante="peligro">Delete</Boton>
    )

    const button = container.querySelector('button')
    expect(button).toHaveClass('bg-red-500')
  })
})
```

#### Ejemplo: Modal

```typescript
// src/components/__tests__/Modal.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '../Modal'

describe('Modal', () => {
  test('no renderiza si no está abierto', () => {
    render(
      <Modal
        titulo="Test"
        abierto={false}
        onCerrar={() => {}}
      >
        Contenido
      </Modal>
    )

    expect(screen.queryByText('Test')).not.toBeInTheDocument()
  })

  test('renderiza cuando está abierto', () => {
    render(
      <Modal
        titulo="Test"
        abierto={true}
        onCerrar={() => {}}
      >
        Contenido
      </Modal>
    )

    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('Contenido')).toBeInTheDocument()
  })

  test('ejecuta callback al cerrar', async () => {
    const onCerrar = vi.fn()
    const user = userEvent.setup()

    render(
      <Modal
        titulo="Test"
        abierto={true}
        onCerrar={onCerrar}
      >
        Contenido
      </Modal>
    )

    await user.click(screen.getByText('✕'))
    expect(onCerrar).toHaveBeenCalled()
  })
})
```

---

## Integration Tests

### Testing de Flujos

```typescript
// src/__tests__/flujoCompletoProyecto.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { ProyectoProvider } from '../context/ProyectoContext'
import App from '../App'

describe('Flujo: Crear Proyecto y Agregar Tarea', () => {
  test('usuario crea proyecto y agrega tarea', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <ProyectoProvider>
          <App />
        </ProyectoProvider>
      </BrowserRouter>
    )

    // 1. Espera a que cargue
    await waitFor(() => {
      expect(
        screen.getByText(/bienvenido|mis proyectos/i)
      ).toBeInTheDocument()
    })

    // 2. Hacer clic en "Crear Proyecto"
    const btnCrear = screen.getByText(/crear/i)
    await user.click(btnCrear)

    // 3. Llenar formulario
    const inputNombre = screen.getByPlaceholderText(/nombre/i)
    await user.type(inputNombre, 'Mi Proyecto de Tests')

    // 4. Enviar
    await user.click(screen.getByText(/crear proyecto/i))

    // 5. Verificar que proyecto fue creado
    await waitFor(() => {
      expect(screen.getByText('Mi Proyecto de Tests')).toBeInTheDocument()
    })
  })
})
```

---

## E2E Tests (Cypress)

### Setup

```bash
npm install --save-dev cypress
npx cypress open
```

### Ejemplo: Crear Proyecto

```typescript
// cypress/e2e/crear-proyecto.cy.ts
describe('Crear Proyecto', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173')
  })

  it('debe crear un nuevo proyecto', () => {
    // Espera a que cargue
    cy.contains('Bienvenido').should('be.visible')

    // Hace clic en crear
    cy.contains('button', 'Crear Proyecto').click()

    // Llena el formulario
    cy.get('input[placeholder*="nombre"]').type('Proyecto E2E')
    cy.get('textarea').type('Descripción del proyecto')

    // Envía
    cy.contains('button', 'Crear').click()

    // Verifica resultado
    cy.contains('Proyecto E2E').should('be.visible')
  })
})
```

---

## Métricas de Calidad

### Cobertura de Tests

```bash
npm run test -- --coverage
```

Objetivo: > 80% de cobertura

```
Statements   : 85%
Branches     : 80%
Functions    : 90%
Lines        : 85%
```

### Analysis de Código

```bash
npm run lint
npx tsc --noEmit  # Verificar tipos
```

---

## CI/CD Integration

### GitHub Actions

En `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

---

## Checklist de Pruebas Manuales

Antes de cada release, probar:

- [ ] Crear proyecto
- [ ] Editar proyecto
- [ ] Eliminar proyecto
- [ ] Agregar tarea
- [ ] Editar tarea
- [ ] Eliminar tarea
- [ ] Mover tarea entre columnas
- [ ] Cargar página (funciona después de refresh)
- [ ] Validación de formularios
- [ ] Mensajes de error claros
- [ ] Responsive en móvil
- [ ] Funciona offline (si aplica)
- [ ] Accesibilidad con teclado

---

## Performance Testing

### Lighthouse

```bash
npm install -g lighthouse
lighthouse https://agiledesk.vercel.app --view
```

Objetivos:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

---

## Conclusión

Una estrategia de testing sólida garantiza la calidad del código, facilita refactoring y proporciona confianza al hacer cambios. El testing debe ser parte de la rutina de desarrollo, no una actividad posterior.
