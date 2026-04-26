import { servicioProyectos } from '../../server/src/services/ServicioProyectos'

type Solicitud = {
  method?: string
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
  const body = obtenerCuerpo(req.body)

  try {
    if (method === 'GET') {
      return responder(res, 200, servicioProyectos.obtenerTodos(), 'Proyectos obtenidos correctamente')
    }

    if (method === 'POST') {
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

    return responder(res, 405, null, 'Método no permitido')
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : 'Error interno del servidor'
    return responder(res, 500, null, mensaje)
  }
}

