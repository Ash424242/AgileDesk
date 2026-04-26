import { ReactNode } from 'react'
import Boton from './Boton'

interface ModalProps {
  titulo: string;
  abierto: boolean;
  onCerrar: () => void;
  children: ReactNode;
  acciones?: ReactNode;
}

/**
 * Componente de modal reutilizable
 * Muestra un diálogo modal con título, contenido y acciones
 */
export function Modal({
  titulo,
  abierto,
  onCerrar,
  children,
  acciones,
}: ModalProps) {
  if (!abierto) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">{titulo}</h2>
          <button
            onClick={onCerrar}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✕
          </button>
        </div>

        <div className="p-6">{children}</div>

        {acciones && (
          <div className="flex gap-3 p-6 border-t justify-end">
            <Boton variante="secundario" onClick={onCerrar}>
              Cerrar
            </Boton>
            {acciones}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
