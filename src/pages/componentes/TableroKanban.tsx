import { useState } from 'react'
import { Proyecto, Tarea } from '../../types'
import { Tarjeta, Boton, Modal, Entrada, Selector, Alerta } from '../../components'
import { useProyecto } from '../../context/useProyecto'

interface TableroKanbanProps {
  proyecto: Proyecto;
}

/**
 * Tablero Kanban principal
 * Muestra las columnas del proyecto y permite gestionar tareas
 */
export function TableroKanban({ proyecto }: TableroKanbanProps) {
  const { agregarTarea, actualizarTarea, eliminarTarea, moverTarea } = useProyecto()
  const [columnaBandejaAbierta, setColumnaBandejaAbierta] = useState<string | null>(null)
  const [tareaEditando, setTareaEditando] = useState<{ columnaId: string; tarea: Tarea } | null>(null)
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [prioridad, setPrioridad] = useState<'baja' | 'media' | 'alta'>('media')
  const [estado, setEstado] = useState<'pendiente' | 'enProgreso' | 'completada'>('pendiente')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [arrastrando, setArrastrando] = useState<{ tareaId: string; columnaOrigenId: string } | null>(null)

  const colorPrioridad: Record<string, string> = {
    baja: 'bg-blue-100 text-blue-800',
    media: 'bg-yellow-100 text-yellow-800',
    alta: 'bg-red-100 text-red-800',
  }

  const colorPrioridadOscuro: Record<string, string> = {
    baja: 'dark:bg-blue-950/40 dark:text-blue-200',
    media: 'dark:bg-yellow-950/35 dark:text-yellow-200',
    alta: 'dark:bg-red-950/40 dark:text-red-200',
  }

  const abrirEdicion = (columnaId: string, tarea: Tarea) => {
    setTareaEditando({ columnaId, tarea })
    setTitulo(tarea.titulo)
    setDescripcion(tarea.descripcion)
    setPrioridad(tarea.prioridad)
    setEstado(tarea.estado)
    setError(null)
  }

  const cerrarModalTarea = () => {
    setColumnaBandejaAbierta(null)
    setTareaEditando(null)
    setError(null)
    setTitulo('')
    setDescripcion('')
    setPrioridad('media')
    setEstado('pendiente')
  }

  const textoTituloModal = tareaEditando ? 'Editar Tarea' : 'Crear Nueva Tarea'

  const manejarGuardarTarea = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setCargando(true)

    try {
      if (!titulo.trim()) throw new Error('El título es requerido')

      if (tareaEditando) {
        await actualizarTarea(proyecto.id, tareaEditando.columnaId, tareaEditando.tarea.id, {
          titulo: titulo.trim(),
          descripcion: descripcion.trim(),
          prioridad,
          estado,
        })
        setTareaEditando(null)
      } else {
        if (!columnaBandejaAbierta) throw new Error('Selecciona una columna')
        const nuevaTarea: Omit<Tarea, 'id' | 'fechaCreacion'> = {
          titulo: titulo.trim(),
          descripcion: descripcion.trim(),
          estado,
          prioridad,
          etiquetas: [],
        }
        await agregarTarea(proyecto.id, columnaBandejaAbierta, nuevaTarea)
      }

      cerrarModalTarea()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar tarea')
    } finally {
      setCargando(false)
    }
  }

  const manejarBorrarTarea = async (columnaId: string, tarea: Tarea) => {
    const confirmado = window.confirm(`¿Seguro que quieres borrar la tarea "${tarea.titulo}"?`)
    if (!confirmado) return
    setError(null)
    setCargando(true)

    try {
      await eliminarTarea(proyecto.id, columnaId, tarea.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al borrar tarea')
    } finally {
      setCargando(false)
    }
  }

  const onDragStartTarea = (columnaOrigenId: string, tareaId: string) => {
    setArrastrando({ tareaId, columnaOrigenId })
  }

  const onDropEnColumna = async (columnaDestinoId: string) => {
    if (!arrastrando) return
    setArrastrando(null)
    if (arrastrando.columnaOrigenId === columnaDestinoId) return

    setError(null)
    try {
      await moverTarea(arrastrando.tareaId, arrastrando.columnaOrigenId, columnaDestinoId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al mover tarea')
    }
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
            <div className="bg-gray-200 rounded-lg p-4 dark:bg-gray-900 dark:border dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-gray-50">{columna.nombre}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{columna.tareas.length} tareas</p>
            </div>

            <div
              className={`space-y-3 min-h-96 rounded-lg p-1 transition-colors ${
                arrastrando ? 'bg-primary-50/30 dark:bg-primary-950/20' : ''
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDropEnColumna(columna.id)}
            >
              {columna.tareas.map((tarea) => (
                <Tarjeta
                  key={tarea.id}
                  className="cursor-grab active:cursor-grabbing"
                  onClick={() => abrirEdicion(columna.id, tarea)}
                  draggable
                  onDragStart={() => onDragStartTarea(columna.id, tarea.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-50">{tarea.titulo}</h4>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        manejarBorrarTarea(columna.id, tarea)
                      }}
                      className="text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400"
                      aria-label="Borrar tarea"
                      title="Borrar tarea"
                    >
                      ✕
                    </button>
                  </div>
                  {tarea.descripcion && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{tarea.descripcion}</p>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <span
                      className={`text-xs px-2 py-1 rounded font-semibold ${
                        `${colorPrioridad[tarea.prioridad]} ${colorPrioridadOscuro[tarea.prioridad]}`
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

      {(columnaBandejaAbierta || tareaEditando) && (
        <Modal
          titulo={textoTituloModal}
          abierto={!!columnaBandejaAbierta || !!tareaEditando}
          onCerrar={cerrarModalTarea}
          acciones={
            <Boton type="submit" onClick={manejarGuardarTarea} disabled={cargando}>
              {cargando ? 'Guardando...' : 'Guardar'}
            </Boton>
          }
        >
          <form onSubmit={manejarGuardarTarea} className="space-y-4">
            <Entrada
              etiqueta="Título de la Tarea"
              placeholder="Ej: Implementar login"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              disabled={cargando}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Descripción (opcional)
              </label>
              <textarea
                placeholder="Describe la tarea..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                disabled={cargando}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 placeholder:text-gray-400 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
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
