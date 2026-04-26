# README

# AgileDesk

Aplicación web integral de gestión de proyectos tipo Kanban construida con React, TypeScript y Express. Frontend y backend integrados en una única aplicación.

## 🎯 Características

- **Tablero Kanban Visual**: Organiza tareas en columnas de "Por Hacer", "En Progreso" y "Completado"
- **Gestión de Proyectos**: Crea, edita y elimina proyectos
- **Gestión de Tareas**: Crea tareas con prioridades, descripciones y etiquetas
- **API REST Tipada**: Backend con Express y TypeScript
- **Interfaz Intuitiva**: Diseño limpio y responsivo con Tailwind CSS
- **React Router**: Navegación fluida entre páginas
- **Context API**: Gestión centralizada de estado global
- **Hooks Personalizados**: `useFetch` y `useFormulario` para lógica reutilizable
- **Aplicación Unificada**: Frontend y backend en la misma URL, sin configuración adicional

## 🚀 Inicio Rápido

### Desarrollo

Ejecutar frontend y backend simultáneamente:

```bash
npm run dev
```

- Acceder en: http://localhost:5173

El servidor backend se ejecuta automáticamente en el puerto 3000 y sirve los archivos del frontend.

### Producción

```bash
# Compilar frontend y backend
npm run build

# Ejecutar servidor de producción
npm run server
```

El servidor servirá la aplicación completa en http://localhost:3000

## 📂 Estructura del Proyecto

```
AgileDesk/
├── src/                          # Frontend
│   ├── components/               # Componentes reutilizables
│   ├── pages/                    # Páginas de la aplicación
│   ├── context/                  # Context API
│   ├── hooks/                    # Hooks personalizados
│   ├── api/                      # Cliente HTTP tipado
│   ├── types/                    # Tipos TypeScript
│   ├── utils/                    # Funciones utilitarias
│   ├── App.tsx                   # Componente raíz
│   └── main.tsx                  # Punto de entrada
│
├── server/                       # Backend
│   └── src/
│       ├── index.ts              # Servidor Express
│       ├── routes/               # Rutas API
│       ├── controllers/          # Controladores
│       ├── services/             # Lógica de negocio
│       └── config/               # Configuración
│
├── docs/                         # Documentación
│   ├── agile.md                  # Metodologías Agile
│   ├── idea.md                   # Descripción del proyecto
│   ├── project-management.md     # Gestión del proyecto
│   ├── design.md                 # Arquitectura
│   ├── components.md             # Componentes
│   ├── hooks.md                  # Hooks personalizados
│   ├── context.md                # Context API
│   ├── routing.md                # Sistema de rutas
│   ├── forms.md                  # Formularios
│   ├── api.md                    # API REST
│   ├── api-client.md             # Cliente HTTP
│   └── testing.md                # Testing
│
└── public/                       # Archivos estáticos
```

## 🛠️ Tecnologías

### Frontend
- **React 18**: Librería UI
- **TypeScript**: Type safety
- **Vite**: Build tool rápido
- **Tailwind CSS**: Estilos utility-first
- **React Router v6**: Enrutamiento
- **Context API**: Gestión de estado global

### Backend
- **Node.js**: Runtime JavaScript
- **Express**: Framework web
- **TypeScript**: Type safety
- **CORS**: Cross-origin requests

## 📖 Documentación

Consulta la carpeta `docs/` para documentación detallada:

- `docs/agile.md` - Metodologías Agile, Scrum y Kanban
- `docs/idea.md` - Descripción y problema que resuelve
- `docs/project-management.md` - Organización del trabajo
- `docs/design.md` - Arquitectura de la aplicación
- `docs/components.md` - Componentes reutilizables
- `docs/hooks.md` - Hooks personalizados
- `docs/context.md` - Gestión de estado global
- `docs/routing.md` - Sistema de rutas
- `docs/forms.md` - Manejo de formularios
- `docs/api.md` - Endpoints REST
- `docs/api-client.md` - Cliente HTTP tipado
- `docs/testing.md` - Estrategia de testing

## 🎮 Cómo Usar

1. **Crear Proyecto**: Haz clic en "Crear Proyecto" y completa el formulario
2. **Ver Tablero**: Selecciona un proyecto para ver su tablero Kanban
3. **Agregar Tarea**: Haz clic en "+ Agregar Tarea" en cualquier columna
4. **Editar Tarea**: Haz clic en una tarea para editar sus detalles
5. **Mover Tarea**: Arrastra tareas entre columnas (futuro: drag & drop)
6. **Eliminar**: Usa el botón de eliminar en tareas o proyectos

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Con cobertura
npm run test -- --coverage

# Watch mode
npm run test -- --watch
```

## 🔍 Linting

```bash
# Verificar código
npm run lint

# Verificar tipos
npx tsc --noEmit
```

## 🚢 Despliegue

La aplicación está completamente integrada: frontend y backend se sirven desde el mismo servidor.

### Despliegue en Vercel

1. **Conectar repositorio GitHub**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu repositorio de AgileDesk
   - Vercel detectará automáticamente que es un proyecto Node.js

2. **Configuración automática**
   - Vercel ejecutará `npm run build` para compilar
   - Ejecutará `npm start` para iniciar el servidor con los archivos estáticos

3. **Sin variables de entorno necesarias**
   - La aplicación funciona "out of the box"
   - No necesita configurar `VITE_API_URL`

4. **Acceder a la aplicación**
   - Tu aplicación estará disponible en `https://tu-proyecto.vercel.app`
   - Todos los endpoints estarán disponibles (frontend + API)

### Despliegue local

```bash
# Compilar
npm run build

# Ejecutar
npm run server

# Acceder en http://localhost:3000
```

Ver [docs/deployment.md](docs/deployment.md) para configuraciones avanzadas.
git push origin main
# Railway/Render redeploya automáticamente
```

## ⚙️ Configuración de Variables de Entorno

### Desarrollo Local
Crea `.env.local` (no se versionará):
```
VITE_API_URL=http://localhost:3000
```

### Producción (Vercel)
En el dashboard de Vercel, agrega:
```
VITE_API_URL=https://tu-backend-desplegado.com
```

Ver `.env.example` para más variables disponibles.
