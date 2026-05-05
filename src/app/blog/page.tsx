import type { Metadata } from 'next'
import mongoose from 'mongoose'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BlogContent, { type ArticuloCard } from '@/components/BlogContent'
import connectDB from '@/lib/mongodb'
import BlogArticulo from '@/models/BlogArticulo'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXTAUTH_URL || 'https://greenrouse.com'

export const metadata: Metadata = {
  title: 'Blog | GreenRouse — Huerta Orgánica y Permacultura',
  description:
    'Artículos sobre huerta orgánica, compostaje, permacultura y control de plagas. Aprendé a cultivar tus propios alimentos de forma natural.',
  openGraph: {
    title: 'Blog GreenRouse — Huerta Orgánica y Permacultura',
    description:
      'Aprende técnicas de huerta orgánica, permacultura y jardinería sostenible con artículos escritos por expertos.',
    type: 'website',
    locale: 'es_AR',
    url: `${SITE_URL}/blog`,
    siteName: 'GreenRouse',
    images: [
      {
        url: `${SITE_URL}/images/og-blog.jpg`,
        width: 1200,
        height: 630,
        alt: 'Blog GreenRouse — Huerta Orgánica y Permacultura',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog GreenRouse — Huerta Orgánica y Permacultura',
    description:
      'Artículos sobre huerta orgánica, permacultura y jardinería sostenible.',
    images: [`${SITE_URL}/images/og-blog.jpg`],
  },
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
}

function serializeArticulo(a: Record<string, unknown>): ArticuloCard {
  return {
    _id: (a._id as mongoose.Types.ObjectId).toString(),
    titulo: a.titulo as string,
    slug: a.slug as string,
    extracto: a.extracto as string,
    autor: a.autor as string,
    categoria: a.categoria as string,
    tags: (a.tags as string[]) ?? [],
    imagenUrl: a.imagenUrl as string | undefined,
    imagenAlt: a.imagenAlt as string | undefined,
    fechaPublicacion: a.fechaPublicacion
      ? new Date(a.fechaPublicacion as Date).toISOString()
      : null,
    tiempoLectura: (a.tiempoLectura as number) ?? 5,
    destacado: (a.destacado as boolean) ?? false,
  }
}

export default async function BlogPage() {
  let articulos: ArticuloCard[] = []
  let destacados: ArticuloCard[] = []
  let categorias: string[] = ['Todas']

  try {
    await connectDB()

    const [articulosRaw, destacadosRaw] = await Promise.all([
      BlogArticulo.find({ publicado: true })
        .select(
          'titulo slug extracto autor categoria tags imagenUrl imagenAlt fechaPublicacion tiempoLectura destacado'
        )
        .sort({ fechaPublicacion: -1 })
        .lean(),
      BlogArticulo.find({ publicado: true, destacado: true })
        .select(
          'titulo slug extracto autor categoria tags imagenUrl imagenAlt fechaPublicacion tiempoLectura'
        )
        .sort({ fechaPublicacion: -1 })
        .limit(3)
        .lean(),
    ])

    articulos = (articulosRaw as Record<string, unknown>[]).map(serializeArticulo)
    destacados = (destacadosRaw as Record<string, unknown>[]).map(serializeArticulo)
    categorias = [
      'Todas',
      ...Array.from(new Set(articulos.map((a) => a.categoria))).sort(),
    ]
  } catch {
    // DB no disponible: renderizar con estado vacío
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <section
        className="bg-gradient-to-r from-sage-green to-leaf-green py-16"
        aria-label="Encabezado del blog"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Blog GreenRouse</h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Descubrí consejos, técnicas y secretos para crear la huerta orgánica de tus sueños
          </p>
        </div>
      </section>

      <BlogContent
        articulos={articulos}
        destacados={destacados}
        categorias={categorias}
      />

      <Footer />
    </div>
  )
}