---
applyTo: "src/models/**"
---

# Instrucciones para Modelos Mongoose — GreenRouse

## Estructura mínima de un modelo

```typescript
import mongoose from 'mongoose'

// 1. Definir el Schema con validaciones
const RecursoSchema = new mongoose.Schema(
  {
    // Identificador de usuario: SIEMPRE usuarioEmail (string) en modelos nuevos
    // NO usar usuario_id (ObjectId) — es deuda técnica del modelo Parcela
    usuarioEmail: {
      type: String,
      required: [true, 'El email del usuario es requerido'],
      index: true
    },
    
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      minLength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxLength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    
    estado: {
      type: String,
      enum: ['activo', 'inactivo', 'borrador'],
      default: 'activo'
    }
  },
  {
    timestamps: true  // OBLIGATORIO — agrega createdAt y updatedAt automáticamente
  }
)

// 2. Índices compuestos para todos los campos que se filtran juntos
RecursoSchema.index({ usuarioEmail: 1, estado: 1 })
RecursoSchema.index({ slug: 1 }, { unique: true })
RecursoSchema.index({ createdAt: -1 })

// 3. Export con guard para Hot Module Replacement (HMR)
const Recurso = mongoose.models.Recurso || mongoose.model('Recurso', RecursoSchema)
export default Recurso
```

## Reglas fundamentales

### `{ timestamps: true }` — SIEMPRE
Todo schema debe incluir `{ timestamps: true }` como segunda opción del Schema.
Esto agrega automáticamente `createdAt` y `updatedAt` y son necesarios para ordenar y auditar.

### Índices — OBLIGATORIO
Definir índices explícitos para:
- Campos usados en `filtro.campo = valor` (index simple)
- Combinaciones de campos usados juntos en queries (índice compuesto)
- Campos usados en `.sort()` (índice con orden)
- `slug` siempre debe ser `unique: true`

```typescript
// Ejemplos según el recurso
BlogArticuloSchema.index({ slug: 1 }, { unique: true })
BlogArticuloSchema.index({ tags: 1, publishedAt: -1 })
BlogArticuloSchema.index({ featured: 1, publishedAt: -1 })
```

### Validación en el Schema — no duplicar en el handler
Si un campo tiene restricciones, definirlas en el Schema con mensajes de error claros:
```typescript
contenido: {
  type: String,
  required: [true, 'El contenido es requerido'],
  minLength: [50, 'El contenido debe tener al menos 50 caracteres']
}
```
El API handler NO necesita re-validar lo que ya valida el Schema.

### Guard de Hot Module Replacement
```typescript
// SIEMPRE usar este patrón al final del archivo:
const ModelName = mongoose.models.ModelName || mongoose.model('ModelName', ModelNameSchema)
export default ModelName
```
Sin este guard, Next.js lanzará errores de "Cannot overwrite model once compiled" en desarrollo.

### identificador de usuario
- **Modelos nuevos**: usar `usuarioEmail: String` — es el estándar actual del proyecto
- **Modelo Parcela**: tiene tanto `usuarioEmail` como `usuario_id` por deuda técnica — no reproducir este patrón

## Tipos de campos comunes en GreenRouse

```typescript
// Slug generado desde el nombre
slug: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true,
  match: [/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones']
}

// Imagen opcional
imagen: {
  type: String,  // URL relativa o externa
  default: null
}

// Tags/categorías
tags: {
  type: [String],
  default: []
}

// Nivel de dificultad (patrón del proyecto)
nivel: {
  type: String,
  enum: ['principiante', 'intermedio', 'avanzado'],
  default: 'principiante'
}

// Bool para destacados
featured: {
  type: Boolean,
  default: false
}

// Fecha de publicación (para contenido)
publishedAt: {
  type: Date,
  default: Date.now
}
```

## Lean queries

- Usar `.lean()` en todas las queries de lectura (GET) — retorna POJO en vez de Mongoose Document, ~30% más rápido
- NO usar `.lean()` en mutaciones (save, updateOne, findOneAndUpdate) — necesitan el Document completo

```typescript
// ✅ Lectura — usar lean
const articulos = await BlogArticulo.find(filtro).lean()

// ✅ Escritura — sin lean
const articulo = await BlogArticulo.findOneAndUpdate(
  { slug },
  { $set: updates },
  { new: true }
)
```
