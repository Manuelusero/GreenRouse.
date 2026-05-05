---
mode: ask
description: Crea un nuevo componente React siguiendo las convenciones de GreenRouse
---

Crea un nuevo componente React llamado `${input:nombre_componente}` en `src/components/${input:nombre_componente}.tsx`.

## Descripción del componente

${input:descripcion}

## Props del componente

${input:props}

## Tipo de componente

¿Necesita estado, efectos o event handlers? ${input:necesita_interactividad}

- **Si SÍ** → agregar `'use client'` al inicio del archivo
- **Si NO** → dejar como Server Component (sin directiva)

## Requisitos obligatorios

1. **TypeScript estricto**: definir interface `Props` para todas las props — NO usar `any`
2. **Tailwind CSS únicamente** para estilos — NO agregar estilos inline ni librerías externas
3. **Si renderiza una lista** → usar `React.memo`
4. **NO usar `console.log`** — este es código de producción
5. **NO usar `window.dispatchEvent`** para comunicación — usar Zustand o props
6. **Accesibilidad**: botones con solo ícono deben tener `aria-label`

## Carga de datos

¿El componente necesita cargar datos del servidor?

- **Si SÍ y tiene `'use client'`** → usar el Zustand store correspondiente, no hacer fetch directamente
- **Si SÍ y es Server Component** → hacer fetch directamente con `await fetch()` o importando del modelo
- **Si NO** → recibir datos como props desde el page.tsx padre

## Loading state

Si necesita mostrar un estado de carga, usar los Skeletons existentes en `src/components/Skeletons.tsx`
o crear un placeholder con `animate-pulse` de Tailwind.

## Integración

¿Dónde va a ser usado este componente? ${input:donde_se_usa}
