'use client'

import React, { useState, useEffect } from 'react'

interface SafeProductImageProps {
  src?: string | null
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  sizes?: string
  priority?: boolean
}

export const DEFAULT_PRODUCT_FALLBACK = '/images/products/image-399.png'

export default function SafeProductImage({
  src,
  alt,
  fill = true,
  width,
  height,
  className = 'object-contain',
  priority = false,
}: SafeProductImageProps) {
  const sanitizeSrc = (input?: string | null): string => {
    if (!input || typeof input !== 'string') return DEFAULT_PRODUCT_FALLBACK
    const trimmed = input.trim()
    if (!trimmed || trimmed === 'null' || trimmed === 'undefined') return DEFAULT_PRODUCT_FALLBACK
    return trimmed
  }

  const [currentSrc, setCurrentSrc] = useState<string>(() => sanitizeSrc(src))

  useEffect(() => {
    setCurrentSrc(sanitizeSrc(src))
  }, [src])

  const handleError = () => {
    if (currentSrc !== DEFAULT_PRODUCT_FALLBACK) {
      setCurrentSrc(DEFAULT_PRODUCT_FALLBACK)
    }
  }

  return (
    <img
      key={currentSrc}
      src={currentSrc}
      alt={alt || 'Product'}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={`${className} ${fill ? 'absolute inset-0 w-full h-full object-contain' : ''}`}
      onError={handleError}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}


