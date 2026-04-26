import { ReactNode } from 'react'

interface TarjetaProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Componente de tarjeta reutilizable
 * Proporciona un contenedor estilizado para agrupar contenido
 */
export function Tarjeta({ children, className = '', onClick }: TarjetaProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Tarjeta
