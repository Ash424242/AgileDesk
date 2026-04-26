import { Proyecto, Columna, Tarea } from '../../src/types'

/**
 * Servicio para gestionar proyectos
 * Implementa la lógica de negocio
 */
export class ServicioProyectos {
  private proyectos: Map<string, Proyecto> = new Map()
  private contadores = { proyectos: 0, columnas: 0, tareas: 0 }

  /**
   * Obtiene todos los proyectos
   */
  obtenerTodos(): Proyecto[] {
    return Array.from(this.proyectos.values())
  }

  /**
   * Obtiene un proyecto por ID
   */
  obtenerPorId(id: string): Proyecto | null {
    return this.proyectos.get(id) || null
  }

  /**
   * Crea un nuevo proyecto
   */
  crear(proyecto: Omit<Proyecto, 'id' | 'fechaCreacion' | 'fechaModificacion'>): Proyecto {
    this.contadores.proyectos++
    const id = `proyecto-${this.contadores.proyectos}`

    const nuevoProyecto: Proyecto = {
      ...proyecto,
      id,
      fechaCreacion: new Date(),
      fechaModificacion: new Date(),
    }

    this.proyectos.set(id, nuevoProyecto)
    return nuevoProyecto
  }

  /**
   * Actualiza un proyecto
   */
  actualizar(id: string, datosActualizacion: Partial<Proyecto>): Proyecto | null {
    const proyecto = this.proyectos.get(id)
    if (!proyecto) return null

    const proyectoActualizado: Proyecto = {
      ...proyecto,
      ...datosActualizacion,
      id,
      fechaCreacion: proyecto.fechaCreacion,
      fechaModificacion: new Date(),
    }

    this.proyectos.set(id, proyectoActualizado)
    return proyectoActualizado
  }

  /**
   * Elimina un proyecto
   */
  eliminar(id: string): boolean {
    return this.proyectos.delete(id)
  }

  /**
   * Agrega una tarea a una columna
   */
  agregarTarea(columnaId: string, tarea: Omit<Tarea, 'id' | 'fechaCreacion'>): Tarea | null {
    for (const proyecto of this.proyectos.values()) {
      const columna = proyecto.columnas.find((c) => c.id === columnaId)
      if (columna) {
        this.contadores.tareas++
        const nuevaTarea: Tarea = {
          ...tarea,
          id: `tarea-${this.contadores.tareas}`,
          fechaCreacion: new Date(),
        }
        columna.tareas.push(nuevaTarea)
        proyecto.fechaModificacion = new Date()
        return nuevaTarea
      }
    }
    return null
  }

  /**
   * Actualiza una tarea
   */
  actualizarTarea(
    columnaId: string,
    tareaId: string,
    datosActualizacion: Partial<Tarea>
  ): Tarea | null {
    for (const proyecto of this.proyectos.values()) {
      const columna = proyecto.columnas.find((c) => c.id === columnaId)
      if (columna) {
        const tareaIndex = columna.tareas.findIndex((t) => t.id === tareaId)
        if (tareaIndex !== -1) {
          columna.tareas[tareaIndex] = {
            ...columna.tareas[tareaIndex],
            ...datosActualizacion,
          }
          proyecto.fechaModificacion = new Date()
          return columna.tareas[tareaIndex]
        }
      }
    }
    return null
  }

  /**
   * Elimina una tarea
   */
  eliminarTarea(columnaId: string, tareaId: string): boolean {
    for (const proyecto of this.proyectos.values()) {
      const columna = proyecto.columnas.find((c) => c.id === columnaId)
      if (columna) {
        const indiceTarea = columna.tareas.findIndex((t) => t.id === tareaId)
        if (indiceTarea !== -1) {
          columna.tareas.splice(indiceTarea, 1)
          proyecto.fechaModificacion = new Date()
          return true
        }
      }
    }
    return false
  }

  /**
   * Mueve una tarea de una columna a otra
   */
  moverTarea(tareaId: string, columnaOrigenId: string, columnaDestinoId: string): Tarea | null {
    let tarea: Tarea | null = null

    // Busca la tarea en la columna origen
    for (const proyecto of this.proyectos.values()) {
      const columnaOrigen = proyecto.columnas.find((c) => c.id === columnaOrigenId)
      if (columnaOrigen) {
        const indiceTarea = columnaOrigen.tareas.findIndex((t) => t.id === tareaId)
        if (indiceTarea !== -1) {
          [tarea] = columnaOrigen.tareas.splice(indiceTarea, 1)
          break
        }
      }
    }

    if (!tarea) return null

    // Agrega la tarea a la columna destino
    for (const proyecto of this.proyectos.values()) {
      const columnaDestino = proyecto.columnas.find((c) => c.id === columnaDestinoId)
      if (columnaDestino) {
        columnaDestino.tareas.push(tarea)
        proyecto.fechaModificacion = new Date()
        return tarea
      }
    }

    return null
  }
}

export const servicioProyectos = new ServicioProyectos()
