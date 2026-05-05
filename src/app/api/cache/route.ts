import { NextRequest, NextResponse } from 'next/server'
import CacheService from '@/lib/cache'
import Logger from '@/lib/logger'

// GET /api/cache/stats - Obtener estadísticas del caché
export async function GET(request: NextRequest) {
  try {
    const stats = await CacheService.getStats()
    const healthCheck = await CacheService.healthCheck()
    
    return NextResponse.json({
      cache: stats,
      health: healthCheck,
      timestamp: new Date().toISOString()
    })
  } catch (error: unknown) {
    Logger.error('GET /api/cache error', {
      error: error instanceof Error ? error.message : String(error)
    })
    return NextResponse.json({ 
      error: 'Error obteniendo estadísticas'
    }, { status: 500 })
  }
}

// DELETE /api/cache/clear - Limpiar todo el caché
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pattern = searchParams.get('pattern')
    
    if (pattern) {
      // Invalidar caché por patrón específico
      const success = await CacheService.invalidatePattern(pattern)
      
      return NextResponse.json({
        success,
        message: success ? `Caché invalidado para patrón: ${pattern}` : 'Error invalidando caché',
        pattern,
        timestamp: new Date().toISOString()
      })
    } else {
      // Limpiar todo el caché (solo para desarrollo/admin)
      const success = await CacheService.invalidatePattern('*')
      
      return NextResponse.json({
        success,
        message: success ? 'Todo el caché ha sido limpiado' : 'Error limpiando caché',
        timestamp: new Date().toISOString()
      })
    }
  } catch (error: unknown) {
    Logger.error('DELETE /api/cache error', {
      error: error instanceof Error ? error.message : String(error)
    })
    return NextResponse.json({ 
      error: 'Error limpiando caché'
    }, { status: 500 })
  }
}
