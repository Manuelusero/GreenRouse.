---
applyTo: "src/stores/**"
---

# Instrucciones para Zustand Stores — GreenRouse

## Stores existentes

| Store | Archivo | Persist | Propósito |
|---|---|---|---|
| `parcelasStore` | `parcelasStore.ts` | NO | Estado de parcelas y paginación (datos del servidor) |
| `authStore` | `authStore.ts` | SÍ (localStorage) | Estado de UI del perfil del usuario |

## Estructura mínima de un store nuevo

```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface RecursoState {
  // Estado
  items: Item[]
  itemActual: Item | null
  loading: boolean
  error: string | null

  // Acciones síncronas
  setItems: (items: Item[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void

  // Acciones async (fetch al servidor)
  fetchItems: (param: string) => Promise<void>
}

const initialState = {
  items: [],
  itemActual: null,
  loading: false,
  error: null,
}

export const useRecursoStore = create<RecursoState>()(
  devtools(
    (set) => ({
      ...initialState,

      setItems: (items) => set({ items }, false, 'setItems'),
      setLoading: (loading) => set({ loading }, false, 'setLoading'),
      setError: (error) => set({ error }, false, 'setError'),
      reset: () => set(initialState, false, 'reset'),

      fetchItems: async (param) => {
        set({ loading: true, error: null }, false, 'fetchItems/start')
        try {
          const res = await fetch(`/api/resource?param=${encodeURIComponent(param)}`)
          if (!res.ok) throw new Error('Error al cargar los datos')
          const data = await res.json()
          set({ items: data, loading: false }, false, 'fetchItems/success')
        } catch (error: unknown) {
          set(
            { error: error instanceof Error ? error.message : 'Error desconocido', loading: false },
            false,
            'fetchItems/error'
          )
        }
      }
    }),
    { name: 'RecursoStore' }  // nombre visible en Redux DevTools
  )
)
```

## Reglas fundamentales

### devtools — SIEMPRE
- TODO store debe usar `devtools()` de `zustand/middleware`
- El `name` en `devtools({ name: 'NombreStore' })` debe ser descriptivo — se ve en Redux DevTools

### persist — solo para preferencias de UI
- `persist` de `zustand/middleware` solo para datos de **UI persistente** (preferencias, tema, nombre del perfil)
- NUNCA usar `persist` para datos que vienen del servidor (parcelas, artículos, etc.) — pueden quedar stale
- Cuando se usa `persist`, siempre especificar `storage: createJSONStorage(() => localStorage)`

### Acciones async en el store — no en los componentes
Las funciones que hacen `fetch` a la API van en el store, no en el componente:
```typescript
// ✅ Store tiene la lógica async
fetchParcelas: async (userId) => { ... }

// ✅ Componente solo llama al store
const { fetchParcelas } = useParcelasStore()
useEffect(() => { fetchParcelas(userEmail) }, [userEmail])

// ❌ No hacer fetch directamente en el componente
useEffect(() => {
  fetch('/api/parcelas').then(...)  // mover esto al store
}, [])
```

### Nombres de acciones en devtools
Usar el tercer argumento de `set()` para nombrar la acción — se ve en Redux DevTools:
```typescript
set({ loading: true }, false, 'fetchParcelas/start')
set({ parcelas: data }, false, 'fetchParcelas/success')
set({ error: msg }, false, 'fetchParcelas/error')
```

### Error handling en acciones async
```typescript
// Siempre: catch (error: unknown) — NUNCA any
} catch (error: unknown) {
  set({
    error: error instanceof Error ? error.message : 'Error desconocido',
    loading: false
  }, false, 'fetchItems/error')
}
```

### encodeURIComponent en fetch
Siempre encodear parámetros de URL:
```typescript
const res = await fetch(`/api/parcelas?userId=${encodeURIComponent(userId)}&page=${page}`)
```

## Acceder a múltiples valores del store

```typescript
// ✅ Selectores individuales para evitar re-renders innecesarios
const parcelas = useParcelasStore(state => state.parcelas)
const loading = useParcelasStore(state => state.loading)

// ✅ O desestructurar si se necesitan muchos valores (el store ya está memoizado por Zustand)
const { parcelas, loading, fetchParcelas } = useParcelasStore()
```
