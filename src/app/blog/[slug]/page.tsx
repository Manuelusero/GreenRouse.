import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import connectDB from '@/lib/mongodb'
import BlogArticulo from '@/models/BlogArticulo'
import { markdownToHtml } from '@/utils/markdown'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXTAUTH_URL || 'https://greenrouse.com'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    await connectDB()
  } catch {
    return { title: 'Blog | GreenRouse' }
  }

  const articulo = await BlogArticulo.findOne({ slug, publicado: true })
    .select('titulo slug extracto metaTitle metaDescription imagenUrl imagenAlt autor fechaPublicacion canonicalUrl')
    .lean()

  if (!articulo) {
    return { title: 'Artículo no encontrado | GreenRouse' }
  }

  const title = `${articulo.metaTitle || articulo.titulo} | GreenRouse`
  const description = articulo.metaDescription || articulo.extracto
  const imageUrl = articulo.imagenUrl?.startsWith('http')
    ? articulo.imagenUrl
    : `${SITE_URL}${articulo.imagenUrl || '/images/og-blog.jpg'}`
  const canonical =
    articulo.canonicalUrl || `${SITE_URL}/blog/${articulo.slug}`

  return {
    title,
    description,
    authors: [{ name: articulo.autor }],
    openGraph: {
      title: articulo.metaTitle || articulo.titulo,
      description,
      type: 'article',
      locale: 'es_AR',
      url: canonical,
      siteName: 'GreenRouse',
      publishedTime: articulo.fechaPublicacion?.toISOString(),
      authors: [articulo.autor],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: articulo.imagenAlt || articulo.titulo,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: articulo.metaTitle || articulo.titulo,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical,
    },
  }
}

export default async function BlogArticuloPage({ params }: PageProps) {
  const { slug } = await params

  try {
    await connectDB()
  } catch {
    notFound()
  }

  const [articuloRaw] = await Promise.all([
    BlogArticulo.findOne({ slug, publicado: true }).lean(),
  ])

  if (!articuloRaw) notFound()

  const articulo = articuloRaw

  const relacionados = await BlogArticulo.find({
    publicado: true,
    categoria: articulo.categoria,
    slug: { $ne: articulo.slug },
  })
    .select('titulo slug extracto imagenUrl imagenAlt tiempoLectura fechaPublicacion')
    .sort({ fechaPublicacion: -1 })
    .limit(3)
    .lean()

  const contenidoHtml = markdownToHtml(articulo.contenido)

  const imageUrl = articulo.imagenUrl?.startsWith('http')
    ? articulo.imagenUrl
    : `${SITE_URL}${articulo.imagenUrl || '/images/og-blog.jpg'}`

  // JSON-LD — Article schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: articulo.titulo,
    description: articulo.metaDescription || articulo.extracto,
    author: {
      '@type': 'Person',
      name: articulo.autor,
      description: articulo.autorBio,
    },
    datePublished: articulo.fechaPublicacion?.toISOString(),
    dateModified: (articulo as { updatedAt?: Date }).updatedAt?.toISOString(),
    image: imageUrl,
    publisher: {
      '@type': 'Organization',
      name: 'GreenRouse',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${articulo.slug}`,
    },
    keywords: articulo.tags.join(', '),
  }

  // JSON-LD — BreadcrumbList
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${SITE_URL}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: articulo.titulo,
        item: `${SITE_URL}/blog/${articulo.slug}`,
      },
    ],
  }

  const fechaFormateada = articulo.fechaPublicacion
    ? new Date(articulo.fechaPublicacion).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <>
      {/* JSON-LD estructurado */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Hero del artículo */}
        <div className="bg-gradient-to-r from-sage-green to-leaf-green py-12 relative overflow-hidden">
          {articulo.imagenUrl && (
            <img
              src={
                articulo.imagenUrl.startsWith('http')
                  ? articulo.imagenUrl
                  : articulo.imagenUrl
              }
              alt={articulo.imagenAlt || articulo.titulo}
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
          )}
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-green-200">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Inicio
                  </Link>
                </li>
                <li aria-hidden="true">›</li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true">›</li>
                <li className="text-white truncate max-w-xs">{articulo.titulo}</li>
              </ol>
            </nav>

            {/* Categoría */}
            <Link
              href={`/blog?categoria=${encodeURIComponent(articulo.categoria)}`}
              className="inline-block bg-white/20 text-white px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm mb-4 hover:bg-white/30 transition-colors"
            >
              {articulo.categoria}
            </Link>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {articulo.titulo}
            </h1>

            <p className="text-xl text-green-100 mb-6 leading-relaxed">
              {articulo.extracto}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-green-200">
              <span className="font-medium text-white">{articulo.autor}</span>
              {articulo.autorBio && (
                <span className="hidden md:inline opacity-75">
                  {articulo.autorBio}
                </span>
              )}
              {fechaFormateada && (
                <time
                  dateTime={articulo.fechaPublicacion?.toISOString()}
                  className="flex items-center gap-1"
                >
                  <span aria-hidden="true">📅</span>
                  {fechaFormateada}
                </time>
              )}
              <span className="flex items-center gap-1">
                <span aria-hidden="true">🕐</span>
                {articulo.tiempoLectura} min de lectura
              </span>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Artículo */}
            <article className="lg:col-span-3">
              {/* Tags */}
              {articulo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {articulo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-sage-green/10 text-sage-green px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Contenido del artículo */}
              <div
                className="prose-blog"
                dangerouslySetInnerHTML={{ __html: contenidoHtml }}
              />

              {/* Imagen de cierre con caption */}
              {articulo.imagenUrl && articulo.imagenCaption && (
                <figure className="mt-8">
                  <img
                    src={articulo.imagenUrl}
                    alt={articulo.imagenAlt || articulo.titulo}
                    className="w-full rounded-xl shadow-md"
                  />
                  <figcaption className="text-sm text-gray-500 text-center mt-2 italic">
                    {articulo.imagenCaption}
                  </figcaption>
                </figure>
              )}

              {/* Compartir */}
              <div className="mt-10 pt-8 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  ¿Te resultó útil? Compartilo:
                </p>
                <div className="flex gap-3">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(articulo.titulo)}&url=${encodeURIComponent(`${SITE_URL}/blog/${articulo.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                    aria-label={`Compartir "${articulo.titulo}" en X (Twitter)`}
                  >
                    X / Twitter
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${articulo.titulo} — ${SITE_URL}/blog/${articulo.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                    aria-label={`Compartir "${articulo.titulo}" por WhatsApp`}
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-8">
              {/* Sobre el autor */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-base font-bold text-soil-dark mb-3">
                  Sobre el autor
                </h2>
                <p className="font-semibold text-gray-800">{articulo.autor}</p>
                {articulo.autorBio && (
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {articulo.autorBio}
                  </p>
                )}
              </div>

              {/* CTA Calculadora */}
              <div className="bg-gradient-to-br from-leaf-green to-sage-green rounded-xl p-6 text-white">
                <h2 className="text-base font-bold mb-2">
                  ¿Tenés una huerta?
                </h2>
                <p className="text-sm text-green-100 mb-4">
                  Calculá cuántas plantas entran en tu espacio disponible.
                </p>
                <Link
                  href="/calculadora"
                  className="block text-center bg-white text-leaf-green px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
                >
                  Calculadora gratuita
                </Link>
              </div>
            </aside>
          </div>

          {/* Artículos relacionados */}
          {relacionados.length > 0 && (
            <section className="mt-16 pt-12 border-t border-gray-200" aria-labelledby="heading-relacionados">
              <h2 id="heading-relacionados" className="text-2xl font-bold text-soil-dark mb-8">
                Artículos Relacionados
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relacionados.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/blog/${rel.slug}`}
                    className="group block bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <div className="h-40 bg-gradient-to-br from-sage-green to-leaf-green relative overflow-hidden">
                      {rel.imagenUrl && (
                        <img
                          src={rel.imagenUrl}
                          alt={rel.imagenAlt || rel.titulo}
                          className="w-full h-full object-cover opacity-75"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-bold text-soil-dark group-hover:text-leaf-green transition-colors mb-2 line-clamp-2">
                        {rel.titulo}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {rel.tiempoLectura} min de lectura
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Volver al blog */}
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-leaf-green font-medium hover:underline"
            >
              ← Volver al Blog
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}
