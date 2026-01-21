import { NextRequest, NextResponse } from 'next/server'
import Logger from '@/lib/logger'

// Middleware de logging para API routes
export function withLogging(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const start = Date.now()
    const method = req.method
    const url = req.url
    const userAgent = req.headers.get('user-agent') || 'unknown'
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    
    // Log de request inicial
    Logger.http(`${method} ${url}`, {
      method,
      url,
      userAgent,
      ip,
      headers: Object.fromEntries(req.headers.entries()),
    })

    try {
      // Ejecutar el handler original
      const response = await handler(req)
      const duration = Date.now() - start
      
      // Log de éxito
      Logger.http(`${method} ${url} - ${response.status}`, {
        method,
        url,
        status: response.status,
        duration,
        userAgent,
        ip,
        success: true,
      })

      // Añadir headers de logging a la respuesta
      response.headers.set('X-Response-Time', `${duration}ms`)
      response.headers.set('X-Request-ID', Logger['generateRequestId']?.() || 'unknown')

      return response
    } catch (error) {
      const duration = Date.now() - start
      
      // Log de error
      Logger.error(`${method} ${url} - Error`, {
        method,
        url,
        duration,
        userAgent,
        ip,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        success: false,
      })

      // Retornar respuesta de error estandarizada
      return NextResponse.json(
        { 
          error: 'Error interno del servidor',
          requestId: Logger['generateRequestId']?.() || 'unknown',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      )
    }
  }
}

// Middleware específico para logging de caché
export function withCacheLogging(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const start = Date.now()
    
    try {
      const response = await handler(req)
      const duration = Date.now() - start
      
      // Verificar si la respuesta viene del caché
      const cached = response.headers.get('X-Cache') || 'MISS'
      
      Logger.cache('api_response', req.url, cached === 'HIT', {
        method: req.method,
        url: req.url,
        duration,
        cached,
      })

      return response
    } catch (error) {
      Logger.error('Cache logging error', {
        url: req.url,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      
      throw error
    }
  }
}

// Middleware para logging de acciones de usuario
export function withUserActionLogging(action: string) {
  return (handler: (req: NextRequest) => Promise<NextResponse>) => {
    return async (req: NextRequest) => {
      const userId = req.headers.get('x-user-id') || 'anonymous'
      
      Logger.userAction(action, userId, {
        method: req.method,
        url: req.url,
        userAgent: req.headers.get('user-agent') || 'unknown',
      })

      try {
        const response = await handler(req)
        
        Logger.userAction(`${action}_success`, userId, {
          method: req.method,
          url: req.url,
          status: response.status,
        })

        return response
      } catch (error) {
        Logger.userAction(`${action}_error`, userId, {
          method: req.method,
          url: req.url,
          error: error instanceof Error ? error.message : 'Unknown error',
        })

        throw error
      }
    }
  }
}

// Middleware para logging de base de datos
export function withDatabaseLogging(operation: string, collection: string) {
  return (handler: (req: NextRequest) => Promise<NextResponse>) => {
    return async (req: NextRequest) => {
      const start = Date.now()
      
      try {
        const response = await handler(req)
        const duration = Date.now() - start
        
        Logger.database(operation, collection, duration, {
          method: req.method,
          url: req.url,
        })

        return response
      } catch (error) {
        const duration = Date.now() - start
        
        Logger.database(`${operation}_error`, collection, duration, {
          method: req.method,
          url: req.url,
          error: error instanceof Error ? error.message : 'Unknown error',
        })

        throw error
      }
    }
  }
}

// Middleware combinado para logging completo
export function withFullLogging(
  operation: string,
  options: {
    cache?: boolean
    userAction?: boolean
    database?: { operation: string; collection: string }
  } = {}
) {
  let handler = async (req: NextRequest): Promise<NextResponse> => {
    return NextResponse.next()
  }

  // Aplicar logging base
  handler = withLogging(handler)

  // Aplicar logging de caché si es necesario
  if (options.cache) {
    handler = withCacheLogging(handler)
  }

  // Aplicar logging de acción de usuario si es necesario
  if (options.userAction) {
    handler = withUserActionLogging(operation)(handler)
  }

  // Aplicar logging de base de datos si es necesario
  if (options.database) {
    handler = withDatabaseLogging(options.database.operation, options.database.collection)(handler)
  }

  return handler
}
