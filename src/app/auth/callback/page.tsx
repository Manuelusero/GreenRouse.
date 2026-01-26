'use client'

import { useEffect, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthCallbackContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/perfil'

  useEffect(() => {
    console.log('🔍 [AUTH CALLBACK PAGE] useEffect:', {
      status,
      hasSession: !!session,
      callbackUrl,
      userEmail: session?.user?.email
    })

    if (status === 'loading') {
      console.log('⏳ [AUTH CALLBACK PAGE] Cargando sesión...')
      return
    }

    if (status === 'authenticated' && session) {
      console.log('✅ [AUTH CALLBACK PAGE] Autenticación exitosa, redirigiendo a:', callbackUrl)
      console.log('👤 [AUTH CALLBACK PAGE] Datos de sesión:', {
        email: session.user?.email,
        name: session.user?.name,
        userId: (session.user as any)?.id
      })
      // Redirigir después de un breve delay para asegurar que la sesión esté lista
      setTimeout(() => {
        console.log('🚀 [AUTH CALLBACK PAGE] Ejecutando redirección a:', callbackUrl)
        router.push(callbackUrl)
        router.refresh()
      }, 500)
    } else if (status === 'unauthenticated') {
      console.log('❌ [AUTH CALLBACK PAGE] No autenticado, redirigiendo a login')
      router.push('/auth/login')
    }
  }, [status, session, router, callbackUrl])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🌱</div>
        <h2 className="text-2xl font-bold text-soil-dark mb-2">
          {status === 'loading' ? 'Iniciando sesión...' : 'Redirigiendo...'}
        </h2>
        <p className="text-gray-600">Por favor espera un momento</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🌱</div>
          <h2 className="text-2xl font-bold text-soil-dark mb-2">
            Cargando...
          </h2>
          <p className="text-gray-600">Por favor espera un momento</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
