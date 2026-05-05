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
    if (status === 'loading') {
      return
    }

    if (status === 'authenticated' && session) {
      // Redirigir después de un breve delay para asegurar que la sesión esté lista
      setTimeout(() => {
        router.push(callbackUrl)
        router.refresh()
      }, 500)
    } else if (status === 'unauthenticated') {
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
