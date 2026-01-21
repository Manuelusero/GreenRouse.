'use client'

import OptimizedImage from './OptimizedImage'

interface PlantImageProps {
  plantName: string
  emoji?: string
  size?: 'small' | 'medium' | 'large'
  className?: string
}

const plantImageMap: Record<string, string> = {
  'tomate': '/images/plants/tomate.jpg',
  'lechuga': '/images/plants/lechuga.jpg',
  'zanahoria': '/images/plants/zanahoria.jpg',
  'brócoli': '/images/plants/brocoli.jpg',
  'pimiento': '/images/plants/pimiento.jpg',
  'pepino': '/images/plants/pepino.jpg',
  'berenjena': '/images/plants/berenjena.jpg',
  'calabacín': '/images/plants/calabacin.jpg',
  'cebolla': '/images/plants/cebolla.jpg',
  'ajo': '/images/plants/ajo.jpg',
  'papa': '/images/plants/papa.jpg',
  'espinaca': '/images/plants/espinaca.jpg',
  'acelga': '/images/plants/acelga.jpg',
  'rúcula': '/images/plants/rucula.jpg',
  'cilantro': '/images/plants/cilantro.jpg',
  'perejil': '/images/plants/perejil.jpg',
  'albahaca': '/images/plants/albahaca.jpg',
  'tomillo': '/images/plants/tomillo.jpg',
  'orégano': '/images/plants/oregano.jpg',
  'romero': '/images/plants/romero.jpg',
  'menta': '/images/plants/menta.jpg',
  'salvia': '/images/plants/salvia.jpg',
  'lavanda': '/images/plants/lavanda.jpg',
  'fresa': '/images/plants/fresa.jpg',
  'frambuesa': '/images/plants/frambuesa.jpg',
  'arándano': '/images/plants/arandano.jpg',
  'manzana': '/images/plants/manzana.jpg',
  'pera': '/images/plants/pera.jpg',
  'naranja': '/images/plants/naranja.jpg',
  'limón': '/images/plants/limon.jpg',
  'mandarina': '/images/plants/mandarina.jpg',
}

const sizeConfig = {
  small: { width: 40, height: 40, className: 'rounded-md' },
  medium: { width: 80, height: 80, className: 'rounded-lg' },
  large: { width: 120, height: 120, className: 'rounded-xl' }
}

export default function PlantImage({ 
  plantName, 
  emoji, 
  size = 'medium', 
  className = '' 
}: PlantImageProps) {
  const config = sizeConfig[size]
  const imageSrc = plantImageMap[plantName.toLowerCase()]
  
  // Si no hay imagen disponible, usar emoji
  if (!imageSrc) {
    return (
      <div 
        className={`flex items-center justify-center bg-green-100 ${config.className} ${className}`}
        style={{ width: config.width, height: config.height }}
      >
        <span className="text-2xl">{emoji || '🌱'}</span>
      </div>
    )
  }

  return (
    <OptimizedImage
      src={imageSrc}
      alt={plantName}
      width={config.width}
      height={config.height}
      className={`${config.className} ${className}`}
      quality={85}
      placeholder="blur"
      sizes="(max-width: 768px) 40px, 80px"
    />
  )
}
