'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  fill?: boolean
  sizes?: string
  onLoad?: () => void
  onError?: () => void
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 80,
  placeholder = 'empty',
  blurDataURL,
  fill = false,
  sizes,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    setError(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setError(true)
    onError?.()
  }

  // Generar blur placeholder si no se proporciona
  const generateBlurDataURL = () => {
    if (blurDataURL) return blurDataURL
    
    // Placeholder simple para imágenes sin blur data
    return `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="14">
          Cargando...
        </text>
      </svg>`
    ).toString('base64')}`
  }

  // Si hay error, mostrar fallback
  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 text-gray-500 ${className}`}
        style={{ width: width || '100%', height: height || '300px' }}
      >
        <div className="text-center p-4">
          <div className="text-2xl mb-2">🖼️</div>
          <div className="text-sm">No se pudo cargar la imagen</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Cargando...</div>
        </div>
      )}
      
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={placeholder === 'blur' ? generateBlurDataURL() : undefined}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  )
}
