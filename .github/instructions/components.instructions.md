---
applyTo: "src/components/**"
---

# Instrucciones para Componentes React — GreenRouse

## Server vs Client Components

### Server Components (default — no marcar con nada)
- `page.tsx` y `layout.tsx` son Server Components por defecto
- Hacer fetch de datos y verificar auth en el Server Component
- Pasar datos como props al Client Component hijo
- NUNCA usar hooks (`useState`, `useEffect`, etc.) en Server Components

### Client Components (`'use client'` al tope del archivo)
- Obligatorio cuando el componente usa: hooks de React, event handlers, estado local, efectos
- Obligatorio cuando usa: `useSession`, `useRouter`, `usePathname`, cualquier hook de browser
- Todos los componentes en `src/components/` con interactividad deben tener `'use client'`

### Patrón establecido: Server Page → Client Component
```typescript
// src/app/parcelas/page.tsx (Server Component)
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ParcelasClient from '@/components/ParcelasClient'

export default async function ParcelasPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')
  
  return <ParcelasClient userEmail={session.user?.email ?? ''} />
}

// src/components/ParcelasClient.tsx (Client Component)
'use client'
export default function ParcelasClient({ userEmail }: { userEmail: string }) {
  // Toda la interactividad aquí
}
```

## Performance

### React.memo
Usar en componentes que renderizan listas o reciben props estables:
```typescript
const ParcelaCard = React.memo(function ParcelaCard({ parcela }: Props) {
  return (...)
})
```

### Lazy loading con dynamic()
Para componentes pesados que no son necesarios en el render inicial:
```typescript
import dynamic from 'next/dynamic'

const MonitoringDashboard = dynamic(() => import('./MonitoringDashboard'), {
  loading: () => <div className="animate-pulse h-64 bg-gray-100 rounded-lg" />,
  ssr: false  // solo si el componente usa APIs exclusivas del browser
})
```

## Reglas de comunicación entre componentes

- **Estado compartido** → Zustand store (parcelasStore, authStore)
- **Props normales** → pasar directamente padre → hijo
- **NO usar `window.dispatchEvent`** para comunicación — es frágil y dificulta el testing
- El Header ya usa `window.addEventListener('nombreActualizado')` para compatibilidad hacia atrás, 
  pero NO reproducir este patrón en componentes nuevos — usar Zustand

## Tailwind CSS

- Design tokens del proyecto definidos en `tailwind.config.js`:
  - `leaf-green` → color primario (verde hoja)
  - `earth-brown` → color terciario
  - Siempre preferir las clases de utilidad de Tailwind sobre estilos inline
- NO agregar `className` con valores hexadecimales — usar las clases de Tailwind
- Breakpoints: `sm:`, `md:`, `lg:` — mobile-first

## Hydration y SSR

- Usar el hook `useHydration()` de `@/hooks/useHydration` cuando se necesite evitar el mismatch de SSR/client en el Header
- Para estados que dependen de `window` o localStorage, verificar `isHydrated` antes de renderizar:
  ```typescript
  const isHydrated = useHydration()
  if (!isHydrated) return null // o un skeleton
  ```

## Skeletons y loading states

- Los componentes de carga están en `src/components/Skeletons.tsx`
- Usar `animate-pulse` de Tailwind para los placeholders
- Siempre mostrar un skeleton mientras se cargan datos en listas

## Imágenes

- Usar el componente `OptimizedImage` de `@/components/OptimizedImage` en lugar de `<img>` directamente
- O usar `next/image` con `width` y `height` explícitos
- Los emojis de cultivos son válidos como placeholder cuando no hay imagen real

## Accesibilidad

- Botones con solo íconos deben tener `aria-label`
- Imágenes deben tener `alt` descriptivo
- Formularios deben tener `<label>` asociados a los inputs

## Lo que NO hacer

- NO usar `console.log` en ningún componente — es código de producción
- NO importar `ChatVerduras` — ese componente está eliminado de la app
- NO crear páginas de calendario — feature eliminada
- NO agregar librerías de UI externas (shadcn, MUI, Chakra, etc.)
- NO hacer fetch directo desde Client Components con `useEffect` para datos iniciales — 
  preferir que la page.tsx (Server Component) haga el fetch y lo pase como props
