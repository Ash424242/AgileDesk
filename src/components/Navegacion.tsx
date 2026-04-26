import { Link } from 'react-router-dom'
import { useProyecto } from '../context/useProyecto'

/**
 * Componente de navegación principal
 * Muestra el header con el logo y opciones de navegación
 */
export function Navegacion() {
  const { proyectos, proyectoActual } = useProyecto()

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary-600">AgileDesk</span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="text-sm text-gray-600">
            {proyectoActual ? (
              <span>Proyecto: <strong>{proyectoActual.nombre}</strong></span>
            ) : (
              <span>Proyectos: {proyectos.length}</span>
            )}
          </div>
          <Link
            to="/"
            className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            Inicio
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navegacion
