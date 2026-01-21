import { lazy } from 'react'

// Lazy loading para componentes pesados
export const ParcelaVisualGrid = lazy(() => import('./ParcelaVisualGrid'))
export const ParcelasClient = lazy(() => import('./ParcelasClient'))
export const PerfilClient = lazy(() => import('./PerfilClient'))
export const RecomendacionesInteligentes = lazy(() => import('./RecomendacionesInteligentes'))
export const ParcelaTextoDistribucion = lazy(() => import('./ParcelaTextoDistribucion'))
export const ParcelaVisual = lazy(() => import('./ParcelaVisual'))
