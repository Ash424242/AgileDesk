import { useState } from 'react'
import { Proyecto, Tarea } from '../../types'
import { Tarjeta, Boton, Modal, Entrada, Selector, Alerta } from '../../components'
import { useProyecto } from '../../context/ProyectoContext'

interface TableroKanbanProps {
  proyecto: Proyecto;
}

/**
 * Tablero Kanban principal
 * Muestra las columnas del proyecto y permite gestionar tareas
 */
export function TableroKanban({ proyecto }: TableroKanbanProps) {
  const { agregarTarea } = useProyecto()
  const [columnaBandejaAbierta, setColumnaBandejaAbierta] = useState<string | null>(null)
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [prioridad, setPrioridad] = useState<'baja' | 'media' | 'alta'>('media')
  const [estado, setEstado] = useState<'pendiente' | 'enProgreso' | 'completada'>('pendiente')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Maneja la creación de una nueva tarea
   */
  const manejarCrearTarea = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setCargando(true)

    try {
      if (!columnaBandejaAbierta) throw new Error('Selecciona una columna')
      if (!titulo.trim()) throw new Error('El título es requerido')

      const nuevaTarea: Omit<Tarea, 'id' | 'fechaCreacion'> = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        estado,
        prioridad,
        etiquetas: [],
      }

      await agregarTarea(proyecto.id, columnaBandejaAbierta, nuevaTarea)

      setTitulo('')
      setDescripcion('')
      setPrioridad('media')
      setEstado('pendiente')
      setColumnaBandejaAbierta(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear tarea')
    } finally {
      setCargando(false)
    }
  }

  const colorPrioridad: Record<string, string> = {
    baja: 'bg-blue-100 text-blue-800',
    media: 'bg-yellow-100 text-yellow-800',
    alta: 'bg-red-100 text-red-800',
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alerta
          tipo="error"
          titulo="Error"
          mensaje={error}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {proyecto.columnas.map((columna) => (
          <div key={columna.id} className="space-y-4">
            <div className="bg-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-gray-900">{columna.nombre}</h3>
              <p className="text-xs text-gray-600 mt-1">{columna.tareas.length} tareas</p>
            </div>

            <div className="space-y-3 min-h-96">
              {columna.tareas.map((tarea) => (
                <Tarjeta
                  key={tarea.id}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <h4 className="font-semibold text-gray-900">{tarea.titulo}</h4>
                  {tarea.descripcion && (
                    <p className="text-sm text-gray-600 mt-2">{tarea.descripcion}</p>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <span
                      className={`text-xs px-2 py-1 rounded font-semibold ${
                        colorPrioridad[tarea.prioridad]
                      }`}
                    >
                      {tarea.prioridad.charAt(0).toUpperCase() +
                        tarea.prioridad.slice(1)}
                    </span>
                  </div>
                </Tarjeta>
              ))}
            </div>

            <Boton
              variante="secundario"
              className="w-full"
              onClick={() => setColumnaBandejaAbierta(columna.id)}
            >
              + Agregar Tarea
            </Boton>
          </div>
        ))}
      </div>

      {columnaBandejaAbierta && (
        <Modal
          titulo="Crear Nueva Tarea"
          abierto={!!columnaBandejaAbierta}
          onCerrar={() => {
            setColumnaBandejaAbierta(null)
            setError(null)
          }}
          acciones={
            <Boton type="submit" onClick={manejarCrearTarea} disabled={cargando}>
              {cargando ? 'Creando...' : 'Crear'}
            </Boton>
          }
        >
          <form onSubmit={manejarCrearTarea} className="space-y-4">
            <Entrada
              etiqueta="Título de la Tarea"
              placeholder="Ej: Implementar login"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              disabled={cargando}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción (opcional)
              </label>
              <textarea
                placeholder="Describe la tarea..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                disabled={cargando}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
              />
            </div>

            <Selector
              etiqueta="Prioridad"
              value={prioridad}
              onChange={(e) =>
                setPrioridad(e.target.value as 'baja' | 'media' | 'alta')
              }
              opciones={[
                { valor: 'baja', etiqueta: 'Baja' },
                { valor: 'media', etiqueta: 'Media' },
                { valor: 'alta', etiqueta: 'Alta' },
              ]}
            />

            <Selector
              etiqueta="Estado"
              value={estado}
              onChange={(e) =>
                setEstado(e.target.value as 'pendiente' | 'enProgreso' | 'completada')
              }
              opciones={[
                { valor: 'pendiente', etiqueta: 'Pendiente' },
                { valor: 'enProgreso', etiqueta: 'En Progreso' },
                { valor: 'completada', etiqueta: 'Completada' },
              ]}
            />
          </form>
        </Modal>
      )}
    </div>
  )
}

export default TableroKanban
