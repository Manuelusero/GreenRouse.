---
mode: ask
description: Crea un nuevo API Route completo siguiendo los patrones de GreenRouse
---

Crea un nuevo API Route Handler para el recurso `${input:nombre_recurso}` en `src/app/api/${input:nombre_recurso}/route.ts`.

## Requisitos obligatorios

1. **Importar y usar** `withLogging` de `@/lib/loggingMiddleware`
2. **Importar y usar** `CacheService` de `@/lib/cache` con namespace `'${input:nombre_recurso}'`
3. **Importar y usar** `Logger` de `@/lib/logger` — NO `console.log`
4. **Conectar a DB** con `await connectDB()` al inicio de cada handler
5. **Escapar strings** para `$regex` usando:
   ```typescript
   function escapeRegex(str: string): string {
     return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
   }
   ```
6. **Tipos**: `Record<string, unknown>` para filtros, NUNCA `any`
7. **Error handling**: `catch (error: unknown)` con `error instanceof Error` guard
8. **Headers**: `X-Cache: HIT` o `MISS`, y `X-Response-Time` (este lo agrega `withLogging` automáticamente)
9. **lean()** en todos los queries de lectura
10. **Promise.all()** si hay múltiples queries en paralelo

## Estructura esperada

```typescript
// Handler interno (no exportar directamente)
const GET_handler = async (request: NextRequest) => { ... }

// Export wrapeado
export const GET = withLogging(GET_handler)
export const POST = withLogging(POST_handler)  // si aplica
```

## Recursos del modelo

El modelo a usar se llama `${input:nombre_modelo}` y está en `src/models/${input:nombre_modelo}.ts`.

Si el modelo no existe todavía, pedime que lo cree primero usando el prompt `nuevo-modelo.prompt.md`.

## Parámetros de este endpoint

Describí los parámetros que debe aceptar este endpoint:
${input:descripcion_parametros}
