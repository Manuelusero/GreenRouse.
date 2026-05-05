import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Onboarding from '@/models/Onboarding'
import Parcela from '@/models/Parcela'
import Logger from '@/lib/logger'
import { obtenerRecomendacionesUbicacion, obtenerEstacionActual, obtenerHemisferio } from '@/utils/geografia'

// GET /api/onboarding?usuario_id=xxx - Obtener onboarding de usuario
// POST /api/onboarding - Crear/actualizar onboarding
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const usuario_id = searchParams.get('usuario_id')
    
    
    if (!usuario_id) {
      return NextResponse.json({
        success: false,
        error: 'usuario_id es requerido'
      }, { status: 400 })
    }
    
    const onboarding = await Onboarding.findOne({ usuario_id })
    
    
    if (!onboarding) {
      return NextResponse.json({
        success: false,
        error: 'Onboarding no encontrado'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: onboarding
    })
  } catch (error: unknown) {
    Logger.error('GET /api/onboarding error', {
      error: error instanceof Error ? error.message : String(error)
    })
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()
    
    const { usuario_id, paso_actual, datos, completado } = body
    
    if (!usuario_id) {
      return NextResponse.json({
        success: false,
        error: 'usuario_id es requerido'
      }, { status: 400 })
    }

    // No necesitamos verificar si el usuario existe en nuestra colección Usuario
    // porque NextAuth maneja los usuarios en su propia colección

    // Buscar onboarding existente o crear nuevo
    let onboarding = await Onboarding.findOne({ usuario_id })
    
    if (onboarding) {
      // Actualizar onboarding existente
      
      onboarding.paso_actual = paso_actual || onboarding.paso_actual
      onboarding.datos = { ...onboarding.datos, ...datos }
      onboarding.completado = completado !== undefined ? completado : onboarding.completado
      
      
      if (completado && !onboarding.fecha_completado) {
        onboarding.fecha_completado = new Date()
        
        // Los datos del usuario se guardan en el onboarding, no necesitamos actualizar Usuario

        // Crear parcelas automáticamente basadas en los datos del onboarding
        const parcelasCreadas = []
        
        // Determinar tipo de parcela basado en el espacio y ubicación del onboarding
        let nombreParcela = 'Mi Primera Huerta'
        let tipoParcela = 'mixto'
        let descripcionParcela = `Parcela creada desde onboarding - Nivel: ${datos.experiencia}`
        
        // Personalizar basado en el espacio disponible
        if (datos.espacio === 'balcon') {
          nombreParcela = 'Mi Huerta de Balcón'
          tipoParcela = 'balcon'
          descripcionParcela = `Huerta en balcón - Perfecto para hierbas y plantas pequeñas`
        } else if (datos.espacio === 'patio') {
          nombreParcela = 'Mi Huerta de Patio'
          tipoParcela = 'patio'
          descripcionParcela = `Huerta en patio - Ideal para macetas y jardineras`
        } else if (datos.espacio === 'jardin') {
          nombreParcela = 'Mi Jardín Huerta'
          tipoParcela = 'jardin'
          descripcionParcela = `Jardín huerta - Espacio amplio para diversos cultivos`
        } else if (datos.espacio === 'terreno') {
          nombreParcela = 'Mi Gran Huerta'
          tipoParcela = 'terreno'
          descripcionParcela = `Huerta en terreno - Máximo espacio para cultivos variados`
        }
        
        // Personalizar más basado en la ubicación (luz)
        if (datos.ubicacion === 'interior') {
          nombreParcela = 'Mi Huerta Interior'
          descripcionParcela += ' - Cultivos de interior con luz artificial'
        } else if (datos.ubicacion === 'sombra') {
          descripcionParcela += ' - Plantas que prosperan en sombra parcial'
        } else if (datos.ubicacion === 'sol') {
          descripcionParcela += ' - Cultivos de pleno sol'
        }

        try {
          const parcelaCreada = await Parcela.create({
            nombre: nombreParcela,
            descripcion: descripcionParcela,
            tipo: tipoParcela,
            tamaño: datos.espacio === 'balcon' ? 'pequeño' : 
                   datos.espacio === 'patio' ? 'mediano' :
                   datos.espacio === 'jardin' ? 'grande' : 'muy-grande',
            ubicacion: datos.ubicacion,
            clima: 'templado', // Por defecto hasta que tengamos más datos
            objetivos: datos.objetivos || [],
            plantas_deseadas: [],
            usuario_id: usuario_id,
            estado: 'planificando',
            fecha_creacion: new Date(),
            configuracion_inicial: {
              experiencia: datos.experiencia,
              tiempo_disponible: datos.tiempo,
              espacio_original: datos.espacio,
              ubicacion_luz: datos.ubicacion,
              desde_onboarding: true,
              fecha_onboarding: new Date()
            }
          })
          
          parcelasCreadas.push(parcelaCreada)
        } catch (parcelaError) {
        }

        // También crear las parcelas manuales del paso 8 si existen
        if (datos.parcelas_creadas_manual && datos.parcelas_creadas_manual.length > 0) {
          
          for (const parcelaManual of datos.parcelas_creadas_manual) {
            try {
              const parcelaManualCreada = await Parcela.create({
                nombre: parcelaManual.nombre || 'Parcela Manual',
                descripcion: `Parcela creada manualmente en onboarding - ${parcelaManual.cultivo || 'Sin cultivo específico'}`,
                tipo: 'manual',
                tamaño: 'personalizado',
                ubicacion: datos.ubicacion,
                clima: 'templado',
                objetivos: datos.objetivos || [],
                plantas_deseadas: parcelaManual.cultivo ? [parcelaManual.cultivo] : [],
                usuario_id: usuario_id,
                estado: 'planificando',
                fecha_creacion: new Date(),
                dimensiones: {
                  largo: parcelaManual.largo || 0,
                  ancho: parcelaManual.ancho || 0,
                  area: (parcelaManual.largo || 0) * (parcelaManual.ancho || 0) / 10000 // m²
                },
                configuracion_inicial: {
                  experiencia: datos.experiencia,
                  tiempo_disponible: datos.tiempo,
                  desde_onboarding: true,
                  parcela_manual: true,
                  cultivo_inicial: parcelaManual.cultivo,
                  fecha_onboarding: new Date()
                }
              })
              
              parcelasCreadas.push(parcelaManualCreada)
            } catch (parcelaError) {
            }
          }
        }

        // Generar recomendaciones basadas en ubicación geográfica
        if (datos.pais) {
          
          try {
            const recomendaciones = obtenerRecomendacionesUbicacion(datos.pais)
            const hemisferio = obtenerHemisferio(datos.pais)
            const estacion = obtenerEstacionActual(datos.pais)
            
            // Actualizar configuración recomendada con información geográfica
            onboarding.configuracion_recomendada = {
              cultivos_sugeridos: recomendaciones.cultivos,
              nivel_dificultad: datos.experiencia === 'principiante' ? 'fácil' : 
                               datos.experiencia === 'basico' ? 'medio' : 'difícil',
              tiempo_estimado_setup: datos.tiempo === 'poco' ? '1-2 semanas' :
                                   datos.tiempo === 'moderado' ? '2-4 semanas' :
                                   datos.tiempo === 'bastante' ? '1-2 meses' : '2+ meses',
              consejos_personalizados: [
                ...recomendaciones.consejos,
                `Ubicación geográfica: ${datos.ubicacionGeografica || 'No especificada'}`,
                `Hemisferio ${hemisferio}: las estaciones ${hemisferio === 'sur' ? 'están invertidas' : 'son normales'}`,
                `Cultivos ideales para ${estacion}: ${recomendaciones.cultivos.slice(0, 3).join(', ')}`,
                `Nivel de experiencia: ${datos.experiencia} - ${datos.experiencia === 'principiante' ? 'Comienza con cultivos fáciles' : 'Puedes intentar cultivos más desafiantes'}`
              ]
            }
            
          } catch (geoError) {
          }
        } else {
          onboarding.configuracion_recomendada = {
            cultivos_sugeridos: ['lechuga', 'rábano', 'perejil', 'tomate', 'albahaca'],
            nivel_dificultad: datos.experiencia === 'principiante' ? 'fácil' : 
                             datos.experiencia === 'basico' ? 'medio' : 'difícil',
            tiempo_estimado_setup: '2-4 semanas',
            consejos_personalizados: [
              'Comienza con cultivos básicos como lechuga y hierbas',
              'Especifica tu país para obtener recomendaciones estacionales',
              'Adapta los tiempos de siembra a tu clima local'
            ]
          }
        }

        // Guardar información de parcelas creadas en el onboarding
        onboarding.parcelas_creadas = parcelasCreadas.map(p => p._id)
      }
      
      await onboarding.save()
    } else {
      // Crear nuevo onboarding
      onboarding = await Onboarding.create({
        usuario_id,
        paso_actual: paso_actual || 1,
        datos: datos || {},
        completado: completado || false,
        fecha_inicio: new Date()
      })
    }

    await onboarding.populate('usuario_id', 'nombre email')

    return NextResponse.json({
      success: true,
      data: onboarding,
      parcelas_creadas: onboarding.parcelas_creadas || [],
      message: onboarding.completado ? 
        `Onboarding completado${onboarding.parcelas_creadas?.length ? ` - ${onboarding.parcelas_creadas.length} parcela(s) creada(s)` : ''}` : 
        'Onboarding actualizado'
    })

  } catch (error: unknown) {
    Logger.error('POST /api/onboarding error', {
      error: error instanceof Error ? error.message : String(error)
    })

    if (error instanceof Error && error.name === 'ValidationError') {
      const mongoErr = error as Error & { errors: Record<string, { message: string }> }
      const msgs = Object.values(mongoErr.errors).map(e => e.message)
      return NextResponse.json({ success: false, error: msgs[0] }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 })
  }
}