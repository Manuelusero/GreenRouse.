'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { verdurasData, Verdura } from '@/data/verduras'
import ChatVerduras from '@/components/ChatVerduras'

export default function VerduraCatchAllPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string[]
  const verduraId = slug?.[0] || 'desconocida'
  
  // Buscar en la base de datos
  const verdura = verdurasData.find(v => v.id === verduraId)
  
  // Capitalizar el nombre para mostrarlo mejor
  const nombreVerdura = verduraId.charAt(0).toUpperCase() + verduraId.slice(1).toLowerCase()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-leaf-green to-sage-green text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/verduras"
                className="text-white/80 hover:text-white transition-colors"
              >
                ← Volver a verduras
              </Link>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-bold flex items-center">
                <span className="text-4xl mr-3">{verdura?.emoji || '🌱'}</span>
                {verdura?.nombre || nombreVerdura}
              </h1>
              <p className="text-white/80 mt-1">
                {verdura ? 'Información detallada' : 'Consulta a nuestra IA especializada'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Información principal */}
          <div className="lg:col-span-2 space-y-8">
            
            {verdura ? (
              // Si la verdura existe en la BD, mostrar información detallada
              <>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="aspect-video bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg mb-6 flex items-center justify-center">
                    <span className="text-8xl">{verdura.emoji}</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Acerca de {verdura.nombre}</h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {verdura.descripcion}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-leaf-green/10 rounded-lg p-3">
                      <div className="text-2xl mb-1">🌱</div>
                      <div className="text-sm font-medium text-gray-900">Temporada</div>
                      <div className="text-sm text-gray-600">{verdura.temporada}</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-2xl mb-1">💧</div>
                      <div className="text-sm font-medium text-gray-900">Riego</div>
                      <div className="text-sm text-gray-600">{verdura.riego}</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-3">
                      <div className="text-2xl mb-1">☀️</div>
                      <div className="text-sm font-medium text-gray-900">Sol</div>
                      <div className="text-sm text-gray-600">{verdura.sol}</div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Si no existe, mostrar mensaje de bienvenida para plantas raras
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="aspect-video bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg mb-6 flex items-center justify-center">
                  <span className="text-8xl">🌱</span>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Asistente de {nombreVerdura}</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  ¡Bienvenido! {nombreVerdura} no está en nuestra base de datos principal, 
                  pero nuestra IA especializada puede ayudarte con toda la información que necesites.
                </p>
                
                <div className="bg-leaf-green/10 border border-leaf-green/20 rounded-lg p-4">
                  <h3 className="font-semibold text-leaf-green mb-2">🤖 ¿Qué puedes preguntar?</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Época de siembra y cosecha</li>
                    <li>• Cuidados y requerimientos</li>
                    <li>• Plagas y enfermedades comunes</li>
                    <li>• Compatibilidad con otros cultivos</li>
                    <li>• Tips para cultivo orgánico</li>
                    <li>• Cualquier duda específica que tengas</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Verduras populares */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🌿 Verduras Populares</h3>
              <p className="text-gray-600 mb-4">
                Explora nuestras guías especializadas de las verduras más comunes:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['tomate', 'lechuga', 'zanahoria', 'pimiento', 'berenjena', 'pepino'].map((verdura) => (
                  <Link
                    key={verdura}
                    href={`/verduras/${verdura}`}
                    className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-3 text-center transition-colors"
                  >
                    <div className="text-2xl mb-1">
                      {verdura === 'tomate' && '🍅'}
                      {verdura === 'lechuga' && '🥬'}
                      {verdura === 'zanahoria' && '🥕'}
                      {verdura === 'pimiento' && '🫑'}
                      {verdura === 'berenjena' && '🍆'}
                      {verdura === 'pepino' && '🥒'}
                    </div>
                    <div className="text-sm font-medium text-gray-900 capitalize">
                      {verdura}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Chat con IA */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ChatVerduras verdura={verdura || {
                id: verduraId,
                nombre: nombreVerdura,
                emoji: '🌱',
                descripcion: `Planta especializada con asistencia de IA`,
                temporada: 'Consultar con IA',
                riego: 'Consultar con IA',
                sol: 'Consultar con IA'
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
