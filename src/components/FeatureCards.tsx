import Link from 'next/link'

const features = [
  {
    title: 'Gestión de Parcelas',
    description: 'Planifica, mide y organiza tus cultivos. Lleva un registro detallado de cada parcela con información sobre siembra, riego y cosecha.',
    icon: '🌾',
    link: '/parcelas',
    color: 'from-leaf-green to-sage-green'
  },
  {
    title: 'Cursos',
    description: 'Accede a cursos especializados en técnicas sostenibles, compostaje, rotación de cultivos y diseño permacultural.',
    icon: '📚',
    link: '/cursos',
    color: 'from-sunrise-orange to-yellow-500'
  },
  {
    title: 'Blog y Recursos',
    description: 'Mantente actualizado con artículos, tips de temporada, y guías prácticas para mejorar tu huerta orgánica.',
    icon: '📝',
    link: '/blog',
    color: 'from-sky-blue to-blue-500'
  },
  {
    title: 'Proveedores Locales',
    description: 'Encuentra semillas, herramientas e insumos orgánicos cerca de tu ubicación. Apoya el comercio local y sostenible.',
    icon: '🏪',
    link: '/proveedores',
    color: 'from-earth-brown to-orange-600'
  },
  {
    title: 'Guía de Verduras',
    description: 'Explora nuestra enciclopedia de verduras y frutas. Consultá información de cultivo, riego, asociaciones y épocas de siembra para cada especie.',
    icon: '🥬',
    link: '/verduras',
    color: 'from-earth-brown to-orange-600'
  },
  {
    title: 'Calculadora',
    description: 'Calculá cuántas plantas entran en tu espacio, estimá rendimientos y planífica la rotación de cultivos temporada a temporada.',
    icon: '🧹',
    link: '/calculadora',
    color: 'from-green-600 to-teal-500'
  }
]

export default function FeatureCards() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-soil-dark mb-4">
            Todo lo que Necesitas para tu Huerta
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre herramientas completas para gestionar tu huerta orgánica, 
            aprender nuevas técnicas y conectar con una comunidad sostenible
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link 
              href={feature.link} 
              key={index}
              className="group block transform transition-all duration-300 hover:scale-105"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full hover:shadow-2xl transition-shadow">
                <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
                
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-4xl mr-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-soil-dark group-hover:text-leaf-green transition-colors">
                      {feature.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="mt-4 flex items-center text-leaf-green group-hover:text-soil-dark transition-colors">
                    <span className="font-semibold">Explorar</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Call to action section */}
        <div className="mt-20 bg-gradient-to-r from-leaf-green to-sage-green rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            ¿Listo para Comenzar tu Huerta Sostenible?
          </h3>
          <p className="text-lg mb-8 text-green-100">
            Únete a nuestra comunidad y transforma tu espacio en un oasis orgánico
          </p>
          <button className="bg-white text-leaf-green px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
            Crear mi Primera Parcela
          </button>
        </div>
      </div>
    </section>
  )
}