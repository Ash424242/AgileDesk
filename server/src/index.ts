import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import routerProyectos from './routes/proyectos'

const aplicacion: Express = express()
const PUERTO = process.env.PUERTO || 3000

/**
 * Middleware de configuración global
 */
aplicacion.use(express.json())
aplicacion.use(cors({
  origin: process.env.ORIGEN_PERMITIDO || 'http://localhost:5173',
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
 * Ruta no encontrada
 */
aplicacion.use((req: Request, res: Response) => {
  res.status(404).json({
    exito: false,
    mensaje: 'Ruta no encontrada',
    codigo: 404,
  })
})

/**
 * Inicia el servidor
 */
aplicacion.listen(PUERTO, () => {
  console.log(`Servidor escuchando en puerto ${PUERTO}`)
})
