'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Layers,
  ArrowUpRight,
} from 'lucide-react'
import { getStoredCategories, INITIAL_CATEGORIES_SEED } from '@/src/lib/dataStore'
import { CategoryItem } from '@/src/types/category'

export default function CategoriesCollection() {
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES_SEED)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  // Load categories and listen to real-time admin updates
  useEffect(() => {
    const loadCategories = () => {
      const stored = getStoredCategories()
      const active = stored
        .filter((c) => c.is_published !== false)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      setCategories(active.length > 0 ? active : stored)
    }

    loadCategories()

    const handleUpdate = () => {
      loadCategories()
    }

    window.addEventListener('alpha_content_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      window.removeEventListener('alpha_content_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  // Responsive items per view:
  // Mobile: 1.2, Tablet: 2, Laptop: 3, Desktop: 4, Ultra-wide (64 inch / 4K): 5-6
  const maxSlides = Math.max(0, categories.length - 1)

  // Slider navigation
  const handlePrev = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.firstElementChild?.clientWidth || 320
      sliderRef.current.scrollBy({ left: -(cardWidth + 24), behavior: 'smooth' })
    }
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : categories.length - 1))
  }

  const handleNext = () => {
    if (sliderRef.current) {
      const cardWidth = sliderRef.current.firstElementChild?.clientWidth || 320
      sliderRef.current.scrollBy({ left: cardWidth + 24, behavior: 'smooth' })
    }
    setCurrentIndex((prev) => (prev < categories.length - 1 ? prev + 1 : 0))
  }

  // Autoplay slider (pauses on hover)
  useEffect(() => {
    if (isHovered || categories.length <= 4) return
    const interval = setInterval(() => {
      handleNext()
    }, 4500)
    return () => clearInterval(interval)
  }, [isHovered, categories.length])

  return (
    <section
      className="py-14 sm:py-20 bg-gradient-to-b from-[#f8fafc] via-white to-[#f1f5f9] border-b border-slate-200 overflow-hidden relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* BACKGROUND SUBTLE MEDICAL AMBIENCE */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl pointer-events-none" />

      {/* CONTAINER OPTIMIZED FOR ALL SCREENS INCLUDING 64-INCH 4K DISPLAYS (up to 2400px) */}
      <div className="w-full max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] mx-auto px-4 sm:px-8 2xl:px-16 relative z-10">
        {/* SECTION HEADER & NAVIGATION CONTROLS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs 2xl:text-sm font-extrabold text-[#B92025] uppercase tracking-widest">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B92025]" />
              <span>EXPLORE SURGICAL DISCIPLINES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-[#18355E] tracking-tight">
              Categories Collection
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base font-medium max-w-2xl">
              Precision surgical instruments and specialty hospital equipment engineered for clinical excellence.
            </p>
          </div>

          {/* SLIDER NAVIGATION ARROWS */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="w-11 h-11 sm:w-12 sm:h-12 2xl:w-14 2xl:h-14 rounded-full bg-white hover:bg-[#B92025] text-slate-800 hover:text-white border border-slate-200 shadow-md flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group"
              title="Previous Category"
            >
              <ChevronLeft className="w-5 h-5 2xl:w-6 2xl:h-6 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <button
              onClick={handleNext}
              className="w-11 h-11 sm:w-12 sm:h-12 2xl:w-14 2xl:h-14 rounded-full bg-white hover:bg-[#B92025] text-slate-800 hover:text-white border border-slate-200 shadow-md flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group"
              title="Next Category"
            >
              <ChevronRight className="w-5 h-5 2xl:w-6 2xl:h-6 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* RESPONSIVE CATEGORIES SLIDER / CAROUSEL (SUPPORTS UP TO 64-INCH SCREENS) */}
        <div className="relative">
          <div
            ref={sliderRef}
            className="flex overflow-x-auto scroll-smooth scrollbar-none snap-x snap-mandatory gap-6 2xl:gap-8 pb-4 pt-1"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {categories.map((cat, idx) => {
              const cardImg = cat.card_image || cat.image_url || '/images/categories/image_376.png'
              const isOriginalSvgCard =
                cardImg.includes('376') ||
                cardImg.includes('377') ||
                cardImg.includes('378') ||
                cardImg.includes('379')

              return (
                <div
                  key={cat.id || idx}
                  className="w-[85%] sm:w-[48%] md:w-[31%] lg:w-[23.5%] 2xl:w-[23.5%] 3xl:w-[18.5%] shrink-0 group select-none snap-start"
                >
                  <Link
                    href={`/products?cat=${cat.slug}`}
                    className="block relative rounded-[28px] overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-200/80"
                  >
                    {/* CARD CONTAINER WITH EXACT 442x536 ASPECT RATIO */}
                    <div className="relative aspect-[442/536] w-full overflow-hidden bg-slate-900">
                      {/* CARD BACKGROUND IMAGE (image 376, 377, 378, 379) */}
                      <Image
                        src={cardImg}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 768px) 85vw, (max-width: 1280px) 30vw, (max-width: 2000px) 25vw, 20vw"
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        priority={idx < 4}
                      />

                      {/* FOR CARDS THAT DON'T HAVE EMBEDDED GRAPHIC ARCH, RENDER STYLED CURVED BOTTOM */}
                      {!isOriginalSvgCard && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                          <div className="absolute bottom-0 left-0 right-0 h-[42%] bg-[#800000] rounded-t-[40px] pointer-events-none" />
                          {cat.icon && (
                            <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white text-[#B92025] flex items-center justify-center text-xl font-bold shadow-xl border-2 border-[#B92025]">
                              {cat.icon}
                            </div>
                          )}
                        </>
                      )}

                      {/* OVERLAY CONTENT IN THE RED LOWER ARCH */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 2xl:p-7 text-center flex flex-col items-center justify-end z-20 pointer-events-none">
                        {/* CATEGORY TITLE */}
                        <h3 className="text-white font-black text-sm sm:text-base 2xl:text-lg uppercase tracking-wider leading-snug drop-shadow-md group-hover:text-amber-200 transition-colors">
                          {cat.name}
                        </h3>

                        {/* PRODUCT COUNT & SUBTITLE */}
                        <div className="mt-1 flex items-center gap-1.5 text-red-100/90 text-[11px] 2xl:text-xs font-semibold">
                          <span>{cat.product_count || 30}+ Premium Instruments</span>
                        </div>

                        {/* HOVER EXPLORE BUTTON */}
                        <div className="mt-3 inline-flex items-center gap-1.5 text-white bg-white/10 group-hover:bg-white group-hover:text-[#800000] px-4 py-1.5 rounded-full text-[11px] 2xl:text-xs font-extrabold uppercase tracking-wider transition-all duration-300 shadow">
                          <span>View Products</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>

        {/* BOTTOM DOT INDICATORS & BROWSE ALL LINK */}
        <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-2">
            {categories.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentIndex(dotIdx)}
                className={`transition-all rounded-full ${
                  currentIndex === dotIdx
                    ? 'w-8 h-2.5 bg-[#B92025]'
                    : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
                title={`Go to category slide ${dotIdx + 1}`}
              />
            ))}
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-xs 2xl:text-sm font-extrabold text-[#B92025] hover:text-[#96161B] uppercase tracking-wider group"
          >
            <span>Browse All Product Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
