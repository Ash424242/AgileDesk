# Retrospectiva final

## Qué aprendí

Este proyecto consolidó el trabajo fullstack en un único repositorio, conectando una UI en React + TypeScript con una API en Express. El aprendizaje principal fue mantener contratos de datos consistentes entre frontend y backend para evitar errores de integración.

## Cómo conecté frontend, backend y API

La UI consume un cliente HTTP tipado (`src/api/cliente.ts`) que habla con endpoints REST bajo `/api/proyectos`. En desarrollo local se trabaja con servidor Express y, en despliegue, con handler serverless equivalente para conservar el mismo contrato.

## Problemas principales encontrados

- Desalineación entre documentación y estado real del código en testing y despliegue.
- Endpoints documentados o consumidos sin reflejo completo en todas las implementaciones.
- Persistencia temporal en memoria, que limita consistencia en entornos serverless.

## Cómo los resolví

- Unifiqué documentación para que describa solo lo implementado.
- Completé endpoints GET de columnas y tareas para mantener coherencia con el cliente.
- Eliminé el fallback de `localStorage` en contexto para usar la API como fuente única de verdad.

## Próximos pasos

- Integrar persistencia real (base de datos).
- Agregar pruebas automatizadas y CI.
- Publicar enlaces definitivos de Trello y despliegue en `README.md`.
