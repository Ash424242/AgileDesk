# Gestión de Proyectos: AgileDesk

## Metodología

AgileDesk utiliza una combinación de Kanban puro para la gestión del desarrollo, complementado con prácticas de Scrum cuando es necesario. Este enfoque permite al equipo mantener flexibilidad mientras garantiza regularidad en las entregas.

## Organización del Trabajo

### Tablero Kanban

El proyecto está organizado en un tablero Kanban en Trello con las siguientes columnas:

1. **Backlog**: Todas las funcionalidades y mejoras posibles
2. **Todo (Por Hacer)**: Tareas seleccionadas para trabajar en la iteración actual
3. **In Progress (En Progreso)**: Tareas actualmente siendo desarrolladas
4. **Review (En Revisión)**: Tareas completadas esperando revisión
5. **Done (Completado)**: Tareas terminadas y verificadas

### Límites de WIP (Work In Progress)

Para mantener calidad y enfoque:

- **In Progress**: Máximo 3 tareas simultáneas por desarrollador
- **Review**: Máximo 2 tareas sin revisar

Esta limitación asegura que el equipo termine tareas antes de iniciar nuevas, evitando dispersión.

## Estructura de Tareas

### Tarjetas de Tarea

Cada tarjeta en Trello contiene:

- **Título**: Descripción clara y concisa
- **Descripción**: Detalles de qué hacer (criterios de aceptación)
- **Etiquetas**: Tipo (feature, bug, documentation, testing)
- **Prioridad**: Indica urgencia (High, Medium, Low)
- **Asignado a**: Responsable de la tarea
- **Estimación**: Story Points o horas estimadas (opcional)
- **Checklist**: Subtareas si la tarea es compleja

### Ejemplo de estructura:

```
Título: Implementar validación de formularios
Descripción:
- Crear campo de email con validación
- Mostrar mensaje de error si email inválido
- Mostrar mensaje de éxito si válido
- Tests unitarios incluidos

Criterios de Aceptación:
- [] Email válido acepta formatos RFC 5322
- [] Error message es claro y útil
- [] Estilos coherentes con diseño
- [] Tests con cobertura del 90%+

Etiquetas: feature, frontend
Prioridad: High
Asignado a: Juan
```

## Dinámicas de Trabajo

### Daily

- **Frecuencia**: Diaria (asíncrona si es equipo remoto)
- **Duración**: 15 minutos máximo
- **Formato**: Cada uno responde en comentarios de Trello:
  - ¿Qué hice ayer?
  - ¿Qué voy a hacer hoy?
  - ¿Hay bloqueos?

### Sprint Planning (Semanal)

- **Frecuencia**: Al inicio de cada semana
- **Duración**: 1 hora
- **Actividades**:
  1. Revisar estado de tareas en progreso
  2. Seleccionar tareas del backlog para la semana
  3. Estimar esfuerzo si es necesario
  4. Asignar responsables
  5. Identificar dependencias

### Sprint Review (Semanal)

- **Frecuencia**: Al final de cada semana
- **Duración**: 30-45 minutos
- **Actividades**:
  1. Revisar y demostrar funcionalidades completadas
  2. Recopilar feedback
  3. Documentar ítems no completados
  4. Actualizar Trello (mover tarjetas a Done)

### Retrospectiva (Semanal)

- **Frecuencia**: Luego de Sprint Review
- **Duración**: 20-30 minutos
- **Formato**: ¿Qué fue bien?, ¿Qué podemos mejorar?, ¿Qué cambios hacer?
- **Acciones**: Anotar mejoras a implementar en la próxima semana

## Flujo de una Tarea

1. **Creación**: Se agrega al Backlog
2. **Selección**: Se mueve a Todo en Sprint Planning
3. **Desarrollo**: Se asigna a alguien y se mueve a In Progress
4. **Revisión de código**: Se crea PR, se revisa, se mueve a Review
5. **Aprobación**: Se aprueba y se mueve a Done
6. **Deployment**: Se mezcla a main y se despliega (si aplica)

## Categorización de Tareas

### Por Tipo:

- **Feature**: Nueva funcionalidad
- **Bug Fix**: Corrección de error
- **Documentation**: Documentación del código o proyecto
- **Testing**: Pruebas unitarias, integración, E2E
- **Refactoring**: Mejora de código sin cambiar funcionalidad
- **Chore**: Tareas de mantenimiento

### Por Prioridad:

- **Critical**: Bloquea otros trabajos o afecta usuarios
- **High**: Importante, debe hacerse pronto
- **Medium**: Importante pero no urgente
- **Low**: Nice to have, puede esperar

## Métricas de Seguimiento

1. **Velocity**: Tareas/puntos completadas por semana
2. **Burndown**: Gráfico de trabajo completado vs tiempo
3. **Lead Time**: Tiempo desde creación a completación
4. **Cycle Time**: Tiempo desde "In Progress" a "Done"
5. **Defect Rate**: Errores encontrados después de "Done"

## Entrega y Despliegue

1. **Desarrollo**: En rama feature del Git
2. **Revisión**: Pull Request con revisión de pares
3. **Testing**: Pruebas manual y automatizada
4. **Staging**: Despliegue a ambiente de pruebas
5. **Production**: Despliegue a producción (usualmente semanal)

## Herramientas

- **Trello**: Gestión visual de tareas
- **GitHub**: Versionamiento de código y Pull Requests
- **Vercel**: Despliegue del frontend
- **Railway/Render**: Despliegue del backend
- **Discord/Slack**: Comunicación del equipo (opcional)
- **VS Code**: Editor de código

## Responsabilidades

- **Product Owner**: Mantiene Backlog priorizado, acepta tareas completadas
- **Lead Developer**: Revisa código, guía arquitectura, asigna tareas
- **Developers**: Completan tareas, escriben tests, documentan
- **QA (si aplica)**: Revisa funcionalidades antes de Release

## Normas del equipo

1. Cada tarea debe tener descripción clara con criterios de aceptación
2. No se puede asignar más de 3 tareas simultáneas
3. Código debe incluir comentarios para lógica compleja
4. Mínimo 80% de cobertura de tests
5. Todo cambio requiere validación de al menos 1 compañero antes de merge
6. Releases son bidimensionales: fecha + features completadas

## Ejemplos de iteraciones

### Semana 1: MVP

- Crear componentes base
- Tablero Kanban funcional
- CRUD básico de proyectos y tareas
- Almacenamiento en LocalStorage

### Semana 2: Backend

- API REST con Express
- Persistencia en base de datos en memoria
- Conexión frontend-backend
- Autenticación simple

### Semana 3: Pulido

- Mensajes de error y validaciones
- Diseño responsive
- Optimización de performance
- Testing completo

## Comunicación

- **Asincrónica**: Comentarios en Trello y GitHub
- **Síncrona**: Llamadas semanales para planificación y retrospectiva
- **Urgencias**: Slack/Discord para bloqueos críticos

Este enfoque permite al equipo mantener agilidad, claridad y velocidad de entrega mientras se adapta a cambios y aprende continuamente.
