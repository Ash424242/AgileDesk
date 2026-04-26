import { InputHTMLAttributes } from 'react'

interface EntradaProps extends InputHTMLAttributes<HTMLInputElement> {
  etiqueta?: string;
  error?: string;
}

/**
 * Componente de entrada de formulario reutilizable
 * Incluye soporte para etiqueta y mensajes de error
 */
export function Entrada({
  etiqueta,
  error,
  className = '',
  ...props
}: EntradaProps) {
  return (
    <div className="mb-4">
      {etiqueta && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {etiqueta}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export default Entrada
