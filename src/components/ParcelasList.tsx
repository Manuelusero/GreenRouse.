'use client'

import { memo, useEffect } from 'react'
import { useParcelasStore } from '@/stores'
import ParcelaCard from './ParcelaCard'
import PaginationControls from './PaginationControls'
import ParcelaFilters from './ParcelaFilters'

interface ParcelasListProps {
  userEmail: string
  onEditParcela?: (parcela: any) => void
  onDeleteParcela?: (id: string) => void
  onViewParcela?: (parcela: any) => void
}

function ParcelasList({ 
  userEmail, 
  onEditParcela, 
  onDeleteParcela, 
  onViewParcela 
}: ParcelasListProps) {
  console.log('📧 ParcelasList recibió userEmail:', userEmail)
  
  const { 
    parcelas, 
    loading, 
    error, 
    fetchParcelas 
  } = useParcelasStore()

  // Efecto para cargar las parcelas cuando cambia el userEmail
  useEffect(() => {
    if (userEmail) {
      console.log('🌱 Cargando parcelas para:', userEmail)
      fetchParcelas(userEmail, 1, 10)
    }
  }, [userEmail]) // Solo dependemos de userEmail

  if (loading) {
    console.log('⏳ Cargando parcelas...')
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-leaf-green"></div>
        <span className="ml-2 text-gray-600">Cargando parcelas...</span>
      </div>
    )
  }

  if (error) {
    console.log('❌ Error cargando parcelas:', error)
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-red-500 mr-2">⚠️</div>
          <div>
            <h3 className="text-red-800 font-medium">Error al cargar las parcelas</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  console.log('📊 Parcelas cargadas:', parcelas.length, parcelas)

  if (parcelas.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-5xl mb-4">🌱</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes parcelas aún</h3>
        <p className="text-gray-600 mb-4">
          Comienza creando tu primera parcela para organizar tus cultivos
        </p>
        <button className="bg-leaf-green text-white px-6 py-2 rounded-lg hover:bg-sage-green transition-colors">
          Crear mi primera parcela
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ParcelaFilters />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parcelas.map((parcela) => (
          <ParcelaCard
            key={parcela._id}
            parcela={parcela}
            onEdit={onEditParcela}
            onDelete={onDeleteParcela}
            onView={onViewParcela}
          />
        ))}
      </div>

      <PaginationControls className="mt-8" />
    </div>
  )
}

export default memo(ParcelasList)
