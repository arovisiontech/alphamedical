'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ClipboardList,
  FileCheck,
  ShieldCheck,
  Package,
  FileText,
  Truck,
  Headphones,
  ArrowRight,
  Globe,
  Users,
  Shield,
  Clock,
  Search,
} from 'lucide-react'
import {
  getStoredProcessOrder,
  INITIAL_PROCESS_ORDER_SEED,
} from '@/src/lib/dataStore'
import { ProcessOrderSectionData } from '@/src/types/section'

export default function OrderProcessSection() {
  const [data, setData] = useState<ProcessOrderSectionData>(INITIAL_PROCESS_ORDER_SEED)

  const loadData = () => {
    const stored = getStoredProcessOrder()
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

  // Icon mapping for 7 steps
  const renderStepIcon = (name: string, stepNumber: string) => {
    const iconClass = 'w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 text-slate-800'
    switch (stepNumber) {
      case '01':
        return (
          <div className="relative flex items-center justify-center">
            <ClipboardList className={iconClass} />
            <Search className="w-3.5 h-3.5 text-[#96161B] absolute -bottom-1 -right-1" />
          </div>
        )
      case '02':
        return (
          <div className="relative flex items-center justify-center">
            <FileCheck className={iconClass} />
            <span className="w-2.5 h-2.5 rounded-full bg-[#96161B] absolute -bottom-0.5 -right-0.5 ring-2 ring-white" />
          </div>
        )
      case '03':
        return (
          <div className="relative flex items-center justify-center">
            <ShieldCheck className={iconClass} />
            <Search className="w-3.5 h-3.5 text-[#96161B] absolute -bottom-1 -right-1" />
          </div>
        )
      case '04':
        return (
          <div className="relative flex items-center justify-center">
            <Package className={iconClass} />
            <span className="w-2 h-2 rounded-full bg-[#96161B] absolute top-0 right-0" />
          </div>
        )
      case '05':
        return (
          <div className="relative flex items-center justify-center">
            <FileText className={iconClass} />
            <span className="w-2.5 h-2.5 rounded-full bg-[#96161B] absolute -bottom-0.5 -right-0.5 ring-2 ring-white" />
          </div>
        )
      case '06':
        return (
          <div className="relative flex items-center justify-center">
            <Truck className={iconClass} />
            <span className="w-2 h-2 rounded-full bg-[#96161B] absolute top-1 right-1" />
          </div>
        )
      case '07':
      default:
        return (
          <div className="relative flex items-center justify-center">
            <Headphones className={iconClass} />
            <span className="w-2 h-2 rounded-full bg-[#96161B] absolute top-0 right-0 animate-ping" />
          </div>
        )
    }
  }

  // Icon mapping for bottom badges
  const renderBadgeIcon = (name: string) => {
    const iconClass = 'w-4 h-4 2xl:w-5 2xl:h-5 text-slate-800'
    switch (name) {
      case 'globe':
        return <Globe className={iconClass} />
      case 'users':
        return <Users className={iconClass} />
      case 'truck':
        return <Truck className={iconClass} />
      case 'shield':
      default:
        return <Shield className={iconClass} />
    }
  }

  return (
    <section className="py-16 sm:py-24 2xl:py-32 3xl:py-40 bg-gradient-to-b from-[#fafbfc] via-white to-[#fafbfc] overflow-hidden relative border-t border-slate-100 font-sans">
      {/* Decorative Wavy Lines Background (Matching Screenshot 1) */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="process-waves" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 50 Q 25 30, 50 50 T 100 50" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#process-waves)" />
        </svg>
      </div>

      <div className="w-full max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 3xl:px-20 relative z-10">
        
        {/* =========================================================
            HEADER & DECORATIVE SIDE TAGS (MATCHING SCREENSHOT 1)
        ========================================================= */}
        <div className="relative flex items-center justify-between gap-4 mb-14 sm:mb-20">
          
          {/* Left Decorative Tag */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <span className="w-1 h-9 bg-[#96161B] rounded-full shrink-0" />
            <div className="text-[10px] 2xl:text-xs font-black text-slate-600 uppercase tracking-widest leading-tight">
              <div>QUALITY</div>
              <div>IN EVERY STEP</div>
            </div>
          </div>

          {/* Center Main Heading */}
          <div className="flex-1 text-center max-w-2xl mx-auto space-y-2">
            <div className="text-[11px] sm:text-xs 2xl:text-sm font-bold text-slate-500 uppercase tracking-[0.25em]">
              {data.subtitle}
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl 2xl:text-6xl font-black text-slate-900 tracking-tight leading-none">
              <span>{data.title_line1} </span>
              <span className="text-[#96161B] relative inline-block">
                {data.title_line2}
                {/* Red Underline Accent */}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-[2.5px] bg-[#96161B] rounded-full" />
              </span>
            </h2>

            <div className="pt-3 text-[10px] sm:text-[11px] 2xl:text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
              <span className="text-slate-600">PRECISION</span>
              <span className="text-[#96161B]">•</span>
              <span className="text-slate-600">QUALITY</span>
              <span className="text-[#96161B]">•</span>
              <span className="text-slate-600">TRUST</span>
              <span className="text-[#96161B]">•</span>
              <span className="text-slate-600">WORLDWIDE</span>
            </div>
          </div>

          {/* Right Decorative Tag */}
          <div className="hidden lg:flex items-center gap-3 shrink-0 text-right">
            <div className="text-[10px] 2xl:text-xs font-black text-slate-600 uppercase tracking-widest leading-tight">
              <div>SURGICAL INSTRUMENTS</div>
              <div>FOR A HEALTHIER TOMORROW</div>
            </div>
            <span className="w-1 h-9 bg-[#96161B] rounded-full shrink-0" />
          </div>

        </div>

        {/* =========================================================
            7-STEP PROCESS TIMELINE (MATCHING SCREENSHOT 1)
        ========================================================= */}
        <div className="relative mb-16 sm:mb-20">
          
          {/* Horizontal Connecting Line on Desktop (Red Dashed Line with Red Dots) */}
          <div className="hidden xl:block absolute top-[68px] left-[6%] right-[6%] z-0">
            <div className="w-full border-t-2 border-dashed border-red-300 relative flex items-center justify-between">
              {/* Connecting Red Bullet Dots between cards */}
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-[#96161B] shadow-sm ring-2 ring-white"
                  style={{
                    position: 'absolute',
                    left: `${((i + 1) / 7) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* 7 Process Steps Grid / Horizontal Scroll for Mobile */}
          <div
            className="flex xl:grid xl:grid-cols-7 gap-6 sm:gap-6 2xl:gap-8 overflow-x-auto scrollbar-none pb-4 pt-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {data.steps.map((step, idx) => (
              <div
                key={step.id || idx}
                className="w-[280px] sm:w-[300px] xl:w-auto shrink-0 snap-start flex flex-col items-center text-center group relative z-10"
              >
                {/* Step Node with Number Badge & Icon Container */}
                <div className="relative mb-5 flex flex-col items-center">
                  {/* Top Red Pill/Badge with Step Number */}
                  <div className="w-8 h-8 2xl:w-9 2xl:h-9 rounded-full bg-[#96161B] text-white font-black text-xs 2xl:text-sm flex items-center justify-center shadow-md mb-2 group-hover:scale-110 transition-transform duration-300">
                    {step.step_number}
                  </div>

                  {/* Circular Icon Container */}
                  <div className="w-20 h-20 sm:w-22 sm:h-22 2xl:w-24 2xl:h-24 rounded-full bg-white border border-slate-200/90 shadow-md flex items-center justify-center p-4 group-hover:border-[#96161B] group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
                    {renderStepIcon(step.icon_name, step.step_number)}
                  </div>
                </div>

                {/* Step Title */}
                <h3 className="text-sm sm:text-base 2xl:text-lg font-black text-slate-900 group-hover:text-[#96161B] transition-colors leading-snug mb-2 px-1 min-h-[40px] flex items-center justify-center">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-[11px] sm:text-xs 2xl:text-sm text-slate-500 font-medium leading-relaxed px-1">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* =========================================================
            BOTTOM BAR (MATCHING SCREENSHOT 1)
        ========================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-6 2xl:p-8 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Left Quote */}
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-8 bg-[#96161B] rounded-full shrink-0" />
            <div className="text-xs sm:text-sm 2xl:text-base font-black text-slate-700 tracking-wider uppercase">
              {data.bottom_quote || 'ADVANCING SURGERY, IMPROVING LIVES.'}
            </div>
          </div>

          {/* 4 Feature Badges in Pill Containers */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {data.bottom_badges.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-2 bg-[#f8fafc] border border-slate-200/80 rounded-2xl px-3.5 py-2 hover:bg-red-50/40 hover:border-red-200 transition-colors shadow-2xs"
              >
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-xs shrink-0">
                  {renderBadgeIcon(b.icon_name)}
                </div>
                <span className="text-[10px] sm:text-[11px] 2xl:text-xs font-extrabold text-slate-800 tracking-wide uppercase">
                  {b.text}
                </span>
              </div>
            ))}
          </div>

          {/* Right Red Pill CTA Button */}
          <div className="shrink-0">
            <Link
              href={data.cta_button_url || '/contact'}
              className="inline-flex items-center gap-2.5 bg-[#96161B] hover:bg-[#7d1216] text-white font-black px-7 sm:px-9 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg shadow-red-950/20 hover:translate-y-[-2px] active:translate-y-0 group/btn"
            >
              <span>{data.cta_button_text || 'PARTNER WITH US'}</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  )
}
