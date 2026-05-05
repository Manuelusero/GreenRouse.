import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import PlantaAsociacion from '@/models/PlantaAsociacion'
import Logger from '@/lib/logger'

export const dynamic = 'force-dynamic'

// GET /api/asociaciones - Obtener todas las plantas con sus asociaciones
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const tipo = searchParams.get('tipo')
    const temporada = searchParams.get('temporada')

    const query: Record<string, unknown> = {}

    if (slug) {
      query.slug = slug.toLowerCase()
    }

    if (tipo) {
      query.tipo = tipo
    }

    if (temporada) {
      query.temporada = temporada
    }

    const plantas = await PlantaAsociacion.find(query).sort({ nombre_mostrado: 1 })

    return NextResponse.json({
      success: true,
      count: plantas.length,
      data: plantas
    })
  } catch (error: unknown) {
    Logger.error('GET /api/asociaciones error', {
      error: error instanceof Error ? error.message : String(error)
    })
    return NextResponse.json(
      { success: false, error: 'Error al obtener asociaciones de plantas' },
      { status: 500 }
    )
  }
}

// POST /api/asociaciones - Crear nueva planta con asociaciones
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()

    const nuevaPlanta = await PlantaAsociacion.create(body)

    return NextResponse.json(
      {
        success: true,
        data: nuevaPlanta
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    Logger.error('POST /api/asociaciones error', {
      error: error instanceof Error ? error.message : String(error)
    })
    return NextResponse.json(
      { success: false, error: 'Error al crear asociación de planta' },
      { status: 500 }
    )
  }
}
