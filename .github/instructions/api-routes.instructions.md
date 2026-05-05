---
applyTo: "src/app/api/**"
---

# Instrucciones para API Routes — GreenRouse

Estos archivos son Route Handlers de Next.js 15 App Router. Seguir EXACTAMENTE el patrón establecido.

## Estructura obligatoria de un Route Handler

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

    // 1. Leer y validar parámetros
    const param = searchParams.get("param");
    if (!param) {
      return NextResponse.json(
        { error: "Parámetro requerido" },
        { status: 400 },
      );
    }

    // 2. Construir clave de caché
    const cacheKey = `resource:${param}`;
    const cached = await CacheService.get("namespace", cacheKey);
    if (cached) {
      const res = NextResponse.json(cached);
      res.headers.set("X-Cache", "HIT");
      return res;
    }

    // 3. Construir filtro MongoDB (siempre escapar strings para $regex)
    const filtro: Record<string, unknown> = {};

    // 4. Ejecutar query con lean() y Promise.all para paralelas
    const data = await ModelName.find(filtro).lean();

    // 5. Guardar en caché y responder
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

## Reglas fundamentales

### Exports

- Siempre exportar como `export const GET = withLogging(GET_handler)`
- NUNCA exportar el handler directamente sin `withLogging`
- Un archivo por recurso: `GET`, `POST`, `PUT`, `DELETE` en el mismo `route.ts`

### Seguridad — inputs del usuario

- NUNCA pasar input del usuario directamente a `$regex` — siempre escapar:
  ```typescript
  function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  filtro.nombre = { $regex: escapeRegex(busqueda), $options: "i" };
  ```
- Validar y sanitizar todos los parámetros de `searchParams` antes de usarlos
- Parsear números con `parseInt` y verificar `isNaN` antes de userels como límites

### MongoDB

- `await connectDB()` SIEMPRE al inicio del handler
- `.lean()` en todos los `find()` y `findOne()` de lectura
- `Promise.all([query1, query2])` cuando se necesiten múltiples queries
- Tipo de filtros: `Record<string, unknown>` — NO usar `any`
- El identificador de usuario es `usuarioEmail` (string) — NO usar `usuario_id` en modelos nuevos

### Caché

- SIEMPRE intentar leer caché antes de ir a MongoDB
- Namespace del caché = nombre del recurso en minúsculas (ej: `'parcelas'`, `'blog'`, `'cursos'`)
- TTL por defecto: 300 segundos (5 minutos)
- Header `X-Cache: HIT` cuando viene de caché, `X-Cache: MISS` cuando va a DB
- El CacheService falla silenciosamente si Redis no está configurado — no manejar ese error

### Error handling

- `catch (error: unknown)` — NUNCA `catch (error: any)`
- `error instanceof Error ? error.message : error` para extraer el mensaje
- `Logger.error()` antes de retornar el 500
- Status codes: 400 (input inválido), 401 (no auth), 404 (no encontrado), 500 (error interno)

### Logging

- NO usar `console.log` — usar `Logger.error()`, `Logger.info()`, `Logger.cache()`
- El `withLogging` ya loggea automáticamente request/response time — no duplicar

## Rutas dinámicas

Para `/api/blog/[slug]/route.ts`:

```typescript
export const GET = withLogging(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
  ) => {
    const { slug } = await params;
    // ...
  },
);
```

## Paginación estándar

```typescript
const page = parseInt(searchParams.get("page") || "1");
const limit = parseInt(searchParams.get("limit") || "10");

if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 100) {
  return NextResponse.json(
    { error: "Parámetros de paginación inválidos" },
    { status: 400 },
  );
}

const skip = (page - 1) * limit;
const [items, total] = await Promise.all([
  Model.find(filtro).skip(skip).limit(limit).lean(),
  Model.countDocuments(filtro),
]);
```
