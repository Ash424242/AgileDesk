# Cliente HTTP tipado

## Archivo principal

El cliente de API está implementado en `src/api/cliente.ts`.

## Enfoque actual

- Usa `fetch` con rutas relativas (`/api/proyectos`).
- Centraliza el manejo de errores en `solicitud<T>()`.
- Devuelve respuestas tipadas con `RespuestaAPI<T>`.
- Mantiene los tipos alineados con `src/types/index.ts`.

## Operaciones implementadas

### Proyectos

- `obtenerProyectos()`
- `obtenerProyecto(id)`
- `crearProyecto(proyecto)`
- `actualizarProyecto(id, proyecto)`
- `eliminarProyecto(id)`

### Columnas

- `obtenerColumnas(proyectoId)`
- `crearColumna(proyectoId, columna)`

### Tareas

- `obtenerTareas(proyectoId, columnaId)`
- `crearTarea(proyectoId, columnaId, tarea)`
- `actualizarTarea(proyectoId, columnaId, tareaId, tarea)`
- `eliminarTarea(proyectoId, columnaId, tareaId)`
- `moverTarea(tareaId, columnaBefore, columnaAfter)`

## Contrato de tipos

- `Proyecto`, `Columna`, `Tarea` en `src/types/index.ts`
- `RespuestaAPI<T>` como envoltorio de respuestas del backend

## Estados de red en UI

La interfaz maneja estados de:

- carga
- éxito
- error

principalmente desde `src/pages/PaginaPrincipal.tsx` y `src/context/ProyectoContext.tsx`.

## Nota de arquitectura

Desde esta iteración, los datos de proyectos y tareas se consideran datos de backend. Por eso se eliminó el fallback de `localStorage` en el contexto y se usa la API como fuente única de verdad.
