import mongoose from 'mongoose'

export interface IPlantaAsociacion extends mongoose.Document {
  slug: string
  nombre_mostrado: string
  tipo: 'hortaliza' | 'verdura' | 'leguminosa' | 'aromática' | 'flor' | 'frutal'
  temporada: string[]
  recomendadas: string[]
  no_recomendadas: string[]
  descripcion?: string
  createdAt: Date
  updatedAt: Date
}

const PlantaAsociacionSchema = new mongoose.Schema<IPlantaAsociacion>(
  {
    slug: {
      type: String,
      required: [true, 'El slug es requerido'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    nombre_mostrado: {
      type: String,
      required: [true, 'El nombre mostrado es requerido'],
      trim: true
    },
    tipo: {
      type: String,
      required: [true, 'El tipo es requerido'],
      enum: ['hortaliza', 'verdura', 'leguminosa', 'aromática', 'flor', 'frutal']
    },
    temporada: {
      type: [String],
      required: [true, 'La temporada es requerida'],
      enum: ['primavera', 'verano', 'otoño', 'invierno'],
      default: []
    },
    recomendadas: {
      type: [String],
      default: [],
      lowercase: true
    },
    no_recomendadas: {
      type: [String],
      default: [],
      lowercase: true
    },
    descripcion: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    collection: 'plantas_asociaciones'
  }
)

// Índices para búsquedas rápidas
PlantaAsociacionSchema.index({ tipo: 1 })
PlantaAsociacionSchema.index({ temporada: 1 })
PlantaAsociacionSchema.index({ slug: 1, tipo: 1 })

// Método para obtener asociaciones compatibles
PlantaAsociacionSchema.methods.obtenerCompatibles = function() {
  return this.recomendadas
}

// Método para verificar si dos plantas son compatibles
PlantaAsociacionSchema.methods.esCompatibleCon = function(otraPlantaSlug: string) {
  return this.recomendadas.includes(otraPlantaSlug.toLowerCase())
}

// Método para verificar si dos plantas NO son compatibles
PlantaAsociacionSchema.methods.noEsCompatibleCon = function(otraPlantaSlug: string) {
  return this.no_recomendadas.includes(otraPlantaSlug.toLowerCase())
}

// Método estático para obtener recomendaciones para un cultivo
PlantaAsociacionSchema.statics.obtenerRecomendacionesPara = async function(cultivos: string[]) {
  const cultivosNormalizados = cultivos.map(c => c.toLowerCase())
  const plantas = await this.find({ slug: { $in: cultivosNormalizados } })
  
  const recomendadas = new Set<string>()
  const noRecomendadas = new Set<string>()
  
  plantas.forEach((planta: IPlantaAsociacion) => {
    planta.recomendadas.forEach((r: string) => recomendadas.add(r))
    planta.no_recomendadas.forEach((nr: string) => noRecomendadas.add(nr))
  })
  
  // Eliminar plantas que ya están en el cultivo
  cultivosNormalizados.forEach(c => {
    recomendadas.delete(c)
    noRecomendadas.delete(c)
  })
  
  // Eliminar plantas que están en no_recomendadas de recomendadas
  noRecomendadas.forEach(nr => recomendadas.delete(nr))
  
  return {
    recomendadas: Array.from(recomendadas),
    no_recomendadas: Array.from(noRecomendadas)
  }
}

const PlantaAsociacion = mongoose.models.PlantaAsociacion || mongoose.model<IPlantaAsociacion>('PlantaAsociacion', PlantaAsociacionSchema)

export default PlantaAsociacion
