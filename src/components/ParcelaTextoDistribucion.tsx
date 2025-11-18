'use client'

import { useState, useEffect } from 'react'

interface Planta {
  nombre: string
  emoji: string
  espaciado: number // cm entre plantas (promedio si hay rango)
  color: string
  tipo?: 'aromatica' | 'continua' | 'unica' // Tipo de producción
  categoria?: 'hoja' | 'raiz' | 'fruto' | 'leguminosa' | 'aromatica' | 'otro' // Clasificación botánica
}

interface ParcelaTextoDistribucionProps {
  nombre: string
  cultivos: string[]
  area: number // m²
  dimensiones?: { largo: number; ancho: number } // en cm
  onEdit?: (nuevosCultivos: string[]) => void
}

const PLANTAS_INFO: Record<string, Planta> = {
  // ========== DE HOJA ==========
  'lechuga': { nombre: 'Lechuga', emoji: '🥬', espaciado: 27.5, color: 'bg-green-100', tipo: 'unica', categoria: 'hoja' },
  'acelga': { nombre: 'Acelga', emoji: '🌿', espaciado: 35, color: 'bg-green-200', tipo: 'continua', categoria: 'hoja' },
  'espinaca': { nombre: 'Espinaca', emoji: '🍃', espaciado: 12.5, color: 'bg-green-300', tipo: 'unica', categoria: 'hoja' },
  'repollo': { nombre: 'Repollo', emoji: '🥬', espaciado: 52.5, color: 'bg-green-50', tipo: 'unica', categoria: 'hoja' },
  'col': { nombre: 'Col', emoji: '🥬', espaciado: 52.5, color: 'bg-green-100', tipo: 'unica', categoria: 'hoja' },
  'coliflor': { nombre: 'Coliflor', emoji: '🥦', espaciado: 52.5, color: 'bg-gray-50', tipo: 'unica', categoria: 'hoja' },
  'brócoli': { nombre: 'Brócoli', emoji: '🥦', espaciado: 52.5, color: 'bg-green-400', tipo: 'unica', categoria: 'hoja' },
  
  // ========== DE RAÍZ ==========
  'zanahoria': { nombre: 'Zanahoria', emoji: '🥕', espaciado: 6.5, color: 'bg-orange-100', tipo: 'unica', categoria: 'raiz' },
  'rábano': { nombre: 'Rábano', emoji: '🫘', espaciado: 5, color: 'bg-pink-100', tipo: 'unica', categoria: 'raiz' },
  'remolacha': { nombre: 'Remolacha', emoji: '🫛', espaciado: 12.5, color: 'bg-red-200', tipo: 'unica', categoria: 'raiz' },
  'nabo': { nombre: 'Nabo', emoji: '🫛', espaciado: 12.5, color: 'bg-purple-50', tipo: 'unica', categoria: 'raiz' },
  
  // ========== FRUTOS (Solanáceas y Cucurbitáceas) ==========
  'tomate': { nombre: 'Tomate', emoji: '�', espaciado: 50, color: 'bg-red-100', tipo: 'continua', categoria: 'fruto' },
  'pimiento': { nombre: 'Pimiento', emoji: '🌶️', espaciado: 40, color: 'bg-yellow-100', tipo: 'continua', categoria: 'fruto' },
  'berenjena': { nombre: 'Berenjena', emoji: '🍆', espaciado: 45, color: 'bg-purple-100', tipo: 'continua', categoria: 'fruto' },
  'pepino': { nombre: 'Pepino', emoji: '🥒', espaciado: 45, color: 'bg-green-200', tipo: 'continua', categoria: 'fruto' },
  'calabacín': { nombre: 'Calabacín', emoji: '🥒', espaciado: 85, color: 'bg-green-300', tipo: 'continua', categoria: 'fruto' },
  'calabaza': { nombre: 'Calabaza', emoji: '🎃', espaciado: 175, color: 'bg-orange-200', tipo: 'unica', categoria: 'fruto' },
  'melón': { nombre: 'Melón', emoji: '🍈', espaciado: 90, color: 'bg-yellow-50', tipo: 'unica', categoria: 'fruto' },
  'sandía': { nombre: 'Sandía', emoji: '🍉', espaciado: 125, color: 'bg-red-50', tipo: 'unica', categoria: 'fruto' },
  
  // ========== LEGUMINOSAS ==========
  'judías enanas': { nombre: 'Judías (enanas)', emoji: '🫘', espaciado: 12.5, color: 'bg-green-500', tipo: 'continua', categoria: 'leguminosa' },
  'judías trepadoras': { nombre: 'Judías (trepadoras)', emoji: '🫘', espaciado: 20, color: 'bg-green-600', tipo: 'continua', categoria: 'leguminosa' },
  'guisantes': { nombre: 'Guisantes', emoji: '🫛', espaciado: 6.5, color: 'bg-green-400', tipo: 'unica', categoria: 'leguminosa' },
  
  // ========== AROMÁTICAS ==========
  'albahaca': { nombre: 'Albahaca', emoji: '🌿', espaciado: 27.5, color: 'bg-emerald-100', tipo: 'aromatica', categoria: 'aromatica' },
  'perejil': { nombre: 'Perejil', emoji: '🌿', espaciado: 20, color: 'bg-lime-100', tipo: 'aromatica', categoria: 'aromatica' },
  'cilantro': { nombre: 'Cilantro', emoji: '�', espaciado: 22.5, color: 'bg-teal-100', tipo: 'aromatica', categoria: 'aromatica' },
  'menta': { nombre: 'Menta', emoji: '🌿', espaciado: 45, color: 'bg-green-100', tipo: 'aromatica', categoria: 'aromatica' },
  'orégano': { nombre: 'Orégano', emoji: '🌿', espaciado: 35, color: 'bg-green-100', tipo: 'aromatica', categoria: 'aromatica' },
  'romero': { nombre: 'Romero', emoji: '🌿', espaciado: 85, color: 'bg-emerald-200', tipo: 'aromatica', categoria: 'aromatica' },
  'tomillo': { nombre: 'Tomillo', emoji: '🌿', espaciado: 27.5, color: 'bg-lime-200', tipo: 'aromatica', categoria: 'aromatica' },
  'lavanda': { nombre: 'Lavanda', emoji: '💜', espaciado: 70, color: 'bg-purple-200', tipo: 'aromatica', categoria: 'aromatica' },
  'salvia': { nombre: 'Salvia', emoji: '�', espaciado: 50, color: 'bg-gray-100', tipo: 'aromatica', categoria: 'aromatica' },
  'hierbabuena': { nombre: 'Hierbabuena', emoji: '🌿', espaciado: 45, color: 'bg-green-50', tipo: 'aromatica', categoria: 'aromatica' },
  'cebollino': { nombre: 'Cebollino', emoji: '🌱', espaciado: 22.5, color: 'bg-green-300', tipo: 'aromatica', categoria: 'aromatica' },
  
  // ========== OTROS ==========
  'maíz': { nombre: 'Maíz', emoji: '🌽', espaciado: 32.5, color: 'bg-yellow-200', tipo: 'unica', categoria: 'otro' },
  'patata': { nombre: 'Patata', emoji: '🥔', espaciado: 35, color: 'bg-amber-100', tipo: 'unica', categoria: 'otro' },
  'ajo': { nombre: 'Ajo', emoji: '🧄', espaciado: 12.5, color: 'bg-gray-50', tipo: 'unica', categoria: 'otro' },
  'cebolla': { nombre: 'Cebolla', emoji: '🧅', espaciado: 12.5, color: 'bg-amber-50', tipo: 'unica', categoria: 'otro' },
  'puerro': { nombre: 'Puerro', emoji: '�', espaciado: 12.5, color: 'bg-green-700', tipo: 'unica', categoria: 'otro' },
}

// Mapa de compatibilidad simplificado (basado en asociaciones)
const COMPATIBILIDAD: Record<string, string[]> = {
  'tomate': ['albahaca', 'zanahoria', 'cebollín'],
  'zanahoria': ['tomate', 'cebollín', 'romero', 'salvia'],
  'cebollín': ['zanahoria', 'lechuga'],
  'lechuga': ['cebollín', 'zanahoria', 'rábano', 'menta'],
  'pepino': ['rábano'],
  'berenjena': ['albahaca', 'pimiento', 'espinaca'],
  'pimiento': ['albahaca', 'berenjena'],
  'calabacín': ['menta', 'orégano'],
  'brócoli': ['menta', 'romero', 'salvia', 'tomillo'],
  'albahaca': ['tomate', 'pimiento', 'berenjena'],
  'menta': ['lechuga', 'brócoli', 'calabacín'],
  'romero': ['zanahoria', 'brócoli'],
  'salvia': ['zanahoria', 'brócoli'],
  'espinaca': ['berenjena', 'lechuga'],
  'rábano': ['lechuga', 'pepino', 'espinaca'],
  'perejil': ['tomate', 'zanahoria'],
  'tomillo': ['brócoli'],
  'orégano': ['calabacín'],
  'lavanda': ['romero', 'salvia'],
  'cilantro': ['tomate', 'pepino'],
}

export default function ParcelaTextoDistribucion({ 
  nombre, 
  cultivos, 
  area, 
  dimensiones, 
  onEdit 
}: ParcelaTextoDistribucionProps) {
  const [distribucion, setDistribucion] = useState<Array<{
    nombre: string
    emoji: string
    cantidad: number
    espaciado: number
    color: string
    areaNecesaria: number
  }>>([])
  const [distribucionRecomendada, setDistribucionRecomendada] = useState<Array<{
    nombre: string
    emoji: string
    cantidad: number
    espaciado: number
    color: string
    areaNecesaria: number
  }> | null>(null)
  const [variacion, setVariacion] = useState(0)
  const [editMode, setEditMode] = useState(false)
  const [plantasCompatibles, setPlantasCompatibles] = useState<string[]>([])
  const [mostrandoCompatibles, setMostrandoCompatibles] = useState(false)
  const [eficienciaActual, setEficienciaActual] = useState(0)
  const [mejorEficiencia, setMejorEficiencia] = useState(0)
  const [eficienciaRecomendada, setEficienciaRecomendada] = useState(0)

  // Calcular distribución de plantas
  useEffect(() => {
    calcularDistribucion(variacion)
  }, [cultivos, area, variacion])
  
  // Guardar la primera distribución como recomendada
  useEffect(() => {
    if (variacion === 0 && distribucion.length > 0 && !distribucionRecomendada) {
      setDistribucionRecomendada([...distribucion])
      setEficienciaRecomendada(eficienciaActual)
    }
  }, [distribucion, variacion, distribucionRecomendada, eficienciaActual])

  const calcularDistribucion = (factorVariacion: number) => {
    // Área disponible para cultivo (descontando ~20% para pasillos y bordes)
    const areaUtil = area * 0.8 // m²
    const areaUtilCm2 = areaUtil * 10000 // cm²
    
    const nuevaDistribucion: typeof distribucion = []
    
    // Clasificar plantas por tamaño Y tipo de producción
    const plantasPorTamano = cultivos.map((cultivoNombre) => {
      const cultivoKey = cultivoNombre.toLowerCase()
      const plantaInfo = PLANTAS_INFO[cultivoKey]
      
      if (!plantaInfo) return null
      
      // Clasificar por espaciado: grande (≥40cm), mediana (20-39cm), pequeña (<20cm)
      let categoria: 'grande' | 'mediana' | 'pequena'
      if (plantaInfo.espaciado >= 40) {
        categoria = 'grande'
      } else if (plantaInfo.espaciado >= 20) {
        categoria = 'mediana'
      } else {
        categoria = 'pequena'
      }
      
      return {
        nombre: cultivoNombre,
        info: plantaInfo,
        categoria,
        tipoProduccion: plantaInfo.tipo || 'continua'
      }
    }).filter(p => p !== null)
    
    // Asignar pesos según tamaño (en primera carga, priorizar grandes)
    const pesosPorCategoria = factorVariacion === 0 ? {
      // Primera carga: priorizar plantas grandes MUCHO más
      'grande': 4.0,    // Tomates, berenjenas, calabacines → MUCHA cantidad
      'mediana': 1.5,   // Pimientos, pepinos, brócoli → cantidad media
      'pequena': 0.3    // Hierbas aromáticas, lechugas → MUY POCA cantidad
    } : {
      // Con variaciones: más equilibrado con aleatoriedad
      'grande': 1.5 + Math.random(),
      'mediana': 1.0 + Math.random(),
      'pequena': 0.8 + Math.random()
    }
    
    // Crear array de proporciones según categoría Y tipo de producción
    const proporciones: number[] = []
    let sumaTotal = 0
    
    plantasPorTamano.forEach((planta) => {
      if (!planta) return
      
      let pesoBase = pesosPorCategoria[planta.categoria]
      
      // Ajustar peso según tipo de producción
      if (factorVariacion === 0) {
        // Primera carga: ajuste por tipo de producción
        if (planta.tipoProduccion === 'aromatica') {
          // Aromáticas: reducir drásticamente (una planta produce mucho)
          pesoBase *= 0.15
        } else if (planta.tipoProduccion === 'unica') {
          // Cultivos de una cosecha: aumentar (necesitas más para cosechar más)
          pesoBase *= 1.8
        } else if (planta.tipoProduccion === 'continua') {
          // Producción continua: cantidad moderada
          pesoBase *= 0.7
        }
      }
      
      const valorAleatorio = factorVariacion === 0 ? pesoBase : pesoBase * (0.7 + Math.random() * 0.6)
      proporciones.push(valorAleatorio)
      sumaTotal += valorAleatorio
    })
    
    // Normalizar proporciones para que sumen 1
    const proporcionesNormalizadas = proporciones.map(p => p / sumaTotal)
    
    plantasPorTamano.forEach((planta, index) => {
      if (!planta) return
      
      const plantaInfo = planta.info
      
      // Calcular área que ocupa cada planta (espaciado²)
      const areaPlantaCm2 = plantaInfo.espaciado * plantaInfo.espaciado
      
      // Calcular cuántas plantas caben usando la proporción normalizada
      const areaPorCultivo = areaUtilCm2 * proporcionesNormalizadas[index]
      let cantidad = Math.max(2, Math.floor(areaPorCultivo / areaPlantaCm2))
      
      // LIMITAR cantidad según categoría Y tipo de producción
      if (factorVariacion === 0) {
        // Límites estrictos para primera carga según tipo de producción
        if (planta.tipoProduccion === 'aromatica') {
          // Aromáticas: MUY pocas (5-8 plantas suficientes)
          cantidad = Math.min(cantidad, 8)
        } else if (planta.tipoProduccion === 'unica') {
          // Cultivos de una cosecha: más cantidad (necesitas más)
          cantidad = Math.min(cantidad, 50)
        } else if (planta.tipoProduccion === 'continua') {
          // Producción continua: cantidad moderada
          cantidad = Math.min(cantidad, 20)
        }
      } else {
        // En variaciones, límites más flexibles
        if (planta.tipoProduccion === 'aromatica') {
          cantidad = Math.min(cantidad, 15)
        } else if (planta.tipoProduccion === 'unica') {
          cantidad = Math.min(cantidad, 60)
        } else if (planta.tipoProduccion === 'continua') {
          cantidad = Math.min(cantidad, 35)
        }
      }
      
      nuevaDistribucion.push({
        nombre: plantaInfo.nombre,
        emoji: plantaInfo.emoji,
        cantidad,
        espaciado: plantaInfo.espaciado,
        color: plantaInfo.color,
        areaNecesaria: (cantidad * areaPlantaCm2) / 10000 // convertir a m²
      })
    })
    
    // REDISTRIBUIR espacio sobrante a plantas prioritarias (SIEMPRE, no solo primera carga)
    const areaOcupadaInicial = nuevaDistribucion.reduce((sum, p) => sum + p.areaNecesaria, 0)
    const areaDisponibleCm2 = (areaUtil - areaOcupadaInicial) * 10000
    
    if (areaDisponibleCm2 > 0) {
      // Redistribuir a plantas de cosecha única primero (necesitan más)
      const plantasUnicas = nuevaDistribucion.filter((p, idx) => {
        const planta = plantasPorTamano[idx]
        return planta && planta.tipoProduccion === 'unica'
      })
      
      if (plantasUnicas.length > 0) {
        // Distribuir espacio extra entre plantas de cosecha única
        const areaExtraPorPlanta = areaDisponibleCm2 / plantasUnicas.length
        
        plantasUnicas.forEach((plantaUnica) => {
          const plantaIndex = nuevaDistribucion.findIndex(p => p.nombre === plantaUnica.nombre)
          if (plantaIndex >= 0) {
            const areaPlantaCm2 = plantaUnica.espaciado * plantaUnica.espaciado
            const plantasExtra = Math.floor(areaExtraPorPlanta / areaPlantaCm2)
            const limiteMaximo = factorVariacion === 0 ? 80 : 100 // Más flexible en variaciones
            const nuevaCantidad = Math.min(plantaUnica.cantidad + plantasExtra, limiteMaximo)
            
            nuevaDistribucion[plantaIndex].cantidad = nuevaCantidad
            nuevaDistribucion[plantaIndex].areaNecesaria = (nuevaCantidad * areaPlantaCm2) / 10000
          }
        })
      } else {
        // Si no hay plantas únicas, redistribuir a plantas continuas
        const plantasContinuas = nuevaDistribucion.filter((p, idx) => {
          const planta = plantasPorTamano[idx]
          return planta && planta.tipoProduccion === 'continua'
        })
        
        if (plantasContinuas.length > 0) {
          const areaExtraPorPlanta = areaDisponibleCm2 / plantasContinuas.length
          
          plantasContinuas.forEach((plantaContinua) => {
            const plantaIndex = nuevaDistribucion.findIndex(p => p.nombre === plantaContinua.nombre)
            if (plantaIndex >= 0) {
              const areaPlantaCm2 = plantaContinua.espaciado * plantaContinua.espaciado
              const plantasExtra = Math.floor(areaExtraPorPlanta / areaPlantaCm2)
              const limiteMaximo = factorVariacion === 0 ? 25 : 40
              const nuevaCantidad = Math.min(plantaContinua.cantidad + plantasExtra, limiteMaximo)
              
              nuevaDistribucion[plantaIndex].cantidad = nuevaCantidad
              nuevaDistribucion[plantaIndex].areaNecesaria = (nuevaCantidad * areaPlantaCm2) / 10000
            }
          })
        }
      }
    }
    
    setDistribucion(nuevaDistribucion)
    
    // Calcular eficiencia de esta distribución
    const areaOcupadaTotal = nuevaDistribucion.reduce((sum, p) => sum + p.areaNecesaria, 0)
    const eficiencia = (areaOcupadaTotal / area) * 100
    setEficienciaActual(eficiencia)
    
    // Actualizar mejor eficiencia si es mayor
    if (eficiencia > mejorEficiencia) {
      setMejorEficiencia(eficiencia)
    }
  }

  const generarVariacion = () => {
    setVariacion(prev => prev + 1)
  }

  const volverARecomendada = () => {
    if (distribucionRecomendada) {
      setDistribucion([...distribucionRecomendada])
      setEficienciaActual(eficienciaRecomendada)
      setVariacion(0)
    }
  }

  const guardarComoRecomendada = () => {
    setDistribucionRecomendada([...distribucion])
    setEficienciaRecomendada(eficienciaActual)
    setMejorEficiencia(eficienciaActual)
  }

  const obtenerPlantasCompatibles = () => {
    if (cultivos.length === 0) return []
    
    // Obtener todas las plantas posibles que son compatibles con al menos un cultivo
    const candidatas = new Map<string, number>()
    
    cultivos.forEach((cultivo) => {
      const cultivoKey = cultivo.toLowerCase()
      const plantasCompatiblesDelCultivo = COMPATIBILIDAD[cultivoKey] || []
      
      plantasCompatiblesDelCultivo.forEach((planta) => {
        // Solo considerar plantas que no están ya en cultivos y existen en PLANTAS_INFO
        if (!cultivos.map(c => c.toLowerCase()).includes(planta) && PLANTAS_INFO[planta]) {
          candidatas.set(planta, (candidatas.get(planta) || 0) + 1)
        }
      })
    })
    
    // Verificar compatibilidad cruzada: la planta candidata debe ser compatible con TODOS los cultivos actuales
    const plantasCompatibles: string[] = []
    
    candidatas.forEach((count, plantaCandidata) => {
      let esCompatibleConTodos = true
      
      // Verificar que esta planta candidata sea compatible con cada cultivo actual
      for (const cultivo of cultivos) {
        const cultivoKey = cultivo.toLowerCase()
        const compatibilidadCultivo = COMPATIBILIDAD[cultivoKey] || []
        
        // Si el cultivo NO tiene a esta planta en sus compatibles, no es buena opción
        if (!compatibilidadCultivo.includes(plantaCandidata)) {
          esCompatibleConTodos = false
          break
        }
      }
      
      // Si es compatible con todos los cultivos actuales, agregarla
      if (esCompatibleConTodos) {
        plantasCompatibles.push(plantaCandidata)
      }
    })
    
    return plantasCompatibles
  }

  const agregarPlantaCompatible = (plantaSlug: string) => {
    if (onEdit && !cultivos.includes(plantaSlug)) {
      const nuevosCultivos = [...cultivos, plantaSlug]
      onEdit(nuevosCultivos)
      setMostrandoCompatibles(false)
    }
  }

  const toggleMostrarCompatibles = () => {
    if (!mostrandoCompatibles) {
      const compatibles = obtenerPlantasCompatibles()
      setPlantasCompatibles(compatibles)
    }
    setMostrandoCompatibles(!mostrandoCompatibles)
  }

  const totalPlantas = distribucion.reduce((sum, p) => sum + p.cantidad, 0)
  const areaOcupada = distribucion.reduce((sum, p) => sum + p.areaNecesaria, 0)
  const porcentajeUso = eficienciaActual

  // Función para obtener el color según la eficiencia
  const getEficienciaColor = (eficiencia: number) => {
    if (eficiencia >= 75) return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300' }
    if (eficiencia >= 60) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300' }
    return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300' }
  }

  const eficienciaColor = getEficienciaColor(eficienciaActual)
  const esMejorDistribucion = Math.abs(eficienciaActual - mejorEficiencia) < 0.1

  // Calcular dimensiones
  let largoMetros: number
  let anchoMetros: number
  
  if (dimensiones?.largo && dimensiones?.ancho) {
    largoMetros = dimensiones.largo / 100
    anchoMetros = dimensiones.ancho / 100
  } else {
    anchoMetros = Math.sqrt(area * 1.33)
    largoMetros = area / anchoMetros
  }

  return (
    <div className="space-y-6">
      {/* Header con información */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{nombre}</h2>
          {onEdit && (
            <button
              onClick={() => setEditMode(!editMode)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              {editMode ? '✅ Guardar' : '✏️ Editar'}
            </button>
          )}
        </div>

        {/* Información de la parcela */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Área Total</div>
            <div className="text-2xl font-bold text-green-700">{area} m²</div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Dimensiones</div>
            <div className="text-lg font-bold text-blue-700">
              {largoMetros.toFixed(1)}m × {anchoMetros.toFixed(1)}m
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Total Plantas</div>
            <div className="text-2xl font-bold text-purple-700">{totalPlantas}</div>
          </div>
          
          <div className={`${eficienciaColor.bg} rounded-lg p-4 border-2 ${eficienciaColor.border} relative overflow-hidden`}>
            <div className="text-sm text-gray-600 mb-1 flex items-center justify-between">
              <span>Eficiencia</span>
              {esMejorDistribucion && (
                <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                  ⭐ MEJOR
                </span>
              )}
            </div>
            <div className={`text-2xl font-bold ${eficienciaColor.text} mb-2`}>{porcentajeUso.toFixed(1)}%</div>
            
            {/* Barra de progreso */}
            <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-gray-300">
              <div 
                className={`h-full transition-all duration-500 ${
                  porcentajeUso >= 75 ? 'bg-green-500' : 
                  porcentajeUso >= 60 ? 'bg-amber-500' : 
                  'bg-red-500'
                }`}
                style={{ width: `${Math.min(porcentajeUso, 100)}%` }}
              />
            </div>
            
            {mejorEficiencia > 0 && mejorEficiencia !== eficienciaActual && (
              <div className="text-xs text-gray-600 mt-1">
                Mejor: {mejorEficiencia.toFixed(1)}%
              </div>
            )}
          </div>
        </div>

        {/* Botones de control */}
        <div className="flex gap-3">
          {/* Botón principal: Generar Variación */}
          <button
            onClick={generarVariacion}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 font-semibold shadow-lg"
          >
            🔄 Generar Variación
          </button>
          
          {/* Botón: Volver a Recomendada (solo si hay una guardada y no estamos en ella) */}
          {distribucionRecomendada && variacion > 0 && (
            <button
              onClick={volverARecomendada}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2 font-semibold shadow-lg"
            >
              ⭐ Volver a Recomendada
            </button>
          )}
          
          {/* Botón: Guardar como Recomendada (siempre visible en variaciones) */}
          {variacion > 0 && (
            <button
              onClick={guardarComoRecomendada}
              className={`flex-1 ${
                eficienciaActual > eficienciaRecomendada 
                  ? 'bg-amber-600 hover:bg-amber-700' 
                  : 'bg-gray-600 hover:bg-gray-700'
              } text-white px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2 font-semibold shadow-lg`}
            >
              {eficienciaActual > eficienciaRecomendada ? '💾 Guardar esta' : '💾 Guardar'}
            </button>
          )}
        </div>
        
        {/* Mensaje informativo si estamos viendo la recomendada */}
        {distribucionRecomendada && variacion === 0 && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⭐</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-800">Distribución Recomendada</p>
                <p className="text-xs text-blue-600">Esta es la mejor distribución optimizada para tu parcela. Puedes generar variaciones y volver aquí cuando quieras.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de plantas */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Plan de Plantación</h3>
        
        <div className="space-y-3">
          {distribucion.map((planta, index) => (
            <div
              key={index}
              className={`${planta.color} border-2 border-gray-200 rounded-lg p-4 transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                {/* Info de la planta */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-4xl">{planta.emoji}</div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-800">{planta.nombre}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>📏 Espaciado: <span className="font-semibold">{planta.espaciado} cm</span> entre plantas</div>
                      <div>📐 Área necesaria: <span className="font-semibold">{planta.areaNecesaria.toFixed(2)} m²</span></div>
                    </div>
                  </div>
                </div>

                {/* Cantidad */}
                <div className="text-center bg-white rounded-lg px-6 py-3 border-2 border-gray-300">
                  <div className="text-3xl font-bold text-gray-800">{planta.cantidad}</div>
                  <div className="text-xs text-gray-600 font-semibold">plantas</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="text-sm text-gray-700">
              <p className="font-semibold mb-2">Consejos de plantación:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>El espaciado indicado es la distancia mínima entre plantas</li>
                <li>Se ha reservado ~20% del área para pasillos y acceso</li>
                <li>Puedes generar variaciones para explorar diferentes distribuciones</li>
                <li>Las cantidades son aproximadas y pueden ajustarse según tus necesidades</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de plantas compatibles */}
      {onEdit && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">🌱 Agregar Plantas Compatibles</h3>
            <button
              onClick={toggleMostrarCompatibles}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              {mostrandoCompatibles ? '👆 Ocultar' : '👇 Ver compatibles'}
            </button>
          </div>

          {mostrandoCompatibles && (
            <div>
              {plantasCompatibles.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-3">
                    ✅ Estas plantas son <strong>compatibles con TODOS</strong> tus cultivos actuales y pueden mejorar tu huerta:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {plantasCompatibles.map((plantaSlug) => {
                      const plantaInfo = PLANTAS_INFO[plantaSlug]
                      if (!plantaInfo) return null
                      
                      return (
                        <button
                          key={plantaSlug}
                          onClick={() => agregarPlantaCompatible(plantaSlug)}
                          className={`${plantaInfo.color} border-2 border-gray-300 hover:border-emerald-500 rounded-lg p-4 transition-all hover:shadow-md text-left`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{plantaInfo.emoji}</div>
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-gray-800">{plantaInfo.nombre}</h4>
                              <div className="text-xs text-gray-600">
                                📏 {plantaInfo.espaciado} cm de espaciado
                              </div>
                            </div>
                            <div className="text-2xl text-emerald-600">+</div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🤔</div>
                  <p className="font-semibold mb-2">No hay plantas compatibles con TODOS tus cultivos actuales</p>
                  <p className="text-sm">Las plantas que seleccionaste tienen diferentes preferencias de asociación. Esto no es un problema - pueden crecer juntas igualmente.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Resumen final */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-3">✨ Resumen de tu Huerta</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold">{totalPlantas}</div>
            <div className="text-sm opacity-90">Plantas Totales</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{cultivos.length}</div>
            <div className="text-sm opacity-90">Tipos de Cultivos</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{area} m²</div>
            <div className="text-sm opacity-90">Área de Cultivo</div>
          </div>
        </div>
      </div>
    </div>
  )
}
