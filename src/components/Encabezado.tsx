import { ReactNode } from 'react'

interface EncabezadoProps {
  titulo: string;
  subtitulo?: string;
  acciones?: ReactNode;
}

/**
 * Componente de encabezado reutilizable
 * Muestra el título y subtítulo de una página
 */
export function Encabezado({ titulo, subtitulo, acciones }: EncabezadoProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">{titulo}</h1>
        {subtitulo && <p className="text-gray-600 dark:text-gray-300 mt-2">{subtitulo}</p>}
      </div>
      {acciones && <div className="flex gap-4">{acciones}</div>}
    </div>
  )
}

export default Encabezado
