import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import { Proyecto, Tarea } from '../types'

/**
 * URL base de la API - usa variable de entorno o localhost por defecto
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

/**
 * Contexto para la gestión global de proyectos
 */
interface InfrastructuraProyecto {
  proyectos: Proyecto[];
  proyectoActual: Proyecto | null;
  cargarProyectos: () => Promise<void>;
  crearProyecto: (proyecto: Omit<Proyecto, 'id' | 'fechaCreacion' | 'fechaModificacion'>) => Promise<void>;
  actualizarProyecto: (id: string, proyecto: Partial<Proyecto>) => Promise<void>;
  eliminarProyecto: (id: string) => Promise<void>;
  establecerProyectoActual: (id: string | null) => void;
  agregarTarea: (columnId: string, tarea: Omit<Tarea, 'id' | 'fechaCreacion'>) => Promise<void>;
  actualizarTarea: (columnId: string, tareaId: string, tarea: Partial<Tarea>) => Promise<void>;
  eliminarTarea: (columnId: string, tareaId: string) => Promise<void>;
  moverTarea: (tareaId: string, columnaBefore: string, columnaAfter: string) => Promise<void>;
}

const ProyectoContext = createContext<InfrastructuraProyecto | undefined>(undefined)

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
   * Carga todos los proyectos desde la API o LocalStorage
   */
  const cargarProyectos = useCallback(async () => {
    try {
      // Intenta cargar desde la API
      const respuesta = await fetch(`${API_URL}/api/proyectos`)
      if (!respuesta.ok) {
        const error = await respuesta.text()
        throw new Error(`Servidor respondió con error ${respuesta.status}: ${error || respuesta.statusText}`)
      }

      const datos = await respuesta.json()
      setProyectos(datos.datos || [])
    } catch (error) {
      console.error('Error al cargar proyectos:', error)
      // Carga desde LocalStorage como fallback
      const proyectosGuardados = localStorage.getItem('proyectos')
      if (proyectosGuardados) {
        setProyectos(JSON.parse(proyectosGuardados))
      } else if (error instanceof Error && error.message.includes('TypeError')) {
        // Error de conexión
        throw new Error('No se pudo conectar al servidor. Verifica que el backend esté desplegado y VITE_API_URL esté configurado correctamente.')
      }
    }
  }, [])

  /**
   * Crea un nuevo proyecto
   */
  const crearProyecto = useCallback(async (proyecto: Omit<Proyecto, 'id' | 'fechaCreacion' | 'fechaModificacion'>) => {
    try {
      const respuesta = await fetch(`${API_URL}/api/proyectos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proyecto),
      })

      if (!respuesta.ok) {
        const error = await respuesta.text()
        throw new Error(`Error ${respuesta.status}: ${error || respuesta.statusText}`)
      }

      const nuevoProyecto = await respuesta.json()
      setProyectos((previos) => [...previos, nuevoProyecto.datos])
      localStorage.setItem('proyectos', JSON.stringify([...proyectos, nuevoProyecto.datos]))
    } catch (error) {
      console.error('Error al crear proyecto:', error)
      if (error instanceof TypeError) {
        throw new Error('No se pudo conectar al servidor. Verifica que el backend esté desplegado. VITE_API_URL debe estar configurado en Vercel.')
      }
      throw error
    }
  }, [proyectos])

  /**
   * Actualiza un proyecto existente
   */
  const actualizarProyecto = useCallback(async (id: string, proyecto: Partial<Proyecto>) => {
    try {
      const respuesta = await fetch(`${API_URL}/api/proyectos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proyecto),
      })

      if (!respuesta.ok) throw new Error('Error al actualizar proyecto')

      const proyectoActualizado = await respuesta.json()
      setProyectos((previos) =>
        previos.map((p) => (p.id === id ? proyectoActualizado.datos : p))
      )
      localStorage.setItem('proyectos', JSON.stringify(
        proyectos.map((p) => (p.id === id ? proyectoActualizado.datos : p))
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
      const respuesta = await fetch(`${API_URL}/api/proyectos/${id}`, {
        method: 'DELETE',
      })

      if (!respuesta.ok) throw new Error('Error al eliminar proyecto')

      setProyectos((previos) => previos.filter((p) => p.id !== id))
      localStorage.setItem('proyectos', JSON.stringify(
        proyectos.filter((p) => p.id !== id)
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
  const agregarTarea = useCallback(async (columnId: string, tarea: Omit<Tarea, 'id' | 'fechaCreacion'>) => {
    try {
      const respuesta = await fetch(`${API_URL}/api/columnas/${columnId}/tareas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tarea),
      })

      if (!respuesta.ok) throw new Error('Error al agregar tarea')

      await cargarProyectos()
    } catch (error) {
      console.error('Error al agregar tarea:', error)
      throw error
    }
  }, [cargarProyectos])

  /**
   * Actualiza una tarea existente
   */
  const actualizarTarea = useCallback(async (columnId: string, tareaId: string, tarea: Partial<Tarea>) => {
    try {
      const respuesta = await fetch(`${API_URL}/api/columnas/${columnId}/tareas/${tareaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tarea),
      })

      if (!respuesta.ok) throw new Error('Error al actualizar tarea')

      await cargarProyectos()
    } catch (error) {
      console.error('Error al actualizar tarea:', error)
      throw error
    }
  }, [cargarProyectos])

  /**
   * Elimina una tarea de una columna
   */
  const eliminarTarea = useCallback(async (columnId: string, tareaId: string) => {
    try {
      const respuesta = await fetch(`${API_URL}/api/columnas/${columnId}/tareas/${tareaId}`, {
        method: 'DELETE',
      })

      if (!respuesta.ok) throw new Error('Error al eliminar tarea')

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
      const respuesta = await fetch(`${API_URL}/api/tareas/${tareaId}/mover`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ columnaBefore, columnaAfter }),
      })

      if (!respuesta.ok) throw new Error('Error al mover tarea')

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

/**
 * Hook para acceder al contexto de proyectos
 */
export function useProyecto(): InfrastructuraProyecto {
  const contexto = useContext(ProyectoContext)
  if (!contexto) {
    throw new Error('useProyecto debe usarse dentro de ProyectoProvider')
  }
  return contexto
}
