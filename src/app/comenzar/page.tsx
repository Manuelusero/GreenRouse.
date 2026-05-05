'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { cultivosDatabase, CultivoKey, getCultivosRecomendados, calcularCapacidadParcela } from '@/data/cultivos'
import { paisesInfo, obtenerCultivosEstacionales } from '@/utils/geografia'

interface FormData {
  nombre: string
  experiencia: string
  espacio: string
  ubicacion: string
  pais?: string
  objetivos: string[]
  tiempo: string
  parcelas?: Array<{nombre: string, largo: number, ancho: number, cultivo: string | string[]}>
  [key: string]: string | string[] | boolean | undefined | Array<{nombre: string, largo: number, ancho: number, cultivo: string | string[]}>
}

export default function ComenzarHuerta() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [paso, setPaso] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    experiencia: '',
    espacio: '',
    ubicacion: '',
    pais: '',
    objetivos: [],
    tiempo: '',
    parcelas: []
  })

  const [parcelaEdit, setParcelaEdit] = useState({
    nombre: '',
    largo: '',
    ancho: '',
    cultivo: [] as string[]
  })

  const totalPasos = 10

  // Efecto para prellenar nombre del usuario si está autenticado
  useEffect(() => {
    if (status === 'loading') return // Aún cargando
    
    // Si está autenticado, prellenar nombre del usuario
    if (session?.user?.name && !formData.nombre) {
      setFormData(prev => ({
        ...prev,
        nombre: session.user?.name || ''
      }))
    }
  }, [session, status, formData.nombre])

  const handleObjetivosChange = (objetivo: string) => {
    setFormData(prev => ({
      ...prev,
      objetivos: prev.objetivos.includes(objetivo)
        ? prev.objetivos.filter(obj => obj !== objetivo)
        : [...prev.objetivos, objetivo]
    }))
  }

  const nextPaso = () => {
    if (paso < totalPasos) setPaso(paso + 1)
  }

  const prevPaso = () => {
    if (paso > 1) setPaso(paso - 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progreso */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-soil-dark">Comenzar mi Huerta</h1>
            <span className="text-sm text-gray-600">Paso {paso} de {totalPasos}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-leaf-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${(paso / totalPasos) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Paso 1: Bienvenida */}
          {paso === 1 && (
            <div className="text-center">
              <div className="text-6xl mb-6">🌱</div>
              <h2 className="text-2xl font-bold text-soil-dark mb-4">
                ¡Bienvenido a tu viaje en la agricultura orgánica!
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Te vamos a guiar paso a paso para crear tu primera huerta orgánica. 
                Este proceso toma solo unos minutos y nos ayuda a personalizar tu experiencia.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Cómo te gusta que te llamen?
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  className="w-full max-w-md mx-auto px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-green focus:border-transparent text-gray-900 bg-white"
                  placeholder="Tu nombre"
                />
              </div>
            </div>
          )}

          {/* Paso 2: Experiencia */}
          {paso === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-soil-dark mb-6 text-center">
                ¡Hola {formData.nombre || 'amigo'}! ¿Cuál es tu experiencia con la jardinería?
              </h2>
              
              <div className="space-y-4 max-w-2xl mx-auto">
                {[
                  { valor: 'principiante', titulo: 'Soy principiante', descripcion: 'Nunca he tenido una huerta antes', icono: '🌱' },
                  { valor: 'basico', titulo: 'Algo de experiencia', descripcion: 'He tenido algunas plantas en macetas', icono: '🪴' },
                  { valor: 'intermedio', titulo: 'Experiencia intermedia', descripcion: 'He manejado jardines pequeños antes', icono: '🌿' },
                  { valor: 'avanzado', titulo: 'Bastante experiencia', descripcion: 'Tengo experiencia con huertas grandes', icono: '🌳' }
                ].map((opcion) => (
                  <button
                    key={opcion.valor}
                    onClick={() => setFormData(prev => ({ ...prev, experiencia: opcion.valor }))}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      formData.experiencia === opcion.valor
                        ? 'border-leaf-green bg-leaf-green/5'
                        : 'border-gray-200 hover:border-leaf-green/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{opcion.icono}</span>
                      <div>
                        <div className="font-semibold text-gray-900">{opcion.titulo}</div>
                        <div className="text-sm text-gray-600">{opcion.descripcion}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Paso 3: Espacio disponible */}
          {paso === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-soil-dark mb-6 text-center">
                ¿Cuánto espacio tienes disponible?
              </h2>
              
              <div className="space-y-4 max-w-2xl mx-auto">
                {[
                  { valor: 'balcon', titulo: 'Balcón o terraza', descripcion: 'Macetas y jardineras (1-5 m²)', icono: '🏠' },
                  { valor: 'patio', titulo: 'Patio pequeño', descripcion: 'Espacio limitado (5-20 m²)', icono: '🏡' },
                  { valor: 'jardin', titulo: 'Jardín mediano', descripcion: 'Buen espacio disponible (20-100 m²)', icono: '🌻' },
                  { valor: 'terreno', titulo: 'Terreno grande', descripcion: 'Mucho espacio (100+ m²)', icono: '🚜' }
                ].map((opcion) => (
                  <button
                    key={opcion.valor}
                    onClick={() => setFormData(prev => ({ ...prev, espacio: opcion.valor }))}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      formData.espacio === opcion.valor
                        ? 'border-leaf-green bg-leaf-green/5'
                        : 'border-gray-200 hover:border-leaf-green/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{opcion.icono}</span>
                      <div>
                        <div className="font-semibold text-gray-900">{opcion.titulo}</div>
                        <div className="text-sm text-gray-600">{opcion.descripcion}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Paso 4: Ubicación */}
          {paso === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-soil-dark mb-6 text-center">
                ¿Dónde está ubicada tu huerta?
              </h2>
              
              <div className="space-y-4 max-w-2xl mx-auto">
                {[
                  { valor: 'interior', titulo: 'Interior (muy poca luz)', descripcion: 'Dentro de casa, luz artificial', icono: '💡' },
                  { valor: 'sombra', titulo: 'Sombra parcial', descripcion: '2-4 horas de sol directo', icono: '⛅' },
                  { valor: 'semisombra', titulo: 'Semi-sombra', descripcion: '4-6 horas de sol directo', icono: '🌤️' },
                  { valor: 'sol', titulo: 'Sol directo', descripcion: '6+ horas de sol directo', icono: '☀️' }
                ].map((opcion) => (
                  <button
                    key={opcion.valor}
                    onClick={() => setFormData(prev => ({ ...prev, ubicacion: opcion.valor }))}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      formData.ubicacion === opcion.valor
                        ? 'border-leaf-green bg-leaf-green/5'
                        : 'border-gray-200 hover:border-leaf-green/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{opcion.icono}</span>
                      <div>
                        <div className="font-semibold text-gray-900">{opcion.titulo}</div>
                        <div className="text-sm text-gray-600">{opcion.descripcion}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Paso 5: Objetivos */}
          {paso === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-soil-dark mb-6 text-center">
                ¿Cuáles son tus objetivos? (Puedes elegir varios)
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                {[
                  { valor: 'alimentos', titulo: 'Producir mis propios alimentos', icono: '🥬' },
                  { valor: 'hierbas', titulo: 'Cultivar hierbas aromáticas', icono: '🌿' },
                  { valor: 'flores', titulo: 'Tener flores hermosas', icono: '🌸' },
                  { valor: 'medicina', titulo: 'Plantas medicinales', icono: '🌱' },
                  { valor: 'hobby', titulo: 'Relajarme y divertirme', icono: '😌' },
                  { valor: 'sostenible', titulo: 'Vivir más sostenible', icono: '♻️' }
                ].map((opcion) => (
                  <button
                    key={opcion.valor}
                    onClick={() => handleObjetivosChange(opcion.valor)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.objetivos.includes(opcion.valor)
                        ? 'border-leaf-green bg-leaf-green/5'
                        : 'border-gray-200 hover:border-leaf-green/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{opcion.icono}</span>
                      <div className="font-semibold text-gray-900">{opcion.titulo}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Paso 6: Tiempo disponible */}
          {paso === 6 && (
            <div>
              <h2 className="text-2xl font-bold text-soil-dark mb-6 text-center">
                ¿Cuánto tiempo puedes dedicar por semana?
              </h2>
              
              <div className="space-y-4 max-w-2xl mx-auto">
                {[
                  { valor: 'poco', titulo: '30 minutos - 1 hora', descripcion: 'Solo lo básico', icono: '⏱️' },
                  { valor: 'moderado', titulo: '1-3 horas', descripcion: 'Mantenimiento regular', icono: '🕐' },
                  { valor: 'bastante', titulo: '3-5 horas', descripcion: 'Dedicación considerable', icono: '🕕' },
                  { valor: 'mucho', titulo: '5+ horas', descripcion: 'Es mi pasión principal', icono: '❤️' }
                ].map((opcion) => (
                  <button
                    key={opcion.valor}
                    onClick={() => setFormData(prev => ({ ...prev, tiempo: opcion.valor }))}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      formData.tiempo === opcion.valor
                        ? 'border-leaf-green bg-leaf-green/5'
                        : 'border-gray-200 hover:border-leaf-green/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{opcion.icono}</span>
                      <div>
                        <div className="font-semibold text-gray-900">{opcion.titulo}</div>
                        <div className="text-sm text-gray-600">{opcion.descripcion}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Paso 7: Ubicación Geográfica */}
          {paso === 7 && (
            <div>
              <h2 className="text-2xl font-bold text-soil-dark mb-6 text-center">
                ¿Dónde te encuentras? 🌎
              </h2>
              <p className="text-center text-gray-600 mb-6">
                Necesitamos saber tu ubicación para recomendarte los cultivos ideales según tu estación del año
              </p>
              
              <div className="space-y-4 max-w-2xl mx-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Selecciona tu país:
                  </label>
                  <select
                    value={formData.pais || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, pais: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-green focus:border-leaf-green text-gray-900 bg-white text-base"
                  >
                    <option value="">-- Selecciona un país --</option>
                    <optgroup label="🌍 Hemisferio Norte">
                      {Object.entries(paisesInfo)
                        .filter(([_, info]) => info.hemisferio === 'norte')
                        .map(([codigo, info]) => (
                          <option key={codigo} value={codigo}>
                            {info.nombre}
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="🌎 Hemisferio Sur">
                      {Object.entries(paisesInfo)
                        .filter(([_, info]) => info.hemisferio === 'sur')
                        .map(([codigo, info]) => (
                          <option key={codigo} value={codigo}>
                            {info.nombre}
                          </option>
                        ))}
                    </optgroup>
                  </select>
                </div>

                {/* Mostrar información de la estación si ya seleccionó país */}
                {formData.pais && (
                  <div className="bg-leaf-green/10 border-2 border-leaf-green/30 rounded-lg p-4 mt-6">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">
                        {paisesInfo[formData.pais].hemisferio === 'norte' ? '🌍' : '🌎'}
                      </span>
                      <div>
                        <h4 className="font-semibold text-soil-dark mb-2">
                          Perfecto! Estás en {paisesInfo[formData.pais].nombre}
                        </h4>
                        <div className="text-sm text-gray-700 space-y-1">
                          <p>
                            • <strong>Hemisferio:</strong> {paisesInfo[formData.pais].hemisferio === 'norte' ? 'Norte' : 'Sur'}
                          </p>
                          <p>
                            • <strong>Estación actual:</strong> {(() => {
                              const mes = new Date().getMonth() + 1
                              const hemisferio = paisesInfo[formData.pais].hemisferio
                              if (hemisferio === 'norte') {
                                if (mes >= 3 && mes <= 5) return '🌸 Primavera'
                                if (mes >= 6 && mes <= 8) return '☀️ Verano'
                                if (mes >= 9 && mes <= 11) return '🍂 Otoño'
                                return '❄️ Invierno'
                              } else {
                                if (mes >= 3 && mes <= 5) return '🍂 Otoño'
                                if (mes >= 6 && mes <= 8) return '❄️ Invierno'
                                if (mes >= 9 && mes <= 11) return '🌸 Primavera'
                                return '☀️ Verano'
                              }
                            })()}
                          </p>
                          <p className="text-xs text-gray-600 mt-2">
                            En el siguiente paso te mostraremos los cultivos ideales para esta temporada
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Paso 8: Sugerencias de cultivos */}
          {paso === 8 && (
            <div>
              <h2 className="text-2xl font-bold text-soil-dark mb-4 text-center">
                ¡Perfecto! Basado en tu perfil, te recomendamos estos cultivos:
              </h2>
              <p className="text-center text-gray-600 mb-6">
                Selecciona los que te interesen para incluir en tu huerta
              </p>
              
              <div className="space-y-4">
                {/* Información del perfil y ubicación */}
                <div className="bg-leaf-green/10 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-soil-dark mb-2">
                    ¿Por qué estas recomendaciones?
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• Tu nivel: <span className="font-medium">{formData.experiencia}</span></p>
                    <p>• Tu espacio: <span className="font-medium">{formData.espacio}</span></p>
                    <p>• Luz disponible: <span className="font-medium">{formData.ubicacion}</span></p>
                    {formData.pais && (
                      <p>
                        • Ubicación: <span className="font-medium">{paisesInfo[formData.pais]?.nombre}</span>
                        {' '}
                        <span className="text-xs">
                          ({paisesInfo[formData.pais]?.hemisferio === 'norte' ? '🌍 Norte' : '🌎 Sur'})
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Información de la estación actual */}
                {formData.pais && (() => {
                  const mes = new Date().getMonth() + 1
                  const hemisferio = paisesInfo[formData.pais].hemisferio
                  let estacionActual = ''
                  let estacionIcono = ''
                  
                  if (hemisferio === 'norte') {
                    if (mes >= 3 && mes <= 5) { estacionActual = 'Primavera'; estacionIcono = '🌸' }
                    else if (mes >= 6 && mes <= 8) { estacionActual = 'Verano'; estacionIcono = '☀️' }
                    else if (mes >= 9 && mes <= 11) { estacionActual = 'Otoño'; estacionIcono = '🍂' }
                    else { estacionActual = 'Invierno'; estacionIcono = '❄️' }
                  } else {
                    if (mes >= 3 && mes <= 5) { estacionActual = 'Otoño'; estacionIcono = '🍂' }
                    else if (mes >= 6 && mes <= 8) { estacionActual = 'Invierno'; estacionIcono = '❄️' }
                    else if (mes >= 9 && mes <= 11) { estacionActual = 'Primavera'; estacionIcono = '🌸' }
                    else { estacionActual = 'Verano'; estacionIcono = '☀️' }
                  }

                  const cultivosEstacionales = obtenerCultivosEstacionales(formData.pais)
                  
                  return (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{estacionIcono}</span>
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-1">
                            Estación actual: {estacionActual}
                          </h4>
                          <p className="text-sm text-blue-800 mb-2">
                            Estos cultivos son ideales para plantar ahora en {paisesInfo[formData.pais].nombre}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {cultivosEstacionales.slice(0, 8).map((cultivo, index) => (
                              <span
                                key={index}
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                              >
                                {cultivo}
                              </span>
                            ))}
                            {cultivosEstacionales.length > 8 && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                +{cultivosEstacionales.length - 8} más
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })()}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getCultivosRecomendados({
                    experiencia: formData.experiencia,
                    espacio: formData.espacio,
                    ubicacion: formData.ubicacion
                  }).map((cultivo) => {
                    // Verificar si el cultivo es estacional para el país seleccionado
                    const esEstacional = formData.pais 
                      ? obtenerCultivosEstacionales(formData.pais).some(c => 
                          c.toLowerCase().includes(cultivo.data.nombre.toLowerCase()) ||
                          cultivo.data.nombre.toLowerCase().includes(c.toLowerCase())
                        )
                      : false

                    return (
                      <button
                        key={cultivo.key}
                        onClick={() => {
                          const cultivosSeleccionados = formData.objetivos.includes('cultivos-seleccionados') 
                            ? formData.objetivos 
                            : [...formData.objetivos, 'cultivos-seleccionados']
                          setFormData(prev => ({ 
                            ...prev, 
                            objetivos: cultivosSeleccionados,
                            [cultivo.key]: !prev[cultivo.key]
                          }))
                        }}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          formData[cultivo.key]
                            ? 'border-leaf-green bg-leaf-green/5'
                            : esEstacional
                            ? 'border-blue-200 bg-blue-50 hover:border-blue-400'
                            : 'border-gray-200 hover:border-leaf-green/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{cultivo.data.icono}</span>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                {cultivo.data.nombre}
                                {esEstacional && (
                                  <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                                    Temporada
                                  </span>
                                )}
                              </h4>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {cultivo.data.dificultad}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{cultivo.data.dias} días</p>
                            <p className="text-xs text-leaf-green font-medium">{cultivo.motivo}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Paso 9: Crear parcelas */}
          {paso === 9 && (
            <div>
              <h2 className="text-2xl font-bold text-soil-dark mb-4 text-center">
                Crea tus parcelas personalizadas
              </h2>
              <p className="text-center text-gray-600 mb-6">
                Ajusta las dimensiones y asigna cultivos a cada parcela
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Calculadora de nueva parcela */}
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-soil-dark mb-4">➕ Agregar Nueva Parcela</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de la parcela
                      </label>
                      <input
                        type="text"
                        value={parcelaEdit.nombre}
                        onChange={(e) => setParcelaEdit(prev => ({ ...prev, nombre: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-green focus:border-transparent text-gray-900 bg-white"
                        placeholder="ej. Bancal Principal"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Largo (m)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={parcelaEdit.largo}
                          onChange={(e) => setParcelaEdit(prev => ({ ...prev, largo: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-green focus:border-transparent text-gray-900 bg-white"
                          placeholder="2.0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ancho (m)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={parcelaEdit.ancho}
                          onChange={(e) => setParcelaEdit(prev => ({ ...prev, ancho: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-green focus:border-transparent text-gray-900 bg-white"
                          placeholder="1.0"
                        />
                      </div>
                    </div>
                    
                    {/* Selector de cultivos múltiple */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cultivos (selecciona uno o varios)
                      </label>
                      
                      {/* Mensaje sobre cultivos de temporada */}
                      {formData.pais && (() => {
                        const mes = new Date().getMonth() + 1
                        const hemisferio = paisesInfo[formData.pais].hemisferio
                        let estacionActual = ''
                        let estacionIcono = ''
                        
                        if (hemisferio === 'norte') {
                          if (mes >= 3 && mes <= 5) { estacionActual = 'Primavera'; estacionIcono = '🌸' }
                          else if (mes >= 6 && mes <= 8) { estacionActual = 'Verano'; estacionIcono = '☀️' }
                          else if (mes >= 9 && mes <= 11) { estacionActual = 'Otoño'; estacionIcono = '🍂' }
                          else { estacionActual = 'Invierno'; estacionIcono = '❄️' }
                        } else {
                          if (mes >= 3 && mes <= 5) { estacionActual = 'Otoño'; estacionIcono = '🍂' }
                          else if (mes >= 6 && mes <= 8) { estacionActual = 'Invierno'; estacionIcono = '❄️' }
                          else if (mes >= 9 && mes <= 11) { estacionActual = 'Primavera'; estacionIcono = '🌸' }
                          else { estacionActual = 'Verano'; estacionIcono = '☀️' }
                        }
                        
                        return (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                            <div className="flex items-center gap-2 text-sm text-blue-900">
                              <span className="text-lg">{estacionIcono}</span>
                              <span>
                                <strong>{estacionActual}</strong> - Los cultivos con ⭐ son ideales para esta temporada
                              </span>
                            </div>
                          </div>
                        )
                      })()}
                      
                      {/* Grid de checkboxes con cultivos */}
                      <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-white">
                        {(() => {
                          // Preparar lista de cultivos
                          const cultivosEstacionales = formData.pais ? obtenerCultivosEstacionales(formData.pais) : []
                          
                          // Mapear cultivos estacionales a keys
                          const mapeoEstacional: Record<string, CultivoKey> = {
                            'tomate': 'tomate', 'tomates': 'tomate',
                            'lechuga': 'lechuga', 'lechugas': 'lechuga',
                            'espinaca': 'espinaca', 'espinacas': 'espinaca',
                            'acelga': 'acelga', 'acelgas': 'acelga',
                            'pimiento': 'pimiento', 'pimientos': 'pimiento',
                            'albahaca': 'albahaca', 'perejil': 'perejil',
                            'tomate cherry': 'tomate-cherry',
                            'zanahoria': 'zanahoria', 'zanahorias': 'zanahoria',
                            'rabanito': 'rabanito', 'rabanitos': 'rabanito',
                            'rábano': 'rabanito', 'rábanos': 'rabanito',
                            'cebolla': 'cebolla', 'cebollas': 'cebolla',
                            'ajo': 'ajo', 'ajos': 'ajo',
                            'calabacín': 'calabacín', 'calabacines': 'calabacín',
                            'pepino': 'pepino', 'pepinos': 'pepino',
                            'berenjena': 'berenjena', 'berenjenas': 'berenjena',
                            'brócoli': 'brócoli', 'brocoli': 'brócoli',
                            'coliflor': 'coliflor',
                            'remolacha': 'remolacha', 'remolachas': 'remolacha',
                            'rúcula': 'rúcula', 'rucula': 'rúcula',
                            'cilantro': 'cilantro',
                            'nabo': 'nabo', 'nabos': 'nabo',
                            'papa': 'papa', 'papas': 'papa',
                            'batata': 'batata', 'batatas': 'batata',
                            'choclo': 'choclo', 'maíz': 'choclo',
                            'arvejas': 'arvejas', 'habas': 'habas',
                            'porotos': 'porotos',
                            'romero': 'romero', 'tomillo': 'tomillo',
                            'orégano': 'orégano', 'oregano': 'orégano',
                            'menta': 'menta'
                          }
                          
                          const cultivosDeTemporada = new Set<string>()
                          cultivosEstacionales.forEach(nombreEstacional => {
                            const cultivoKey = mapeoEstacional[nombreEstacional.toLowerCase()]
                            if (cultivoKey) cultivosDeTemporada.add(cultivoKey)
                          })
                          
                          // Obtener todos los cultivos disponibles
                          const todosCultivos = Object.entries(cultivosDatabase).map(([key, data]) => ({
                            key: key as CultivoKey,
                            data,
                            esTemporada: cultivosDeTemporada.has(key)
                          }))
                          
                          // Ordenar: temporada primero, luego alfabético
                          todosCultivos.sort((a, b) => {
                            if (a.esTemporada && !b.esTemporada) return -1
                            if (!a.esTemporada && b.esTemporada) return 1
                            return a.data.nombre.localeCompare(b.data.nombre)
                          })
                          
                          const cultivosActuales = Array.isArray(parcelaEdit.cultivo) 
                            ? parcelaEdit.cultivo 
                            : parcelaEdit.cultivo ? [parcelaEdit.cultivo] : []
                          
                          return (
                            <div className="space-y-1">
                              {todosCultivos.map(({ key, data, esTemporada }) => (
                                <label
                                  key={key}
                                  className={`flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer ${
                                    esTemporada ? 'bg-blue-50 hover:bg-blue-100' : ''
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={cultivosActuales.includes(key)}
                                    onChange={(e) => {
                                      const newCultivos = e.target.checked
                                        ? [...cultivosActuales, key]
                                        : cultivosActuales.filter(c => c !== key)
                                      setParcelaEdit(prev => ({ ...prev, cultivo: newCultivos }))
                                    }}
                                    className="w-4 h-4 text-leaf-green border-gray-300 rounded focus:ring-leaf-green"
                                  />
                                  <span className="text-xl">{data.icono}</span>
                                  <span className="flex-1 text-sm text-gray-900">
                                    {data.nombre}
                                    {esTemporada && <span className="ml-2 text-xs">⭐</span>}
                                  </span>
                                  <span className="text-xs text-gray-500">{data.distancia}cm</span>
                                </label>
                              ))}
                            </div>
                          )
                        })()}
                      </div>
                      
                      {/* Resumen de cultivos seleccionados */}
                      {(() => {
                        const cultivosActuales = Array.isArray(parcelaEdit.cultivo) 
                          ? parcelaEdit.cultivo 
                          : parcelaEdit.cultivo ? [parcelaEdit.cultivo] : []
                        
                        if (cultivosActuales.length > 0) {
                          return (
                            <div className="mt-3 bg-leaf-green/10 border border-leaf-green/30 rounded-lg p-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium text-soil-dark">Seleccionados:</span>
                                {cultivosActuales.map(cultKey => {
                                  const cultData = cultivosDatabase[cultKey as CultivoKey]
                                  return cultData ? (
                                    <span key={cultKey} className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded-full text-xs border border-leaf-green/20">
                                      <span>{cultData.icono}</span>
                                      <span className="text-gray-900">{cultData.nombre}</span>
                                    </span>
                                  ) : null
                                })}
                              </div>
                            </div>
                          )
                        }
                        return null
                      })()}
                    </div>
                    
                    {/* Vista previa del cálculo */}
                    {parcelaEdit.largo && parcelaEdit.ancho && (
                      <div className="bg-leaf-green/10 rounded-lg p-4">
                        <h4 className="font-semibold text-soil-dark mb-2">Vista previa:</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Área total:</span>
                            <span className="font-bold text-leaf-green">
                              {(parseFloat(parcelaEdit.largo) * parseFloat(parcelaEdit.ancho)).toFixed(2)} m²
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Dimensiones:</span>
                            <span className="text-gray-800 font-medium">{parcelaEdit.largo} × {parcelaEdit.ancho} m</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={() => {
                        if (parcelaEdit.nombre && parcelaEdit.largo && parcelaEdit.ancho) {
                          const nuevaParcela = {
                            nombre: parcelaEdit.nombre,
                            largo: parseFloat(parcelaEdit.largo),
                            ancho: parseFloat(parcelaEdit.ancho),
                            cultivo: parcelaEdit.cultivo || []
                          }
                          
                          setFormData(prev => ({
                            ...prev,
                            parcelas: [...(prev.parcelas || []), nuevaParcela]
                          }))
                          
                          // Limpiar formulario
                          setParcelaEdit({
                            nombre: '',
                            largo: '',
                            ancho: '',
                            cultivo: []
                          })
                        }
                      }}
                      disabled={!parcelaEdit.nombre || !parcelaEdit.largo || !parcelaEdit.ancho}
                      className="w-full bg-leaf-green text-white px-4 py-3 rounded-lg hover:bg-leaf-green/90 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold"
                    >
                      {session ? '💾 Guardar Parcela' : '➕ Crear Parcela'}
                    </button>
                  </div>
                </div>
                
                {/* Lista de parcelas creadas */}
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-soil-dark mb-4">
                    📋 Tus Parcelas ({(formData.parcelas || []).length})
                  </h3>
                  
                  {(formData.parcelas || []).length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-3">🌱</div>
                      <p>Aún no has creado parcelas.</p>
                      <p className="text-sm">Usa el formulario de la izquierda para agregar tu primera parcela.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(formData.parcelas || []).map((parcela, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{parcela.nombre}</h4>
                              <p className="text-sm text-gray-600">
                                Cultivo{Array.isArray(parcela.cultivo) && parcela.cultivo.length > 1 ? 's' : ''}: {
                                  Array.isArray(parcela.cultivo) 
                                    ? parcela.cultivo.map(c => cultivosDatabase[c as CultivoKey]?.nombre || c).join(', ')
                                    : typeof parcela.cultivo === 'string' 
                                      ? parcela.cultivo.charAt(0).toUpperCase() + parcela.cultivo.slice(1).replace('-', ' ')
                                      : 'No asignado'
                                }
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  parcelas: (prev.parcelas || []).filter((_, i) => i !== index)
                                }))
                              }}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              🗑️
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-800 font-medium">Área:</span>
                              <div className="font-bold text-leaf-green">
                                {(parcela.largo * parcela.ancho).toFixed(2)} m²
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-800 font-medium">Dimensiones:</span>
                              <div className="font-semibold text-gray-900">
                                {parcela.largo} × {parcela.ancho} m
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Resumen total */}
                      <div className="bg-leaf-green/10 rounded-lg p-4 border-2 border-leaf-green/20">
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Área total de cultivo:</div>
                          <div className="text-xl font-bold text-leaf-green">
                            {(formData.parcelas || []).reduce((total, parcela) => 
                              total + (parcela.largo * parcela.ancho), 0
                            ).toFixed(2)} m²
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Paso 10: Resumen final */}
          {paso === 10 && (
            <div className="text-center">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-2xl font-bold text-soil-dark mb-4">
                ¡Tu huerta está lista para comenzar!
              </h2>
              
              <div className="bg-leaf-green/10 rounded-lg p-6 mb-8 text-left max-w-4xl mx-auto">
                <h3 className="font-semibold text-soil-dark mb-4">📋 Resumen de tu plan:</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Información del jardinero */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-leaf-green">👤</span>
                      <span className="text-gray-900"><strong>Jardinero:</strong> {formData.nombre} ({formData.experiencia})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-leaf-green">📏</span>
                      <span className="text-gray-900"><strong>Espacio:</strong> {formData.espacio}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-leaf-green">☀️</span>
                      <span className="text-gray-900"><strong>Luz:</strong> {formData.ubicacion}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-leaf-green">⏰</span>
                      <span className="text-gray-900"><strong>Tiempo:</strong> {formData.tiempo} por semana</span>
                    </div>
                  </div>
                  
                  {/* Parcelas creadas */}
                  <div>
                    <h4 className="font-semibold text-soil-dark mb-3 flex items-center gap-2">
                      <span className="text-leaf-green">🗂️</span>
                      Parcelas creadas ({(formData.parcelas || []).length})
                    </h4>
                    {(formData.parcelas || []).length === 0 ? (
                      <p className="text-sm text-gray-600 italic">No se crearon parcelas</p>
                    ) : (
                      <div className="space-y-2">
                        {(formData.parcelas || []).map((parcela, index) => {
                          const areaParcela = parcela.largo * parcela.ancho
                          const cultivosList = Array.isArray(parcela.cultivo) ? parcela.cultivo : []
                          
                          return (
                            <div key={index} className="bg-white rounded p-3 text-sm border border-gray-200">
                              <div className="mb-2">
                                <div className="font-semibold text-gray-900">{parcela.nombre}</div>
                                <div className="text-gray-600 text-xs">
                                  {parcela.largo} × {parcela.ancho} m = <span className="font-bold text-leaf-green">{areaParcela.toFixed(2)} m²</span>
                                </div>
                              </div>
                              
                              {cultivosList.length > 0 && (
                                <div className="space-y-1 mt-2 pt-2 border-t border-gray-100">
                                  <div className="text-xs font-semibold text-gray-700 mb-1">📊 Distribución recomendada:</div>
                                  {(() => {
                                    // Calcular área disponible por cultivo
                                    const areaPorCultivo = areaParcela / cultivosList.length
                                    
                                    return cultivosList.map(cultKey => {
                                      const cultData = cultivosDatabase[cultKey as CultivoKey]
                                      if (!cultData) return null
                                      
                                      // Calcular plantas para el área asignada
                                      const distanciaM = cultData.distancia / 100
                                      const plantasPorM2 = 1 / (distanciaM * distanciaM)
                                      let plantasRecomendadas = Math.floor(areaPorCultivo * plantasPorM2)
                                      
                                      // Ajustar cantidades según tipo de cultivo para que sea más realista
                                      // Aromáticas: máximo 10-15 plantas (no necesitas 200 plantas de perejil)
                                      if (cultData.categoria === 'Aromáticas') {
                                        plantasRecomendadas = Math.min(plantasRecomendadas, 10)
                                      }
                                      // Hojas verdes pequeñas: máximo 30-40 plantas
                                      else if (cultData.categoria === 'Hojas Verdes' && cultData.distancia <= 25) {
                                        plantasRecomendadas = Math.min(plantasRecomendadas, 35)
                                      }
                                      
                                      // Calcular área que realmente ocuparán
                                      const areaOcupada = (plantasRecomendadas * distanciaM * distanciaM)
                                      
                                      // Información de producción
                                      let infoProduccion = ''
                                      if (cultData.tipoCosecha === 'continua') {
                                        infoProduccion = `Producción continua`
                                      } else {
                                        const unidadesTotal = plantasRecomendadas * cultData.rendimiento
                                        infoProduccion = `≈${unidadesTotal} unidades`
                                      }
                                      
                                      return (
                                        <div key={cultKey} className="text-xs text-gray-900">
                                          <div className="flex items-center justify-between mb-0.5">
                                            <span className="font-medium">{cultData.icono} {cultData.nombre}</span>
                                            <span className="font-semibold text-leaf-green">{plantasRecomendadas} plantas</span>
                                          </div>
                                          <div className="text-gray-600 text-[10px] ml-5 flex justify-between">
                                            <span>{areaOcupada.toFixed(2)} m² ({cultData.distancia}cm entre plantas)</span>
                                            <span className="text-leaf-green/80">{infoProduccion}</span>
                                          </div>
                                        </div>
                                      )
                                    })
                                  })()}
                                </div>
                              )}
                            </div>
                          )
                        })}
                        <div className="bg-leaf-green/20 rounded p-2 text-sm text-center border-2 border-leaf-green/40">
                          <strong className="text-gray-900">Área total: {(formData.parcelas || []).reduce((total, parcela) => 
                            total + (parcela.largo * parcela.ancho), 0
                          ).toFixed(2)} m²</strong>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Advertencia para usuarios no autenticados */}
              {!session && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <h4 className="font-semibold text-amber-900 mb-1">¿Quieres guardar tu progreso?</h4>
                      <p className="text-sm text-amber-800 mb-3">
                        Crea una cuenta para guardar tus parcelas en la nube y acceder desde cualquier dispositivo.
                        También podrás continuar sin registrarte guardando localmente.
                      </p>
                      <Link
                        href="/auth/login"
                        className="inline-block bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm font-semibold"
                      >
                        📧 Crear cuenta o iniciar sesión
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <button
                  onClick={async () => {
                    try {
                      // Incluir parcelas creadas en el paso 8
                      const datosCompletos = {
                        ...formData,
                        parcelas_creadas_manual: formData.parcelas || [] // Parcelas del paso 8
                      }
                      
                      // Si está autenticado, guardar en BD
                      if (session?.user && (session.user as any)?.id) {
                        const response = await fetch('/api/onboarding', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            usuario_id: (session.user as any).id,
                            completado: true,
                            paso_actual: 9,
                            datos: datosCompletos
                          })
                        })
                        
                        const result = await response.json()

                        if (response.ok && result.success) {
                          const parcelasCreadas = result.parcelas_creadas?.length || 0
                          
                          // Guardar datos en localStorage para uso posterior
                          localStorage.setItem('greenrouse-onboarding', JSON.stringify(formData))
                          // Redirigir a parcelas con los datos usando Next.js router
                          router.push('/parcelas?from=onboarding')
                          if (parcelasCreadas > 0) {
                            alert(`¡Perfecto! Se han creado ${parcelasCreadas} parcela(s) basadas en tu configuración.`)
                          }
                          return
                        }
                      }
                      
                      // Si no está autenticado o falló, guardar localmente
                      localStorage.setItem('greenrouse-onboarding', JSON.stringify(datosCompletos))
                      localStorage.setItem('greenrouse-parcelas-temp', JSON.stringify(formData.parcelas || []))
                      
                      router.push('/parcelas?mode=local&from=onboarding')
                      
                    } catch {
                      // En caso de error, guardar localmente y continuar
                      const datosCompletos = {
                        ...formData,
                        parcelas_creadas_manual: formData.parcelas || []
                      }
                      localStorage.setItem('greenrouse-onboarding', JSON.stringify(datosCompletos))
                      localStorage.setItem('greenrouse-parcelas-temp', JSON.stringify(formData.parcelas || []))
                      router.push('/parcelas?mode=local&from=onboarding')
                    }
                  }}
                  className="bg-leaf-green text-white px-6 py-4 rounded-lg hover:bg-leaf-green/90 transition-colors font-semibold"
                >
                  {session ? '🌿 Crear Mis Parcelas' : '🌱 Continuar sin cuenta'}
                </button>
                <Link
                  href="/calculadora"
                  className="bg-sage-green text-white px-6 py-4 rounded-lg hover:bg-sage-green/90 transition-colors font-semibold text-center"
                >
                  🧮 Usar Calculadora
                </Link>
                <Link
                  href="/cursos"
                  className="border-2 border-leaf-green text-leaf-green px-6 py-4 rounded-lg hover:bg-leaf-green hover:text-white transition-colors font-semibold text-center"
                >
                  📚 Explorar Cursos
                </Link>
                <Link
                  href="/proveedores"
                  className="border-2 border-sage-green text-sage-green px-6 py-4 rounded-lg hover:bg-sage-green hover:text-white transition-colors font-semibold text-center"
                >
                  🏪 Buscar Proveedores
                </Link>
              </div>

              <p className="text-gray-600 text-sm">
                ¡Felicitaciones! Ya tienes todo listo para comenzar tu aventura en la agricultura orgánica.
              </p>
            </div>
          )}

          {/* Navegación */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={prevPaso}
              disabled={paso === 1}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>

            {paso < totalPasos ? (
              <button
                onClick={paso === 9 ? async () => {
                  // Función de guardar para el paso 9
                  try {
                    // Incluir parcelas creadas en el paso 9
                    const datosCompletos = {
                      ...formData,
                      parcelas_creadas_manual: formData.parcelas || []
                    }
                    
                    // Si está autenticado, guardar en BD
                    if (session?.user && (session.user as any)?.id) {
                      const response = await fetch('/api/onboarding', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          usuario_id: (session.user as any).id,
                          completado: false, // Aún no completado, solo guardando parcelas
                          paso_actual: 9,
                          datos: datosCompletos
                        })
                      })
                      
                      const result = await response.json()

                      if (response.ok && result.success) {
                        localStorage.setItem('greenrouse-onboarding', JSON.stringify(datosCompletos))
                        alert('✅ Parcelas guardadas correctamente')
                        nextPaso()
                        return
                      }
                    }
                    
                    // Si no está autenticado, solo guardar localmente y continuar
                    localStorage.setItem('greenrouse-onboarding', JSON.stringify(datosCompletos))
                    localStorage.setItem('greenrouse-parcelas-temp', JSON.stringify(formData.parcelas || []))
                    nextPaso()
                    
                  } catch {
                    // En caso de error, guardar localmente y continuar
                    const datosCompletos = {
                      ...formData,
                      parcelas_creadas_manual: formData.parcelas || []
                    }
                    localStorage.setItem('greenrouse-onboarding', JSON.stringify(datosCompletos))
                    localStorage.setItem('greenrouse-parcelas-temp', JSON.stringify(formData.parcelas || []))
                    nextPaso()
                  }
                } : nextPaso}
                disabled={
                  (paso === 1 && !formData.nombre) ||
                  (paso === 2 && !formData.experiencia) ||
                  (paso === 3 && !formData.espacio) ||
                  (paso === 4 && !formData.ubicacion) ||
                  (paso === 5 && formData.objetivos.length === 0) ||
                  (paso === 6 && !formData.tiempo) ||
                  (paso === 7 && !formData.pais) ||
                  (paso === 9 && (!formData.parcelas || formData.parcelas.length === 0))
                }
                className="px-6 py-2 bg-leaf-green text-white rounded-lg hover:bg-leaf-green/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {paso === 9 ? (session ? '💾 Guardar Parcelas' : '👁️ Mostrar Parcelas') : 'Siguiente →'}
              </button>
            ) : null}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}