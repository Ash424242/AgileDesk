import { Router } from 'express'
import { ControladorProyectos } from '../controllers/ControladorProyectos.js'

const router = Router()

/**
 * Rutas para proyectos
 */

// Obtener todos los proyectos
router.get('/', ControladorProyectos.obtenerTodos)

// Obtener un proyecto por ID
router.get('/:id', ControladorProyectos.obtenerPorId)

// Crear un nuevo proyecto
router.post('/', ControladorProyectos.crear)

// Actualizar un proyecto
router.put('/:id', ControladorProyectos.actualizar)

// Eliminar un proyecto
router.delete('/:id', ControladorProyectos.eliminar)

// Obtener columnas de un proyecto
router.get('/:proyectoId/columnas', ControladorProyectos.obtenerColumnas)

// Obtener tareas de una columna
router.get('/:proyectoId/columnas/:columnaId/tareas', ControladorProyectos.obtenerTareas)

// Crear una tarea en una columna
router.post('/:proyectoId/columnas/:columnaId/tareas', ControladorProyectos.crearTarea)

// Actualizar una tarea
router.put(
  '/:proyectoId/columnas/:columnaId/tareas/:tareaId',
  ControladorProyectos.actualizarTarea
)

// Eliminar una tarea
router.delete(
  '/:proyectoId/columnas/:columnaId/tareas/:tareaId',
  ControladorProyectos.eliminarTarea
)

// Mover una tarea
router.patch('/tareas/:tareaId/mover', ControladorProyectos.moverTarea)

export default router
