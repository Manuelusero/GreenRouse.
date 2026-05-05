'use client'

import Link from 'next/link'
import { useState, useMemo, memo } from 'react'

export type ArticuloCard = {
  _id: string
  titulo: string
  slug: string
  extracto: string
  autor: string
  categoria: string
  tags: string[]
  imagenUrl?: string
  imagenAlt?: string
  fechaPublicacion: string | null
  tiempoLectura: number
  destacado: boolean
}

type Props = {
  articulos: ArticuloCard[]
  destacados: ArticuloCard[]
  categorias: string[]
}

function formatDate(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const ArticuloCardImage = memo(function ArticuloCardImage({
  imagenUrl,
  imagenAlt,
  titulo,
  height = 'h-48',
}: {
  imagenUrl?: string
  imagenAlt?: string
  titulo: string
  height?: string
}) {
  return (
    <div className={`${height} bg-gradient-to-br from-leaf-green to-sage-green relative overflow-hidden`}>
      {imagenUrl && (
        <img
          src={imagenUrl}
          alt={imagenAlt || titulo}
          className="w-full h-full object-cover opacity-80"
          loading="lazy"
        />
      )}
      {!imagenUrl && (
        <div className="absolute inset-0 earth-pattern opacity-20" />
      )}
    </div>
  )
})

const DestacadoCard = memo(function DestacadoCard({
  articulo,
  large = false,
}: {
  articulo: ArticuloCard
  large?: boolean
}) {
  return (
    <Link
      href={`/blog/${articulo.slug}`}
      className={`group block ${large ? 'lg:col-span-2' : ''}`}
    >
      <article className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden h-full">
        <div className="relative">
          <ArticuloCardImage
            imagenUrl={articulo.imagenUrl}
            imagenAlt={articulo.imagenAlt}
            titulo={articulo.titulo}
            height={large ? 'h-64 lg:h-72' : 'h-48'}
          />
          <div className="absolute top-4 left-4">
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
              {articulo.categoria}
            </span>
          </div>
        </div>

        <div className={`p-6 ${large ? 'lg:p-8' : ''}`}>
          <div className="flex items-center text-sm text-gray-500 mb-3 flex-wrap gap-1">
            <span>{articulo.autor}</span>
            <span className="mx-1">·</span>
            <time dateTime={articulo.fechaPublicacion ?? undefined}>
              {formatDate(articulo.fechaPublicacion)}
            </time>
            <span className="mx-1">·</span>
            <span>{articulo.tiempoLectura} min de lectura</span>
          </div>

          <h3
            className={`font-bold text-soil-dark group-hover:text-leaf-green transition-colors mb-3 ${
              large ? 'text-xl lg:text-2xl' : 'text-lg'
            }`}
          >
            {articulo.titulo}
          </h3>

          <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
            {articulo.extracto}
          </p>

          <div className="flex flex-wrap gap-2">
            {articulo.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-sage-green/10 text-sage-green px-2 py-1 rounded text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  )
})

const ArticuloGridCard = memo(function ArticuloGridCard({
  articulo,
}: {
  articulo: ArticuloCard
}) {
  return (
    <Link href={`/blog/${articulo.slug}`} className="group block">
      <article className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden h-full">
        <div className="relative">
          <ArticuloCardImage
            imagenUrl={articulo.imagenUrl}
            imagenAlt={articulo.imagenAlt}
            titulo={articulo.titulo}
          />
          <div className="absolute top-4 left-4">
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
              {articulo.categoria}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center text-sm text-gray-500 mb-3 flex-wrap gap-1">
            <span>{articulo.autor}</span>
            <span className="mx-1">·</span>
            <span>{articulo.tiempoLectura} min</span>
          </div>

          <h3 className="text-lg font-bold text-soil-dark group-hover:text-leaf-green transition-colors mb-3">
            {articulo.titulo}
          </h3>

          <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
            {articulo.extracto}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {articulo.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="bg-sage-green/10 text-sage-green px-2 py-1 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <time
              dateTime={articulo.fechaPublicacion ?? undefined}
              className="text-sm text-gray-500"
            >
              {formatDate(articulo.fechaPublicacion)}
            </time>
          </div>
        </div>
      </article>
    </Link>
  )
})

export default function BlogContent({ articulos, destacados, categorias }: Props) {
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')

  const articulosFiltrados = useMemo(
    () =>
      categoriaActiva === 'Todas'
        ? articulos
        : articulos.filter((a) => a.categoria === categoriaActiva),
    [articulos, categoriaActiva]
  )

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Artículos destacados */}
      {destacados.length > 0 && (
        <section className="mb-16" aria-labelledby="heading-destacados">
          <h2 id="heading-destacados" className="text-2xl font-bold text-soil-dark mb-8">
            Artículos Destacados
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {destacados.map((articulo, index) => (
              <DestacadoCard
                key={articulo._id}
                articulo={articulo}
                large={index === 0}
              />
            ))}
          </div>
        </section>
      )}

      {/* Filtro por categoría */}
      <section className="mb-8" aria-label="Filtros de categoría">
        <div className="flex flex-wrap gap-3" role="group" aria-label="Filtrar por categoría">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              onClick={() => setCategoriaActiva(categoria)}
              aria-pressed={categoriaActiva === categoria}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                categoriaActiva === categoria
                  ? 'bg-leaf-green text-white'
                  : 'bg-white text-gray-700 hover:bg-sage-green hover:text-white border border-gray-200'
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>
      </section>

      {/* Grid de artículos */}
      <section aria-labelledby="heading-articulos">
        <h2 id="heading-articulos" className="text-2xl font-bold text-soil-dark mb-8">
          {categoriaActiva === 'Todas'
            ? 'Todos los Artículos'
            : `Artículos: ${categoriaActiva}`}
          <span className="ml-3 text-base font-normal text-gray-500">
            ({articulosFiltrados.length})
          </span>
        </h2>

        {articulosFiltrados.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            No hay artículos en esta categoría todavía.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articulosFiltrados.map((articulo) => (
              <ArticuloGridCard key={articulo._id} articulo={articulo} />
            ))}
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="mt-16 bg-gradient-to-r from-leaf-green to-sage-green rounded-2xl p-8 md:p-12 text-center text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Mantente Actualizado
        </h2>
        <p className="text-lg mb-8 text-green-100">
          Recibí los mejores consejos de jardinería directamente en tu email
        </p>
        <div className="max-w-md mx-auto flex gap-4">
          <label htmlFor="newsletter-email" className="sr-only">
            Tu dirección de email
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="Tu email"
            autoComplete="email"
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button className="bg-white text-leaf-green px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Suscribirse
          </button>
        </div>
      </section>
    </main>
  )
}
