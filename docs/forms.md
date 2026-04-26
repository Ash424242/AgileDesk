# Formularios e Interacción

## Descripción General

Los formularios en AgileDesk utilizan React y el hook personalizado `useFormulario` para manejar estado, validación y envío de datos de forma eficiente.

## Patrones de Formularios

### Formulario Controlado Básico

```tsx
import { useState } from 'react'
import { Entrada, Boton } from '../components'

function FormularioBasico() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ nombre, email })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Entrada
        etiqueta="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <Entrada
        etiqueta="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Boton type="submit">Enviar</Boton>
    </form>
  )
}
```

### Usando useFormulario

```tsx
import { useFormulario } from '../hooks'
import { Entrada, Boton, Alerta } from '../components'

interface DatosFormulario {
  nombre: string;
  email: string;
}

function FormularioProyecto() {
  const { valores, errores, cargando, cambiar, enviar, reiniciar } =
    useFormulario<DatosFormulario>(
      { nombre: '', email: '' },
      async (valores) => {
        const respuesta = await fetch('/api/proyectos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(valores),
        })

        if (!respuesta.ok) {
          throw new Error('Error al crear proyecto')
        }
      }
    )

  return (
    <form onSubmit={enviar} className="space-y-4">
      {errores.general && (
        <Alerta tipo="error" titulo="Error" mensaje={errores.general} />
      )}

      <Entrada
        etiqueta="Nombre del Proyecto"
        name="nombre"
        placeholder="Ej: Aplicación TODO"
        value={valores.nombre}
        onChange={cambiar}
        error={errores.nombre}
        disabled={cargando}
      />

      <Entrada
        etiqueta="Email del Contacto"
        name="email"
        type="email"
        placeholder="contacto@ejemplo.com"
        value={valores.email}
        onChange={cambiar}
        error={errores.email}
        disabled={cargando}
      />

      <div className="flex gap-2">
        <Boton type="submit" disabled={cargando}>
          {cargando ? 'Guardando...' : 'Crear Proyecto'}
        </Boton>
        <Boton variante="secundario" type="reset" onClick={reiniciar}>
          Limpiar
        </Boton>
      </div>
    </form>
  )
}
```

## Validación

### Validación en Frontend

```typescript
const handleSubmit = async (valores: DatosFormulario) => {
  const erroresLocales: Record<string, string> = {}

  // Validación de nombre
  if (!valores.nombre.trim()) {
    erroresLocales.nombre = 'El nombre es requerido'
  } else if (valores.nombre.length < 3) {
    erroresLocales.nombre = 'El nombre debe tener al menos 3 caracteres'
  }

  // Validación de email
  const expresionEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!valores.email.trim()) {
    erroresLocales.email = 'El email es requerido'
  } else if (!expresionEmail.test(valores.email)) {
    erroresLocales.email = 'El email no es válido'
  }

  if (Object.keys(erroresLocales).length > 0) {
    throw new Error(Object.values(erroresLocales)[0])
  }

  // Procede con el envío
  await fetch('/api/proyectos', { ... })
}
```

### Validación en Backend

```typescript
// server/src/controllers/ControladorProyectos.ts
static crear(req: Request, res: Response): void {
  try {
    const { nombre, descripcion } = req.body

    // Validación básica
    if (!nombre || typeof nombre !== 'string') {
      res.status(400).json({
        exito: false,
        mensaje: 'El nombre es requerido',
        codigo: 400,
      })
      return
    }

    // Validación adicional
    if (nombre.length < 3) {
      res.status(400).json({
        exito: false,
        mensaje: 'El nombre debe tener al menos 3 caracteres',
        codigo: 400,
      })
      return
    }

    // Crear proyecto
    const nuevoProyecto = servicioProyectos.crear({ nombre, descripcion })
    // ...
  } catch (error) {
    // ...
  }
}
```

## Campos Especializados

### Textarea

```tsx
<div>
  <label className="block text-sm font-medium mb-2">
    Descripción
  </label>
  <textarea
    name="descripcion"
    value={valores.descripcion}
    onChange={cambiar}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
    rows={4}
    placeholder="Describe el proyecto..."
  />
</div>
```

### Select

```tsx
import { Selector } from '../components'

<Selector
  etiqueta="Prioridad"
  name="prioridad"
  value={valores.prioridad}
  onChange={cambiar}
  opciones={[
    { valor: 'baja', etiqueta: 'Baja' },
    { valor: 'media', etiqueta: 'Media' },
    { valor: 'alta', etiqueta: 'Alta' },
  ]}
/>
```

### Checkbox

```tsx
function FormularioAvanzado() {
  const [aceptarTerminos, setAceptarTerminos] = useState(false)

  return (
    <div className="mb-4">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={aceptarTerminos}
          onChange={(e) => setAceptarTerminos(e.target.checked)}
        />
        <span>Aceptaré términos y condiciones</span>
      </label>
    </div>
  )
}
```

### Radio Button

```tsx
function FormularioRadio() {
  const [estado, setEstado] = useState('pendiente')

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2">
        <input
          type="radio"
          value="pendiente"
          checked={estado === 'pendiente'}
          onChange={(e) => setEstado(e.target.value)}
        />
        Pendiente
      </label>
      <label className="flex items-center gap-2">
        <input
          type="radio"
          value="completado"
          checked={estado === 'completado'}
          onChange={(e) => setEstado(e.target.value)}
        />
        Completado
      </label>
    </div>
  )
}
```

## Prevención de Doble Envío

```tsx
function FormularioConPrevencion() {
  const { cargando, enviar } = useFormulario(
    { nombre: '' },
    async (valores) => {
      // Simula envío lento
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Enviado:', valores)
    }
  )

  return (
    <form onSubmit={enviar}>
      <Boton type="submit" disabled={cargando}>
        {cargando ? 'Enviando...' : 'Enviar'}
      </Boton>
    </form>
  )
}
```

## Feedback de Usuario

### Mensajes de Éxito

```tsx
const [mensaje, setMensaje] = useState<string | null>(null)

const handleSubmit = async (valores) => {
  try {
    await fetch('/api/proyectos', { ... })
    setMensaje('¡Proyecto creado exitosamente!')
    setTimeout(() => setMensaje(null), 3000)
  } catch (error) {
    // Manejo de error
  }
}

return (
  <>
    {mensaje && (
      <Alerta tipo="exito" titulo="Éxito" mensaje={mensaje} />
    )}
    <form>{/* ... */}</form>
  </>
)
```

### Validación en Tiempo Real

```tsx
function FormularioConValidacionEnTiempoReal() {
  const { valores, cambiar } = useFormulario(
    { nombre: '' },
    async () => {}
  )

  const [errorTiempoReal, setErrorTiempoReal] = useState('')

  const handleNombreChange = (e) => {
    cambiar(e)
    if (e.target.value.length < 3) {
      setErrorTiempoReal('Mínimo 3 caracteres')
    } else {
      setErrorTiempoReal('')
    }
  }

  return (
    <Entrada
      etiqueta="Nombre"
      value={valores.nombre}
      onChange={handleNombreChange}
      error={errorTiempoReal}
    />
  )
}
```

## Ejemplo Completo: Formulario de Tarea

```tsx
import { useState } from 'react'
import { useFormulario } from '../hooks'
import { Entrada, Selector, Boton, Alerta } from '../components'
import { useProyecto } from '../context/ProyectoContext'

interface FormularioTareaData {
  titulo: string;
  descripcion: string;
  prioridad: 'baja' | 'media' | 'alta';
  etiquetas: string;
}

function FormularioTarea({ columnId, onExito }) {
  const { agregarTarea } = useProyecto()

  const { valores, errores, cargando, cambiar, enviar } =
    useFormulario<FormularioTareaData>(
      {
        titulo: '',
        descripcion: '',
        prioridad: 'media',
        etiquetas: '',
      },
      async (valores) => {
        // Validación adicional
        if (!valores.titulo.trim()) {
          throw new Error('El título es requerido')
        }

        // Crear tarea
        await agregarTarea(columnId, {
          titulo: valores.titulo.trim(),
          descripcion: valores.descripcion.trim(),
          prioridad: valores.prioridad,
          estado: 'pendiente',
          etiquetas: valores.etiquetas
            .split(',')
            .map(e => e.trim())
            .filter(e => e),
        })

        onExito()
      }
    )

  return (
    <form onSubmit={enviar} className="space-y-4">
      {errores.general && (
        <Alerta tipo="error" titulo="Error" mensaje={errores.general} />
      )}

      <Entrada
        etiqueta="Título de la Tarea"
        name="titulo"
        placeholder="Ej: Implementar login"
        value={valores.titulo}
        onChange={cambiar}
        error={errores.titulo}
        disabled={cargando}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción
        </label>
        <textarea
          name="descripcion"
          value={valores.descripcion}
          onChange={cambiar}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          rows={3}
          placeholder="Describe la tarea"
          disabled={cargando}
        />
      </div>

      <Selector
        etiqueta="Prioridad"
        name="prioridad"
        value={valores.prioridad}
        onChange={cambiar}
        opciones={[
          { valor: 'baja', etiqueta: 'Baja' },
          { valor: 'media', etiqueta: 'Media' },
          { valor: 'alta', etiqueta: 'Alta' },
        ]}
        disabled={cargando}
      />

      <Entrada
        etiqueta="Etiquetas (separadas por coma)"
        name="etiquetas"
        placeholder="backend, urgente, feature"
        value={valores.etiquetas}
        onChange={cambiar}
        disabled={cargando}
      />

      <Boton type="submit" disabled={cargando} className="w-full">
        {cargando ? 'Creando...' : 'Crear Tarea'}
      </Boton>
    </form>
  )
}

export default FormularioTarea
```

## Best Practices

1. **Siempre validar en backend**: Nunca confiar solo en validación frontend
2. **Mensajes de error claros**: Ayuda a usuarios a entender qué salió mal
3. **Feedback visual**: Deshabilitar botones durante envío
4. **Prevenir doble envío**: Deshabilitar formulario mientras se procesa
5. **Accesibilidad**: usar labels asociadas con inputs
6. **Limpieza de estado**: Limpiar formulario después de éxito
7. **UX: Sin rechazos inesperados**: Validar progresivamente, no al final

Esta documentación proporciona una referencia completa para trabajar con formularios siguiendo las mejores prácticas de React y UX.
