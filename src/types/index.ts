/**
 * Interfaz que representa una tarea en un tablero de proyecto
 */
export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  estado: 'pendiente' | 'enProgreso' | 'completada';
  prioridad: 'baja' | 'media' | 'alta';
  fechaCreacion: Date;
  fechaVencimiento?: Date;
  asignadoA?: string;
  etiquetas: string[];
}

/**
 * Interfaz que representa una columna en el tablero
 */
export interface Columna {
  id: string;
  nombre: string;
  descripcion: string;
  posicion: number;
  tareas: Tarea[];
}

/**
 * Interfaz que representa un proyecto de Kanban
 */
export interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  columnas: Columna[];
}

/**
 * Interfaz para la respuesta de la API
 */
export interface RespuestaAPI<T = unknown> {
  exito: boolean;
  datos: T;
  mensaje: string;
  codigo: number;
}

/**
 * Interfaz para el estado de carga de solicitudes
 */
export interface EstadoRed {
  cargando: boolean;
  error: string | null;
  datos: unknown | null;
}
