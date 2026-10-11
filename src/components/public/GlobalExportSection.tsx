'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Users, Scissors, Plane, MapPin } from 'lucide-react'
import {
  getStoredWorldExport,
  INITIAL_WORLD_EXPORT_SEED,
} from '@/src/lib/dataStore'
import { WorldExportData } from '@/src/types/section'

export default function GlobalExportSection() {
  const [data, setData] = useState<WorldExportData>(INITIAL_WORLD_EXPORT_SEED)

  const loadData = () => {
    const stored = getStoredWorldExport()
    setData(stored)
  }

  useEffect(() => {
    loadData()

    const handleUpdate = () => {
      loadData()
    }
    window.addEventListener('alpha_content_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      window.removeEventListener('alpha_content_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  return (
    <section className="py-16 sm:py-20 2xl:py-28 3xl:py-36 bg-white overflow-hidden relative border-t border-slate-100">
      {/* Background Soft Glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-red-50/50 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-slate-100/60 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 3xl:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 2xl:gap-16 items-center">
          
          {/* LEFT: TEXT & STATS (MATCHING SCREENSHOT 1 BOTTOM) */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8 2xl:space-y-10">
            {/* Badge */}
            <div className="flex items-center gap-2">
              <span className="w-8 h-[2.5px] bg-[#96161B] rounded-full inline-block" />
              <span className="text-xs sm:text-sm 2xl:text-base font-bold text-[#96161B] tracking-wider uppercase">
                {data.badge_text || 'EXPORT DESTINATIONS'}
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl 2xl:text-6xl 3xl:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
              <div>{data.heading_line1}</div>
              <div className="text-[#96161B]">{data.heading_line2}</div>
              <div className="text-[#96161B]">{data.heading_line3}</div>
            </h2>

            {/* Description Paragraph */}
            <p className="text-slate-500 text-sm sm:text-base 2xl:text-lg leading-relaxed max-w-lg font-medium">
              {data.description}
            </p>

            {/* Stats Row */}
            <div className="pt-4 sm:pt-6 flex flex-wrap items-center gap-8 sm:gap-12 border-t border-slate-100">
              {/* Stat 1: Staff */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 2xl:w-14 2xl:h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 2xl:w-7 2xl:h-7 text-slate-700" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl 2xl:text-4xl font-black text-[#96161B]">
                    {data.staff_count}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                    {data.staff_label}
                  </div>
                </div>
              </div>

              {/* Vertical divider */}
              <div className="h-12 w-[1px] bg-slate-200 hidden sm:block" />

              {/* Stat 2: Instruments */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 2xl:w-14 2xl:h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  <Scissors className="w-6 h-6 2xl:w-7 2xl:h-7 text-slate-700" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-slate-400 font-semibold">
                    More than
                  </div>
                  <div className="text-2xl sm:text-3xl 2xl:text-4xl font-black text-[#96161B]">
                    {data.instruments_count.replace('More than', '').trim()}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                    {data.instruments_label}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: GLOBE GRAPHIC WITH FLIGHT ARCS & FLOATING COUNTRY BADGES */}
          <div className="lg:col-span-7 relative flex items-center justify-center">
            {/* Flight Path Graphic with Airplane */}
            <div className="relative w-full max-w-xl 2xl:max-w-2xl 3xl:max-w-3xl aspect-square">
              
              {/* Globe Image */}
              <Image
                src={data.globe_image || '/images/world-globe-export.jpg'}
                alt="Global Export Destinations"
                fill
                className="object-contain"
                priority={false}
              />

              {/* Factory Pin at center/Asia */}
              <div className="absolute top-[48%] left-[62%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center animate-bounce">
                <div className="w-8 h-8 rounded-full bg-[#96161B] text-white flex items-center justify-center shadow-lg ring-4 ring-red-200">
                  <MapPin className="w-4 h-4 fill-white" />
                </div>
                <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                  Factory HQ
                </span>
              </div>

              {/* Airplane icon along dashed trajectory */}
              <div className="absolute top-[32%] left-[12%] -rotate-45 z-10 text-slate-400 hidden sm:block">
                <Plane className="w-6 h-6" />
              </div>
              <div className="absolute top-[8%] right-[18%] rotate-12 z-10 text-slate-400 hidden sm:block">
                <Plane className="w-6 h-6" />
              </div>

              {/* Country Badges Array on Outer Arc */}
              <div className="absolute inset-0 pointer-events-none">
                {/* 1. Germany */}
                <div className="absolute top-[18%] left-[12%] sm:left-[22%] pointer-events-auto">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 2xl:w-14 2xl:h-14 rounded-full bg-white shadow-xl border-2 border-slate-100 flex items-center justify-center text-base sm:text-2xl 2xl:text-3xl hover:scale-125 transition-transform duration-300 cursor-pointer">
                    🇩🇪
                  </div>
                </div>

                {/* 2. UK */}
                <div className="absolute top-[10%] left-[30%] sm:left-[38%] pointer-events-auto">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 2xl:w-14 2xl:h-14 rounded-full bg-white shadow-xl border-2 border-slate-100 flex items-center justify-center text-base sm:text-2xl 2xl:text-3xl hover:scale-125 transition-transform duration-300 cursor-pointer">
                    🇬🇧
                  </div>
                </div>

                {/* 3. Pakistan */}
                <div className="absolute top-[6%] left-[47%] sm:left-[52%] pointer-events-auto">
                  <div className="w-9 h-9 sm:w-13 sm:h-13 2xl:w-16 2xl:h-16 rounded-full bg-white shadow-xl border-2 border-[#96161B] ring-2 ring-red-100 flex items-center justify-center text-lg sm:text-3xl 2xl:text-4xl hover:scale-125 transition-transform duration-300 cursor-pointer animate-pulse">
                    🇵🇰
                  </div>
                </div>

                {/* 4. France */}
                <div className="absolute top-[10%] left-[64%] sm:left-[66%] pointer-events-auto">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 2xl:w-14 2xl:h-14 rounded-full bg-white shadow-xl border-2 border-slate-100 flex items-center justify-center text-base sm:text-2xl 2xl:text-3xl hover:scale-125 transition-transform duration-300 cursor-pointer">
                    🇫🇷
                  </div>
                </div>

                {/* 5. Kenya */}
                <div className="absolute top-[20%] right-[10%] sm:right-[16%] pointer-events-auto">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 2xl:w-14 2xl:h-14 rounded-full bg-white shadow-xl border-2 border-slate-100 flex items-center justify-center text-base sm:text-2xl 2xl:text-3xl hover:scale-125 transition-transform duration-300 cursor-pointer">
                    🇰🇪
                  </div>
                </div>

                {/* 6. Syria / Middle East */}
                <div className="absolute top-[36%] right-[3%] sm:right-[6%] pointer-events-auto">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 2xl:w-14 2xl:h-14 rounded-full bg-white shadow-xl border-2 border-slate-100 flex items-center justify-center text-base sm:text-2xl 2xl:text-3xl hover:scale-125 transition-transform duration-300 cursor-pointer">
                    🇸🇾
                  </div>
                </div>

                {/* 7. Japan */}
                <div className="absolute top-[52%] right-[2%] sm:right-[2%] pointer-events-auto">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 2xl:w-14 2xl:h-14 rounded-full bg-white shadow-xl border-2 border-slate-100 flex items-center justify-center text-base sm:text-2xl 2xl:text-3xl hover:scale-125 transition-transform duration-300 cursor-pointer">
                    🇯🇵
                  </div>
                </div>

                {/* 8. USA */}
                <div className="absolute top-[34%] left-[6%] sm:left-[12%] pointer-events-auto">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 2xl:w-14 2xl:h-14 rounded-full bg-white shadow-xl border-2 border-slate-100 flex items-center justify-center text-base sm:text-2xl 2xl:text-3xl hover:scale-125 transition-transform duration-300 cursor-pointer">
                    🇺🇸
                  </div>
                </div>

                {/* 9. South Africa */}
                <div className="absolute top-[50%] left-[2%] sm:left-[4%] pointer-events-auto">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 2xl:w-14 2xl:h-14 rounded-full bg-white shadow-xl border-2 border-slate-100 flex items-center justify-center text-base sm:text-2xl 2xl:text-3xl hover:scale-125 transition-transform duration-300 cursor-pointer">
                    🇿🇦
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
