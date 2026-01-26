import Link from 'next/link'
import { verdurasData, Verdura } from '@/data/verduras'

export default function VerdurasPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-soil-dark mb-4">
            🥬 Guía de Verduras y Frutas
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explora nuestra enciclopedia de cultivos. Consulta a nuestra IA especializada 
            sobre cuidados, siembra, cosecha y recomendaciones para cada planta.
          </p>
        </div>

        {/* Grid de verduras */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {verdurasData.map((verdura: Verdura) => (
            <Link
              key={verdura.id}
              href={`/verduras/${verdura.id}`}
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="aspect-square bg-gradient-to-br from-green-50 to-emerald-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl">{verdura.emoji}</span>
                </div>
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                  <span className="text-xs font-medium text-leaf-green">
                    {verdura.temporada}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-leaf-green transition-colors">
                  {verdura.nombre}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {verdura.descripcion}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    💧 {verdura.riego}
                  </span>
                  <span className="text-gray-500">
                    ☀️ {verdura.sol}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA para consultar a IA */}
        <div className="mt-16 text-center bg-gradient-to-r from-leaf-green to-sage-green rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">
            ¿Tienes dudas sobre algún cultivo?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Nuestra IA especializada está lista para responder todas tus preguntas 
            sobre siembra, cuidados, plagas y recomendaciones personalizadas.
          </p>
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
            <span className="text-2xl mr-2">🤖</span>
            <span className="font-medium">Haz clic en cualquier verdura para consultar</span>
          </div>
        </div>
      </div>
    </div>
  )
}
