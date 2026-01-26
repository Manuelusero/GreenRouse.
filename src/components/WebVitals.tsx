'use client'

import { useEffect } from 'react'

interface WebVitalsProps {
  onMetric: (metric: any) => void
}

export function WebVitals({ onMetric }: WebVitalsProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Importar dinámicamente para evitar SSR issues
      import('web-vitals')
        .then((webVitalsModule) => {
          // Verificar que el módulo se cargó correctamente
          if (!webVitalsModule) {
            console.warn('Web vitals module not loaded')
            return
          }
          
          const webVitals = webVitalsModule as any
          const { getCLS, getFID, getFCP, getLCP, getTTFB } = webVitals
          
          // Verificar que las funciones existan antes de llamarlas
          if (typeof getCLS === 'function') getCLS(onMetric)
          if (typeof getFID === 'function') getFID(onMetric)
          if (typeof getFCP === 'function') getFCP(onMetric)
          if (typeof getLCP === 'function') getLCP(onMetric)
          if (typeof getTTFB === 'function') getTTFB(onMetric)
        })
        .catch((error) => {
          console.warn('Error loading web-vitals:', error)
        })
    }
  }, [onMetric])

  return null
}

// Función para enviar métricas al servidor
export function reportWebVitals(metric: any) {
  // Enviar a analytics endpoint
  fetch('/api/analytics/web-vitals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...metric,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    }),
  }).catch(console.error)
}

// Función para enviar a servicios externos (Google Analytics, Vercel, etc.)
export function reportToAnalytics(metric: any) {
  // Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.value),
      non_interaction: true,
    })
  }

  // Vercel Analytics
  if (typeof window !== 'undefined' && (window as any).va) {
    (window as any).va('track', 'Web Vitals', {
      metric: metric.name,
      value: metric.value,
      id: metric.id,
    })
  }
}
