import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import BlogArticulo from '@/models/BlogArticulo'
import CacheService from '@/lib/cache'
import Logger from '@/lib/logger'
import { withLogging } from '@/lib/loggingMiddleware'

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const GET_handler = async (request: NextRequest) => {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)

    const categoria = searchParams.get('categoria') || ''
    const tag = searchParams.get('tag') || ''
    const busqueda = searchParams.get('q') || ''
    const soloDestacados = searchParams.get('destacados') === 'true'
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)))
    const skip = (page - 1) * limit

    // Cache key
    const cacheKey = `list:${categoria}:${tag}:${busqueda}:${soloDestacados}:${page}:${limit}`
    const cached = await CacheService.get('blog', cacheKey)
    if (cached) {
      const res = NextResponse.json(cached)
      res.headers.set('X-Cache', 'HIT')
      return res
    }

    // Filtro
    const filtro: Record<string, unknown> = { publicado: true }
    if (categoria) filtro.categoria = categoria
    if (tag) filtro.tags = tag
    if (soloDestacados) filtro.destacado = true
    if (busqueda) {
      const safe = escapeRegex(busqueda)
      filtro.$or = [
        { titulo: { $regex: safe, $options: 'i' } },
        { extracto: { $regex: safe, $options: 'i' } },
        { tags: { $regex: safe, $options: 'i' } },
      ]
    }

    const [articulos, total] = await Promise.all([
      BlogArticulo.find(filtro)
        .select('titulo slug extracto autor categoria tags imagenUrl imagenAlt fechaPublicacion tiempoLectura destacado')
        .sort({ destacado: -1, fechaPublicacion: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogArticulo.countDocuments(filtro),
    ])

    const payload = {
      articulos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    }

    await CacheService.set('blog', cacheKey, payload, 300)

    const res = NextResponse.json(payload)
    res.headers.set('X-Cache', 'MISS')
    return res
  } catch (error: unknown) {
    Logger.error('GET /api/blog error', {
      error: error instanceof Error ? error.message : error,
    })
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export const GET = withLogging(GET_handler)
