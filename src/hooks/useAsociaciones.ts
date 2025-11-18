import { useState, useEffect } from 'react'

interface PlantaRecomendacion {
  slug: string
  nombre_mostrado: string
  tipo: string
  temporada: string[]
}

interface Recomendaciones {
  recomendadas: PlantaRecomendacion[]
  no_recomendadas: PlantaRecomendacion[]
  loading: boolean
  error: string | null
}

export function useAsociaciones(cultivos: string[]) {
  const [recomendaciones, setRecomendaciones] = useState<Recomendaciones>({
    recomendadas: [],
    no_recomendadas: [],
    loading: false,
    error: null
  })

  useEffect(() => {
    // Si no hay cultivos, no hacer nada
    if (!cultivos || cultivos.length === 0) {
      setRecomendaciones({
        recomendadas: [],
        no_recomendadas: [],
        loading: false,
        error: null
      })
      return
    }

    const fetchRecomendaciones = async () => {
      setRecomendaciones(prev => ({ ...prev, loading: true, error: null }))

      try {
        const response = await fetch('/api/asociaciones/recomendaciones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cultivos })
        })

        if (!response.ok) {
          throw new Error('Error al obtener recomendaciones')
        }

        const data = await response.json()

        if (data.success) {
          setRecomendaciones({
            recomendadas: data.recomendadas || [],
            no_recomendadas: data.no_recomendadas || [],
            loading: false,
            error: null
          })
        } else {
          throw new Error(data.error || 'Error desconocido')
        }
      } catch (error: any) {
        setRecomendaciones({
          recomendadas: [],
          no_recomendadas: [],
          loading: false,
          error: error.message
        })
      }
    }

    // Debounce para no hacer muchas peticiones
    const timeoutId = setTimeout(fetchRecomendaciones, 500)

    return () => clearTimeout(timeoutId)
  }, [JSON.stringify(cultivos.sort())]) // Usar JSON.stringify para comparar arrays

  return recomendaciones
}

export function verificarCompatibilidad(
  plantaSlug: string,
  noRecomendadas: PlantaRecomendacion[]
): { compatible: boolean; mensaje?: string } {
  const plantaIncompatible = noRecomendadas.find(
    p => p.slug === plantaSlug.toLowerCase()
  )

  if (plantaIncompatible) {
    return {
      compatible: false,
      mensaje: `⚠️ ${plantaIncompatible.nombre_mostrado} no es compatible con tus cultivos actuales`
    }
  }

  return { compatible: true }
}

export function esPlantaRecomendada(
  plantaSlug: string,
  recomendadas: PlantaRecomendacion[]
): boolean {
  return recomendadas.some(p => p.slug === plantaSlug.toLowerCase())
}
