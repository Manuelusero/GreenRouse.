'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import ParcelasList from '@/components/ParcelasList'
import { ParcelasListSkeleton } from '@/components/Skeletons'

interface ParcelasPageContentProps {
  userEmail: string
  localMode?: boolean
}

function ParcelasPageContent({ userEmail, localMode = false }: ParcelasPageContentProps) {
  const handleEditParcela = (_parcela: any) => {
    // Implementar modal de edición
  }

  const handleDeleteParcela = (_id: string) => {
    // Implementar confirmación de eliminación
  }

  const handleViewParcela = (_parcela: any) => {
    // Implementar vista detalle
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {localMode && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="font-semibold text-amber-800">Guardado localmente</p>
            <p className="text-sm text-amber-700 mt-0.5">
              Tus parcelas están guardadas solo en este dispositivo. Creá una cuenta para guardarlas en la nube y acceder desde cualquier lugar.
            </p>
          </div>
          <Link
            href="/auth/login"
            className="shrink-0 bg-amber-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors text-center"
          >
            Crear cuenta / Iniciar sesión
          </Link>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Parcelas</h1>
        <p className="text-gray-600">
          Gestiona y organiza todas tus parcelas de cultivo
        </p>
      </div>

      <Suspense fallback={<ParcelasListSkeleton />}>
        <ParcelasList
          userEmail={userEmail}
          localMode={localMode}
          onEditParcela={handleEditParcela}
          onDeleteParcela={handleDeleteParcela}
          onViewParcela={handleViewParcela}
        />
      </Suspense>
    </div>
  )
}

export default ParcelasPageContent
