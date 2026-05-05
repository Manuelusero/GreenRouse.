// Utilidades para manejo de ubicación geográfica y estaciones

export interface PaisInfo {
  nombre: string
  hemisferio: 'norte' | 'sur'
  codigo: string
}

// Mapeo de países con información geográfica
export const paisesInfo: Record<string, PaisInfo> = {
  // Hemisferio Norte
  'mexico': { nombre: 'México', hemisferio: 'norte', codigo: 'MX' },
  'estados-unidos': { nombre: 'Estados Unidos', hemisferio: 'norte', codigo: 'US' },
  'canada': { nombre: 'Canadá', hemisferio: 'norte', codigo: 'CA' },
  'españa': { nombre: 'España', hemisferio: 'norte', codigo: 'ES' },
  'francia': { nombre: 'Francia', hemisferio: 'norte', codigo: 'FR' },
  'alemania': { nombre: 'Alemania', hemisferio: 'norte', codigo: 'DE' },
  'italia': { nombre: 'Italia', hemisferio: 'norte', codigo: 'IT' },
  'reino-unido': { nombre: 'Reino Unido', hemisferio: 'norte', codigo: 'GB' },
  'china': { nombre: 'China', hemisferio: 'norte', codigo: 'CN' },
  'japon': { nombre: 'Japón', hemisferio: 'norte', codigo: 'JP' },
  
  // Hemisferio Sur
  'argentina': { nombre: 'Argentina', hemisferio: 'sur', codigo: 'AR' },
  'chile': { nombre: 'Chile', hemisferio: 'sur', codigo: 'CL' },
  'brasil': { nombre: 'Brasil', hemisferio: 'sur', codigo: 'BR' },
  'peru': { nombre: 'Perú', hemisferio: 'sur', codigo: 'PE' },
  'colombia': { nombre: 'Colombia', hemisferio: 'norte', codigo: 'CO' }, // Aunque está en el ecuador, la mayoría está en el norte
  'ecuador': { nombre: 'Ecuador', hemisferio: 'sur', codigo: 'EC' }, // Línea ecuatorial, pero consideramos sur para estaciones
  'uruguay': { nombre: 'Uruguay', hemisferio: 'sur', codigo: 'UY' },
  'bolivia': { nombre: 'Bolivia', hemisferio: 'sur', codigo: 'BO' },
  'paraguay': { nombre: 'Paraguay', hemisferio: 'sur', codigo: 'PY' },
  'australia': { nombre: 'Australia', hemisferio: 'sur', codigo: 'AU' },
  'nueva-zelanda': { nombre: 'Nueva Zelanda', hemisferio: 'sur', codigo: 'NZ' },
  'sudafrica': { nombre: 'Sudáfrica', hemisferio: 'sur', codigo: 'ZA' }
}

/**
 * Obtiene el hemisferio basado en el código del país
 */
export function obtenerHemisferio(paisCodigo: string): 'norte' | 'sur' | null {
  const paisInfo = paisesInfo[paisCodigo]
  return paisInfo ? paisInfo.hemisferio : null
}

/**
 * Obtiene la estación actual basada en el mes y hemisferio
 */
export function obtenerEstacionActual(paisCodigo: string, mes?: number): string {
  const hemisferio = obtenerHemisferio(paisCodigo)
  if (!hemisferio) return 'desconocida'
  
  const mesActual = mes || new Date().getMonth() + 1 // JavaScript months are 0-based
  
  if (hemisferio === 'norte') {
    if (mesActual >= 3 && mesActual <= 5) return 'primavera'
    if (mesActual >= 6 && mesActual <= 8) return 'verano'
    if (mesActual >= 9 && mesActual <= 11) return 'otoño'
    return 'invierno'
  } else {
    // Hemisferio sur - estaciones invertidas
    if (mesActual >= 3 && mesActual <= 5) return 'otoño'
    if (mesActual >= 6 && mesActual <= 8) return 'invierno'
    if (mesActual >= 9 && mesActual <= 11) return 'primavera'
    return 'verano'
  }
}

/**
 * Obtiene cultivos recomendados basados en la estación y hemisferio
 */
export function obtenerCultivosEstacionales(paisCodigo: string, mes?: number): string[] {
  const estacion = obtenerEstacionActual(paisCodigo, mes)
  
  const cultivosPorEstacion: Record<string, string[]> = {
    'primavera': [
      'tomate', 'pimiento', 'pepino', 'calabacín', 'berenjena',
      'lechuga', 'espinaca', 'rábano', 'zanahoria', 'perejil',
      'albahaca', 'cilantro', 'apio'
    ],
    'verano': [
      'tomate', 'pimiento', 'pepino', 'calabacín', 'sandía',
      'melón', 'maíz', 'frijol', 'okra', 'girasol',
      'albahaca', 'orégano', 'tomillo'
    ],
    'otoño': [
      'lechuga', 'espinaca', 'col', 'brócoli', 'coliflor',
      'rábano', 'zanahoria', 'remolacha', 'cebolla', 'ajo',
      'perejil', 'cilantro', 'apio'
    ],
    'invierno': [
      'col', 'brócoli', 'coliflor', 'espinaca', 'lechuga de invierno',
      'cebolla', 'ajo', 'puerro', 'habas', 'guisantes',
      'perejil', 'cilantro', 'romero'
    ]
  }
  
  return cultivosPorEstacion[estacion] || []
}

/**
 * Obtiene cultivos filtrados por tipo de clima
 */
export function obtenerCultivosPorClima(clima: string): string[] {
  const cultivosPorClima: Record<string, string[]> = {
    'tropical': [
      'plátano', 'papaya', 'mango', 'jengibre', 'cilantro', 'albahaca thai',
      'chiles picantes', 'yuca', 'batata', 'okra', 'lemongrass'
    ],
    'subtropical': [
      'limón', 'naranja', 'aguacate', 'tomate', 'pimiento', 'berenjena',
      'calabacín', 'albahaca', 'orégano', 'romero', 'lavanda'
    ],
    'templado': [
      'manzana', 'pera', 'lechuga', 'espinaca', 'brócoli', 'zanahoria',
      'rábano', 'perejil', 'cebollín', 'tomillo', 'salvia'
    ],
    'frio': [
      'col rizada', 'coles de bruselas', 'coliflor', 'papa', 'cebolla',
      'ajo', 'puerro', 'eneldo', 'menta', 'cebollas verdes'
    ],
    'desertico': [
      'cactus comestible', 'aloe vera', 'hierbas resistentes', 'chiles',
      'tomates cherry', 'suculentas comestibles', 'romero', 'lavanda'
    ]
  }
  
  return cultivosPorClima[clima] || []
}

/**
 * Obtiene hortalizas organizadas por temporada
 */
export function obtenerHortalizasPorTemporada(paisCodigo: string): {
  hortalizas: string[]
  aromaticas: string[]
} {
  const estacion = obtenerEstacionActual(paisCodigo)
  
  const hortalizasPorEstacion: Record<string, string[]> = {
    'primavera': [
      'tomate', 'pimiento', 'berenjena', 'calabacín', 'pepino', 
      'lechuga', 'espinaca', 'rúcula', 'zanahoria', 'remolacha',
      'apio', 'acelga', 'brócoli', 'coliflor'
    ],
    'verano': [
      'tomate', 'pimiento', 'berenjena', 'calabacín', 'pepino',
      'sandía', 'melón', 'maíz dulce', 'okra', 'chaucha',
      'lechuga de verano', 'acelga', 'zapallo'
    ],
    'otoño': [
      'lechuga', 'espinaca', 'rúcula', 'radicheta', 'escarola',
      'zanahoria', 'remolacha', 'nabo', 'rabanito', 'apio',
      'brócoli', 'coliflor', 'repollo', 'acelga'
    ],
    'invierno': [
      'lechuga de invierno', 'espinaca', 'acelga', 'apio', 'hinojo',
      'cebolla de verdeo', 'puerro', 'ajo', 'habas', 'arvejas',
      'brócoli', 'coliflor', 'repollo', 'col de bruselas'
    ]
  }
  
  const aromaticasTodoAño = [
    'albahaca', 'perejil', 'cilantro', 'cebollín', 'orégano',
    'romero', 'tomillo', 'salvia', 'menta', 'lavanda',
    'estragón', 'mejorana', 'ciboulette'
  ]
  
  return {
    hortalizas: hortalizasPorEstacion[estacion] || hortalizasPorEstacion['primavera'],
    aromaticas: aromaticasTodoAño
  }
}

/**
 * Obtiene cultivos filtrados por tamaño de espacio
 */
export function obtenerCultivosPorEspacio(tamaño: string): string[] {
  const cultivosPorEspacio: Record<string, string[]> = {
    'pequeño': [
      'lechuga', 'espinaca', 'rábano', 'cebollín', 'perejil', 'albahaca',
      'cilantro', 'menta', 'orégano', 'tomillo', 'microgreens'
    ],
    'mediano': [
      'tomate cherry', 'pimiento', 'berenjena pequeña', 'calabacín',
      'lechuga', 'espinaca', 'zanahoria', 'remolacha', 'hierbas variadas'
    ],
    'grande': [
      'tomate', 'pimiento', 'berenjena', 'calabacín', 'pepino', 'melón',
      'sandía', 'maíz', 'frijoles', 'habas', 'cultivos de raíz'
    ],
    'muy-grande': [
      'árboles frutales', 'cultivos extensivos', 'maíz', 'calabaza grande',
      'melones', 'sandías', 'cultivos de rotación', 'hierbas perennes'
    ]
  }
  
  return cultivosPorEspacio[tamaño] || []
}

/**
 * Obtiene recomendaciones inteligentes basadas en múltiples factores
 */
export function obtenerRecomendacionesInteligentes(
  paisCodigo: string,
  clima?: string,
  tamaño?: string
): {
  cultivos: string[]
  cultivosEstacionales: string[]
  cultivosClima: string[]
  cultivosEspacio: string[]
  consejos: string[]
  estacionActual: string
} {
  const estacionActual = obtenerEstacionActual(paisCodigo)
  const cultivosEstacionales = obtenerCultivosEstacionales(paisCodigo)
  const cultivosClima = clima ? obtenerCultivosPorClima(clima) : []
  const cultivosEspacio = tamaño ? obtenerCultivosPorEspacio(tamaño) : []
  
  // Combinar y filtrar cultivos que aparezcan en múltiples categorías (más recomendados)
  const todosCultivos = [...cultivosEstacionales, ...cultivosClima, ...cultivosEspacio]
  const contadorCultivos: Record<string, number> = {}
  
  todosCultivos.forEach(cultivo => {
    contadorCultivos[cultivo] = (contadorCultivos[cultivo] || 0) + 1
  })
  
  // Cultivos más recomendados (aparecen en múltiples categorías)
  const cultivosRecomendados = Object.entries(contadorCultivos)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([cultivo]) => cultivo)
  
  const consejos = [
    `🌍 Estación actual en ${paisesInfo[paisCodigo]?.nombre || paisCodigo}: ${estacionActual}`,
    `🌱 Cultivos ideales para ${estacionActual}: ${cultivosEstacionales.slice(0, 3).join(', ')}`,
  ]
  
  if (clima) {
    consejos.push(`🌡️ Para clima ${clima}: ${cultivosClima.slice(0, 3).join(', ')}`)
  }
  
  if (tamaño) {
    consejos.push(`📏 Para espacio ${tamaño}: ${cultivosEspacio.slice(0, 3).join(', ')}`)
  }
  
  consejos.push(
    `🎯 Más recomendados para ti: ${cultivosRecomendados.slice(0, 3).join(', ')}`,
    `🌎 Hemisferio ${obtenerHemisferio(paisCodigo)}: las estaciones ${obtenerHemisferio(paisCodigo) === 'sur' ? 'están invertidas' : 'son normales'}`
  )
  
  return {
    cultivos: cultivosRecomendados,
    cultivosEstacionales,
    cultivosClima,
    cultivosEspacio,
    consejos,
    estacionActual
  }
}

/**
 * Obtiene recomendaciones usando datos climáticos reales de API
 */
export async function obtenerRecomendacionesConClima(
  paisCodigo: string,
  ubicacionGeografica: string,
  tamaño?: string
): Promise<{
  cultivos: string[]
  cultivosEstacionales: string[]
  cultivosClima: string[]
  cultivosEspacio: string[]
  consejos: string[]
  estacionActual: string
  datosClima?: any
}> {
  try {
    // Obtener datos climáticos reales
    const response = await fetch(`/api/clima?ciudad=${encodeURIComponent(ubicacionGeografica)}&pais=${paisCodigo}`)
    const climaData = await response.json()
    
    let tipoClimaDetectado = 'templado'
    if (climaData.success && climaData.data) {
      tipoClimaDetectado = climaData.data.tipoClima
    }
    
    // Usar los datos climáticos reales en las recomendaciones
    const recomendaciones = obtenerRecomendacionesInteligentes(paisCodigo, tipoClimaDetectado, tamaño)
    
    // Añadir información climática real a los consejos
    const consejosConClima = [
      ...recomendaciones.consejos,
      climaData.success ? 
        `🌡️ Clima actual en ${climaData.data.ciudad}: ${climaData.data.temperatura}°C, ${climaData.data.descripcion}` :
        '🌡️ Usando datos climáticos estimados'
    ]
    
    return {
      ...recomendaciones,
      consejos: consejosConClima,
      datosClima: climaData.data
    }
    
  } catch {
    // Fallback a recomendaciones básicas
    return obtenerRecomendacionesInteligentes(paisCodigo, undefined, tamaño)
  }
}

/**
 * Genera 2 opciones diferentes de parcelas basadas en la selección del usuario
 */
export function generarOpcionesParcelas(perfilUsuario: {
  pais: string
  tamaño: string
  espacio: string
  objetivos: string[]
  tiempo: string
  experiencia: string
  plantasSeleccionadas: {
    hortalizas: string[]
    aromaticas: string[]
  }
}): Array<{
  nombre: string
  descripcion: string
  parcelas: Array<{
    nombre: string
    cultivos: string[]
    area: number
    ubicacion: string
  }>
}> {
  const { hortalizas, aromaticas } = perfilUsuario.plantasSeleccionadas
  const totalPlantas = hortalizas.length + aromaticas.length
  
  // Determinar tamaños de área según el perfil
  const areaTotal = perfilUsuario.tamaño === 'pequeño' ? 10 : 
                   perfilUsuario.tamaño === 'mediano' ? 25 : 
                   perfilUsuario.tamaño === 'grande' ? 50 : 75

  const opciones = []

  // OPCIÓN 1: Separadas por tipo (hortalizas vs aromáticas)
  if (hortalizas.length > 0 && aromaticas.length > 0) {
    const areaPorTipo = Math.floor(areaTotal / 2)
    opciones.push({
      nombre: "Opción A: Parcelas Separadas",
      descripcion: "Hortalizas y aromáticas en parcelas independientes para mejor organización",
      parcelas: [
        {
          nombre: "Huerta de Hortalizas",
          cultivos: hortalizas,
          area: areaPorTipo,
          ubicacion: "zona-sol"
        },
        {
          nombre: "Jardín de Aromáticas", 
          cultivos: aromaticas,
          area: areaPorTipo,
          ubicacion: "zona-semisombra"
        }
      ]
    })
  }

  // OPCIÓN 2: Mixta por compatibilidad
  if (totalPlantas > 0) {
    // Dividir en parcelas más pequeñas mezclando tipos
    const plantasPorParcela = Math.max(3, Math.floor(totalPlantas / 2))
    const todasLasPlantas = [...hortalizas, ...aromaticas]
    
    const parcela1 = todasLasPlantas.slice(0, plantasPorParcela)
    const parcela2 = todasLasPlantas.slice(plantasPorParcela)
    
    const areaPorParcela = Math.floor(areaTotal / (parcela2.length > 0 ? 2 : 1))
    
    const parcelasMixtas = [
      {
        nombre: "Parcela Mixta Principal",
        cultivos: parcela1,
        area: areaPorParcela,
        ubicacion: "zona-sol"
      }
    ]
    
    if (parcela2.length > 0) {
      parcelasMixtas.push({
        nombre: "Parcela Mixta Secundaria",
        cultivos: parcela2,
        area: areaPorParcela,
        ubicacion: "zona-semisombra"
      })
    }
    
    opciones.push({
      nombre: "Opción B: Parcelas Mixtas",
      descripcion: "Hortalizas y aromáticas mezcladas para maximizar el espacio y crear ecosistemas",
      parcelas: parcelasMixtas
    })
  }

  // OPCIÓN 3: Por facilidad de cuidado (si hay muchas plantas)
  if (totalPlantas > 6) {
    const plantasFaciles = [...hortalizas.filter(h => 
      ['lechuga', 'espinaca', 'rábano', 'perejil', 'cilantro'].includes(h)
    ), ...aromaticas.filter(a => 
      ['albahaca', 'perejil', 'cilantro', 'menta'].includes(a)
    )]
    
    const plantasAvanzadas = [
      ...hortalizas.filter(h => !['lechuga', 'espinaca', 'rábano', 'perejil', 'cilantro'].includes(h)),
      ...aromaticas.filter(a => !['albahaca', 'perejil', 'cilantro', 'menta'].includes(a))
    ]
    
    if (plantasFaciles.length > 0 && plantasAvanzadas.length > 0) {
      opciones.push({
        nombre: "Opción C: Por Dificultad",
        descripcion: "Separadas por facilidad de cuidado - ideal para ir aprendiendo gradualmente",
        parcelas: [
          {
            nombre: "Parcela para Principiantes",
            cultivos: plantasFaciles,
            area: Math.floor(areaTotal * 0.6),
            ubicacion: "zona-facil-acceso"
          },
          {
            nombre: "Parcela Avanzada",
            cultivos: plantasAvanzadas,
            area: Math.floor(areaTotal * 0.4),
            ubicacion: "zona-experimental"
          }
        ]
      })
    }
  }

  return opciones.slice(0, 2) // Devolver máximo 2 opciones
}

/**
 * Genera parcelas automáticamente basado en el perfil del usuario
 */
export function generarParcelasAutomaticas(perfilUsuario: {
  pais: string
  tamaño: string
  espacio: string
  objetivos: string[]
  tiempo: string
  experiencia: string
  plantasDeseadas: string[]
}): Array<{
  nombre: string
  descripcion: string
  cultivos: string[]
  categoria: 'hortalizas' | 'aromaticas' | 'mixto'
  dificultad: 'facil' | 'medio' | 'avanzado'
  tiempoMantenimiento: 'bajo' | 'medio' | 'alto'
}> {
  const { hortalizas, aromaticas } = obtenerHortalizasPorTemporada(perfilUsuario.pais)
  const estacion = obtenerEstacionActual(perfilUsuario.pais)
  const parcelas: Array<any> = []
  
  // Filtrar cultivos según experiencia
  const nivelDificultad = perfilUsuario.experiencia === 'principiante' ? 'facil' : 
                         perfilUsuario.experiencia === 'basico' ? 'medio' : 'avanzado'
  
  // Cultivos fáciles para principiantes
  const cultivosFaciles = ['lechuga', 'espinaca', 'rábano', 'perejil', 'cilantro', 'albahaca', 'cebollín']
  const cultivosMedios = ['tomate cherry', 'pimiento', 'zanahoria', 'remolacha', 'acelga', 'orégano', 'menta']
  const cultivosAvanzados = ['tomate', 'berenjena', 'melón', 'calabacín', 'brócoli', 'coliflor']
  
  // Filtrar hortalizas según experiencia
  let hortalizasRecomendadas = hortalizas
  if (nivelDificultad === 'facil') {
    hortalizasRecomendadas = hortalizas.filter(h => cultivosFaciles.includes(h) || cultivosMedios.includes(h))
  } else if (nivelDificultad === 'medio') {
    hortalizasRecomendadas = hortalizas.filter(h => !cultivosAvanzados.includes(h) || Math.random() > 0.5)
  }
  
  // Parcela de hortalizas
  if (perfilUsuario.objetivos.includes('alimentos') || perfilUsuario.objetivos.includes('sostenible')) {
    parcelas.push({
      nombre: `Huerta de ${estacion}`,
      descripcion: `Hortalizas ideales para plantar en ${estacion}`,
      cultivos: hortalizasRecomendadas.slice(0, perfilUsuario.tamaño === 'pequeño' ? 4 : 
                                              perfilUsuario.tamaño === 'mediano' ? 6 : 
                                              perfilUsuario.tamaño === 'grande' ? 8 : 10),
      categoria: 'hortalizas' as const,
      dificultad: nivelDificultad as any,
      tiempoMantenimiento: perfilUsuario.tiempo === 'poco' ? 'bajo' : 
                          perfilUsuario.tiempo === 'moderado' ? 'medio' : 'alto'
    })
  }
  
  // Parcela de aromáticas
  if (perfilUsuario.objetivos.includes('hierbas') || perfilUsuario.objetivos.includes('medicina') || perfilUsuario.objetivos.includes('hobby')) {
    parcelas.push({
      nombre: 'Jardín de Aromáticas',
      descripcion: 'Hierbas aromáticas para cocina y medicina natural',
      cultivos: aromaticas.slice(0, perfilUsuario.tamaño === 'pequeño' ? 5 : 
                                   perfilUsuario.tamaño === 'mediano' ? 7 : 
                                   perfilUsuario.tamaño === 'grande' ? 9 : 12),
      categoria: 'aromaticas' as const,
      dificultad: 'facil' as const, // Las aromáticas son generalmente fáciles
      tiempoMantenimiento: 'bajo' as const
    })
  }
  
  // Parcela mixta si tiene plantas deseadas específicas
  if (perfilUsuario.plantasDeseadas.length > 0) {
    parcelas.push({
      nombre: 'Cultivos Personalizados',
      descripcion: 'Plantas que específicamente quieres cultivar',
      cultivos: perfilUsuario.plantasDeseadas.slice(0, 8),
      categoria: 'mixto' as const,
      dificultad: nivelDificultad as any,
      tiempoMantenimiento: perfilUsuario.tiempo === 'poco' ? 'medio' : 'alto'
    })
  }
  
  return parcelas
}

/**
 * Obtiene recomendaciones específicas para la ubicación (función original mantenida por compatibilidad)
 */
export function obtenerRecomendacionesUbicacion(paisCodigo: string): {
  cultivos: string[]
  consejos: string[]
  estacionActual: string
} {
  const recomendaciones = obtenerRecomendacionesInteligentes(paisCodigo)
  return {
    cultivos: recomendaciones.cultivos,
    consejos: recomendaciones.consejos,
    estacionActual: recomendaciones.estacionActual
  }
}