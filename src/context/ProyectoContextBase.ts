import { createContext } from 'react'
import { Proyecto, Tarea } from '../types'

/**
 * Contrato del contexto para la gestión global de proyectos
 */
export interface InfrastructuraProyecto {
  proyectos: Proyecto[];
  proyectoActual: Proyecto | null;
  cargarProyectos: () => Promise<void>;
  crearProyecto: (proyecto: Omit<Proyecto, 'id' | 'fechaCreacion' | 'fechaModificacion'>) => Promise<void>;
  actualizarProyecto: (id: string, proyecto: Partial<Proyecto>) => Promise<void>;
  eliminarProyecto: (id: string) => Promise<void>;
  establecerProyectoActual: (id: string | null) => void;
  agregarTarea: (proyectoId: string, columnId: string, tarea: Omit<Tarea, 'id' | 'fechaCreacion'>) => Promise<void>;
  actualizarTarea: (proyectoId: string, columnId: string, tareaId: string, tarea: Partial<Tarea>) => Promise<void>;
  eliminarTarea: (proyectoId: string, columnId: string, tareaId: string) => Promise<void>;
  moverTarea: (tareaId: string, columnaBefore: string, columnaAfter: string) => Promise<void>;
}

export const ProyectoContext = createContext<InfrastructuraProyecto | undefined>(undefined)

