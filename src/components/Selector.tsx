import { SelectHTMLAttributes } from 'react'

interface OpcionSelector {
  valor: string | number;
  etiqueta: string;
}

interface SelectorProps extends SelectHTMLAttributes<HTMLSelectElement> {
  etiqueta?: string;
  error?: string;
  opciones: OpcionSelector[];
  placeholder?: string;
}

/**
 * Componente de selector (select) reutilizable
 * Incluye soporte para etiqueta, opciones y mensajes de error
 */
export function Selector({
  etiqueta,
  error,
  opciones,
  placeholder,
  className = '',
  ...props
}: SelectorProps) {
  return (
    <div className="mb-4">
      {etiqueta && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          {etiqueta}
        </label>
      )}
      <select
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
        } ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.etiqueta}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export default Selector
