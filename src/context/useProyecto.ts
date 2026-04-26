import { useContext } from 'react'
import { InfrastructuraProyecto, ProyectoContext } from './ProyectoContextBase'

/**
 * Hook para acceder al contexto de proyectos
 */
export function useProyecto(): InfrastructuraProyecto {
  const contexto = useContext(ProyectoContext)
  if (!contexto) {
    throw new Error('useProyecto debe usarse dentro de ProyectoProvider')
  }
  return contexto
}

