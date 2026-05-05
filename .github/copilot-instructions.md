# GreenRouse — Copilot Instructions

## Qué es este proyecto

GreenRouse es una plataforma web para jardinería orgánica y permacultura en español, orientada al mercado latinoamericano (Argentina como mercado principal). Permite a los usuarios gestionar parcelas de cultivo, consultar una enciclopedia de verduras, calcular capacidad de siembra, leer artículos de blog y acceder a cursos de permacultura.

## Stack técnico (no cambiar sin consenso)

- **Framework**: Next.js 15.5 con App Router — NO usar Pages Router
- **Lenguaje**: TypeScript 5 estricto — NO usar `any` salvo excepción documentada
- **UI**: React 18 + Tailwind CSS 3 — NO agregar otras librerías de UI (no shadcn, no MUI)
- **Base de datos**: MongoDB vía Mongoose 8 — NO usar otros ORMs
- **Auth**: NextAuth v4 con Google + email/password — NO cambiar la estrategia de auth
- **Estado global**: Zustand v5 — NO usar Redux, Context API solo para auth (NextAuth)
- **Caché**: ioredis con fallback graceful cuando `REDIS_URL` no está configurado
- **Logging**: Winston estructurado (JSON) — NO usar `console.log` en componentes ni API routes de producción
- **Email**: Resend — NO configurar sin variable de entorno `RESEND_API_KEY`
- **Testing**: Jest 30 + Testing Library + Playwright
- **Deploy**: Vercel — tener en cuenta edge limits

## Estructura del proyecto

```
src/
  app/           # Next.js App Router — pages y API routes
    api/         # Solo Route Handlers (NextRequest/NextResponse)
    (pages)/     # Server Components por defecto, 'use client' solo si hay interactividad
  components/    # Componentes React reutilizables
  data/          # Datos estáticos tipados (cultivos.ts, verduras.ts)
  hooks/         # Custom hooks de React
  lib/           # Utilidades del servidor (auth, cache, logger, mongodb)
  models/        # Esquemas Mongoose
  stores/        # Stores de Zustand
  utils/         # Funciones auxiliares puras
```

## Convenciones de código

### Componentes React

- Los page.tsx son Server Components por defecto — NO marcar como `'use client'` salvo necesidad real
- Los componentes con estado, efectos o event handlers DEBEN tener `'use client'`
- Seguir el patrón Server Page → Client Component: la page.tsx hace el fetch/auth, pasa data al Client
- Usar `React.memo` en componentes que renderizan listas
- Lazy loading via `dynamic()` para componentes pesados (>50KB estimado)
- NO usar `window.dispatchEvent` custom events para comunicación — usar Zustand

### API Routes

- Siempre en `src/app/api/[recurso]/route.ts`
- Envolver todos los handlers con `withLogging` de `@/lib/loggingMiddleware`
- Patrón: handler interno (async function) wrapeado por `withLogging` en el export
- Usar `CacheService.get/set` de `@/lib/cache` — el servicio falla silenciosamente si Redis no está
- Queries: siempre usar `.lean()` para reads, `Promise.all()` para queries paralelas
- Siempre validar y **escapar** inputs del usuario antes de usarlos en `$regex` MongoDB
- Error handling: usar `catch (error: unknown)` y verificar con `instanceof Error`
- Headers de respuesta: agregar `X-Cache: HIT|MISS` y `X-Response-Time`

### Modelos Mongoose

- Siempre incluir `{ timestamps: true }` en el Schema
- Definir índices compuestos para todos los campos que se filtran juntos
- El campo `usuarioEmail` (string) es el identificador de usuario actual — `usuario_id` (ObjectId) es deuda técnica en Parcela, no usar en modelos nuevos
- Usar `lean()` en queries de lectura, NO en mutaciones
- Validar en el Schema (required, minLength, maxLength, enum) — no validar en el API handler duplicadamente

### Zustand stores

- `parcelasStore.ts`: estado de parcelas con devtools, SIN persist (datos del servidor)
- `authStore.ts`: estado de UI del perfil con devtools + persist en localStorage
- NO crear un store sin devtools
- Separar acciones de estado — las funciones async van en el store, no en los componentes

## Patrones establecidos (reproducir, no inventar)

### Patrón API Route completo

```typescript
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { ModelName } from "@/models/ModelName";
import CacheService from "@/lib/cache";
import Logger from "@/lib/logger";
import { withLogging } from "@/lib/loggingMiddleware";

const GET_handler = async (request: NextRequest) => {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);

    // Validar inputs
    const param = searchParams.get("param");

    // Construir filtro (escapar strings para $regex)
    const filtro: Record<string, unknown> = {};

    // Caché
    const cacheKey = `resource:${param}`;
    const cached = await CacheService.get("namespace", cacheKey);
    if (cached) {
      const res = NextResponse.json(cached);
      res.headers.set("X-Cache", "HIT");
      return res;
    }

    // Query
    const data = await ModelName.find(filtro).lean();

    await CacheService.set("namespace", cacheKey, data, 300);
    const res = NextResponse.json(data);
    res.headers.set("X-Cache", "MISS");
    return res;
  } catch (error: unknown) {
    Logger.error("GET /api/resource error", {
      error: error instanceof Error ? error.message : error,
    });
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
};

export const GET = withLogging(GET_handler);
```

### Escapado de inputs para $regex

```typescript
// SIEMPRE escapar antes de usar en $regex
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
// Uso:
filtro.$or = [{ nombre: { $regex: escapeRegex(busqueda), $options: "i" } }];
```

## Lo que NO hacer

- NO agregar IA/LLM (ni OpenAI, ni Anthropic, ni Vercel AI SDK) — decisión de producto
- NO agregar CMS externo (Sanity, Contentful, etc.)
- NO agregar pasarela de pagos por ahora
- NO eliminar la lógica de Redis cache — aunque Redis no esté configurado, el código debe quedar
- NO usar `console.log` en archivos bajo `src/` — usar `Logger` de `@/lib/logger`
- NO crear páginas de calendario — feature eliminada
- NO crear ni importar el componente `ChatVerduras` — feature eliminada
- NO usar `error: any` en catch — siempre `error: unknown`

## Variables de entorno requeridas

```
MONGODB_URI=          # MongoDB Atlas connection string
NEXTAUTH_SECRET=      # openssl rand -base64 32
NEXTAUTH_URL=         # https://tu-dominio.com (local: http://localhost:3000)
GOOGLE_CLIENT_ID=     # Google OAuth
GOOGLE_CLIENT_SECRET= # Google OAuth
REDIS_URL=            # Upstash Redis (opcional — hay fallback)
RESEND_API_KEY=       # Email (opcional por ahora)
```

## Comandos útiles

```bash
npm run dev          # Desarrollo local (puerto 3000)
npm run build        # Verificar build sin errores antes de PR
npm run test         # Jest tests
npm run test:e2e     # Playwright tests
npm run lint         # ESLint
```
