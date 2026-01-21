import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface Usuario {
  id: string
  email: string
  name: string
  image?: string
  experiencia?: string
  espacio?: string
  ubicacion?: string
  objetivos?: string[]
  tiempo?: string
  perfil?: {
    cultivos_preferidos: string[]
    notificaciones: boolean
    tema: 'claro' | 'oscuro'
  }
}

interface AuthState {
  // Estado de autenticación
  usuario: Usuario | null
  loading: boolean
  error: string | null
  
  // Estado de la sesión
  session: {
    status: 'loading' | 'authenticated' | 'unauthenticated'
    expires: string | null
  }
  
  // Preferencias de usuario
  preferencias: {
    tema: 'claro' | 'oscuro'
    notificaciones: boolean
    idioma: 'es' | 'en'
    moneda: 'EUR' | 'USD'
  }
  
  // Acciones de autenticación
  setUsuario: (usuario: Usuario | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSession: (session: Partial<AuthState['session']>) => void
  
  // Acciones de preferencias
  setPreferencias: (preferencias: Partial<AuthState['preferencias']>) => void
  toggleTema: () => void
  toggleNotificaciones: () => void
  
  // Acciones de perfil
  actualizarPerfil: (datos: Partial<Usuario>) => Promise<boolean>
  actualizarPreferencias: (preferencias: Partial<AuthState['preferencias']>) => Promise<boolean>
  
  // Acciones de utilidad
  limpiarEstado: () => void
  isAuthenticated: () => boolean
  tieneRol: (rol: string) => boolean
}

const initialState = {
  usuario: null,
  loading: false,
  error: null,
  session: {
    status: 'loading' as const,
    expires: null,
  },
  preferencias: {
    tema: 'claro' as const,
    notificaciones: true,
    idioma: 'es' as const,
    moneda: 'EUR' as const,
  },
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // Setters básicos
        setUsuario: (usuario) => set({ usuario }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),
        setSession: (session) => 
          set((state) => ({
            session: { ...state.session, ...session }
          })),
        
        // Preferencias
        setPreferencias: (preferencias) => 
          set((state) => ({
            preferencias: { ...state.preferencias, ...preferencias }
          })),
        
        toggleTema: () => 
          set((state) => ({
            preferencias: {
              ...state.preferencias,
              tema: state.preferencias.tema === 'claro' ? 'oscuro' : 'claro'
            }
          })),
        
        toggleNotificaciones: () => 
          set((state) => ({
            preferencias: {
              ...state.preferencias,
              notificaciones: !state.preferencias.notificaciones
            }
          })),
        
        // Acciones de perfil
        actualizarPerfil: async (datos) => {
          const { usuario } = get()
          if (!usuario) return false
          
          set({ loading: true, error: null })
          
          try {
            const response = await fetch('/api/usuarios/perfil', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(datos),
            })
            
            if (!response.ok) {
              throw new Error(`Error: ${response.status}`)
            }
            
            const usuarioActualizado: Usuario = await response.json()
            
            set({
              usuario: { ...usuario, ...usuarioActualizado },
              loading: false,
            })
            
            return true
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              loading: false,
            })
            return false
          }
        },
        
        actualizarPreferencias: async (preferencias) => {
          const { usuario } = get()
          if (!usuario) return false
          
          set({ loading: true, error: null })
          
          try {
            const response = await fetch('/api/usuarios/preferencias', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(preferencias),
            })
            
            if (!response.ok) {
              throw new Error(`Error: ${response.status}`)
            }
            
            // Actualizar preferencias locales
            get().setPreferencias(preferencias)
            
            set({ loading: false })
            return true
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Error desconocido',
              loading: false,
            })
            return false
          }
        },
        
        // Utilidades
        limpiarEstado: () => set(initialState),
        
        isAuthenticated: () => {
          const { session } = get()
          return session.status === 'authenticated' && !!get().usuario
        },
        
        tieneRol: (rol: string) => {
          const { usuario } = get()
          if (!usuario) return false
          // Aquí podrías implementar lógica de roles más compleja
          return usuario.experiencia === rol
        },
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          preferencias: state.preferencias,
          usuario: state.usuario ? {
            id: state.usuario.id,
            email: state.usuario.email,
            name: state.usuario.name,
            image: state.usuario.image,
            experiencia: state.usuario.experiencia,
            espacio: state.usuario.espacio,
            ubicacion: state.usuario.ubicacion,
            objetivos: state.usuario.objetivos,
            tiempo: state.usuario.tiempo,
          } : null,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
)
