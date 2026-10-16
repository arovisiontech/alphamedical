'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ShieldCheck, Globe, Settings, Headphones, ChevronRight } from 'lucide-react'
import { getStoredCategories } from '@/src/lib/dataStore'

function EntSurgeryBannerContent({
  customTitle,
  customSubtitle,
}: {
  customTitle?: string
  customSubtitle?: string
}) {
  const searchParams = useSearchParams()
  const catParam = searchParams.get('cat') || ''
  const queryParam = searchParams.get('query') || ''
  const saleParam = searchParams.get('sale') === 'true'

  const categories = getStoredCategories()
  const currentCat = categories.find(
    (c) => c.slug === catParam || c.id === catParam || c.name.toLowerCase() === catParam.toLowerCase()
  )

  let prefix = 'ENT'
  let restTitle = 'Surgery Instruments'
  let displayCategory = 'ENT Surgery Instruments'

  if (saleParam) {
    prefix = 'SPECIAL'
    restTitle = 'Sale & Discounted Instruments'
    displayCategory = 'Special Offers'
  } else if (queryParam) {
    prefix = 'SEARCH:'
    restTitle = queryParam
    displayCategory = queryParam
  } else if (currentCat) {
    const parts = currentCat.name.split(' ')
    prefix = parts[0]
    restTitle = parts.slice(1).join(' ') || 'Instruments'
    displayCategory = currentCat.name
  } else if (catParam) {
    const clean = catParam.replace(/-/g, ' ').toUpperCase()
    const parts = clean.split(' ')
    prefix = parts[0]
    restTitle = parts.slice(1).join(' ') || 'Instruments'
    displayCategory = clean
  } else if (customTitle) {
    const parts = customTitle.split(' ')
    prefix = parts[0]
    restTitle = parts.slice(1).join(' ')
  }

  const displaySubtitle =
    customSubtitle || 'Precision instruments for advanced ENT procedures.'

  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200/90 font-sans select-none min-h-[220px] sm:min-h-[260px] lg:min-h-[300px] flex items-center">
      {/* BACKGROUND SURGICAL TRAY IMAGE (IMAGE 392.SVG) ON THE RIGHT */}
      <div className="absolute right-0 top-0 bottom-0 w-full sm:w-2/3 lg:w-1/2 pointer-events-none z-0">
        <div className="relative w-full h-full opacity-90 sm:opacity-100 flex items-center justify-end">
          <Image
            src="/images/banners/image-392.svg"
            alt="ENT Surgery Instruments Surgical Tray"
            fill
            priority
            className="object-cover object-right-top"
          />
          {/* Subtle gradient to softly blend left text into the bright white background */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 sm:via-white/50 to-transparent" />
        </div>
      </div>

      {/* FOREGROUND CONTENT (MATCHING SCREENSHOT 2 EXACT DESIGN) */}
      <div className="relative z-10 w-full max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* LEFT 8 COLUMNS: BREADCRUMB, HEADING, SUBTITLE, 4 FEATURE BADGES */}
          <div className="lg:col-span-8 space-y-3.5 sm:space-y-4">
            
            {/* BREADCRUMB (Home > Shop > ENT Surgery Instruments) */}
            <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#B92025] transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link href="/products" className="hover:text-[#B92025] transition-colors">
                Shop
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-800 font-bold">{displayCategory}</span>
            </nav>

            {/* TITLE: [ENT] in RED #B92025 + [Surgery Instruments] in SLATE-900 */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
              <span className="text-[#B92025] uppercase mr-2.5">{prefix}</span>
              <span className="text-slate-900 uppercase">{restTitle}</span>
            </h1>

            {/* SUBTITLE */}
            <p className="text-xs sm:text-sm 2xl:text-base text-slate-600 font-medium max-w-xl leading-relaxed">
              {displaySubtitle}
            </p>

            {/* 4 FEATURE PILLS / BADGES (MATCHING SCREENSHOT 2) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 pt-3 sm:pt-4">
              {/* Badge 1: Premium Quality / Built to Last */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full border border-red-200 bg-red-50/80 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#B92025]" />
                </div>
                <div>
                  <div className="text-xs 2xl:text-sm font-extrabold text-slate-900 leading-tight">
                    Premium Quality
                  </div>
                  <div className="text-[11px] 2xl:text-xs text-slate-500 font-medium">
                    Built to Last
                  </div>
                </div>
              </div>

              {/* Badge 2: Worldwide Shipping / Global Reach */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full border border-red-200 bg-red-50/80 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4 text-[#B92025]" />
                </div>
                <div>
                  <div className="text-xs 2xl:text-sm font-extrabold text-slate-900 leading-tight">
                    Worldwide Shipping
                  </div>
                  <div className="text-[11px] 2xl:text-xs text-slate-500 font-medium">
                    Global Reach
                  </div>
                </div>
              </div>

              {/* Badge 3: Wide Range / 1000+ Instruments */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full border border-red-200 bg-red-50/80 flex items-center justify-center shrink-0">
                  <Settings className="w-4 h-4 text-[#B92025]" />
                </div>
                <div>
                  <div className="text-xs 2xl:text-sm font-extrabold text-slate-900 leading-tight">
                    Wide Range
                  </div>
                  <div className="text-[11px] 2xl:text-xs text-slate-500 font-medium">
                    1000+ Instruments
                  </div>
                </div>
              </div>

              {/* Badge 4: Expert Support / Always Here to Help */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full border border-red-200 bg-red-50/80 flex items-center justify-center shrink-0">
                  <Headphones className="w-4 h-4 text-[#B92025]" />
                </div>
                <div>
                  <div className="text-xs 2xl:text-sm font-extrabold text-slate-900 leading-tight">
                    Expert Support
                  </div>
                  <div className="text-[11px] 2xl:text-xs text-slate-500 font-medium">
                    Always Here to Help
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT 4 COLUMNS: VERTICAL RED ACCENT + "PRECISION CARE BETTER OUTCOMES" */}
          <div className="hidden lg:flex lg:col-span-4 items-center justify-start xl:justify-center pl-6">
            <div className="space-y-1.5 pl-4 border-l-2 border-[#B92025]">
              <div className="text-xs 2xl:text-sm font-black text-slate-900 uppercase tracking-widest leading-snug">
                <div>PRECISION</div>
                <div>CARE</div>
                <div>BETTER</div>
                <div className="text-[#B92025]">OUTCOMES</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default function EntSurgeryBanner(props: {
  customTitle?: string
  customSubtitle?: string
}) {
  return (
    <React.Suspense
      fallback={
        <section className="w-full bg-[#f4f5f7] border-b border-slate-200 py-10 lg:py-14 animate-pulse">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 h-28" />
        </section>
      }
    >
      <EntSurgeryBannerContent {...props} />
    </React.Suspense>
  )
}
