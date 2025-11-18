# 🌱 Sistema de Asociaciones de Plantas - GreenRouse

## 📋 Descripción

Este sistema permite gestionar asociaciones entre plantas, identificando qué plantas son compatibles (recomendadas) o incompatibles (no recomendadas) para cultivar juntas.

## 🗄️ Modelo de Datos

### PlantaAsociacion

```typescript
{
  slug: string              // Identificador único (ej: "tomate")
  nombre_mostrado: string   // Nombre para mostrar (ej: "Tomate")
  tipo: string             // "hortaliza" | "verdura" | "leguminosa" | "aromática" | "flor" | "frutal"
  temporada: string[]      // ["primavera", "verano", "otoño", "invierno"]
  recomendadas: string[]   // Slugs de plantas compatibles
  no_recomendadas: string[] // Slugs de plantas incompatibles
  descripcion?: string     // Descripción opcional
  createdAt: Date
  updatedAt: Date
}
```

## 🚀 Instalación

### 1. Instalar dependencia tsx (si no está instalada)

```bash
npm install -D tsx
```

### 2. Ejecutar el seed para poblar la base de datos

```bash
npm run seed:asociaciones
```

Este comando:

- ✅ Limpia la colección `plantas_asociaciones`
- ✅ Inserta 38 plantas con sus asociaciones
- ✅ Muestra estadísticas por tipo de planta

## 📡 API Endpoints

### 1. Obtener todas las asociaciones

**GET** `/api/asociaciones`

**Query Parameters:**

- `slug` - Filtrar por slug específico (ej: `tomate`)
- `tipo` - Filtrar por tipo (ej: `hortaliza`)
- `temporada` - Filtrar por temporada (ej: `primavera`)

**Ejemplos:**

```bash
# Obtener todas las plantas
GET /api/asociaciones

# Obtener información del tomate
GET /api/asociaciones?slug=tomate

# Obtener todas las aromáticas
GET /api/asociaciones?tipo=aromática

# Obtener plantas de primavera
GET /api/asociaciones?temporada=primavera
```

**Respuesta:**

```json
{
  "success": true,
  "count": 38,
  "data": [
    {
      "slug": "tomate",
      "nombre_mostrado": "Tomate",
      "tipo": "hortaliza",
      "temporada": ["primavera", "verano"],
      "recomendadas": ["albahaca", "zanahoria", "cebolla"],
      "no_recomendadas": ["patata", "hinojo"]
    }
  ]
}
```

### 2. Crear nueva asociación

**POST** `/api/asociaciones`

**Body:**

```json
{
  "slug": "puerro",
  "nombre_mostrado": "Puerro",
  "tipo": "hortaliza",
  "temporada": ["invierno", "primavera"],
  "recomendadas": ["zanahoria", "apio"],
  "no_recomendadas": ["judia"]
}
```

### 3. Obtener recomendaciones para cultivos

**POST** `/api/asociaciones/recomendaciones`

Este endpoint analiza los cultivos actuales de una parcela y devuelve:

- ✅ Plantas recomendadas para añadir
- ❌ Plantas que NO deberías añadir

**Body:**

```json
{
  "cultivos": ["tomate", "lechuga", "zanahoria"]
}
```

**Respuesta:**

```json
{
  "success": true,
  "cultivos_analizados": ["Tomate", "Lechuga", "Zanahoria"],
  "recomendadas": [
    {
      "slug": "albahaca",
      "nombre_mostrado": "Albahaca",
      "tipo": "aromática",
      "temporada": ["primavera", "verano"]
    },
    {
      "slug": "cebolla",
      "nombre_mostrado": "Cebolla",
      "tipo": "hortaliza",
      "temporada": ["invierno", "primavera"]
    }
  ],
  "no_recomendadas": [
    {
      "slug": "patata",
      "nombre_mostrado": "Patata",
      "tipo": "hortaliza",
      "temporada": ["primavera", "verano"]
    }
  ],
  "estadisticas": {
    "total_recomendadas": 12,
    "total_no_recomendadas": 5,
    "cultivos_analizados": 3
  }
}
```

## 💻 Uso en el Frontend

### Ejemplo: Mostrar recomendaciones en una parcela

```typescript
// En tu componente de parcela
async function obtenerRecomendaciones(cultivos: string[]) {
  const response = await fetch("/api/asociaciones/recomendaciones", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cultivos }),
  });

  const data = await response.json();

  if (data.success) {
    console.log("✅ Plantas recomendadas:", data.recomendadas);
    console.log("❌ Plantas NO recomendadas:", data.no_recomendadas);
  }
}

// Usar con los cultivos de la parcela
obtenerRecomendaciones(["tomate", "lechuga", "pepino"]);
```

### Ejemplo: Verificar compatibilidad al agregar planta

```typescript
async function verificarCompatibilidad(
  nuevaPlanta: string,
  cultivosActuales: string[]
) {
  const response = await fetch("/api/asociaciones/recomendaciones", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cultivos: cultivosActuales }),
  });

  const data = await response.json();

  // Verificar si la nueva planta está en las no recomendadas
  const esIncompatible = data.no_recomendadas.some(
    (p: any) => p.slug === nuevaPlanta.toLowerCase()
  );

  if (esIncompatible) {
    alert(`⚠️ ${nuevaPlanta} no es compatible con tus cultivos actuales`);
    return false;
  }

  // Verificar si está en las recomendadas
  const esRecomendada = data.recomendadas.some(
    (p: any) => p.slug === nuevaPlanta.toLowerCase()
  );

  if (esRecomendada) {
    console.log(`✅ ¡Excelente elección! ${nuevaPlanta} es compatible`);
  }

  return true;
}
```

## 📊 Estadísticas de la Base de Datos

Después de ejecutar el seed, tendrás:

- **Hortalizas**: 17 plantas
- **Aromáticas**: 12 plantas
- **Verduras**: 5 plantas
- **Flores**: 5 plantas
- **Leguminosas**: 1 planta
- **Frutales**: 1 planta

**Total**: 38 plantas con sus asociaciones completas

## 🎨 Ideas de Implementación en UI

1. **Panel de Recomendaciones en Parcela**

   - Mostrar sugerencias de plantas compatibles
   - Advertir sobre plantas incompatibles
   - Filtrar por temporada actual

2. **Indicador Visual al Agregar Plantas**

   - 🟢 Verde: Planta recomendada
   - 🟡 Amarillo: Neutral
   - 🔴 Rojo: No recomendada

3. **Sección "Plantas Compañeras"**

   - Mostrar las mejores asociaciones para cada cultivo
   - Explicar los beneficios de cada asociación

4. **Validación Automática**
   - Advertir al usuario antes de agregar plantas incompatibles
   - Sugerir alternativas compatibles

## 🔧 Mantenimiento

### Agregar nueva planta

```bash
# Opción 1: Via API
POST /api/asociaciones
{
  "slug": "nueva-planta",
  "nombre_mostrado": "Nueva Planta",
  "tipo": "hortaliza",
  "temporada": ["primavera"],
  "recomendadas": ["tomate"],
  "no_recomendadas": ["patata"]
}

# Opción 2: Modificar scripts/seedAsociaciones.ts y re-ejecutar
npm run seed:asociaciones
```

### Actualizar asociaciones

Modificar el array `plantasData` en `scripts/seedAsociaciones.ts` y ejecutar:

```bash
npm run seed:asociaciones
```

## 📝 Notas Importantes

- Los `slug` siempre se almacenan en minúsculas
- Las listas `recomendadas` y `no_recomendadas` usan slugs, no nombres completos
- El sistema previene conflictos: si una planta está en `no_recomendadas` de cualquier cultivo actual, no aparecerá en las recomendaciones
- Las temporadas ayudan a filtrar plantas apropiadas para la época del año

## 🐛 Solución de Problemas

### Error: "Cannot find module 'tsx'"

```bash
npm install -D tsx
```

### Error: "MONGODB_URI no definido"

Asegúrate de tener `.env.local` con:

```
MONGODB_URI=mongodb+srv://...
```

### Error: "Duplicate key error"

La colección ya existe. El seed la limpia automáticamente, pero si persiste:

```bash
# En MongoDB Compass o CLI, eliminar la colección:
db.plantas_asociaciones.drop()
```

## 🎯 Próximos Pasos

1. ✅ Integrar en el componente ParcelaVisual
2. ✅ Mostrar recomendaciones al editar parcela
3. ✅ Añadir tooltips con explicaciones de asociaciones
4. ✅ Implementar sistema de badges (compatible/incompatible)
5. ✅ Crear página de guía de asociaciones completa
