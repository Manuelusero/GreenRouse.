---
mode: ask
description: Crea un nuevo modelo Mongoose siguiendo las convenciones de GreenRouse
---

Crea un nuevo modelo Mongoose llamado `${input:nombre_modelo}` en `src/models/${input:nombre_modelo}.ts`.

## Campos del modelo

${input:descripcion_campos}

## Requisitos obligatorios

1. **`{ timestamps: true }`** — SIEMPRE como segunda opción del Schema
2. **Guard de HMR** al final:
   ```typescript
   const ${input:nombre_modelo} = mongoose.models.${input:nombre_modelo} || mongoose.model('${input:nombre_modelo}', ${input:nombre_modelo}Schema)
   export default ${input:nombre_modelo}
   ```
3. **Índices compuestos** para todos los campos que se filtrarán juntos
4. **Validaciones en el Schema** (required, minLength, maxLength, enum, match)
5. **El identificador de usuario es `usuarioEmail: String`** — NO usar `usuario_id: ObjectId` en modelos nuevos
6. **`slug` debe ser `unique: true`** si el modelo tiene un campo slug
7. Usar `trim: true` en todos los campos de tipo String

## Índices típicos para este modelo

Basándome en el nombre y descripción, generar los índices que tendrían sentido para:
- Queries por usuario (`usuarioEmail`)
- Ordenamiento por fecha (`createdAt: -1`, `publishedAt: -1`)
- Búsqueda por campos únicos (`slug`)
- Filtros por campos de categoría/estado

## Crear seed script

¿También querés que cree un seed script en `scripts/seed${input:nombre_modelo}.ts` con datos de ejemplo? (sí/no)

Si sí, indicá cuántos registros de ejemplo: ${input:cantidad_seeds}
