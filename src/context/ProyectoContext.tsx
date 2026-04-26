import {
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react'
import { ClienteAPI } from '../api/cliente'
import { Proyecto, Tarea } from '../types'
import { ProyectoContext } from './ProyectoContextBase'

interface ProyectoProviderProps {
  children: ReactNode;
}

/**
 * Provider del contexto de proyectos
 * Gestiona el estado global de los proyectos y sus tareas
 */
export function ProyectoProvider({ children }: ProyectoProviderProps) {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [proyectoActual, setProyectoActual] = useState<Proyecto | null>(null)

  /**
   * Sincroniza el proyecto seleccionado cuando cambia la lista de proyectos.
   * Evita que la UI muestre datos antiguos tras crear/editar tareas o proyectos.
   */
  useEffect(() => {
    if (!proyectoActual) return

    const proyectoActualizado = proyectos.find((p) => p.id === proyectoActual.id) || null
    if (proyectoActualizado?.id !== proyectoActual.id) {
      setProyectoActual(null)
      return
    }

    if (proyectoActualizado && proyectoActualizado !== proyectoActual) {
      setProyectoActual(proyectoActualizado)
    }
  }, [proyectos, proyectoActual])

  /**
   * Carga todos los proyectos desde la API o LocalStorage
   */
  const cargarProyectos = useCallback(async () => {
    try {
      const respuesta = await ClienteAPI.obtenerProyectos()
      setProyectos(respuesta.datos || [])
    } catch (error) {
      console.error('Error al cargar proyectos:', error)
      const proyectosGuardados = localStorage.getItem('proyectos')

      if (proyectosGuardados) {
        setProyectos(JSON.parse(proyectosGuardados))
      } else if (error instanceof Error) {
        throw new Error('No se pudo conectar al servidor. Recarga la página e inténtalo de nuevo.')
      }
    }
  }, [])

  /**
   * Crea un nuevo proyecto
   */
  const crearProyecto = useCallback(async (proyecto: Omit<Proyecto, 'id' | 'fechaCreacion' | 'fechaModificacion'>) => {
    try {
      const respuesta = await ClienteAPI.crearProyecto(proyecto)
      const proyectosActualizados = [...proyectos, respuesta.datos]

      setProyectos(proyectosActualizados)
      localStorage.setItem('proyectos', JSON.stringify(proyectosActualizados))
    } catch (error) {
      console.error('Error al crear proyecto:', error)
      if (error instanceof Error) {
        throw new Error(error.message || 'No se pudo crear el proyecto.')
      }

      throw error
    }
  }, [proyectos])

  /**
   * Actualiza un proyecto existente
   */
  const actualizarProyecto = useCallback(async (id: string, proyecto: Partial<Proyecto>) => {
    try {
      const respuesta = await ClienteAPI.actualizarProyecto(id, proyecto)
      const proyectosActualizados = proyectos.map((p) => (p.id === id ? respuesta.datos : p))

      setProyectos(proyectosActualizados)
      localStorage.setItem('proyectos', JSON.stringify(
        proyectosActualizados
      ))
    } catch (error) {
      console.error('Error al actualizar proyecto:', error)
      throw error
    }
  }, [proyectos])

  /**
   * Elimina un proyecto
   */
  const eliminarProyecto = useCallback(async (id: string) => {
    try {
      await ClienteAPI.eliminarProyecto(id)
      const proyectosActualizados = proyectos.filter((p) => p.id !== id)

      setProyectos(proyectosActualizados)
      localStorage.setItem('proyectos', JSON.stringify(
        proyectosActualizados
      ))
    } catch (error) {
      console.error('Error al eliminar proyecto:', error)
      throw error
    }
  }, [proyectos])

  /**
   * Establece el proyecto actual activo
   */
  const establecerProyectoActual = useCallback((id: string | null) => {
    if (id === null) {
      setProyectoActual(null)
      return
    }

    const proyecto = proyectos.find((p) => p.id === id)
    setProyectoActual(proyecto || null)
  }, [proyectos])

  /**
   * Añade una nueva tarea a una columna
   */
  const agregarTarea = useCallback(async (
    proyectoId: string,
    columnId: string,
    tarea: Omit<Tarea, 'id' | 'fechaCreacion'>
  ) => {
    try {
      await ClienteAPI.crearTarea(proyectoId, columnId, tarea)
      await cargarProyectos()
    } catch (error) {
      console.error('Error al agregar tarea:', error)
      throw error
    }
  }, [cargarProyectos])

  /**
   * Actualiza una tarea existente
   */
  const actualizarTarea = useCallback(async (
    proyectoId: string,
    columnId: string,
    tareaId: string,
    tarea: Partial<Tarea>
  ) => {
    try {
      await ClienteAPI.actualizarTarea(proyectoId, columnId, tareaId, tarea)
      await cargarProyectos()
    } catch (error) {
      console.error('Error al actualizar tarea:', error)
      throw error
    }
  }, [cargarProyectos])

  /**
   * Elimina una tarea de una columna
   */
  const eliminarTarea = useCallback(async (proyectoId: string, columnId: string, tareaId: string) => {
    try {
      await ClienteAPI.eliminarTarea(proyectoId, columnId, tareaId)
      await cargarProyectos()
    } catch (error) {
      console.error('Error al eliminar tarea:', error)
      throw error
    }
  }, [cargarProyectos])

  /**
   * Mueve una tarea de una columna a otra
   */
  const moverTarea = useCallback(async (tareaId: string, columnaBefore: string, columnaAfter: string) => {
    try {
      await ClienteAPI.moverTarea(tareaId, columnaBefore, columnaAfter)
      await cargarProyectos()
    } catch (error) {
      console.error('Error al mover tarea:', error)
      throw error
    }
  }, [cargarProyectos])

  return (
    <ProyectoContext.Provider
      value={{
        proyectos,
        proyectoActual,
        cargarProyectos,
        crearProyecto,
        actualizarProyecto,
        eliminarProyecto,
        establecerProyectoActual,
        agregarTarea,
        actualizarTarea,
        eliminarTarea,
        moverTarea,
      }}
    >
      {children}
    </ProyectoContext.Provider>
  )
}
