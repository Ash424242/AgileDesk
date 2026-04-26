import { Outlet } from 'react-router-dom'
import Navegacion from './Navegacion'

/**
 * Componente de diseño (layout) principal
 * Proporciona la estructura base de la aplicación con navegación
 */
export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navegacion />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
