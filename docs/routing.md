# Rutas y navegación

## Librería utilizada

React Router (`react-router-dom`).

## Rutas implementadas actualmente

- `/` página principal (`PaginaPrincipal`)
- `*` página no encontrada (`Pagina404`)

La configuración está en `src/App.tsx` y usa `Layout` como contenedor compartido.

## Navegación

- Navegación principal en `src/components/Navegacion.tsx`.
- Página 404 con retorno a inicio.
- Estructura de layout con `Outlet` para mantener cabecera y contenido.

## Estructura actual (resumen)

```text
/
├─ /      -> PaginaPrincipal
└─ *      -> Pagina404
```

## Rutas planeadas (backlog)

Las rutas de detalle/configuración de proyecto se mantienen como mejora futura y no forman parte del comportamiento activo en esta versión.
