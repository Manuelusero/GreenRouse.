'use client'

import { useState, useEffect } from 'react'

interface MonitoringDashboardProps {
  className?: string
}

interface MetricData {
  lcp: { avg: number; p50: number; p95: number }
  fid: { avg: number; p50: number; p95: number }
  cls: { avg: number; p50: number; p95: number }
  fcp: { avg: number; p50: number; p95: number }
  ttfb: { avg: number; p50: number; p95: number }
}

interface PerformanceData {
  score: number
  good: number
  needsImprovement: number
}

export default function MonitoringDashboard({ className = '' }: MonitoringDashboardProps) {
  const [metrics, setMetrics] = useState<MetricData | null>(null)
  const [performance, setPerformance] = useState<PerformanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('24h')

  useEffect(() => {
    fetchMetrics()
  }, [period])

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics/web-vitals?period=${period}`)
      const data = await response.json()
      
      setMetrics(data.metrics)
      setPerformance(data.performance)
    } catch (error) {
      // silent failure — UI shows no data
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getMetricColor = (value: number, type: string) => {
    const thresholds = {
      lcp: { good: 2.5, poor: 4 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      fcp: { good: 1.8, poor: 3 },
      ttfb: { good: 800, poor: 1800 }
    }
    
    const threshold = thresholds[type as keyof typeof thresholds]
    if (value <= threshold.good) return 'text-green-600'
    if (value <= threshold.poor) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className={`p-6 bg-white rounded-lg shadow-lg ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-6 bg-white rounded-lg shadow-lg ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard de Performance</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="24h">Últimas 24 horas</option>
          <option value="7d">Últimos 7 días</option>
          <option value="30d">Últimos 30 días</option>
        </select>
      </div>

      {/* Performance Score */}
      {performance && (
        <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Score General</h3>
              <div className={`text-4xl font-bold ${getScoreColor(performance.score)}`}>
                {performance.score}/100
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                <span className="text-green-600">{performance.good}%</span> bueno
              </div>
              <div className="text-sm text-gray-600">
                <span className="text-yellow-600">{performance.needsImprovement}%</span> necesita mejorar
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Core Web Vitals */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* LCP - Largest Contentful Paint */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-3">LCP</h4>
            <div className="text-sm text-gray-600 mb-2">Largest Contentful Paint</div>
            <div className={`text-2xl font-bold ${getMetricColor(metrics.lcp.avg, 'lcp')}`}>
              {metrics.lcp.avg.toFixed(1)}s
            </div>
            <div className="text-xs text-gray-500 mt-1">
              P50: {metrics.lcp.p50.toFixed(1)}s | P95: {metrics.lcp.p95.toFixed(1)}s
            </div>
          </div>

          {/* FID - First Input Delay */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-3">FID</h4>
            <div className="text-sm text-gray-600 mb-2">First Input Delay</div>
            <div className={`text-2xl font-bold ${getMetricColor(metrics.fid.avg, 'fid')}`}>
              {metrics.fid.avg.toFixed(0)}ms
            </div>
            <div className="text-xs text-gray-500 mt-1">
              P50: {metrics.fid.p50.toFixed(0)}ms | P95: {metrics.fid.p95.toFixed(0)}ms
            </div>
          </div>

          {/* CLS - Cumulative Layout Shift */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-3">CLS</h4>
            <div className="text-sm text-gray-600 mb-2">Cumulative Layout Shift</div>
            <div className={`text-2xl font-bold ${getMetricColor(metrics.cls.avg, 'cls')}`}>
              {metrics.cls.avg.toFixed(3)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              P50: {metrics.cls.p50.toFixed(3)} | P95: {metrics.cls.p95.toFixed(3)}
            </div>
          </div>

          {/* FCP - First Contentful Paint */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-3">FCP</h4>
            <div className="text-sm text-gray-600 mb-2">First Contentful Paint</div>
            <div className={`text-2xl font-bold ${getMetricColor(metrics.fcp.avg, 'fcp')}`}>
              {metrics.fcp.avg.toFixed(1)}s
            </div>
            <div className="text-xs text-gray-500 mt-1">
              P50: {metrics.fcp.p50.toFixed(1)}s | P95: {metrics.fcp.p95.toFixed(1)}s
            </div>
          </div>

          {/* TTFB - Time to First Byte */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-3">TTFB</h4>
            <div className="text-sm text-gray-600 mb-2">Time to First Byte</div>
            <div className={`text-2xl font-bold ${getMetricColor(metrics.ttfb.avg, 'ttfb')}`}>
              {metrics.ttfb.avg.toFixed(0)}ms
            </div>
            <div className="text-xs text-gray-500 mt-1">
              P50: {metrics.ttfb.p50.toFixed(0)}ms | P95: {metrics.ttfb.p95.toFixed(0)}ms
            </div>
          </div>

          {/* Cache Performance */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-3">Cache</h4>
            <div className="text-sm text-gray-600 mb-2">Hit Rate</div>
            <div className="text-2xl font-bold text-green-600">
              87%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              1,245 hits | 185 misses
            </div>
          </div>
        </div>
      )}

      {/* Alertas */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">Alertas Activas</h4>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
            <span>CLS por encima del umbral en dispositivos móviles</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            <span>TTFB elevado en región Sudamérica</span>
          </div>
        </div>
      </div>
    </div>
  )
}
