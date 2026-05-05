import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import PlantaAsociacion from '@/models/PlantaAsociacion'
import Logger from '@/lib/logger'

export const dynamic = 'force-dynamic'

// POST /api/asociaciones/recomendaciones - Obtener recomendaciones para cultivos específicos
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const { cultivos } = body

    if (!cultivos || !Array.isArray(cultivos) || cultivos.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Debe proporcionar un array de cultivos'
        },
        { status: 400 }
      )
    }

    // Normalizar nombres de cultivos a minúsculas
    const cultivosNormalizados = cultivos.map((c: string) => c.toLowerCase())

    // Obtener información de los cultivos existentes
    const plantasExistentes = await PlantaAsociacion.find({
      slug: { $in: cultivosNormalizados }
    })

    if (plantasExistentes.length === 0) {
      return NextResponse.json({
        success: true,
        cultivos: cultivosNormalizados,
        recomendadas: [],
        no_recomendadas: [],
        detalles: [],
        message: 'No se encontraron plantas en la base de datos'
      })
    }

    // Conjuntos para almacenar recomendaciones y no recomendadas
    const recomendadasSet = new Set<string>()
    const noRecomendadasSet = new Set<string>()
    const detalles: any[] = []

    // Procesar cada planta existente
    plantasExistentes.forEach((planta) => {
      detalles.push({
        planta: planta.nombre_mostrado,
        slug: planta.slug,
        tipo: planta.tipo,
        recomendadas: planta.recomendadas,
        no_recomendadas: planta.no_recomendadas
      })

      // Agregar plantas recomendadas
      planta.recomendadas.forEach((r: string) => {
        if (!cultivosNormalizados.includes(r)) {
          recomendadasSet.add(r)
        }
      })

      // Agregar plantas no recomendadas
      planta.no_recomendadas.forEach((nr: string) => {
        noRecomendadasSet.add(nr)
      })
    })

    // Eliminar plantas que están en ambas listas (conflicto)
    // Priorizar las no_recomendadas (seguridad primero)
    noRecomendadasSet.forEach((nr) => recomendadasSet.delete(nr))

    // Eliminar plantas que ya están en los cultivos actuales
    cultivosNormalizados.forEach((c) => {
      recomendadasSet.delete(c)
      noRecomendadasSet.delete(c)
    })

    // Convertir a arrays y obtener información completa
    const recomendadasArray = Array.from(recomendadasSet)
    const noRecomendadasArray = Array.from(noRecomendadasSet)

    // Obtener información completa de las plantas recomendadas
    const plantasRecomendadas = await PlantaAsociacion.find({
      slug: { $in: recomendadasArray }
    }).select('slug nombre_mostrado tipo temporada')

    const plantasNoRecomendadas = await PlantaAsociacion.find({
      slug: { $in: noRecomendadasArray }
    }).select('slug nombre_mostrado tipo temporada')

    return NextResponse.json({
      success: true,
      cultivos_analizados: plantasExistentes.map((p) => p.nombre_mostrado),
      recomendadas: plantasRecomendadas,
      no_recomendadas: plantasNoRecomendadas,
      estadisticas: {
        total_recomendadas: plantasRecomendadas.length,
        total_no_recomendadas: plantasNoRecomendadas.length,
        cultivos_analizados: plantasExistentes.length
      },
      detalles
    })
  } catch (error: unknown) {
    Logger.error('GET /api/asociaciones/recomendaciones error', {
      error: error instanceof Error ? error.message : String(error)
    })
    return NextResponse.json(
      { success: false, error: 'Error al obtener recomendaciones' },
      { status: 500 }
    )
  }
}
