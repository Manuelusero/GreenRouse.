import { memo } from 'react'

// Skeleton para la lista de parcelas
export const ParcelasListSkeleton = memo(() => {
  return (
    <div className="space-y-6">
      {/* Skeleton de filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Skeleton de tarjetas de parcelas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6">
            <div className="animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
              
              <div className="space-y-2 mb-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="flex gap-2">
                  {[...Array(3)].map((_, k) => (
                    <div key={k} className="h-6 bg-gray-200 rounded w-16"></div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                {[...Array(3)].map((_, k) => (
                  <div key={k} className="h-8 bg-gray-200 rounded flex-1"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Skeleton de paginación */}
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded w-48"></div>
        <div className="flex items-center gap-2">
          <div className="h-8 bg-gray-200 rounded w-20"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded w-8"></div>
          ))}
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  )
})

ParcelasListSkeleton.displayName = 'ParcelasListSkeleton'

// Skeleton para tarjeta individual
export const ParcelaCardSkeleton = memo(() => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
        
        <div className="space-y-2 mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>

        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 rounded w-16"></div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded flex-1"></div>
          ))}
        </div>
      </div>
    </div>
  )
})

ParcelaCardSkeleton.displayName = 'ParcelaCardSkeleton'

// Skeleton para formulario de parcela
export const ParcelaFormSkeleton = memo(() => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="animate-pulse space-y-6">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <div className="h-10 bg-gray-200 rounded w-24"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    </div>
  )
})

ParcelaFormSkeleton.displayName = 'ParcelaFormSkeleton'
