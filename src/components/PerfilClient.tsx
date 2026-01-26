'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function PerfilClient() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [hasUserEdited, setHasUserEdited] = useState(false)
  const [perfilCargado, setPerfilCargado] = useState(false)
  
  // Estado inicial para comparar cambios
  const [initialFormData, setInitialFormData] = useState({
    nombre: '',
    experiencia: ''
  })
  
  const [formData, setFormData] = useState({
    nombre: '',
    experiencia: ''
  })

  // Detectar si hay cambios sin guardar
  const hasUnsavedChanges = formData.nombre !== initialFormData.nombre || 
                           formData.experiencia !== initialFormData.experiencia

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    // Solo cargar perfil si está autenticado y aún no se ha cargado
    if (status === 'authenticated' && session?.user && !perfilCargado) {
      cargarPerfil()
    }
  }, [session, status, router, perfilCargado])

  const cargarPerfil = async () => {
    try {
      setIsLoading(true)
      
      // Intentar cargar desde localStorage primero
      if (session?.user?.email) {
        const savedProfile = localStorage.getItem(`perfil_${session.user.email}`)
        if (savedProfile) {
          const profileData = JSON.parse(savedProfile)
          const formData = {
            nombre: profileData.nombre || session?.user?.name || '',
            experiencia: profileData.experiencia || ''
          }
          setFormData(formData)
          setInitialFormData(formData)
          setPerfilCargado(true)
          return
        }
      }
      
      // Si no hay datos guardados, usar el nombre de Google
      const formData = {
        nombre: session?.user?.name || '',
        experiencia: ''
      }
      setFormData(formData)
      setInitialFormData(formData)
      setPerfilCargado(true)
      
    } catch (error) {
      console.log('Error cargando perfil, usando nombre de Google:', error instanceof Error ? error.message : String(error))
      // En caso de error, usar el nombre de Google
      const formData = {
        nombre: session?.user?.name || '',
        experiencia: ''
      }
      setFormData(formData)
      setInitialFormData(formData)
      setPerfilCargado(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user) return
    
    try {
      setIsSaving(true)
      
      // Guardar en localStorage como fallback mientras la API no funciona
      const profileData = {
        nombre: formData.nombre,
        experiencia: formData.experiencia,
        email: session.user.email,
        updatedAt: new Date().toISOString()
      }
      
      localStorage.setItem(`perfil_${session.user.email}`, JSON.stringify(profileData))
      
      // Actualizar el estado inicial para reflejar que no hay cambios pendientes
      setInitialFormData({
        nombre: formData.nombre,
        experiencia: formData.experiencia
      })
      
      // Notificar al Header sobre el cambio de nombre
      window.dispatchEvent(new CustomEvent('nombreActualizado', { 
        detail: { nombre: formData.nombre } 
      }))
      
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      
      // No hacer refresh - mantener la experiencia seleccionada visible
      
    } catch (error) {
      console.error('Error guardando perfil:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-leaf-green mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mensaje de éxito */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-green-500 mr-2">✅</div>
              <div>
                <h3 className="text-green-800 font-medium">¡Perfil guardado!</h3>
                <p className="text-green-600 text-sm">Tus datos han sido actualizados correctamente.</p>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje de bienvenida para nuevos usuarios */}
        {session?.user && !hasUserEdited && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="text-blue-500 text-2xl mr-3">👋</div>
              <div>
                <h2 className="text-blue-800 font-semibold text-lg">¡Bienvenido a GreenRouse!</h2>
                <p className="text-blue-600">Para personalizar tu experiencia, cuéntanos un poco sobre ti.</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información Personal */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-xl font-semibold text-soil-dark mb-6">Información Personal</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">¿Cómo te gusta que te llamen?</label>
              <input
                type="text"
                value={formData.nombre || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-leaf-green focus:border-transparent text-gray-900 bg-white placeholder:text-gray-400"
                placeholder="Tu nombre"
                autoComplete="name"
              />
            </div>
          </div>

          {/* Experiencia en Cultivo */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-xl font-semibold text-soil-dark mb-6">¿Cuál es tu experiencia con la jardinería?</h2>
            
            <div className="space-y-4">
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

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving || !hasUnsavedChanges}
              className={`px-6 py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2 ${
                !hasUnsavedChanges 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-leaf-green text-white hover:bg-sage-green'
              }`}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Guardando...</span>
                </>
              ) : !hasUnsavedChanges ? (
                <span>Sin cambios</span>
              ) : (
                <span>Guardar Cambios</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
