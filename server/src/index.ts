import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import routerProyectos from './routes/proyectos.js'

const aplicacion: Express = express()
const PUERTO = process.env.PUERTO || 3000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Middleware de configuración global
 */
aplicacion.use(express.json())
aplicacion.use(cors({
  credentials: true,
}))

/**
 * Middleware para logging
 */
aplicacion.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

/**
 * Rutas de la API
 */
aplicacion.use('/api/proyectos', routerProyectos)

/**
 * Ruta de prueba
 */
aplicacion.get('/ping', (req: Request, res: Response) => {
  res.json({ mensaje: 'Servidor funcionando correctamente' })
})

/**
 * Servir archivos estáticos del frontend
 */
const directorioDistFrontend = path.join(__dirname, '../../dist')
aplicacion.use(express.static(directorioDistFrontend, {
  maxAge: '1d',
  etag: false,
}))

/**
 * Manejo de errores global
 */
aplicacion.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  res.status(500).json({
    exito: false,
    mensaje: err.message || 'Error interno del servidor',
    codigo: 500,
  })
})

/**
 * Servir index.html para rutas de SPA no encontradas (para React Router)
 */
aplicacion.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(directorioDistFrontend, 'index.html'))
})

/**
 * Inicia el servidor
 */
aplicacion.listen(PUERTO, () => {
  console.log(`Servidor escuchando en puerto ${PUERTO}`)
})
