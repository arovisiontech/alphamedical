import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface AlphaLogoProps {
  variant?: 'light' | 'dark'
  className?: string
  height?: number
  width?: number
}

export default function AlphaLogo({
  variant = 'light',
  className = '',
  height = 45,
  width = 180,
}: AlphaLogoProps) {
  const isDark = variant === 'dark'

  return (
    <Link href="/" className={`inline-flex items-center group transition-opacity hover:opacity-90 ${className}`}>
      <div className={`relative flex items-center justify-center p-1 rounded-lg ${isDark ? 'bg-white/90 shadow-sm' : ''}`}>
        <Image
          src="/logo5.svg"
          alt="ALPHA Wholesale Medical Supplies Logo"
          width={width}
          height={height}
          priority
          className="h-10 sm:h-12 w-auto object-contain"
        />
      </div>
    </Link>
  )
}
