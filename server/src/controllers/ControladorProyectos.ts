import { Request, Response } from 'express'
import { servicioProyectos } from '../services/ServicioProyectos'
import { Proyecto } from '../../src/types'

/**
 * Controlador de proyectos
 * Maneja las solicitudes HTTP relacionadas con proyectos
 */
export class ControladorProyectos {
  /**
   * GET /api/proyectos
   * Obtiene todos los proyectos
   */
  static obtenerTodos(req: Request, res: Response): void {
    try {
      const proyectos = servicioProyectos.obtenerTodos()
      res.json({
        exito: true,
        datos: proyectos,
        mensaje: 'Proyectos obtenidos correctamente',
        codigo: 200,
      })
    } catch (error) {
      res.status(500).json({
        exito: false,
        datos: null,
        mensaje: error instanceof Error ? error.message : 'Error al obtener proyectos',
        codigo: 500,
      })
    }
  }

  /**
   * GET /api/proyectos/:id
   * Obtiene un proyecto por ID
   */
  static obtenerPorId(req: Request, res: Response): void {
    try {
      const { id } = req.params
      const proyecto = servicioProyectos.obtenerPorId(id)

      if (!proyecto) {
        res.status(404).json({
          exito: false,
          datos: null,
          mensaje: 'Proyecto no encontrado',
          codigo: 404,
        })
        return
      }

      res.json({
        exito: true,
        datos: proyecto,
        mensaje: 'Proyecto obtenido correctamente',
        codigo: 200,
      })
    } catch (error) {
      res.status(500).json({
        exito: false,
        datos: null,
        mensaje: error instanceof Error ? error.message : 'Error al obtener proyecto',
        codigo: 500,
      })
    }
  }

  /**
   * POST /api/proyectos
   * Crea un nuevo proyecto
   */
  static crear(req: Request, res: Response): void {
    try {
      const { nombre, descripcion, columnas } = req.body

      if (!nombre || typeof nombre !== 'string') {
        res.status(400).json({
          exito: false,
          datos: null,
          mensaje: 'El nombre del proyecto es requerido',
          codigo: 400,
        })
        return
      }

      const nuevoProyecto = servicioProyectos.crear({
        nombre,
        descripcion: descripcion || '',
        columnas: columnas || [],
      })

      res.status(201).json({
        exito: true,
        datos: nuevoProyecto,
        mensaje: 'Proyecto creado correctamente',
        codigo: 201,
      })
    } catch (error) {
      res.status(500).json({
        exito: false,
        datos: null,
        mensaje: error instanceof Error ? error.message : 'Error al crear proyecto',
        codigo: 500,
      })
    }
  }

  /**
   * PUT /api/proyectos/:id
   * Actualiza un proyecto
   */
  static actualizar(req: Request, res: Response): void {
    try {
      const { id } = req.params
      const datosActualizacion = req.body

      const proyectoActualizado = servicioProyectos.actualizar(id, datosActualizacion)

      if (!proyectoActualizado) {
        res.status(404).json({
          exito: false,
          datos: null,
          mensaje: 'Proyecto no encontrado',
          codigo: 404,
        })
        return
      }

      res.json({
        exito: true,
        datos: proyectoActualizado,
        mensaje: 'Proyecto actualizado correctamente',
        codigo: 200,
      })
    } catch (error) {
      res.status(500).json({
        exito: false,
        datos: null,
        mensaje: error instanceof Error ? error.message : 'Error al actualizar proyecto',
        codigo: 500,
      })
    }
  }

  /**
   * DELETE /api/proyectos/:id
   * Elimina un proyecto
   */
  static eliminar(req: Request, res: Response): void {
    try {
      const { id } = req.params
      const eliminado = servicioProyectos.eliminar(id)

      if (!eliminado) {
        res.status(404).json({
          exito: false,
          datos: null,
          mensaje: 'Proyecto no encontrado',
          codigo: 404,
        })
        return
      }

      res.json({
        exito: true,
        datos: null,
        mensaje: 'Proyecto eliminado correctamente',
        codigo: 200,
      })
    } catch (error) {
      res.status(500).json({
        exito: false,
        datos: null,
        mensaje: error instanceof Error ? error.message : 'Error al eliminar proyecto',
        codigo: 500,
      })
    }
  }

  /**
   * POST /api/proyectos/:proyectoId/columnas/:columnaId/tareas
   * Crea una nueva tarea
   */
  static crearTarea(req: Request, res: Response): void {
    try {
      const { columnaId } = req.params
      const { titulo, descripcion, prioridad, estado, etiquetas } = req.body

      if (!titulo) {
        res.status(400).json({
          exito: false,
          datos: null,
          mensaje: 'El título de la tarea es requerido',
          codigo: 400,
        })
        return
      }

      const nuevaTarea = servicioProyectos.agregarTarea(columnaId, {
        titulo,
        descripcion: descripcion || '',
        prioridad: prioridad || 'media',
        estado: estado || 'pendiente',
        etiquetas: etiquetas || [],
      })

      if (!nuevaTarea) {
        res.status(404).json({
          exito: false,
          datos: null,
          mensaje: 'Columna no encontrada',
          codigo: 404,
        })
        return
      }

      res.status(201).json({
        exito: true,
        datos: nuevaTarea,
        mensaje: 'Tarea creada correctamente',
        codigo: 201,
      })
    } catch (error) {
      res.status(500).json({
        exito: false,
        datos: null,
        mensaje: error instanceof Error ? error.message : 'Error al crear tarea',
        codigo: 500,
      })
    }
  }

  /**
   * PUT /api/columnas/:columnaId/tareas/:tareaId
   * Actualiza una tarea
   */
  static actualizarTarea(req: Request, res: Response): void {
    try {
      const { columnaId, tareaId } = req.params
      const datosActualizacion = req.body

      const tareaActualizada = servicioProyectos.actualizarTarea(
        columnaId,
        tareaId,
        datosActualizacion
      )

      if (!tareaActualizada) {
        res.status(404).json({
          exito: false,
          datos: null,
          mensaje: 'Tarea no encontrada',
          codigo: 404,
        })
        return
      }

      res.json({
        exito: true,
        datos: tareaActualizada,
        mensaje: 'Tarea actualizada correctamente',
        codigo: 200,
      })
    } catch (error) {
      res.status(500).json({
        exito: false,
        datos: null,
        mensaje: error instanceof Error ? error.message : 'Error al actualizar tarea',
        codigo: 500,
      })
    }
  }

  /**
   * DELETE /api/columnas/:columnaId/tareas/:tareaId
   * Elimina una tarea
   */
  static eliminarTarea(req: Request, res: Response): void {
    try {
      const { columnaId, tareaId } = req.params
      const eliminada = servicioProyectos.eliminarTarea(columnaId, tareaId)

      if (!eliminada) {
        res.status(404).json({
          exito: false,
          datos: null,
          mensaje: 'Tarea no encontrada',
          codigo: 404,
        })
        return
      }

      res.json({
        exito: true,
        datos: null,
        mensaje: 'Tarea eliminada correctamente',
        codigo: 200,
      })
    } catch (error) {
      res.status(500).json({
        exito: false,
        datos: null,
        mensaje: error instanceof Error ? error.message : 'Error al eliminar tarea',
        codigo: 500,
      })
    }
  }

  /**
   * PATCH /api/tareas/:tareaId/mover
   * Mueve una tarea a otra columna
   */
  static moverTarea(req: Request, res: Response): void {
    try {
      const { tareaId } = req.params
      const { columnaBefore, columnaAfter } = req.body

      if (!columnaBefore || !columnaAfter) {
        res.status(400).json({
          exito: false,
          datos: null,
          mensaje: 'Se requieren las columnas origen y destino',
          codigo: 400,
        })
        return
      }

      const tareaMovida = servicioProyectos.moverTarea(tareaId, columnaBefore, columnaAfter)

      if (!tareaMovida) {
        res.status(404).json({
          exito: false,
          datos: null,
          mensaje: 'Tarea o columna no encontrada',
          codigo: 404,
        })
        return
      }

      res.json({
        exito: true,
        datos: tareaMovida,
        mensaje: 'Tarea movida correctamente',
        codigo: 200,
      })
    } catch (error) {
      res.status(500).json({
        exito: false,
        datos: null,
        mensaje: error instanceof Error ? error.message : 'Error al mover tarea',
        codigo: 500,
      })
    }
  }
}
