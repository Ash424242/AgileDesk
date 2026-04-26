import { useEffect, useState } from 'react'
import { useProyecto } from '../context/useProyecto'
import { Proyecto } from '../types'
import {
  Encabezado,
  Tarjeta,
  Boton,
  Modal,
  Cargador,
  Alerta,
} from '../components'
import FormularioProyecto from './componentes/FormularioProyecto'
import TableroKanban from './componentes/TableroKanban'

/**
 * Página principal de AgileDesk
 * Muestra el tablero Kanban del proyecto seleccionado
 * o una página de bienvenida si no hay proyectos
 */
export function PaginaPrincipal() {
  const {
    proyectos,
    proyectoActual,
    cargarProyectos,
    establecerProyectoActual,
    crearProyecto,
  } = useProyecto()

  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modalNuevoAbierto, setModalNuevoAbierto] = useState(false)

  /**
   * Carga los proyectos al montar el componente
   */
  useEffect(() => {
    const cargar = async () => {
      setCargando(true)
      try {
        await cargarProyectos()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar proyectos')
      } finally {
        setCargando(false)
      }
    }

    cargar()
  }, [cargarProyectos])

  /**
   * Selecciona el primer proyecto cuando los proyectos se cargan
   */
  useEffect(() => {
    if (proyectos.length > 0 && !proyectoActual) {
      establecerProyectoActual(proyectos[0].id)
    }
  }, [proyectos, proyectoActual, establecerProyectoActual])

  /**
   * Maneja la creación de un nuevo proyecto
   */
  const manejarCrearProyecto = async (proyecto: Omit<Proyecto, 'id' | 'fechaCreacion' | 'fechaModificacion'>) => {
    try {
      await crearProyecto(proyecto)
      setModalNuevoAbierto(false)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear proyecto')
    }
  }

  if (cargando && proyectos.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Cargador />
      </div>
    )
  }

  if (proyectos.length === 0) {
    return (
      <div className="space-y-4">
        <Encabezado
          titulo="Bienvenido a AgileDesk"
          subtitulo="Gestiona tus proyectos de forma visual y colaborativa"
          acciones={
            <Boton onClick={() => setModalNuevoAbierto(true)}>
              Crear Proyecto
            </Boton>
          }
        />

        {error && (
          <Alerta
            tipo="error"
            titulo="Error"
            mensaje={error}
          />
        )}

        <div className="text-center py-16">
          <Tarjeta>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              No tienes proyectos aún. Crea uno para comenzar a organizar
              tus tareas de forma visual.
            </p>
            <Boton onClick={() => setModalNuevoAbierto(true)}>
              Crear Mi Primer Proyecto
            </Boton>
          </Tarjeta>
        </div>

        <Modal
          titulo="Crear Nuevo Proyecto"
          abierto={modalNuevoAbierto}
          onCerrar={() => setModalNuevoAbierto(false)}
        >
          <FormularioProyecto onSubmit={manejarCrearProyecto} />
        </Modal>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Encabezado
        titulo={proyectoActual?.nombre || 'Mis Proyectos'}
        subtitulo={proyectoActual?.descripcion || 'Gestiona tus proyectos de forma visual'}
        acciones={
          <div className="flex gap-2">
            <Boton
              variante="secundario"
              tamaño="pequeño"
              onClick={() => setModalNuevoAbierto(true)}
            >
              Nuevo Proyecto
            </Boton>
          </div>
        }
      />

      {error && (
        <Alerta
          tipo="error"
          titulo="Error"
          mensaje={error}
        />
      )}

      {proyectos.length > 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {proyectos.map((proyecto) => (
            <Tarjeta
              key={proyecto.id}
              className={`cursor-pointer ${
                proyectoActual?.id === proyecto.id ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => establecerProyectoActual(proyecto.id)}
            >
              <p className="font-semibold text-gray-900 dark:text-gray-50 truncate">{proyecto.nombre}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {proyecto.columnas.length} columnas
              </p>
            </Tarjeta>
          ))}
        </div>
      )}

      {proyectoActual && (
        <TableroKanban proyecto={proyectoActual} />
      )}

      <Modal
        titulo="Crear Nuevo Proyecto"
        abierto={modalNuevoAbierto}
        onCerrar={() => setModalNuevoAbierto(false)}
      >
        <FormularioProyecto onSubmit={manejarCrearProyecto} />
      </Modal>
    </div>
  )
}

export default PaginaPrincipal
