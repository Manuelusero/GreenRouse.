import { useAuthStore } from '@/stores'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

// Hook personalizado para manejar la autenticación con Zustand y NextAuth
export function useAuth() {
  const { data: session, status } = useSession()
  const {
    usuario,
    loading,
    error,
    preferencias,
    setUsuario,
    setLoading,
    setError,
    actualizarPerfil,
    actualizarPreferencias,
    toggleTema,
    toggleNotificaciones,
    isAuthenticated,
  } = useAuthStore()

  // Sincronizar el store de Zustand con la sesión de NextAuth
  useEffect(() => {
    if (status === 'loading') {
      setLoading(true)
      return
    }

    setLoading(false)

    if (session?.user) {
      setUsuario({
        id: (session.user as any)?.id || '',
        email: session.user.email || '',
        name: session.user.name || '',
        image: session.user.image || '',
      })
    } else {
      setUsuario(null)
    }
  }, [session, status, setUsuario, setLoading])

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Credenciales inválidas')
      }

      const data = await response.json()
      // NextAuth manejará la sesión automáticamente
      return data
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error de login')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      // NextAuth manejará el cierre de sesión automáticamente
    } catch {
      // silent
    }
  }

  const actualizarDatosPerfil = async (datos: any) => {
    return await actualizarPerfil(datos)
  }

  const cambiarTema = () => {
    toggleTema()
  }

  const cambiarNotificaciones = () => {
    toggleNotificaciones()
  }

  return {
    // Estado
    usuario,
    session,
    loading: loading || status === 'loading',
    error,
    preferencias,
    isAuthenticated: isAuthenticated() && !!session,
    
    // Acciones
    login,
    logout,
    actualizarPerfil: actualizarDatosPerfil,
    actualizarPreferencias,
    toggleTema: cambiarTema,
    toggleNotificaciones: cambiarNotificaciones,
  }
}
