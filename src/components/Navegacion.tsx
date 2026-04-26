import { Link, useNavigate } from 'react-router-dom'
import { useProyecto } from '../context/useProyecto'
import { useTema } from '../hooks/useTema'

/**
 * Componente de navegación principal
 * Muestra el header con el logo y opciones de navegación
 */
export function Navegacion() {
  const { proyectos, proyectoActual } = useProyecto()
  const { esOscuro, alternarTema } = useTema()
  const navigate = useNavigate()

  return (
    <nav className="bg-white shadow-md dark:bg-gray-900 dark:shadow-none border-b border-transparent dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl font-bold text-primary-600 whitespace-nowrap">AgileDesk</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <div className="text-sm text-gray-600 dark:text-gray-300 min-w-0 hidden sm:block">
            {proyectoActual ? (
              <span className="flex items-center gap-2 min-w-0">
                <span>Proyecto:</span>
                <strong className="truncate">{proyectoActual.nombre}</strong>
              </span>
            ) : (
              <span>Proyectos: {proyectos.length}</span>
            )}
          </div>

          <button
            type="button"
            onClick={alternarTema}
            className="inline-flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            aria-pressed={esOscuro}
            aria-label="Cambiar tema"
            title="Cambiar tema"
          >
            <span className="font-medium hidden sm:inline">
              {esOscuro ? 'Oscuro' : 'Claro'}
            </span>
            <span className={`w-9 h-5 rounded-full p-0.5 transition-colors ${esOscuro ? 'bg-primary-600' : 'bg-gray-300'}`}>
              <span className={`block w-4 h-4 bg-white rounded-full transition-transform ${esOscuro ? 'translate-x-4' : 'translate-x-0'}`} />
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              navigate('/', { replace: false })
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="px-3 sm:px-4 py-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            Inicio
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navegacion
