import { NextRequest, NextResponse } from 'next/server'
import CacheService from '@/lib/cache'

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
  } catch (error: any) {
    console.error('Error obteniendo estadísticas de caché:', error)
    return NextResponse.json({ 
      error: 'Error obteniendo estadísticas',
      details: error.message 
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
  } catch (error: any) {
    console.error('Error limpiando caché:', error)
    return NextResponse.json({ 
      error: 'Error limpiando caché',
      details: error.message 
    }, { status: 500 })
  }
}
