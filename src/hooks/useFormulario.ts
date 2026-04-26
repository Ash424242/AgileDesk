import { useState, useCallback, ChangeEvent, FormEvent } from 'react'

/**
 * Hook personalizado para manejar formularios de manera sencilla
 * Gestiona el estado del formulario, validación y envío
 *
 * @template T - Tipo de datos del formulario
 * @param valoresIniciales - Valores iniciales del formulario
 * @param onSubmit - Función callback al enviar el formulario
 * @returns Objeto con valores del formulario, manejadores y funciones útiles
 */
export function useFormulario<T extends Record<string, unknown>>(
  valoresIniciales: T,
  onSubmit: (valores: T) => Promise<void>
): {
  valores: T;
  errores: Record<string, string>;
  cargando: boolean;
  cambiar: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  enviar: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  establecer: (campo: keyof T, valor: unknown) => void;
  reiniciar: () => void;
} {
  const [valores, setValores] = useState<T>(valoresIniciales)
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [cargando, setCargando] = useState(false)

  /**
   * Maneja cambios en los campos del formulario
   */
  const cambiar = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setValores((previos) => ({
      ...previos,
      [name]: value,
    }))

    // Limpia el error del campo cuando el usuario comienza a escribir
    if (errores[name]) {
      setErrores((previos) => {
        const nuevosErrores = { ...previos }
        delete nuevosErrores[name]
        return nuevosErrores
      })
    }
  }, [errores])

  /**
   * Maneja el envío del formulario
   */
  const enviar = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCargando(true)

    try {
      await onSubmit(valores)
      setValores(valoresIniciales)
      setErrores({})
    } catch (error) {
      setErrores({
        general: error instanceof Error ? error.message : 'Error desconocido',
      })
    } finally {
      setCargando(false)
    }
  }, [valores, valoresIniciales, onSubmit])

  /**
   * Establece el valor de un campo específico
   */
  const establecer = useCallback((campo: keyof T, valor: unknown) => {
    setValores((previos) => ({
      ...previos,
      [campo]: valor,
    }))
  }, [])

  /**
   * Reinicia el formulario a sus valores iniciales
   */
  const reiniciar = useCallback(() => {
    setValores(valoresIniciales)
    setErrores({})
  }, [valoresIniciales])

  return {
    valores,
    errores,
    cargando,
    cambiar,
    enviar,
    establecer,
    reiniciar,
  }
}
