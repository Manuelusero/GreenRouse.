import type { MetadataRoute } from 'next'
import connectDB from '@/lib/mongodb'
import BlogArticulo from '@/models/BlogArticulo'

const SITE_URL = process.env.NEXTAUTH_URL || 'https://greenrouse.com'

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
  },
  {
    url: `${SITE_URL}/blog`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: `${SITE_URL}/verduras`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  },
  {
    url: `${SITE_URL}/calculadora`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: `${SITE_URL}/cursos`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: `${SITE_URL}/comenzar`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${SITE_URL}/proveedores`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    await connectDB()
    const articulos = await BlogArticulo.find({ publicado: true })
      .select('slug fechaPublicacion updatedAt')
      .lean()

    const blogRoutes: MetadataRoute.Sitemap = articulos.map((a) => ({
      url: `${SITE_URL}/blog/${a.slug}`,
      lastModified: (a as { updatedAt?: Date }).updatedAt || a.fechaPublicacion || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    return [...staticRoutes, ...blogRoutes]
  } catch {
    // Si la DB no está disponible en build time, devolver solo rutas estáticas
    return staticRoutes
  }
}
