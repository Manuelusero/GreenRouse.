import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface Parcela {
  _id: string;
  nombre: string;
  descripcion?: string;
  area: number;
  cultivos: string[];
  tipo: string;
  ubicacion: string;
  clima: string;
  estado: string;
  riego: string;
  fechaSiembra: string;
  createdAt: string;
  updatedAt: string;
  generadoAutomaticamente: boolean;
  dimensiones?: {
    largo: number;
    ancho: number;
    area: number;
  };
  plantas_deseadas?: string[];
  configuracionInicial?: {
    generado_automaticamente: boolean;
    dificultad: string;
    tiempo_mantenimiento: string;
    categoria: string;
  };
}

export interface Usuario {
  id: string;
  email: string;
  name: string;
  image?: string;
  experiencia?: string;
  espacio?: string;
  ubicacion?: string;
  objetivos?: string[];
  tiempo?: string;
}

export interface PaginacionResponse {
  parcelas: Parcela[]
  total: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface ParcelasState {
  // Estado
  parcelas: Parcela[];
  parcelaActual: Parcela | null;
  loading: boolean;
  error: string | null;

  // Paginación
  paginacion: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };

  // Filtros
  filtros: {
    estado: string;
    tipo: string;
    busqueda: string;
  };

  // Acciones
  setParcelas: (parcelas: Parcela[]) => void;
  setParcelaActual: (parcela: Parcela | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Acciones de paginación
  setPaginacion: (paginacion: Partial<ParcelasState["paginacion"]>) => void;
  cambiarPagina: (page: number) => void;

  // Acciones de filtros
  setFiltros: (filtros: Partial<ParcelasState["filtros"]>) => void;
  limpiarFiltros: () => void;

  // Acciones CRUD
  fetchParcelas: (
    userId: string,
    page?: number,
    limit?: number,
  ) => Promise<void>;
  fetchParcela: (id: string) => Promise<void>;
  crearParcela: (parcelaData: Partial<Parcela>) => Promise<Parcela | null>;
  actualizarParcela: (
    id: string,
    parcelaData: Partial<Parcela>,
  ) => Promise<Parcela | null>;
  eliminarParcela: (id: string) => Promise<boolean>;

  // Acciones de utilidad
  refrescarParcelas: () => Promise<void>;
  limpiarEstado: () => void;
}

const initialState = {
  parcelas: [],
  parcelaActual: null,
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
    estado: "",
    tipo: "",
    busqueda: "",
  },
};

export const useParcelasStore = create<ParcelasState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Setters básicos
      setParcelas: (parcelas) => set({ parcelas }),
      setParcelaActual: (parcelaActual) => set({ parcelaActual }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      // Paginación
      setPaginacion: (nuevaPaginacion) =>
        set((state) => ({
          paginacion: { ...state.paginacion, ...nuevaPaginacion },
        })),

      cambiarPagina: (page) =>
        set((state) => ({
          paginacion: { ...state.paginacion, page },
        })),

      // Filtros
      setFiltros: (nuevosFiltros) =>
        set((state) => ({
          filtros: { ...state.filtros, ...nuevosFiltros },
        })),

      limpiarFiltros: () =>
        set({
          filtros: initialState.filtros,
          paginacion: { ...initialState.paginacion, page: 1 },
        }),

      // fetchParcelas con paginación
      fetchParcelas: async (userId, page = 1, limit = 10) => {
        const { filtros } = get();

        set({ loading: true, error: null });

        try {
          const params = new URLSearchParams({
            userId,
            page: page.toString(),
            limit: limit.toString(),
          });

          // Agregar filtros si existen
          if (filtros.estado) params.append("estado", filtros.estado);
          if (filtros.tipo) params.append("tipo", filtros.tipo);
          if (filtros.busqueda) params.append("busqueda", filtros.busqueda);

          const url = `/api/parcelas?${params}`

          const response = await fetch(url);

          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }

          const data = await response.json();

          set({
            parcelas: data.parcelas,
            paginacion: {
              page: data.pagination.page,
              limit,
              total: data.pagination.total,
              totalPages: data.pagination.totalPages,
              hasNext: data.pagination.hasNext,
              hasPrev: data.pagination.hasPrev,
            },
            loading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Error desconocido",
            loading: false,
          });
        }
      },

      fetchParcela: async (id: string) => {
        set({ loading: true, error: null });

        try {
          const response = await fetch(`/api/parcelas/${id}`);

          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }

          const parcela: Parcela = await response.json();
          set({ parcelaActual: parcela, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Error desconocido",
            loading: false,
          });
        }
      },

      crearParcela: async (parcelaData) => {
        set({ loading: true, error: null });

        try {
          const response = await fetch("/api/parcelas", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(parcelaData),
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }

          const nuevaParcela: Parcela = await response.json();

          set((state) => ({
            parcelas: [nuevaParcela, ...state.parcelas],
            loading: false,
          }));

          return nuevaParcela;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Error desconocido",
            loading: false,
          });
          return null;
        }
      },

      actualizarParcela: async (id: string, parcelaData) => {
        set({ loading: true, error: null });

        try {
          const response = await fetch(`/api/parcelas/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(parcelaData),
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }

          const parcelaActualizada: Parcela = await response.json();

          set((state) => ({
            parcelas: state.parcelas.map((p) =>
              p._id === id ? parcelaActualizada : p,
            ),
            parcelaActual:
              state.parcelaActual?._id === id
                ? parcelaActualizada
                : state.parcelaActual,
            loading: false,
          }));

          return parcelaActualizada;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Error desconocido",
            loading: false,
          });
          return null;
        }
      },

      eliminarParcela: async (id: string) => {
        set({ loading: true, error: null });

        try {
          const response = await fetch(`/api/parcelas/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }

          set((state) => ({
            parcelas: state.parcelas.filter((p) => p._id !== id),
            parcelaActual:
              state.parcelaActual?._id === id ? null : state.parcelaActual,
            loading: false,
          }));

          return true;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Error desconocido",
            loading: false,
          });
          return false;
        }
      },

      refrescarParcelas: async () => {
        const state = get();
        // Aquí necesitaríamos el userId, podríamos guardarlo en el store o pasarlo como parámetro
        // Por ahora, vamos a asumir que tenemos una forma de obtenerlo
        // await state.fetchParcelas(userId, state.paginacion.page, state.paginacion.limit)
      },

      limpiarEstado: () => set(initialState),
    }),
    {
      name: "parcelas-store",
    },
  ),
);
