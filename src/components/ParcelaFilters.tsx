'use client'

import { memo, useState } from 'react'
import { useParcelasStore } from '@/stores'

interface ParcelaFiltersProps {
  className?: string
}

function ParcelaFilters({ className = '' }: ParcelaFiltersProps) {
  const { filtros, setFiltros, limpiarFiltros } = useParcelasStore()
  const [localFilters, setLocalFilters] = useState(filtros)

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    setFiltros(newFilters)
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      estado: '',
      tipo: '',
      busqueda: '',
    }
    setLocalFilters(clearedFilters)
    limpiarFiltros()
  }

  const hasActiveFilters = Object.values(localFilters).some(value => value !== '')

  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Búsqueda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Búsqueda
          </label>
          <input
            type="text"
            value={localFilters.busqueda}
            onChange={(e) => handleFilterChange('busqueda', e.target.value)}
            placeholder="Buscar parcelas..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-leaf-green focus:border-transparent"
          />
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            value={localFilters.estado}
            onChange={(e) => handleFilterChange('estado', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-leaf-green focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="planificando">Planificando</option>
            <option value="preparando">Preparando</option>
            <option value="plantado">Plantado</option>
            <option value="creciendo">Creciendo</option>
            <option value="madurando">Madurando</option>
            <option value="cosecha">Cosecha</option>
          </select>
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            value={localFilters.tipo}
            onChange={(e) => handleFilterChange('tipo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-leaf-green focus:border-transparent"
          >
            <option value="">Todos los tipos</option>
            <option value="balcon">Balcón</option>
            <option value="patio">Patio</option>
            <option value="jardin">Jardín</option>
            <option value="terreno">Terreno</option>
            <option value="interior">Interior</option>
            <option value="exterior">Exterior</option>
            <option value="mixto">Mixto</option>
          </select>
        </div>

        {/* Botón limpiar */}
        <div className="flex items-end">
          <button
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
            className={`w-full px-4 py-2 rounded-md transition-colors ${
              hasActiveFilters
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-3 text-sm text-gray-600">
          Filtros activos: {Object.entries(localFilters)
            .filter(([_, value]) => value !== '')
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ')}
        </div>
      )}
    </div>
  )
}

export default memo(ParcelaFilters)
