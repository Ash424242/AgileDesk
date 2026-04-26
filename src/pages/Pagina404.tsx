import { Link } from 'react-router-dom'
import { Encabezado, Tarjeta, Boton } from '../components'

/**
 * Página 404 - Página no encontrada
 */
export function Pagina404() {
  return (
    <div className="space-y-6">
      <Encabezado
        titulo="Página No Encontrada"
        subtitulo="Lo sentimos, la página que buscas no existe"
      />

      <div className="text-center">
        <Tarjeta className="py-16">
          <p className="text-6xl font-bold text-gray-300 dark:text-gray-700 mb-4">404</p>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            La página que intentas acceder no está disponible
          </p>
          <Link to="/">
            <Boton>Volver al Inicio</Boton>
          </Link>
        </Tarjeta>
      </div>
    </div>
  )
}

export default Pagina404
