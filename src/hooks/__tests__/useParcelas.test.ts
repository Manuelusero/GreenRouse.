import { renderHook, act } from '@testing-library/react'
import { useParcelas } from '@/hooks/useParcelas'
import { useParcelasStore } from '@/stores'

// Mock del store
jest.mock('@/stores')

const mockStore = useParcelasStore as jest.MockedFunction<typeof useParcelasStore>

describe('useParcelas Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debe inicializar con estado vacío', () => {
    mockStore.mockReturnValue({
      parcelas: [],
      loading: false,
      error: null,
      paginacion: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      filtros: {
        estado: 'todos',
        tipo: 'todos',
        busqueda: '',
      },
      fetchParcelas: jest.fn(),
      crearParcela: jest.fn(),
      actualizarParcela: jest.fn(),
      eliminarParcela: jest.fn(),
      setFiltros: jest.fn(),
      cambiarPagina: jest.fn(),
      limpiarFiltros: jest.fn(),
    })

    const { result } = renderHook(() => useParcelas('test@example.com'))

    expect(result.current.parcelas).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('debe fetch parcelas correctamente', async () => {
    const mockFetchParcelas = jest.fn()
    
    mockStore.mockReturnValue({
      parcelas: [
        { _id: '1', nombre: 'Parcela 1', area: 10 },
        { _id: '2', nombre: 'Parcela 2', area: 15 },
      ],
      loading: false,
      error: null,
      paginacion: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
      filtros: {
        estado: 'todos',
        tipo: 'todos',
        busqueda: '',
      },
      fetchParcelas: mockFetchParcelas,
      crearParcela: jest.fn(),
      actualizarParcela: jest.fn(),
      eliminarParcela: jest.fn(),
      setFiltros: jest.fn(),
      cambiarPagina: jest.fn(),
      limpiarFiltros: jest.fn(),
    })

    const { result } = renderHook(() => useParcelas('test@example.com'))

    await act(async () => {
      result.current.refrescar()
    })

    expect(mockFetchParcelas).toHaveBeenCalledWith('test@example.com', 1, 10)
  })

  it('debe manejar errores correctamente', () => {
    const mockError = new Error('Error de API')
    
    mockStore.mockReturnValue({
      parcelas: [],
      loading: false,
      error: mockError.message,
      paginacion: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      filtros: {
        estado: 'todos',
        tipo: 'todos',
        busqueda: '',
      },
      fetchParcelas: jest.fn(),
      crearParcela: jest.fn(),
      actualizarParcela: jest.fn(),
      eliminarParcela: jest.fn(),
      setFiltros: jest.fn(),
      cambiarPagina: jest.fn(),
      limpiarFiltros: jest.fn(),
    })

    const { result } = renderHook(() => useParcelas('test@example.com'))

    expect(result.current.error).toBe(mockError.message)
  })

  it('debe crear parcela correctamente', async () => {
    const mockCrearParcela = jest.fn()
    const newParcela = {
      nombre: 'Nueva Parcela',
      area: 20,
      cultivos: ['tomate', 'lechuga'],
    }

    mockStore.mockReturnValue({
      parcelas: [],
      loading: false,
      error: null,
      paginacion: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      filtros: {
        estado: 'todos',
        tipo: 'todos',
        busqueda: '',
      },
      fetchParcelas: jest.fn(),
      crearParcela: mockCrearParcela,
      actualizarParcela: jest.fn(),
      eliminarParcela: jest.fn(),
      setFiltros: jest.fn(),
      cambiarPagina: jest.fn(),
      limpiarFiltros: jest.fn(),
    })

    const { result } = renderHook(() => useParcelas('test@example.com'))

    await act(async () => {
      await result.current.crearParcela(newParcela)
    })

    expect(mockCrearParcela).toHaveBeenCalledWith(newParcela)
  })

  it('debe actualizar filtros correctamente', () => {
    const mockSetFiltros = jest.fn()
    
    mockStore.mockReturnValue({
      parcelas: [],
      loading: false,
      error: null,
      paginacion: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      filtros: {
        estado: 'todos',
        tipo: 'todos',
        busqueda: '',
      },
      fetchParcelas: jest.fn(),
      crearParcela: jest.fn(),
      actualizarParcela: jest.fn(),
      eliminarParcela: jest.fn(),
      setFiltros: mockSetFiltros,
      cambiarPagina: jest.fn(),
      limpiarFiltros: jest.fn(),
    })

    const { result } = renderHook(() => useParcelas('test@example.com'))

    act(() => {
      result.current.setFiltros({
        estado: 'activa',
        tipo: 'huerto',
        busqueda: 'tomate',
      })
    })

    expect(mockSetFiltros).toHaveBeenCalledWith({
      estado: 'activa',
      tipo: 'huerto',
      busqueda: 'tomate',
    })
  })

  it('debe cambiar página correctamente', () => {
    const mockCambiarPagina = jest.fn()
    
    mockStore.mockReturnValue({
      parcelas: [],
      loading: false,
      error: null,
      paginacion: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      filtros: {
        estado: 'todos',
        tipo: 'todos',
        busqueda: '',
      },
      fetchParcelas: jest.fn(),
      crearParcela: jest.fn(),
      actualizarParcela: jest.fn(),
      eliminarParcela: jest.fn(),
      setFiltros: jest.fn(),
      cambiarPagina: mockCambiarPagina,
      limpiarFiltros: jest.fn(),
    })

    const { result } = renderHook(() => useParcelas('test@example.com'))

    act(() => {
      result.current.cambiarPagina(2)
    })

    expect(mockCambiarPagina).toHaveBeenCalledWith(2)
  })
})
