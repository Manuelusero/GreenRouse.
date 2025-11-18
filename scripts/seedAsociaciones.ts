import dotenv from 'dotenv'
import { resolve } from 'path'
import mongoose from 'mongoose'
import PlantaAsociacion from '../src/models/PlantaAsociacion'

// Cargar variables de entorno desde .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/greenrouse'

const plantasData = [
  {
    "slug": "tomate",
    "nombre_mostrado": "Tomate",
    "tipo": "hortaliza",
    "temporada": ["primavera", "verano"],
    "recomendadas": ["albahaca", "zanahoria", "cebolla", "apio", "tagetes", "capuchina"],
    "no_recomendadas": ["patata", "hinojo", "repollo", "maiz"]
  },
  {
    "slug": "zanahoria",
    "nombre_mostrado": "Zanahoria",
    "tipo": "hortaliza",
    "temporada": ["primavera", "otoño"],
    "recomendadas": ["tomate", "cebolla", "puerro", "romero", "salvia", "calendula"],
    "no_recomendadas": ["eneldo", "menta"]
  },
  {
    "slug": "cebolla",
    "nombre_mostrado": "Cebolla",
    "tipo": "hortaliza",
    "temporada": ["invierno", "primavera"],
    "recomendadas": ["zanahoria", "remolacha", "acelga", "lechuga", "fresa", "manzanilla"],
    "no_recomendadas": ["haba", "judia", "guisante"]
  },
  {
    "slug": "lechuga",
    "nombre_mostrado": "Lechuga",
    "tipo": "verdura",
    "temporada": ["primavera", "otoño"],
    "recomendadas": ["cebolla", "zanahoria", "fresa", "rabano", "calendula", "menta"],
    "no_recomendadas": ["perejil", "apio"]
  },
  {
    "slug": "patata",
    "nombre_mostrado": "Patata",
    "tipo": "hortaliza",
    "temporada": ["primavera", "verano"],
    "recomendadas": ["repollo", "maiz", "haba", "calendula"],
    "no_recomendadas": ["tomate", "pepino", "calabaza", "berenjena", "girasol"]
  },
  {
    "slug": "maiz",
    "nombre_mostrado": "Maíz",
    "tipo": "hortaliza",
    "temporada": ["primavera", "verano"],
    "recomendadas": ["calabaza", "judia", "pepino", "melon", "girasol", "capuchina"],
    "no_recomendadas": ["tomate", "remolacha"]
  },
  {
    "slug": "judia",
    "nombre_mostrado": "Judía",
    "tipo": "leguminosa",
    "temporada": ["primavera", "verano"],
    "recomendadas": ["maiz", "pepino", "rabano", "calabaza", "romero", "zanahoria"],
    "no_recomendadas": ["cebolla", "ajo", "puerro", "hinojo"]
  },
  {
    "slug": "ajo",
    "nombre_mostrado": "Ajo",
    "tipo": "hortaliza",
    "temporada": ["invierno", "primavera"],
    "recomendadas": ["fresa", "tomate", "lechuga", "zanahoria"],
    "no_recomendadas": ["haba", "judia"]
  },
  {
    "slug": "pepino",
    "nombre_mostrado": "Pepino",
    "tipo": "hortaliza",
    "temporada": ["primavera", "verano"],
    "recomendadas": ["maiz", "judia", "rabano", "girasol", "eneldo", "capuchina"],
    "no_recomendadas": ["patata", "salvia", "tomate"]
  },
  {
    "slug": "calabaza",
    "nombre_mostrado": "Calabaza",
    "tipo": "hortaliza",
    "temporada": ["primavera", "verano"],
    "recomendadas": ["maiz", "judia", "girasol", "capuchina"],
    "no_recomendadas": ["patata"]
  },
  {
    "slug": "berenjena",
    "nombre_mostrado": "Berenjena",
    "tipo": "hortaliza",
    "temporada": ["primavera", "verano"],
    "recomendadas": ["albahaca", "pimiento", "espinaca", "judia"],
    "no_recomendadas": ["patata"]
  },
  {
    "slug": "pimiento",
    "nombre_mostrado": "Pimiento",
    "tipo": "hortaliza",
    "temporada": ["primavera", "verano"],
    "recomendadas": ["albahaca", "cebolla", "zanahoria", "oregano", "perejil"],
    "no_recomendadas": ["hinojo"]
  },
  {
    "slug": "repollo",
    "nombre_mostrado": "Repollo",
    "tipo": "verdura",
    "temporada": ["otoño", "invierno"],
    "recomendadas": ["patata", "apio", "cebolla", "romero", "menta", "salvia", "eneldo", "tomillo"],
    "no_recomendadas": ["tomate", "fresa"]
  },
  {
    "slug": "acelga",
    "nombre_mostrado": "Acelga",
    "tipo": "verdura",
    "temporada": ["otoño", "invierno"],
    "recomendadas": ["cebolla", "col", "rabano", "fresa", "ajo"],
    "no_recomendadas": ["remolacha"]
  },
  {
    "slug": "remolacha",
    "nombre_mostrado": "Remolacha",
    "tipo": "hortaliza",
    "temporada": ["primavera", "otoño"],
    "recomendadas": ["cebolla", "col", "lechuga"],
    "no_recomendadas": ["acelga", "espinaca"]
  },
  {
    "slug": "rabano",
    "nombre_mostrado": "Rábano",
    "tipo": "hortaliza",
    "temporada": ["primavera", "otoño"],
    "recomendadas": ["lechuga", "pepino", "zanahoria", "calendula", "albahaca"],
    "no_recomendadas": ["hinojo"]
  },
  {
    "slug": "espinaca",
    "nombre_mostrado": "Espinaca",
    "tipo": "verdura",
    "temporada": ["otoño", "invierno"],
    "recomendadas": ["cebolla", "col", "rabano", "ajo"],
    "no_recomendadas": ["remolacha"]
  },
  {
    "slug": "albahaca",
    "nombre_mostrado": "Albahaca",
    "tipo": "aromática",
    "temporada": ["primavera", "verano"],
    "recomendadas": ["tomate", "pimiento", "berenjena", "pepino", "lechuga", "oregano"],
    "no_recomendadas": ["ruda", "salvia"]
  },
  {
    "slug": "romero",
    "nombre_mostrado": "Romero",
    "tipo": "aromática",
    "temporada": ["primavera", "verano"],
    "recomendadas": ["zanahoria", "col", "salvia", "tomillo"],
    "no_recomendadas": ["menta"]
  },
  {
    "slug": "menta",
    "nombre_mostrado": "Menta",
    "tipo": "aromática",
    "temporada": ["primavera", "verano"],
    "recomendadas": ["repollo", "lechuga", "zanahoria"],
    "no_recomendadas": ["manzanilla", "romero"]
  },
  {
    "slug": "salvia",
    "nombre_mostrado": "Salvia",
    "tipo": "aromática",
    "temporada": ["primavera", "verano"],
    "recomendadas": ["col", "zanahoria", "romero"],
    "no_recomendadas": ["pepino", "cebolla"]
  },
  {
    "slug": "tomillo",
    "nombre_mostrado": "Tomillo",
    "tipo": "aromática",
    "temporada": ["primavera", "verano"],
    "recomendadas": ["col", "romero", "fresa"],
    "no_recomendadas": []
  },
  {
    "slug": "calendula",
    "nombre_mostrado": "Caléndula",
    "tipo": "flor",
    "temporada": ["primavera", "verano"],
    "recomendadas": ["tomate", "lechuga", "cebolla", "zanahoria", "pepino"],
    "no_recomendadas": []
  },
  {
    "slug": "capuchina",
    "nombre_mostrado": "Capuchina",
    "tipo": "flor",
    "temporada": ["primavera", "verano"],
    "recomendadas": ["tomate", "calabaza", "pepino", "maiz"],
    "no_recomendadas": []
  },
  {
    "slug": "tagetes",
    "nombre_mostrado": "Tagetes",
    "tipo": "flor",
    "temporada": ["primavera", "verano"],
    "recomendadas": ["tomate", "pimiento", "berenjena", "lechuga"],
    "no_recomendadas": []
  },
  {
    "slug": "manzanilla",
    "nombre_mostrado": "Manzanilla",
    "tipo": "flor",
    "temporada": ["primavera", "verano"],
    "recomendadas": ["cebolla", "repollo", "brocoli"],
    "no_recomendadas": ["menta"]
  },
  {
    "slug": "ruda",
    "nombre_mostrado": "Ruda",
    "tipo": "aromática",
    "temporada": ["primavera", "verano"],
    "recomendadas": ["rosal", "higuera"],
    "no_recomendadas": ["albahaca", "salvia"]
  },
  {
    "slug": "oregano",
    "nombre_mostrado": "Orégano",
    "tipo": "aromática",
    "temporada": ["primavera", "verano"],
    "recomendadas": ["pimiento", "albahaca", "tomate"],
    "no_recomendadas": []
  },
  {
    "slug": "perejil",
    "nombre_mostrado": "Perejil",
    "tipo": "aromática",
    "temporada": ["primavera", "otoño"],
    "recomendadas": ["tomate", "zanahoria", "cebolla"],
    "no_recomendadas": ["lechuga", "menta"]
  },
  {
    "slug": "eneldo",
    "nombre_mostrado": "Eneldo",
    "tipo": "aromática",
    "temporada": ["primavera", "verano"],
    "recomendadas": ["col", "pepino"],
    "no_recomendadas": ["zanahoria"]
  },
  {
    "slug": "hinojo",
    "nombre_mostrado": "Hinojo",
    "tipo": "aromática",
    "temporada": ["primavera", "verano"],
    "recomendadas": [],
    "no_recomendadas": ["tomate", "judia", "rabano", "pimiento"]
  },
  {
    "slug": "apio",
    "nombre_mostrado": "Apio",
    "tipo": "hortaliza",
    "temporada": ["primavera", "otoño"],
    "recomendadas": ["tomate", "repollo", "cebolla"],
    "no_recomendadas": ["lechuga"]
  },
  {
    "slug": "girasol",
    "nombre_mostrado": "Girasol",
    "tipo": "flor",
    "temporada": ["primavera", "verano"],
    "recomendadas": ["maiz", "pepino"],
    "no_recomendadas": ["patata"]
  },
  {
    "slug": "fresa",
    "nombre_mostrado": "Fresa",
    "tipo": "frutal",
    "temporada": ["primavera", "verano"],
    "recomendadas": ["cebolla", "lechuga", "ajo"],
    "no_recomendadas": ["repollo"]
  },
  {
    "slug": "brocoli",
    "nombre_mostrado": "Brócoli",
    "tipo": "verdura",
    "temporada": ["otoño", "invierno"],
    "recomendadas": ["cebolla", "romero", "menta", "salvia", "tomillo", "manzanilla"],
    "no_recomendadas": ["tomate", "fresa"]
  },
  {
    "slug": "cilantro",
    "nombre_mostrado": "Cilantro",
    "tipo": "aromática",
    "temporada": ["primavera", "otoño"],
    "recomendadas": ["zanahoria", "pepino", "tomate"],
    "no_recomendadas": ["hinojo"]
  },
  {
    "slug": "cebollin",
    "nombre_mostrado": "Cebollín",
    "tipo": "aromática",
    "temporada": ["primavera", "verano"],
    "recomendadas": ["zanahoria", "tomate", "lechuga"],
    "no_recomendadas": ["haba", "judia", "guisante"]
  },
  {
    "slug": "calabacin",
    "nombre_mostrado": "Calabacín",
    "tipo": "hortaliza",
    "temporada": ["primavera", "verano"],
    "recomendadas": ["maiz", "judia", "capuchina", "calendula"],
    "no_recomendadas": ["patata"]
  }
]

async function seedAsociaciones() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Conectado a MongoDB')

    // Limpiar colección existente
    await PlantaAsociacion.deleteMany({})
    console.log('🗑️  Colección limpiada')

    // Insertar datos
    const result = await PlantaAsociacion.insertMany(plantasData)
    console.log(`✅ ${result.length} plantas asociaciones insertadas correctamente`)

    // Mostrar estadísticas
    const stats = await PlantaAsociacion.aggregate([
      {
        $group: {
          _id: '$tipo',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ])

    console.log('\n📊 Estadísticas por tipo:')
    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count}`)
    })

    // Ejemplo de uso
    console.log('\n🔍 Ejemplo: Recomendaciones para tomate y lechuga')
    const tomate = await PlantaAsociacion.findOne({ slug: 'tomate' })
    const lechuga = await PlantaAsociacion.findOne({ slug: 'lechuga' })
    if (tomate && lechuga) {
      console.log(`   ${tomate.nombre_mostrado} recomienda:`, tomate.recomendadas.slice(0, 5).join(', '))
      console.log(`   ${lechuga.nombre_mostrado} recomienda:`, lechuga.recomendadas.slice(0, 5).join(', '))
    }

    mongoose.connection.close()
    console.log('\n✅ Seed completado exitosamente')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error en seed:', error)
    process.exit(1)
  }
}

// Ejecutar seed
seedAsociaciones()
