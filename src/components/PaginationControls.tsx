'use client'

import { memo } from 'react'
import { useParcelasStore } from '@/stores'

interface PaginationControlsProps {
  className?: string
}

function PaginationControls({ className = '' }: PaginationControlsProps) {
  const { paginacion, cambiarPagina } = useParcelasStore()

  const { page, limit, total, totalPages, hasNext, hasPrev } = paginacion

  if (totalPages <= 1) return null

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      cambiarPagina(newPage)
    }
  }

  const renderPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm rounded-md transition-colors ${
            i === page
              ? 'bg-leaf-green text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          {i}
        </button>
      )
    }

    return pages
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="text-sm text-gray-700">
        Mostrando <span className="font-medium">{(page - 1) * limit + 1}</span> a{' '}
        <span className="font-medium">{Math.min(page * limit, total)}</span> de{' '}
        <span className="font-medium">{total}</span> resultados
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={!hasPrev}
          className={`px-3 py-2 text-sm rounded-md transition-colors ${
            hasPrev
              ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
        >
          Anterior
        </button>

        <div className="flex gap-1">
          {renderPageNumbers()}
        </div>

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={!hasNext}
          className={`px-3 py-2 text-sm rounded-md transition-colors ${
            hasNext
              ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}

export default memo(PaginationControls)
