import { useState } from 'react'
import { Proyecto, Columna } from '../../types'
import { Entrada, Boton } from '../../components'

interface FormularioProyectoProps {
  onSubmit: (proyecto: Omit<Proyecto, 'id' | 'fechaCreacion' | 'fechaModificacion'>) => Promise<void>;
}

/**
 * Formulario para crear un nuevo proyecto
 */
export function FormularioProyecto({ onSubmit }: FormularioProyectoProps) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Maneja el envío del formulario
   */
  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setCargando(true)

    try {
      if (!nombre.trim()) {
        throw new Error('El nombre del proyecto es requerido')
      }

      const columnasDefault: Columna[] = [
        {
          id: '1',
          nombre: 'Por Hacer',
          descripcion: 'Tareas pendientes',
          posicion: 1,
          tareas: [],
        },
        {
          id: '2',
          nombre: 'En Progreso',
          descripcion: 'Tareas en desarrollo',
          posicion: 2,
          tareas: [],
        },
        {
          id: '3',
          nombre: 'Completado',
          descripcion: 'Tareas terminadas',
          posicion: 3,
          tareas: [],
        },
      ]

      await onSubmit({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        columnas: columnasDefault,
      })

      setNombre('')
      setDescripcion('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear proyecto')
    } finally {
      setCargando(false)
    }
  }

  return (
    <form onSubmit={manejarEnvio} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 dark:bg-red-950/30 dark:border-red-900/60">
          <p className="text-red-800 text-sm dark:text-red-200">{error}</p>
        </div>
      )}

      <Entrada
        etiqueta="Nombre del Proyecto"
        placeholder="Ej: Aplicación TODO"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        disabled={cargando}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Descripción (opcional)
        </label>
        <textarea
          placeholder="Describe el propósito del proyecto..."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          disabled={cargando}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 placeholder:text-gray-400 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
          rows={3}
        />
      </div>

      <Boton type="submit" disabled={cargando} className="w-full">
        {cargando ? 'Creando...' : 'Crear Proyecto'}
      </Boton>
    </form>
  )
}

export default FormularioProyecto
