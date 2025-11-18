'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Modal from './Modal'
import { useHydration } from '@/hooks/useHydration'
import { obtenerCultivosEstacionales } from '@/utils/geografia'

interface Parcela {
  _id?: string
  nombre: string
  area: number
  dimensiones?: {
    largo: number
    ancho: number
  }
  cultivos: string[]
  fechaSiembra: string
  estado: string
  riego: string
  usuarioEmail: string
}

interface ParcelasClientProps {
  parcelas: Parcela[]
  userEmail: string
}

export default function ParcelasClient({ parcelas: initialParcelas, userEmail }: ParcelasClientProps) {
  const [parcelas, setParcelas] = useState<Parcela[]>(initialParcelas)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  
  const searchParams = useSearchParams()
  const fromOnboarding = searchParams.get('from') === 'onboarding'
  const isHydrated = useHydration()

  useEffect(() => {
    if (fromOnboarding) {
      setShowSuccessMessage(true)
      // Ocultar mensaje después de 5 segundos
      const timer = setTimeout(() => {
        setShowSuccessMessage(false)
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [fromOnboarding])

  const handleCreateParcela = async (nuevaParcela: Omit<Parcela, '_id' | 'usuarioEmail'>) => {
    setIsLoading(true)
    console.log('🚀 Creando parcela con datos:', { ...nuevaParcela, usuarioEmail: userEmail })
    
    try {
      const response = await fetch('/api/parcelas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...nuevaParcela,
          usuarioEmail: userEmail,
        }),
      })

      console.log('📡 Response status:', response.status)
      
      if (response.ok) {
        const parcelaCreada = await response.json()
        console.log('✅ Parcela creada exitosamente:', parcelaCreada)
        setParcelas([...parcelas, parcelaCreada])
        setIsModalOpen(false)
      } else {
        const errorData = await response.json()
        console.error('❌ Error creando parcela:', response.status, errorData)
        alert(`Error: ${errorData.error || 'No se pudo crear la parcela'}`)
      }
    } catch (error) {
      console.error('💥 Error de red:', error)
      alert('Error de conexión. Verifica tu conexión a internet.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Mensaje de éxito del onboarding */}
      {showSuccessMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
          <div className="text-green-500 text-2xl">🎉</div>
          <div>
            <h3 className="text-green-800 font-semibold">¡Configuración completada!</h3>
            <p className="text-green-700 text-sm">Hemos creado tus parcelas automáticamente basadas en tu perfil. ¡Ya puedes comenzar a planificar tu huerta!</p>
          </div>
          <button 
            onClick={() => setShowSuccessMessage(false)}
            className="text-green-500 hover:text-green-700 ml-auto"
          >
            ×
          </button>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-soil-dark mb-2">Mis Parcelas</h1>
          <p className="text-gray-600">Gestiona tus cultivos y monitorea el progreso de tu huerta</p>
        </div>
        {parcelas.length === 0 ? (
          <Link 
            href="/comenzar"
            className="bg-leaf-green text-white px-6 py-3 rounded-lg hover:bg-sage-green transition-colors font-semibold"
          >
            🌱 Comenzar Huerta
          </Link>
        ) : (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-leaf-green text-white px-6 py-3 rounded-lg hover:bg-sage-green transition-colors font-semibold"
          >
            + Nueva Parcela
          </button>
        )}
      </div>

      {/* Estado vacío - Sin parcelas */}
      {parcelas.length === 0 ? (
        <div className="text-center py-16">
          {/* Ilustración de estado vacío */}
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-leaf-green/10 to-sage-green/10 rounded-full flex items-center justify-center">
            <div className="text-6xl">🌱</div>
          </div>
          
          {/* Mensaje principal */}
          <h2 className="text-2xl font-bold text-soil-dark mb-4">
            ¡Comienza tu huerta orgánica!
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Te ayudaremos a crear el perfil perfecto para tu huerta. Responde unas preguntas y comenzaremos a diseñar tu espacio de cultivo ideal.
          </p>
          
          {/* Botón de acción principal */}
          <Link 
            href="/comenzar"
            className="inline-block bg-leaf-green text-white px-8 py-4 rounded-lg hover:bg-sage-green transition-colors font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            � Comenzar Mi Huerta
          </Link>
          
          {/* Beneficios o tips */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-soil-dark mb-2">Monitoreo Completo</h3>
              <p className="text-gray-600 text-sm">
                Registra y supervisa el crecimiento de tus cultivos
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-3">💧</div>
              <h3 className="font-semibold text-soil-dark mb-2">Gestión de Riego</h3>
              <p className="text-gray-600 text-sm">
                Programa y controla el riego de cada parcela
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-3">🌿</div>
              <h3 className="font-semibold text-soil-dark mb-2">Cultivo Orgánico</h3>
              <p className="text-gray-600 text-sm">
                Técnicas naturales para una agricultura sostenible
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Grid de parcelas existentes */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parcelas.map((parcela) => (
            <div key={parcela._id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-leaf-green to-sage-green relative">
                <div className="absolute inset-0 earth-pattern opacity-20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-semibold">{parcela.nombre}</h3>
                  <p className="text-green-100">{parcela.area} m²</p>
                </div>
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                  parcela.estado === 'Creciendo' ? 'bg-yellow-100 text-yellow-800' :
                  parcela.estado === 'Plantado' ? 'bg-green-100 text-green-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {parcela.estado}
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="font-semibold text-soil-dark mb-2">Cultivos Actuales</h4>
                  <div className="flex flex-wrap gap-2">
                    {parcela.cultivos.map((cultivo, index) => (
                      <span key={index} className="bg-sage-green/10 text-sage-green px-3 py-1 rounded-full text-sm">
                        {cultivo}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Fecha de siembra:</span>
                    <span className="font-medium">
                      {isHydrated && parcela.fechaSiembra 
                        ? new Date(parcela.fechaSiembra).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long', 
                            day: 'numeric'
                          })
                        : parcela.fechaSiembra 
                          ? new Date(parcela.fechaSiembra).getFullYear().toString()
                          : 'No definida'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Riego:</span>
                    <span className="font-medium">{parcela.riego}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-6">
                  <Link 
                    href={`/parcelas/${parcela._id}`}
                    className="flex-1 bg-leaf-green text-white text-center py-2 rounded-lg hover:bg-sage-green transition-colors text-sm font-medium"
                  >
                    Ver Detalles
                  </Link>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear nueva parcela */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-soil-dark mb-6">🌱 Nueva Parcela</h2>
          <FormularioNuevaParcela 
            onSubmit={handleCreateParcela} 
            onCancel={() => setIsModalOpen(false)}
            isLoading={isLoading}
          />
        </div>
      </Modal>
    </main>
  )
}

// Componente del formulario
function FormularioNuevaParcela({ 
  onSubmit, 
  onCancel, 
  isLoading 
}: { 
  onSubmit: (parcela: Omit<Parcela, '_id' | 'usuarioEmail'>) => void
  onCancel: () => void
  isLoading: boolean
}) {
  const [formData, setFormData] = useState({
    nombre: '',
    largo: '',
    ancho: '',
    cultivos: '',
  })
  const [cultivosRecomendados, setCultivosRecomendados] = useState<string[]>([])
  const [paisUsuario, setPaisUsuario] = useState<string>('argentina') // Default

  // Obtener país del usuario y cultivos recomendados
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Primero obtener la sesión para tener el usuario_id
        const sessionResponse = await fetch('/api/auth/session')
        if (!sessionResponse.ok) {
          throw new Error('No se pudo obtener la sesión')
        }
        const session = await sessionResponse.json()
        const userEmail = session?.user?.email
        
        if (!userEmail) {
          throw new Error('No hay usuario autenticado')
        }

        // Obtener usuario para tener el _id
        const userResponse = await fetch(`/api/usuarios?email=${userEmail}`)
        if (!userResponse.ok) {
          throw new Error('No se pudo obtener el usuario')
        }
        const userData = await userResponse.json()
        const usuario_id = userData._id
        
        // Obtener onboarding del usuario
        const onboardingResponse = await fetch(`/api/onboarding?usuario_id=${usuario_id}`)
        if (onboardingResponse.ok) {
          const onboardingData = await onboardingResponse.json()
          const pais = onboardingData.data?.datos?.pais || 'argentina'
          setPaisUsuario(pais)
          
          // Obtener cultivos estacionales basados en el país
          const cultivos = obtenerCultivosEstacionales(pais)
          setCultivosRecomendados(cultivos)
        } else {
          // Si no hay onboarding, usar cultivos por defecto
          const cultivos = obtenerCultivosEstacionales('argentina')
          setCultivosRecomendados(cultivos)
        }
      } catch (error) {
        console.error('Error obteniendo datos del usuario:', error)
        // Default: cultivos de primavera/verano para Argentina
        const cultivos = obtenerCultivosEstacionales('argentina')
        setCultivosRecomendados(cultivos)
      }
    }
    fetchUserData()
  }, [])

  // Calcular área automáticamente
  const areaCalculada = formData.largo && formData.ancho 
    ? (parseFloat(formData.largo) * parseFloat(formData.ancho)).toFixed(2)
    : '0'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const largo = parseFloat(formData.largo)
    const ancho = parseFloat(formData.ancho)
    const area = largo * ancho
    
    onSubmit({
      nombre: formData.nombre,
      area: area,
      dimensiones: {
        largo: largo * 100, // Convertir a cm para guardar
        ancho: ancho * 100
      },
      cultivos: formData.cultivos.split(',').map(c => c.trim()).filter(c => c),
      fechaSiembra: new Date().toISOString().split('T')[0],
      estado: 'Preparando',
      riego: 'Diario'
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Nombre de la Parcela
        </label>
        <input
          type="text"
          required
          value={formData.nombre}
          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-green focus:border-transparent text-gray-900 placeholder-gray-500"
          placeholder="Ej: Parcela Norte"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Largo (metros)
          </label>
          <input
            type="number"
            required
            min="0.1"
            step="0.1"
            value={formData.largo}
            onChange={(e) => setFormData({...formData, largo: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-green focus:border-transparent text-gray-900 placeholder-gray-500"
            placeholder="5"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Ancho (metros)
          </label>
          <input
            type="number"
            required
            min="0.1"
            step="0.1"
            value={formData.ancho}
            onChange={(e) => setFormData({...formData, ancho: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-green focus:border-transparent text-gray-900 placeholder-gray-500"
            placeholder="5"
          />
        </div>
      </div>

      {/* Mostrar área calculada */}
      {formData.largo && formData.ancho && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Área Total Calculada:</span>
            <span className="text-2xl font-bold text-green-700">{areaCalculada} m²</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {formData.largo}m × {formData.ancho}m = {areaCalculada} m²
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          🌱 Cultivos Recomendados para tu ubicación (separados por coma)
        </label>
        <input
          type="text"
          value={formData.cultivos}
          onChange={(e) => setFormData({...formData, cultivos: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-green focus:border-transparent text-gray-900 placeholder-gray-500"
          placeholder={cultivosRecomendados.slice(0, 3).join(', ')}
        />
        {cultivosRecomendados.length > 0 && (
          <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs font-semibold text-green-800 mb-2">
              💡 Sugerencias para esta temporada:
            </p>
            <div className="flex flex-wrap gap-2">
              {cultivosRecomendados.map((cultivo) => (
                <button
                  key={cultivo}
                  type="button"
                  onClick={() => {
                    const currentCultivos = formData.cultivos ? formData.cultivos.split(',').map(c => c.trim()) : []
                    if (!currentCultivos.includes(cultivo)) {
                      const newCultivos = [...currentCultivos, cultivo].join(', ')
                      setFormData({...formData, cultivos: newCultivos})
                    }
                  }}
                  className="text-xs bg-white hover:bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-300 transition-colors capitalize"
                >
                  + {cultivo}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-800 font-semibold"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-leaf-green text-white px-4 py-3 rounded-lg hover:bg-sage-green transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Creando...' : 'Crear Parcela'}
        </button>
      </div>
    </form>
  )
}