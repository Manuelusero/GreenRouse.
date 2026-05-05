/**
 * API de seed — Solo en development
 * GET /api/seed/blog  → carga los artículos del blog
 *
 * Usar una sola vez para poblar la BD.
 * En producción devuelve 404.
 */
import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import BlogArticulo from '@/models/BlogArticulo'
import { articulosSeed } from '../../../../../scripts/seedBlog'
import Logger from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    await connectDB()

    // Upsert por slug — idempotente, se puede re-ejecutar
    const results = await Promise.all(
      articulosSeed.map((articulo) =>
        BlogArticulo.findOneAndUpdate(
          { slug: articulo.slug },
          articulo,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
      )
    )

    return NextResponse.json({
      ok: true,
      message: `${results.length} artículos sincronizados`,
    })
  } catch (error: unknown) {
    Logger.error('GET /api/seed/blog error', {
      error: error instanceof Error ? error.message : error,
    })
    return NextResponse.json({ error: 'Error en seed' }, { status: 500 })
  }
}
