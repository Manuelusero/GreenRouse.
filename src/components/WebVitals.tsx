'use client'

import { useEffect } from 'react'

interface WebVitalsProps {
  onMetric: (metric: any) => void
}

export function WebVitals({ onMetric }: WebVitalsProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Importar dinámicamente para evitar SSR issues
      import('web-vitals').then((webVitals: any) => {
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = webVitals
        getCLS(onMetric) // Cumulative Layout Shift
        getFID(onMetric) // First Input Delay
        getFCP(onMetric) // First Contentful Paint
        getLCP(onMetric) // Largest Contentful Paint
        getTTFB(onMetric) // Time to First Byte
      }).catch(error => {
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
