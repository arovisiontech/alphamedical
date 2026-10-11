'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, ShieldCheck, ArrowRight, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'

interface HeroSectionProps {
  onOpenSearch?: () => void
}

const HERO_SLIDES = [
  {
    title: 'Certified Medical & ICU Equipment Solutions',
    subtitle: 'High precision multiparameter monitors, ventilators, infusion pumps, and clinical life support systems for modern hospitals.',
    image: '/images/extracted/image_1.png',
    badge: 'ISO 13485 & CE Certified',
    primaryCtaText: 'Browse ICU Equipment',
    primaryCtaLink: '/categories/medical-equipment',
  },
  {
    title: 'Precision Surgical & Dissection Instruments',
    subtitle: 'Crafted from German & Japanese stainless steel. Superior heat treatment & nitric passivated for surgical longevity.',
    image: '/images/extracted/image_2.png',
    badge: 'Japanese AISI 420 Steel',
    primaryCtaText: 'View Surgical Tools',
    primaryCtaLink: '/categories/surgical-instruments',
  },
  {
    title: 'Complete Hospital Furniture & Emergency Care',
    subtitle: 'Electric 5-function ICU beds, MAYO instrument trolleys, transport stretchers, and emergency defibrillators.',
    image: '/images/extracted/image_4.png',
    badge: 'Nationwide Delivery',
    primaryCtaText: 'Explore Hospital Furniture',
    primaryCtaLink: '/categories/hospital-furniture',
  },
]

export default function HeroSection({ onOpenSearch }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const slide = HERO_SLIDES[currentSlide]

  return (
    <section className="relative bg-slate-950 text-white overflow-hidden py-12 md:py-20 border-b border-slate-800">
      {/* Background Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70 z-10" />
      
      {/* Dynamic Slide Background Image */}
      <div className="absolute inset-0 opacity-20 transition-opacity duration-700">
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 space-y-6 animate-fade-in">
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 bg-[#B92025] border border-red-500/30 text-white text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>{slide.badge}</span>
            </div>

            {/* HEADLINE */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {slide.title}
            </h1>

            {/* SUBTITLE */}
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {slide.subtitle}
            </p>

            {/* QUICK SEARCH BAR IN HERO */}
            <div className="pt-2 max-w-xl">
              <div
                onClick={onOpenSearch}
                className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 cursor-pointer hover:bg-white/15 transition-all shadow-xl group"
              >
                <div className="flex-1 flex items-center gap-3 px-3 text-slate-300 text-sm">
                  <Search className="w-5 h-5 text-[#B92025] group-hover:scale-110 transition-transform" />
                  <span className="text-xs">Search products by name, SKU, or category...</span>
                </div>
                <button
                  type="button"
                  className="bg-[#B92025] hover:bg-[#96161B] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shadow"
                >
                  Search
                </button>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={slide.primaryCtaLink}
                className="flex items-center gap-2 bg-[#B92025] hover:bg-[#96161B] text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg hover:translate-y-[-1px]"
              >
                <span>{slide.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3.5 rounded-xl text-sm transition-all"
              >
                <span>Request Quotation</span>
              </Link>
            </div>

            {/* TRUST BULLETS */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Quality Inspected</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Hospital Bulk Discounts</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>24/7 Technical Support</span>
              </div>
            </div>
          </div>

          {/* RIGHT HERO CAROUSEL IMAGE PREVIEW */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-[4/3] group">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-medium flex items-center justify-between">
                <span className="bg-[#B92025] px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider">
                  Alpha Certified
                </span>
                <span className="text-slate-300">Slide {currentSlide + 1} of {HERO_SLIDES.length}</span>
              </div>
            </div>

            {/* CAROUSEL NAV ARROWS */}
            <div className="absolute -bottom-5 right-4 flex items-center gap-2 z-30">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                className="w-10 h-10 bg-slate-900 hover:bg-[#B92025] text-white rounded-full flex items-center justify-center transition-colors shadow-lg border border-slate-700"
                title="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                className="w-10 h-10 bg-slate-900 hover:bg-[#B92025] text-white rounded-full flex items-center justify-center transition-colors shadow-lg border border-slate-700"
                title="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
