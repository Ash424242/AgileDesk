import { ButtonHTMLAttributes, ReactNode } from 'react'

interface BotonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario' | 'peligro';
  tamaño?: 'pequeño' | 'mediano' | 'grande';
  children: ReactNode;
}

/**
 * Componente de botón reutilizable
 * Soporta múltiples variantes y tamaños
 */
export function Boton({
  variante = 'primario',
  tamaño = 'mediano',
  children,
  className = '',
  ...props
}: BotonProps) {
  const estilosBase = 'font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'

  const estilosVariante: Record<string, string> = {
    primario: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
    secundario: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    peligro: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  }

  const estilosTamaño: Record<string, string> = {
    pequeño: 'px-3 py-1 text-sm',
    mediano: 'px-4 py-2 text-base',
    grande: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`${estilosBase} ${estilosVariante[variante]} ${estilosTamaño[tamaño]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Boton
