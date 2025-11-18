import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname, searchParams } = req.nextUrl
    
    // Permitir acceso a /parcelas si viene con mode=local
    if (pathname.startsWith('/parcelas') && searchParams.get('mode') === 'local') {
      return NextResponse.next()
    }
    
    // Lógica adicional del middleware si es necesaria
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname, searchParams } = req.nextUrl
        
        // Permitir acceso a /parcelas con mode=local sin autenticación
        if (pathname.startsWith('/parcelas') && searchParams.get('mode') === 'local') {
          return true
        }
        
        // Rutas que requieren autenticación
        const protectedPaths = ['/parcelas', '/calendario', '/perfil']
        
        // Si está en una ruta protegida, verificar que tenga token
        if (protectedPaths.some(path => pathname.startsWith(path))) {
          return !!token
        }
        
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