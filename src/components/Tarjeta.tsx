import { HTMLAttributes, ReactNode } from 'react'

interface TarjetaProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

/**
 * Componente de tarjeta reutilizable
 * Proporciona un contenedor estilizado para agrupar contenido
 */
export function Tarjeta({ children, className = '', onClick, ...props }: TarjetaProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 dark:bg-gray-900 dark:shadow-none dark:border dark:border-gray-800 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export default Tarjeta
