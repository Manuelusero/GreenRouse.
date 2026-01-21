'use client'

import { memo } from 'react'
import { Parcela } from '@/stores'

interface ParcelaCardProps {
  parcela: Parcela
  onEdit?: (parcela: Parcela) => void
  onDelete?: (id: string) => void
  onView?: (parcela: Parcela) => void
}

function ParcelaCard({ parcela, onEdit, onDelete, onView }: ParcelaCardProps) {
  const handleEdit = () => {
    onEdit?.(parcela)
  }

  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la parcela "${parcela.nombre}"?`)) {
      onDelete?.(parcela._id)
    }
  }

  const handleView = () => {
    onView?.(parcela)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{parcela.nombre}</h3>
          {parcela.descripcion && (
            <p className="text-sm text-gray-600 mt-1">{parcela.descripcion}</p>
          )}
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          parcela.estado === 'planificando' ? 'bg-yellow-100 text-yellow-800' :
          parcela.estado === 'plantado' ? 'bg-green-100 text-green-800' :
          parcela.estado === 'creciendo' ? 'bg-blue-100 text-blue-800' :
          parcela.estado === 'madurando' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {parcela.estado}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Área:</span>
          <span className="font-medium">{parcela.area} m²</span>
        </div>
        <div className="flex justify-between">
          <span>Tipo:</span>
          <span className="font-medium">{parcela.tipo}</span>
        </div>
        <div className="flex justify-between">
          <span>Ubicación:</span>
          <span className="font-medium">{parcela.ubicacion}</span>
        </div>
        <div className="flex justify-between">
          <span>Riego:</span>
          <span className="font-medium">{parcela.riego}</span>
        </div>
      </div>

      {parcela.cultivos && parcela.cultivos.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Cultivos:</h4>
          <div className="flex flex-wrap gap-1">
            {parcela.cultivos.map((cultivo, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded"
              >
                {cultivo}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleView}
          className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
        >
          Ver
        </button>
        <button
          onClick={handleEdit}
          className="flex-1 bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600 transition-colors"
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}

export default memo(ParcelaCard)
