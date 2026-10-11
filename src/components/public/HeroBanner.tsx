'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Target, Infinity, Sparkles } from 'lucide-react'
import { getStoredBanners, INITIAL_BANNERS_SEED } from '@/src/lib/dataStore'
import { BannerItem } from '@/src/types/banner'

export default function HeroBanner() {
  const [banners, setBanners] = useState<BannerItem[]>(INITIAL_BANNERS_SEED)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(true)

  // Load banners and subscribe to real-time updates from admin panel
  useEffect(() => {
    const loadBanners = () => {
      const allBanners = getStoredBanners()
      // Only show active banners, sorted by sort_order
      const active = allBanners
        .filter((b) => b.is_active !== false)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      
      setBanners(active.length > 0 ? active : allBanners)
      setIsLoaded(true)
    }

    loadBanners()

    // Real-time listener for admin changes
    const handleUpdate = () => {
      loadBanners()
    }

    window.addEventListener('alpha_content_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      window.removeEventListener('alpha_content_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  // Auto-play if multiple banners
  useEffect(() => {
    if (banners.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 6500)
    return () => clearInterval(interval)
  }, [banners.length])

  if (!isLoaded || banners.length === 0) {
    return (
      <div className="w-full bg-[#f8fafc] aspect-[1920/728] max-h-[728px] animate-pulse flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-[#B92025] animate-spin" />
          <span>Loading ALPHA Hero Showcase...</span>
        </div>
      </div>
    )
  }

  const currentBanner = banners[currentIndex] || banners[0]
  const isFullImage = currentBanner.display_mode !== 'overlay_text'

  return (
    <section className="relative w-full bg-[#ebebeb] overflow-hidden border-b border-slate-200 select-none">
      {/* 1. FULL IMAGE MODE (EXACT MATCH FOR SCREENSHOT 3 / IMAGE 372.JPG) */}
      {isFullImage ? (
        <div className="relative w-full aspect-[1920/728] min-h-[220px] sm:min-h-[320px] md:min-h-[440px] max-h-[728px]">
          <Link
            href={currentBanner.link_url || '/products?cat=surgical-instruments'}
            className="block w-full h-full relative group cursor-pointer"
            title={`${currentBanner.title} - Click to explore products`}
          >
            <Image
              src={currentBanner.image_url}
              alt={currentBanner.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
            />

            {/* Subtle Interactive Hover glow on "SHOP NOW" button region */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-red-950/5 via-transparent to-transparent" />
          </Link>

          {/* ACCESSIBLE / CLICKABLE ACTION BUTTON OVERLAY FOR MOBILE & TABLET */}
          <div className="absolute left-4 sm:left-12 md:left-24 bottom-4 sm:bottom-12 md:bottom-20 z-20 pointer-events-auto">
            <Link
              href={currentBanner.link_url || '/products?cat=surgical-instruments'}
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#B92025] hover:bg-[#96161B] text-white font-black px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3.5 rounded-md text-[11px] sm:text-xs md:text-sm tracking-wider uppercase transition-all shadow-xl hover:translate-y-[-2px] active:translate-y-0 group"
            >
              <span>{currentBanner.button_text || 'SHOP NOW'}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      ) : (
        /* 2. OVERLAY TEXT MODE (FOR CUSTOM DYNAMIC ADMIN BANNERS) */
        <div className="relative w-full aspect-[1920/728] min-h-[420px] max-h-[728px] flex items-center">
          <Image
            src={currentBanner.image_url}
            alt={currentBanner.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent z-10" />

          <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-20 relative z-20 py-12">
            <div className="max-w-xl space-y-5">
              {currentBanner.tagline && (
                <div className="text-xs font-black uppercase tracking-widest text-[#B92025] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#B92025]" />
                  <span>{currentBanner.tagline}</span>
                </div>
              )}

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight">
                {currentBanner.title}
              </h1>

              {currentBanner.subtitle && (
                <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">
                  {currentBanner.subtitle}
                </p>
              )}

              <div className="pt-2">
                <Link
                  href={currentBanner.link_url || '/products'}
                  className="inline-flex items-center gap-2 bg-[#B92025] hover:bg-[#96161B] text-white font-extrabold px-8 py-3.5 rounded-md text-xs sm:text-sm tracking-wider uppercase transition-all shadow-xl hover:translate-y-[-2px]"
                >
                  <span>{currentBanner.button_text || 'SHOP NOW'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {currentBanner.badges && currentBanner.badges.length > 0 && (
                <div className="pt-6 flex flex-wrap items-center gap-6 text-[11px] font-bold text-slate-700 border-t border-slate-200">
                  {currentBanner.badges.map((badge, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#B92025]" />
                      <span>{badge}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CAROUSEL CONTROLS (IF MORE THAN 1 BANNER IS ACTIVE) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg border border-slate-200 z-30 transition-all hover:scale-110"
            title="Previous Banner"
          >
            <ChevronLeft className="w-5 h-5 text-slate-800" />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 hover:bg-white text-slate-900 flex items-center justify-center shadow-lg border border-slate-200 z-30 transition-all hover:scale-110"
            title="Next Banner"
          >
            <ChevronRight className="w-5 h-5 text-slate-800" />
          </button>

          {/* DOTS INDICATOR */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
            {banners.map((b, idx) => (
              <button
                key={b.id}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all rounded-full ${
                  currentIndex === idx ? 'w-6 h-2 bg-[#B92025]' : 'w-2 h-2 bg-white/70 hover:bg-white'
                }`}
                title={`Go to slide ${idx + 1}: ${b.title}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
