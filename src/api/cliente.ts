import { RespuestaAPI, Proyecto, Columna, Tarea } from '../types'

/**
 * Cliente de API tipado para la comunicación con el backend
 * Todas las respuestas están tipadas según las interfaces definidas
 */

/**
 * Realiza una solicitud fetch con manejo de errores y tipado
 */
async function solicitud<T>(
  ruta: string,
  opciones: RequestInit = {}
): Promise<T> {
  const url = ruta

  const respuesta = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...opciones.headers,
    },
    ...opciones,
  })

  if (!respuesta.ok) {
    let mensaje = `Error: ${respuesta.statusText}`

    try {
      const error = await respuesta.json()
      mensaje = error.mensaje || mensaje
    } catch {
      const texto = await respuesta.text()
      if (texto) {
        mensaje = texto
      }
    }

    throw new Error(mensaje)
  }

  return respuesta.json()
}

/**
 * Cliente de API para proyectos
 */
export const ClienteAPI = {
  /**
   * Obtiene todos los proyectos
   */
  async obtenerProyectos(): Promise<RespuestaAPI<Proyecto[]>> {
    return solicitud('/api/proyectos')
  },

  /**
   * Obtiene un proyecto por ID
   */
  async obtenerProyecto(id: string): Promise<RespuestaAPI<Proyecto>> {
    return solicitud(`/api/proyectos/${id}`)
  },

  /**
   * Crea un nuevo proyecto
   */
  async crearProyecto(
    proyecto: Omit<Proyecto, 'id' | 'fechaCreacion' | 'fechaModificacion'>
  ): Promise<RespuestaAPI<Proyecto>> {
    return solicitud('/api/proyectos', {
      method: 'POST',
      body: JSON.stringify(proyecto),
    })
  },

  /**
   * Actualiza un proyecto existente
   */
  async actualizarProyecto(
    id: string,
    proyecto: Partial<Proyecto>
  ): Promise<RespuestaAPI<Proyecto>> {
    return solicitud(`/api/proyectos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(proyecto),
    })
  },

  /**
   * Elimina un proyecto
   */
  async eliminarProyecto(id: string): Promise<RespuestaAPI<void>> {
    return solicitud(`/api/proyectos/${id}`, {
      method: 'DELETE',
    })
  },

  /**
   * Obtiene todas las columnas de un proyecto
   */
  async obtenerColumnas(proyectoId: string): Promise<RespuestaAPI<Columna[]>> {
    return solicitud(`/api/proyectos/${proyectoId}/columnas`)
  },

  /**
   * Crea una nueva columna en un proyecto
   */
  async crearColumna(
    proyectoId: string,
    columna: Omit<Columna, 'id' | 'tareas'>
  ): Promise<RespuestaAPI<Columna>> {
    return solicitud(`/api/proyectos/${proyectoId}/columnas`, {
      method: 'POST',
      body: JSON.stringify(columna),
    })
  },

  /**
   * Obtiene todas las tareas de una columna
   */
  async obtenerTareas(proyectoId: string, columnaId: string): Promise<RespuestaAPI<Tarea[]>> {
    return solicitud(`/api/proyectos/${proyectoId}/columnas/${columnaId}/tareas`)
  },

  /**
   * Crea una nueva tarea en una columna
   */
  async crearTarea(
    proyectoId: string,
    columnaId: string,
    tarea: Omit<Tarea, 'id' | 'fechaCreacion'>
  ): Promise<RespuestaAPI<Tarea>> {
    return solicitud(`/api/proyectos/${proyectoId}/columnas/${columnaId}/tareas`, {
      method: 'POST',
      body: JSON.stringify(tarea),
    })
  },

  /**
   * Actualiza una tarea
   */
  async actualizarTarea(
    proyectoId: string,
    columnaId: string,
    tareaId: string,
    tarea: Partial<Tarea>
  ): Promise<RespuestaAPI<Tarea>> {
    return solicitud(`/api/proyectos/${proyectoId}/columnas/${columnaId}/tareas/${tareaId}`, {
      method: 'PUT',
      body: JSON.stringify(tarea),
    })
  },

  /**
   * Elimina una tarea
   */
  async eliminarTarea(
    proyectoId: string,
    columnaId: string,
    tareaId: string
  ): Promise<RespuestaAPI<void>> {
    return solicitud(`/api/proyectos/${proyectoId}/columnas/${columnaId}/tareas/${tareaId}`, {
      method: 'DELETE',
    })
  },

  /**
   * Mueve una tarea a otra columna
   */
  async moverTarea(
    tareaId: string,
    columnaBefore: string,
    columnaAfter: string
  ): Promise<RespuestaAPI<Tarea>> {
    return solicitud(`/api/proyectos/tareas/${tareaId}/mover`, {
      method: 'PATCH',
      body: JSON.stringify({ columnaBefore, columnaAfter }),
    })
  },
}
