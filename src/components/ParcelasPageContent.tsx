'use client'

import { Suspense } from 'react'
import ParcelasList from '@/components/ParcelasList'
import { ParcelasListSkeleton } from '@/components/Skeletons'

interface ParcelasPageContentProps {
  userEmail: string
}

function ParcelasPageContent({ userEmail }: ParcelasPageContentProps) {
  console.log('📧 ParcelasPageContent recibió userEmail:', userEmail)
  
  const handleEditParcela = (parcela: any) => {
    // Lógica para editar parcela
    console.log('Editar parcela:', parcela)
  }

  const handleDeleteParcela = (id: string) => {
    // Lógica para eliminar parcela
    console.log('Eliminar parcela:', id)
  }

  const handleViewParcela = (parcela: any) => {
    // Lógica para ver parcela
    console.log('Ver parcela:', parcela)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Parcelas</h1>
        <p className="text-gray-600">
          Gestiona y organiza todas tus parcelas de cultivo
        </p>
      </div>

      <Suspense fallback={<ParcelasListSkeleton />}>
        <ParcelasList
          userEmail={userEmail}
          onEditParcela={handleEditParcela}
          onDeleteParcela={handleDeleteParcela}
          onViewParcela={handleViewParcela}
        />
      </Suspense>
    </div>
  )
}

export default ParcelasPageContent
