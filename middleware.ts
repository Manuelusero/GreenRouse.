import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname, searchParams } = req.nextUrl
    
    console.log('🔍 [MIDDLEWARE] Procesando ruta:', pathname)
    
    // Eliminar excepción para parcelas - ya no debe haber redirección automática
    if (pathname.startsWith('/parcelas')) {
      console.log('🚫 [MIDDLEWARE] Acceso a /parcelas - pathname:', pathname)
      return NextResponse.next()
    }
    
    console.log('✅ [MIDDLEWARE] Permitiendo acceso a:', pathname)
    
    // Lógica adicional del middleware si es necesaria
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname, searchParams } = req.nextUrl
        
        console.log('🔐 [MIDDLEWARE AUTH] Verificando autorización:', {
          pathname,
          hasToken: !!token,
          userEmail: token?.email
        })
        
        // Permitir acceso a /parcelas con mode=local sin autenticación
        if (pathname.startsWith('/parcelas') && searchParams.get('mode') === 'local') {
          console.log('✅ [MIDDLEWARE AUTH] Permitiendo acceso a parcelas con mode=local')
          return true
        }
        
        // Rutas que requieren autenticación
        const protectedPaths = ['/parcelas', '/calendario', '/perfil']
        
        // Si está en una ruta protegida, verificar que tenga token
        if (protectedPaths.some(path => pathname.startsWith(path))) {
          const isAuthorized = !!token
          console.log('🔒 [MIDDLEWARE AUTH] Ruta protegida:', pathname, 'Autorizado:', isAuthorized)
          return isAuthorized
        }
        
        console.log('✅ [MIDDLEWARE AUTH] Ruta pública permitida:', pathname)
        
        // Para todas las demás rutas, permitir acceso
        return true
      }
    },
    pages: {
      signIn: '/auth/login',
    }
  }
)

// Configurar en qué rutas aplicar el middleware
export const config = {
  matcher: [
    '/parcelas/:path*',
    '/calendario/:path*', 
    '/perfil/:path*',
    '/api/parcelas/:path*',
    '/api/onboarding/:path*'
  ]
}