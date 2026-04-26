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
      fondo: 'bg-green-50',
      borde: 'border-green-200',
      icono: '✓',
    },
    error: {
      fondo: 'bg-red-50',
      borde: 'border-red-200',
      icono: '✕',
    },
    advertencia: {
      fondo: 'bg-yellow-50',
      borde: 'border-yellow-200',
      icono: '⚠',
    },
    informacion: {
      fondo: 'bg-blue-50',
      borde: 'border-blue-200',
      icono: 'ℹ',
    },
  }

  const estilos = estilosAlerta[tipo]

  return (
    <div className={`${estilos.fondo} border ${estilos.borde} rounded-lg p-4 mb-4`}>
      <div className="flex items-start gap-3">
        <span className="font-bold text-lg">{estilos.icono}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{titulo}</h3>
          <p className="text-gray-700 text-sm mt-1">{mensaje}</p>
          {acciones && <div className="mt-3">{acciones}</div>}
        </div>
      </div>
    </div>
  )
}

export default Alerta
