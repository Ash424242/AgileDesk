import { Link } from 'react-router-dom'
import { useProyecto } from '../context/useProyecto'
import { useTema } from '../hooks/useTema'

/**
 * Componente de navegación principal
 * Muestra el header con el logo y opciones de navegación
 */
export function Navegacion() {
  const { proyectos, proyectoActual } = useProyecto()
  const { esOscuro, alternarTema } = useTema()

  return (
    <nav className="bg-white shadow-md dark:bg-gray-900 dark:shadow-none border-b border-transparent dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary-600">AgileDesk</span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {proyectoActual ? (
              <span>Proyecto: <strong>{proyectoActual.nombre}</strong></span>
            ) : (
              <span>Proyectos: {proyectos.length}</span>
            )}
          </div>

          <button
            type="button"
            onClick={alternarTema}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            aria-pressed={esOscuro}
            aria-label="Cambiar tema"
            title="Cambiar tema"
          >
            <span className="font-medium">
              {esOscuro ? 'Oscuro' : 'Claro'}
            </span>
            <span className={`w-9 h-5 rounded-full p-0.5 transition-colors ${esOscuro ? 'bg-primary-600' : 'bg-gray-300'}`}>
              <span className={`block w-4 h-4 bg-white rounded-full transition-transform ${esOscuro ? 'translate-x-4' : 'translate-x-0'}`} />
            </span>
          </button>

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
