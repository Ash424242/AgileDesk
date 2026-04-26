type EstadoTarea = 'pendiente' | 'enProgreso' | 'completada'
type PrioridadTarea = 'baja' | 'media' | 'alta'

export type Tarea = {
  id: string
  titulo: string
  descripcion: string
  estado: EstadoTarea
  prioridad: PrioridadTarea
  fechaCreacion: Date
  etiquetas: string[]
}

export type Columna = {
  id: string
  nombre: string
  descripcion: string
  posicion: number
  tareas: Tarea[]
}

export type Proyecto = {
  id: string
  nombre: string
  descripcion: string
  fechaCreacion: Date
  fechaModificacion: Date
  columnas: Columna[]
}

/**
 * Servicio en memoria para la API en Vercel.
 * Nota: en entornos serverless no garantiza persistencia entre invocaciones.
 */
class ServicioProyectos {
  private proyectos: Map<string, Proyecto> = new Map()
  private contadores = { proyectos: 0, tareas: 0 }

  obtenerTodos(): Proyecto[] {
    return Array.from(this.proyectos.values())
  }

  obtenerPorId(id: string): Proyecto | null {
    return this.proyectos.get(id) || null
  }

  crear(proyecto: Omit<Proyecto, 'id' | 'fechaCreacion' | 'fechaModificacion'>): Proyecto {
    this.contadores.proyectos++
    const id = `proyecto-${this.contadores.proyectos}`
    const ahora = new Date()

    const nuevoProyecto: Proyecto = {
      ...proyecto,
      id,
      fechaCreacion: ahora,
      fechaModificacion: ahora,
    }

    this.proyectos.set(id, nuevoProyecto)
    return nuevoProyecto
  }

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

  eliminar(id: string): boolean {
    return this.proyectos.delete(id)
  }

  agregarTarea(columnaId: string, tarea: Omit<Tarea, 'id' | 'fechaCreacion'>): Tarea | null {
    for (const proyecto of this.proyectos.values()) {
      const columna = proyecto.columnas.find((c) => c.id === columnaId)
      if (!columna) continue

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
    return null
  }

  actualizarTarea(columnaId: string, tareaId: string, datosActualizacion: Partial<Tarea>): Tarea | null {
    for (const proyecto of this.proyectos.values()) {
      const columna = proyecto.columnas.find((c) => c.id === columnaId)
      if (!columna) continue

      const indice = columna.tareas.findIndex((t) => t.id === tareaId)
      if (indice === -1) continue

      columna.tareas[indice] = {
        ...columna.tareas[indice],
        ...datosActualizacion,
      }
      proyecto.fechaModificacion = new Date()
      return columna.tareas[indice]
    }
    return null
  }

  eliminarTarea(columnaId: string, tareaId: string): boolean {
    for (const proyecto of this.proyectos.values()) {
      const columna = proyecto.columnas.find((c) => c.id === columnaId)
      if (!columna) continue

      const indice = columna.tareas.findIndex((t) => t.id === tareaId)
      if (indice === -1) continue

      columna.tareas.splice(indice, 1)
      proyecto.fechaModificacion = new Date()
      return true
    }
    return false
  }

  moverTarea(tareaId: string, columnaOrigenId: string, columnaDestinoId: string): Tarea | null {
    let tarea: Tarea | null = null

    for (const proyecto of this.proyectos.values()) {
      const columnaOrigen = proyecto.columnas.find((c) => c.id === columnaOrigenId)
      if (!columnaOrigen) continue

      const indice = columnaOrigen.tareas.findIndex((t) => t.id === tareaId)
      if (indice === -1) continue

      ;[tarea] = columnaOrigen.tareas.splice(indice, 1)
      break
    }

    if (!tarea) return null

    for (const proyecto of this.proyectos.values()) {
      const columnaDestino = proyecto.columnas.find((c) => c.id === columnaDestinoId)
      if (!columnaDestino) continue

      columnaDestino.tareas.push(tarea)
      proyecto.fechaModificacion = new Date()
      return tarea
    }

    return null
  }
}

export const servicioProyectos = new ServicioProyectos()

