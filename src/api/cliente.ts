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

  let respuesta: Response
  try {
    respuesta = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...opciones.headers,
      },
      ...opciones,
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.')
  }

  const contenido = await respuesta.text()
  const contenidoTrim = contenido.trim()
  const contenidoPareceJSON =
    contenidoTrim.startsWith('{') || contenidoTrim.startsWith('[')

  const parsearContenido = () => {
    if (!contenidoTrim) return undefined
    if (!contenidoPareceJSON) return contenido
    try {
      return JSON.parse(contenido) as unknown
    } catch {
      return contenido
    }
  }

  if (!respuesta.ok) {
    let mensaje = 'Error en la solicitud.'

    const payload = parsearContenido()
    if (payload && typeof payload === 'object' && 'mensaje' in payload) {
      const posibleMensaje = (payload as { mensaje?: unknown }).mensaje
      if (typeof posibleMensaje === 'string' && posibleMensaje.trim()) {
        mensaje = posibleMensaje
      }
    } else if (typeof payload === 'string' && payload.trim()) {
      const texto = payload.trim()
      const pareceHTML = texto.startsWith('<!doctype') || texto.startsWith('<html')
      const esNotFoundVercel = texto.includes('NOT_FOUND') || texto.includes('The page could not be found')
      if (!pareceHTML && !esNotFoundVercel) {
        mensaje = texto
      }
    }

    if (!mensaje || mensaje === 'Error en la solicitud.') {
      if (respuesta.status === 404) mensaje = 'Recurso no encontrado.'
      else if (respuesta.status === 400) mensaje = 'La solicitud no es válida.'
      else if (respuesta.status === 401) mensaje = 'No estás autorizado para realizar esta acción.'
      else if (respuesta.status === 403) mensaje = 'No tienes permisos para realizar esta acción.'
      else if (respuesta.status >= 500) mensaje = 'Error interno del servidor. Inténtalo de nuevo más tarde.'
      else mensaje = `Error al realizar la solicitud (código ${respuesta.status}).`
    }

    throw new Error(mensaje)
  }

  return parsearContenido() as T
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
