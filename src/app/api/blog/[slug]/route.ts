import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import BlogArticulo from '@/models/BlogArticulo'
import CacheService from '@/lib/cache'
import Logger from '@/lib/logger'
import { withLogging } from '@/lib/loggingMiddleware'

const GET_handler = async (request: NextRequest) => {
  try {
    // Extraer slug del pathname para mantener compatibilidad con withLogging
    const pathname = new URL(request.url).pathname
    const slug = pathname.split('/').pop() || ''

    if (!slug || !/^[a-z0-9-]+$/i.test(slug)) {
      return NextResponse.json({ error: 'Slug inválido' }, { status: 400 })
    }

    const cacheKey = `slug:${slug}`
    const cached = await CacheService.get('blog', cacheKey)
    if (cached) {
      const res = NextResponse.json(cached)
      res.headers.set('X-Cache', 'HIT')
      return res
    }

    await connectDB()

    const articulo = await BlogArticulo.findOne({
      slug: slug.toLowerCase(),
      publicado: true,
    }).lean()

    if (!articulo) {
      return NextResponse.json({ error: 'Artículo no encontrado' }, { status: 404 })
    }

    // Artículos relacionados (misma categoría, excluyendo el actual)
    const relacionados = await BlogArticulo.find({
      publicado: true,
      categoria: (articulo as { categoria: string }).categoria,
      slug: { $ne: slug },
    })
      .select('titulo slug extracto imagenUrl imagenAlt fechaPublicacion tiempoLectura')
      .sort({ fechaPublicacion: -1 })
      .limit(3)
      .lean()

    const payload = { articulo, relacionados }

    await CacheService.set('blog', cacheKey, payload, 600)

    const res = NextResponse.json(payload)
    res.headers.set('X-Cache', 'MISS')
    return res
  } catch (error: unknown) {
    Logger.error('GET /api/blog/[slug] error', {
      error: error instanceof Error ? error.message : error,
    })
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export const GET = withLogging(GET_handler)
