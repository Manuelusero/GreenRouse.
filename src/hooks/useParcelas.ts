import { useParcelasStore } from '@/stores'
import { useEffect } from 'react'

// Hook personalizado para manejar las parcelas con Zustand
export function useParcelas(userId: string) {
  const {
    parcelas,
    loading,
    error,
    paginacion,
    filtros,
    fetchParcelas,
    crearParcela,
    actualizarParcela,
    eliminarParcela,
    setFiltros,
    cambiarPagina,
    limpiarFiltros,
  } = useParcelasStore()

  useEffect(() => {
    if (userId) {
      fetchParcelas(userId, paginacion.page, paginacion.limit)
    }
  }, [userId, paginacion.page, paginacion.limit])

  const refrescar = () => {
    if (userId) {
      fetchParcelas(userId, paginacion.page, paginacion.limit)
    }
  }

  const crearNuevaParcela = async (parcelaData: any) => {
    return await crearParcela(parcelaData)
  }

  const actualizarParcelaExistente = async (id: string, parcelaData: any) => {
    return await actualizarParcela(id, parcelaData)
  }

  const eliminarParcelaExistente = async (id: string) => {
    return await eliminarParcela(id)
  }

  const aplicarFiltros = (nuevosFiltros: any) => {
    setFiltros(nuevosFiltros)
    cambiarPagina(1) // Resetear a la primera página cuando se aplican filtros
  }

  return {
    // Datos
    parcelas,
    loading,
    error,
    paginacion,
    filtros,
    
    // Acciones
    refrescar,
    crearParcela: crearNuevaParcela,
    actualizarParcela: actualizarParcelaExistente,
    eliminarParcela: eliminarParcelaExistente,
    aplicarFiltros,
    cambiarPagina,
    limpiarFiltros,
  }
}
