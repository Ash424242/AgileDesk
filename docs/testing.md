# Testing y validación

## Estado real actual

En este momento el proyecto no tiene suite de pruebas automatizadas integrada en `package.json`.

No hay scripts de `test`, dependencias de testing ni pipeline CI de pruebas automáticas.

## Qué se validó manualmente

Se verificaron manualmente los flujos principales:

- Crear proyecto
- Editar proyecto
- Eliminar proyecto
- Crear tarea
- Editar tarea
- Eliminar tarea
- Mover tarea entre columnas
- Carga inicial y refresco de datos desde API
- Manejo de errores de red en UI
- Vista responsive básica en móvil y escritorio

## Verificaciones técnicas disponibles

- `npm run lint`
- `npm run build`

Estas comprobaciones se usan como validación técnica antes de desplegar.

## Pendiente en backlog

- Incorporar tests unitarios de hooks y servicios.
- Incorporar tests de integración de flujos críticos.
- Definir CI con ejecución automática de lint y build en cada PR.
