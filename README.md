# AgileDesk

Aplicación fullstack de gestión de proyectos tipo Kanban desarrollada con React, TypeScript, Tailwind y Node.js/Express.

## Estado actual del proyecto

- Frontend y API conviven en el mismo repositorio.
- La API es la fuente de verdad para proyectos y tareas.
- El cliente HTTP del frontend está tipado y usa rutas relativas (`/api/...`).
- La documentación de `docs/` está actualizada al estado real del código.

## Tecnologías

- React 18 + TypeScript + Vite
- Tailwind CSS
- React Router
- Node.js + Express

## Ejecución local

```bash
npm install
npm run dev
```

Servicios en desarrollo:
- Frontend: `http://localhost:5173`
- Backend/API: `http://localhost:3000`

## Build y ejecución de producción local

```bash
npm run build
npm run server
```

Aplicación en: `http://localhost:3000`

## Estructura de carpetas

```text
AgileDesk/
├── api/                        # API serverless para despliegue en Vercel
│   ├── _lib/                   # Lógica compartida de la API en Vercel
│   └── proyectos/              # Handler de endpoints de proyectos y tareas
├── docs/                       # Documentación del proyecto
├── public/                     # Archivos estáticos públicos
├── server/                     # Backend Express para entorno local
│   └── src/
│       ├── config/             # Configuración del servidor
│       ├── controllers/        # Controladores HTTP
│       ├── routes/             # Definición de rutas REST
│       ├── services/           # Lógica de negocio
│       └── types/              # Tipos del backend
├── src/                        # Frontend React + TypeScript
│   ├── api/                    # Cliente HTTP tipado
│   ├── components/             # Componentes reutilizables
│   ├── context/                # Context API y estado global
│   ├── hooks/                  # Hooks personalizados
│   ├── pages/                  # Páginas de la aplicación
│   ├── types/                  # Tipos compartidos del frontend
│   └── utils/                  # Utilidades del frontend
├── README.md
├── package.json
└── vercel.json                 # Configuración de despliegue en Vercel
```

## Documentación

- `docs/agile.md`: resumen de Agile, Scrum y Kanban aplicado al proyecto.
- `docs/idea.md`: problema, público objetivo y alcance funcional de AgileDesk.
- `docs/project-management.md`: organización del trabajo y uso del tablero Kanban.
- `docs/design.md`: decisiones de arquitectura y flujo de datos frontend-API-backend.
- `docs/components.md`: catálogo de componentes reutilizables y su propósito.
- `docs/hooks.md`: uso de hooks de React y hooks personalizados del proyecto.
- `docs/context.md`: implementación del estado global con Context API.
- `docs/routing.md`: rutas implementadas y navegación actual de la aplicación.
- `docs/forms.md`: formularios controlados, validaciones y feedback al usuario.
- `docs/api.md`: endpoints REST disponibles y contratos de respuesta.
- `docs/api-client.md`: capa de red tipada en frontend y operaciones del cliente HTTP.
- `docs/testing.md`: estado actual de pruebas y checklist de validaciones manuales.
- `docs/deployment.md`: estrategia de despliegue en Vercel y notas de entorno.
- `docs/retrospective.md`: reflexión final, aprendizajes y próximos pasos técnicos.

## Trello (gestión del proyecto)

El proyecto se organiza con un tablero Kanban en Trello usando columnas de Backlog y Hecho para seguir el avance de funcionalidades y documentación.

## Vercel (despliegue)

La aplicación se despliega en Vercel con frontend estático y API serverless definida en `vercel.json`, manteniendo el consumo por rutas relativas desde el cliente.

URL de despliegue: [https://agiledesk-vercel.vercel.app/](https://agiledesk-vercel.vercel.app/)