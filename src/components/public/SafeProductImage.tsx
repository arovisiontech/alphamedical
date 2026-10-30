'use client'

import React, { useState } from 'react'
import Image from 'next/image'

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
  sizes,
  priority = false,
}: SafeProductImageProps) {
  const [hasError, setHasError] = useState(false)

  const rawSrc = hasError || !src || typeof src !== 'string' || !src.trim()
    ? DEFAULT_PRODUCT_FALLBACK
    : src.trim()

  // Base64 data URLs render most reliably with standard HTML <img> in Next.js without loader issues
  if (rawSrc.startsWith('data:')) {
    return (
      <img
        src={rawSrc}
        alt={alt || 'Product'}
        className={`${className} ${fill ? 'absolute inset-0 w-full h-full' : ''}`}
        onError={() => setHasError(true)}
        loading={priority ? 'eager' : 'lazy'}
      />
    )
  }

  return (
    <Image
      src={rawSrc}
      alt={alt || 'Product'}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      unoptimized
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setHasError(true)}
    />
  )
}

