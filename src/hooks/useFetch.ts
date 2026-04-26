import { useState, useEffect, useCallback } from 'react'
import { EstadoRed } from '../types'

/**
 * Hook personalizado para manejar solicitudes HTTP
 * Gestiona los estados de carga, éxito y error de manera automática
 *
 * @template T - Tipo de datos esperado en la respuesta
 * @param url - URL del endpoint a consultar
 * @param opciones - Opciones fetch (method, headers, body, etc.)
 * @returns Objeto con estado de carga, datos, error y función para refrescar
 */
export function useFetch<T = unknown>(
  url: string,
  opciones?: RequestInit
): EstadoRed & { refrescar: () => Promise<void> } {
  const [estado, setEstado] = useState<EstadoRed>({
    cargando: true,
    error: null,
    datos: null,
  })

  /**
   * Función para refrescar los datos
   */
  const refrescar = useCallback(async () => {
    setEstado({ cargando: true, error: null, datos: null })

    try {
      const respuesta = await fetch(url, opciones)

      if (!respuesta.ok) {
        throw new Error(`Error en la solicitud: ${respuesta.statusText}`)
      }

      const datos = await respuesta.json()
      setEstado({
        cargando: false,
        error: null,
        datos: datos as T,
      })
    } catch (error) {
      setEstado({
        cargando: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        datos: null,
      })
    }
  }, [url, opciones])

  useEffect(() => {
    refrescar()
  }, [refrescar])

  return {
    ...estado,
    refrescar,
  }
}
