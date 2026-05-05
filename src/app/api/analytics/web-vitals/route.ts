import { NextRequest, NextResponse } from 'next/server'
import Logger from '@/lib/logger'

// POST /api/analytics/web-vitals - Recibir métricas de Web Vitals
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos mínimos
    if (!body.name || !body.value) {
      return NextResponse.json(
        { error: 'Métricas inválidas' },
        { status: 400 }
      )
    }

    // Loggear métricas
    Logger.performance('web_vitals_received', 0, {
      metric: body.name,
      value: body.value,
      id: body.id,
      url: body.url,
      userAgent: body.userAgent,
      timestamp: body.timestamp,
    })

    // Aquí podrías enviar a servicios externos:
    // - Google Analytics
    // - Vercel Analytics  
    // - DataDog
    // - Custom dashboard

    // Guardar en base de datos si es necesario
    // await WebVitalModel.create(body)

    return NextResponse.json({ 
      success: true,
      message: 'Métricas recibidas'
    })
  } catch (error: unknown) {
    Logger.error('Error procesando web vitals', {
      error: error instanceof Error ? error.message : String(error),
    })

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET /api/analytics/web-vitals - Obtener estadísticas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '24h' // 24h, 7d, 30d

    // Aquí podrías obtener métricas de la base de datos
    // const stats = await WebVitalModel.getStats(period)

    // Mock de estadísticas para demo
    const mockStats = {
      period,
      metrics: {
        lcp: { avg: 2.1, p50: 1.8, p95: 3.2 }, // Largest Contentful Paint
        fid: { avg: 45, p50: 30, p95: 80 },    // First Input Delay
        cls: { avg: 0.08, p50: 0.05, p95: 0.15 }, // Cumulative Layout Shift
        fcp: { avg: 1.2, p50: 1.0, p95: 1.8 },  // First Contentful Paint
        ttfb: { avg: 120, p50: 100, p95: 180 }, // Time to First Byte
      },
      performance: {
        score: 85, // Overall performance score
        good: 78,    // Percentage of good metrics
        needsImprovement: 22,
      },
      samples: 1250,
      lastUpdated: new Date().toISOString(),
    }

    Logger.info('Web vitals stats requested', { period })

    return NextResponse.json(mockStats)
  } catch (error: unknown) {
    Logger.error('Error obteniendo estadísticas de web vitals', {
      error: error instanceof Error ? error.message : String(error),
    })

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
