import { ReactNode } from 'react'

interface AlertaProps {
  tipo: 'exito' | 'error' | 'advertencia' | 'informacion';
  titulo: string;
  mensaje: string;
  acciones?: ReactNode;
}

/**
 * Componente de alerta reutilizable
 * Muestra mensajes de diferentes tipos con iconos y colores específicos
 */
export function Alerta({
  tipo,
  titulo,
  mensaje,
  acciones,
}: AlertaProps) {
  const estilosAlerta: Record<string, { fondo: string; borde: string; icono: string }> = {
    exito: {
      fondo: 'bg-green-50 dark:bg-green-950/30',
      borde: 'border-green-200 dark:border-green-900/60',
      icono: '✓',
    },
    error: {
      fondo: 'bg-red-50 dark:bg-red-950/30',
      borde: 'border-red-200 dark:border-red-900/60',
      icono: '✕',
    },
    advertencia: {
      fondo: 'bg-yellow-50 dark:bg-yellow-950/25',
      borde: 'border-yellow-200 dark:border-yellow-900/60',
      icono: '⚠',
    },
    informacion: {
      fondo: 'bg-blue-50 dark:bg-blue-950/30',
      borde: 'border-blue-200 dark:border-blue-900/60',
      icono: 'ℹ',
    },
  }

  const estilos = estilosAlerta[tipo]

  return (
    <div className={`${estilos.fondo} border ${estilos.borde} rounded-lg p-4 mb-4`}>
      <div className="flex items-start gap-3">
        <span className="font-bold text-lg text-gray-900 dark:text-gray-100">{estilos.icono}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-50">{titulo}</h3>
          <p className="text-gray-700 dark:text-gray-200 text-sm mt-1">{mensaje}</p>
          {acciones && <div className="mt-3">{acciones}</div>}
        </div>
      </div>
    </div>
  )
}

export default Alerta
