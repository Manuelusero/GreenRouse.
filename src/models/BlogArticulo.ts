import mongoose, { Document, Schema } from 'mongoose'

export interface IBlogArticulo extends Document {
  // Contenido
  titulo: string
  slug: string
  extracto: string          // 150-160 chars — usado como meta description
  contenido: string         // Markdown / HTML
  autor: string
  autorBio?: string

  // Categorización
  categoria: string
  tags: string[]

  // SEO
  metaTitle?: string        // si difiere del titulo (max 60 chars)
  metaDescription?: string  // si difiere del extracto (max 160 chars)
  canonicalUrl?: string     // para evitar duplicados
  imagenUrl?: string        // OG image — ruta relativa o URL absoluta
  imagenAlt?: string        // alt text para accesibilidad y SEO
  imagenCaption?: string

  // Publicación
  publicado: boolean
  destacado: boolean
  fechaPublicacion: Date
  tiempoLectura: number     // minutos estimados

  // Métricas (opcional)
  vistas: number
}

const BlogArticuloSchema = new Schema<IBlogArticulo>(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9-]+$/,
    },
    extracto: {
      type: String,
      required: true,
      trim: true,
      maxlength: 320,
    },
    contenido: {
      type: String,
      required: true,
    },
    autor: {
      type: String,
      required: true,
      trim: true,
    },
    autorBio: {
      type: String,
      trim: true,
    },
    categoria: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },

    // SEO
    metaTitle: {
      type: String,
      trim: true,
      maxlength: 60,
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    canonicalUrl: {
      type: String,
      trim: true,
    },
    imagenUrl: {
      type: String,
      trim: true,
    },
    imagenAlt: {
      type: String,
      trim: true,
    },
    imagenCaption: {
      type: String,
      trim: true,
    },

    // Publicación
    publicado: {
      type: Boolean,
      default: false,
    },
    destacado: {
      type: Boolean,
      default: false,
    },
    fechaPublicacion: {
      type: Date,
      default: Date.now,
    },
    tiempoLectura: {
      type: Number,
      default: 5,
      min: 1,
    },
    vistas: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

// Índices compuestos para los filtros más comunes
BlogArticuloSchema.index({ publicado: 1, fechaPublicacion: -1 })
BlogArticuloSchema.index({ publicado: 1, categoria: 1, fechaPublicacion: -1 })
BlogArticuloSchema.index({ publicado: 1, tags: 1 })
BlogArticuloSchema.index({ publicado: 1, destacado: 1, fechaPublicacion: -1 })

// HMR guard
const BlogArticulo =
  (mongoose.models.BlogArticulo as mongoose.Model<IBlogArticulo>) ||
  mongoose.model<IBlogArticulo>('BlogArticulo', BlogArticuloSchema)

export default BlogArticulo
