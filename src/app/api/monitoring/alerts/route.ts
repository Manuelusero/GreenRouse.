import { NextRequest, NextResponse } from 'next/server'
import Logger from '@/lib/logger'
import CacheService from '@/lib/cache'

// GET /api/monitoring/alerts - Obtener alertas activas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const severity = searchParams.get('severity') || 'all' // all, warning, critical

    // Mock de alertas para demo
    const mockAlerts = [
      {
        id: 'alert-001',
        type: 'performance',
        severity: 'warning',
        title: 'CLS elevado en móviles',
        description: 'Cumulative Layout Shift por encima de 0.25 en dispositivos móviles',
        metric: 'cls',
        value: 0.28,
        threshold: 0.25,
        affectedUsers: 245,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        url: '/api/analytics/web-vitals',
      },
      {
        id: 'alert-002',
        type: 'performance',
        severity: 'critical',
        title: 'TTFB elevado en Sudamérica',
        description: 'Time to First Byte por encima de 1800ms en usuarios de Sudamérica',
        metric: 'ttfb',
        value: 2100,
        threshold: 1800,
        affectedUsers: 189,
        region: 'south-america',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        url: '/api/analytics/web-vitals',
      },
      {
        id: 'alert-003',
        type: 'cache',
        severity: 'warning',
        title: 'Cache hit rate bajo',
        description: 'Hit rate de caché por debajo del 80%',
        metric: 'cache_hit_rate',
        value: 73,
        threshold: 80,
        affectedUsers: 'all',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: 'active',
        url: '/api/cache/stats',
      },
      {
        id: 'alert-004',
        type: 'error',
        severity: 'critical',
        title: 'Error rate elevado en API',
        description: 'Tasa de errores por encima del 5% en endpoints de parcelas',
        metric: 'error_rate',
        value: 7.2,
        threshold: 5,
        affectedUsers: 412,
        endpoint: '/api/parcelas',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        status: 'active',
        url: '/api/parcelas',
      },
    ]

    // Filtrar por severidad si es necesario
    const filteredAlerts = severity === 'all' 
      ? mockAlerts 
      : mockAlerts.filter(alert => alert.severity === severity)

    Logger.info('Monitoring alerts requested', { 
      severity, 
      count: filteredAlerts.length 
    })

    return NextResponse.json({
      alerts: filteredAlerts,
      summary: {
        total: filteredAlerts.length,
        critical: filteredAlerts.filter(a => a.severity === 'critical').length,
        warning: filteredAlerts.filter(a => a.severity === 'warning').length,
        active: filteredAlerts.filter(a => a.status === 'active').length,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error: unknown) {
    Logger.error('Error obteniendo alertas de monitoring', {
      error: error instanceof Error ? error.message : String(error),
    })

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/monitoring/alerts - Crear nueva alerta
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar datos mínimos
    if (!body.type || !body.severity || !body.title) {
      return NextResponse.json(
        { error: 'Datos de alerta inválidos' },
        { status: 400 }
      )
    }

    const newAlert = {
      id: `alert-${Date.now()}`,
      ...body,
      timestamp: new Date().toISOString(),
      status: 'active',
    }

    // Loggear nueva alerta
    Logger.warn('New monitoring alert created', {
      alertId: newAlert.id,
      type: newAlert.type,
      severity: newAlert.severity,
      title: newAlert.title,
    })

    // Aquí podrías:
    // - Enviar notificación a Slack
    // - Enviar email al equipo
    // - Crear incidente en PagerDuty
    // - Enviar a sistemas de monitoreo

    // Simular envío a Slack
    if (newAlert.severity === 'critical') {
      await sendSlackNotification(newAlert)
    }

    // Simular envío de email
    if (newAlert.severity === 'critical') {
      await sendEmailAlert(newAlert)
    }

    return NextResponse.json({
      success: true,
      alert: newAlert,
      message: 'Alerta creada exitosamente'
    })
  } catch (error: unknown) {
    Logger.error('Error creando alerta de monitoring', {
      error: error instanceof Error ? error.message : String(error),
    })

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/monitoring/alerts/[id] - Actualizar estado de alerta
export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<Record<string, string>> }
) {
  try {
    const resolvedParams = await params
    const { id } = resolvedParams
    const body = await request.json()
    
    Logger.info('Alert status updated', {
      alertId: id,
      newStatus: body.status,
      updatedBy: 'system',
    })

    return NextResponse.json({
      success: true,
      message: 'Alerta actualizada exitosamente'
    })
  } catch (error: unknown) {
    Logger.error('Error actualizando alerta', {
      error: error instanceof Error ? error.message : String(error),
    })

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Funciones auxiliares para notificaciones
async function sendSlackNotification(alert: any) {
  try {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL
    if (!webhookUrl) return

    const message = {
      text: `🚨 *Alerta Crítica: ${alert.title}*`,
      attachments: [
        {
          color: alert.severity === 'critical' ? 'danger' : 'warning',
          fields: [
            {
              title: 'Descripción',
              value: alert.description,
              short: false,
            },
            {
              title: 'Métrica',
              value: `${alert.metric}: ${alert.value}`,
              short: true,
            },
            {
              title: 'Usuarios afectados',
              value: alert.affectedUsers?.toString() || 'N/A',
              short: true,
            },
            {
              title: 'Tiempo',
              value: new Date(alert.timestamp).toLocaleString(),
              short: true,
            },
          ],
        },
      ],
    }

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    })

    Logger.info('Slack notification sent', { alertId: alert.id })
  } catch (error) {
    Logger.error('Error sending Slack notification', { error, alertId: alert.id })
  }
}

async function sendEmailAlert(alert: any) {
  try {
    // Aquí integrarías con tu servicio de email preferido
    // SendGrid, AWS SES, Resend, etc.
    
    Logger.info('Email alert sent', { 
      alertId: alert.id,
      to: 'devops@greenrouse.com'
    })
  } catch (error) {
    Logger.error('Error sending email alert', { error, alertId: alert.id })
  }
}
