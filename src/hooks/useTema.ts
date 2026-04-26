import { useCallback, useEffect, useMemo, useState } from 'react'

type Tema = 'claro' | 'oscuro'

const CLAVE_STORAGE = 'tema'

function leerTemaInicial(): Tema {
  const guardado = localStorage.getItem(CLAVE_STORAGE)
  if (guardado === 'oscuro' || guardado === 'claro') return guardado

  const prefiereOscuro = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  return prefiereOscuro ? 'oscuro' : 'claro'
}

function aplicarTemaEnDOM(tema: Tema) {
  const raiz = document.documentElement
  raiz.classList.toggle('dark', tema === 'oscuro')
}

export function useTema() {
  const [tema, setTema] = useState<Tema>(() => leerTemaInicial())

  useEffect(() => {
    aplicarTemaEnDOM(tema)
    localStorage.setItem(CLAVE_STORAGE, tema)
  }, [tema])

  const esOscuro = tema === 'oscuro'

  const alternarTema = useCallback(() => {
    setTema((t) => (t === 'oscuro' ? 'claro' : 'oscuro'))
  }, [])

  return useMemo(
    () => ({ tema, esOscuro, alternarTema, setTema }),
    [tema, esOscuro, alternarTema]
  )
}

