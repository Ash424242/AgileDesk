import { servicioProyectos } from '../../server/src/services/ServicioProyectos'

type Solicitud = {
  method?: string
  query: {
    ruta?: string[] | string
  }
  body?: unknown
}

type Respuesta = {
  status: (codigo: number) => Respuesta
  json: (cuerpo: unknown) => void
}

function responder(res: Respuesta, codigo: number, datos: unknown, mensaje: string) {
  res.status(codigo).json({
    exito: codigo < 400,
    datos,
    mensaje,
    codigo,
  })
}

function obtenerRuta(ruta?: string[] | string): string[] {
  if (!ruta) {
    return []
  }

  return Array.isArray(ruta) ? ruta : [ruta]
}

function obtenerCuerpo(body: unknown) {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body)
    } catch {
      return {}
    }
  }

  if (body && typeof body === 'object') {
    return body as Record<string, unknown>
  }

  return {}
}

export default function handler(req: Solicitud, res: Respuesta) {
  const method = req.method || 'GET'
  const ruta = obtenerRuta(req.query.ruta)
  const body = obtenerCuerpo(req.body)

  try {
    if (method === 'GET' && ruta.length === 0) {
      return responder(res, 200, servicioProyectos.obtenerTodos(), 'Proyectos obtenidos correctamente')
    }

    if (method === 'POST' && ruta.length === 0) {
      const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : ''
      const descripcion = typeof body.descripcion === 'string' ? body.descripcion : ''
      const columnas = Array.isArray(body.columnas) ? body.columnas : []

      if (!nombre) {
        return responder(res, 400, null, 'El nombre del proyecto es obligatorio.')
      }

      const proyecto = servicioProyectos.crear({
        nombre,
        descripcion,
        columnas,
      })

      return responder(res, 201, proyecto, 'Proyecto creado correctamente')
    }

    if (ruta.length === 1) {
      const [proyectoId] = ruta

      if (method === 'GET') {
        const proyecto = servicioProyectos.obtenerPorId(proyectoId)

        if (!proyecto) {
          return responder(res, 404, null, 'Proyecto no encontrado')
        }

        return responder(res, 200, proyecto, 'Proyecto obtenido correctamente')
      }

      if (method === 'PUT') {
        const proyectoActualizado = servicioProyectos.actualizar(proyectoId, body)

        if (!proyectoActualizado) {
          return responder(res, 404, null, 'Proyecto no encontrado')
        }

        return responder(res, 200, proyectoActualizado, 'Proyecto actualizado correctamente')
      }

      if (method === 'DELETE') {
        const eliminado = servicioProyectos.eliminar(proyectoId)

        if (!eliminado) {
          return responder(res, 404, null, 'Proyecto no encontrado')
        }

        return responder(res, 200, null, 'Proyecto eliminado correctamente')
      }
    }

    if (
      method === 'POST' &&
      ruta.length === 4 &&
      ruta[1] === 'columnas' &&
      ruta[3] === 'tareas'
    ) {
      const columnaId = ruta[2]
      const titulo = typeof body.titulo === 'string' ? body.titulo.trim() : ''

      if (!titulo) {
        return responder(res, 400, null, 'El título de la tarea es obligatorio.')
      }

      const nuevaTarea = servicioProyectos.agregarTarea(columnaId, {
        titulo,
        descripcion: typeof body.descripcion === 'string' ? body.descripcion : '',
        prioridad: body.prioridad === 'baja' || body.prioridad === 'alta' ? body.prioridad : 'media',
        estado: body.estado === 'enProgreso' || body.estado === 'completada' ? body.estado : 'pendiente',
        etiquetas: Array.isArray(body.etiquetas) ? body.etiquetas.filter((etiqueta): etiqueta is string => typeof etiqueta === 'string') : [],
      })

      if (!nuevaTarea) {
        return responder(res, 404, null, 'Columna no encontrada')
      }

      return responder(res, 201, nuevaTarea, 'Tarea creada correctamente')
    }

    if (
      ruta.length === 5 &&
      ruta[1] === 'columnas' &&
      ruta[3] === 'tareas'
    ) {
      const columnaId = ruta[2]
      const tareaId = ruta[4]

      if (method === 'PUT') {
        const tareaActualizada = servicioProyectos.actualizarTarea(columnaId, tareaId, body)

        if (!tareaActualizada) {
          return responder(res, 404, null, 'Tarea no encontrada')
        }

        return responder(res, 200, tareaActualizada, 'Tarea actualizada correctamente')
      }

      if (method === 'DELETE') {
        const eliminada = servicioProyectos.eliminarTarea(columnaId, tareaId)

        if (!eliminada) {
          return responder(res, 404, null, 'Tarea no encontrada')
        }

        return responder(res, 200, null, 'Tarea eliminada correctamente')
      }
    }

    if (method === 'PATCH' && ruta.length === 3 && ruta[0] === 'tareas' && ruta[2] === 'mover') {
      const tareaId = ruta[1]
      const columnaBefore = typeof body.columnaBefore === 'string' ? body.columnaBefore : ''
      const columnaAfter = typeof body.columnaAfter === 'string' ? body.columnaAfter : ''

      if (!columnaBefore || !columnaAfter) {
        return responder(res, 400, null, 'Se requieren las columnas origen y destino')
      }

      const tareaMovida = servicioProyectos.moverTarea(tareaId, columnaBefore, columnaAfter)

      if (!tareaMovida) {
        return responder(res, 404, null, 'Tarea o columna no encontrada')
      }

      return responder(res, 200, tareaMovida, 'Tarea movida correctamente')
    }

    return responder(res, 404, null, 'Ruta no encontrada')
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error interno del servidor'
    return responder(res, 500, null, mensaje)
  }
}