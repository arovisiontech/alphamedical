'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Bell } from 'lucide-react'
import {
  getStoredCompliancesPromo,
  INITIAL_COMPLIANCES_PROMO_SEED,
} from '@/src/lib/dataStore'
import { CompliancesPromoData } from '@/src/types/section'

export default function CompliancesPromoSection() {
  const [data, setData] = useState<CompliancesPromoData>(INITIAL_COMPLIANCES_PROMO_SEED)

  const loadData = () => {
    const stored = getStoredCompliancesPromo()
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
    <section className="py-14 sm:py-20 2xl:py-28 3xl:py-36 bg-white overflow-hidden relative border-t border-slate-100">
      {/* SUBTLE DOTTED WATERMARK MAP IN BACKGROUND (MATCHING SCREENSHOT 1) */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#18355E_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="w-full max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 3xl:px-20 relative z-10">
        
        {/* =========================================================
            PART A: OUR COMPLIANCES (GLOBAL STANDARDS. TRUSTED QUALITY.)
        ========================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          {/* Top Badge with Red Accent Lines */}
          <div className="inline-flex items-center justify-center gap-3 mb-3">
            <span className="w-8 sm:w-12 h-[1.5px] bg-[#96161B] rounded-full" />
            <span className="text-[11px] sm:text-xs 2xl:text-sm font-bold text-slate-500 tracking-[0.2em] uppercase">
              {data.compliance_badge || 'OUR COMPLIANCES'}
            </span>
            <span className="w-8 sm:w-12 h-[1.5px] bg-[#96161B] rounded-full" />
          </div>

          {/* Main Heading (Line 1: Navy/Black, Line 2: Red) */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
            <span className="text-[#18355E] block sm:inline">{data.compliance_title_line1} </span>
            <span className="text-[#96161B] block sm:inline">{data.compliance_title_line2}</span>
          </h2>

          {/* Description Subtitle */}
          <p className="mt-3 text-xs sm:text-sm 2xl:text-base text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
            {data.compliance_description}
          </p>
        </div>

        {/* COMPLIANCE BADGES ROW (5 BADGES WITH DIVIDERS MATCHING SCREENSHOT 1) */}
        <div className="mb-14 sm:mb-20">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 bg-slate-50/60 rounded-3xl border border-slate-200/80 p-4 sm:p-6 2xl:p-8 shadow-sm">
            {data.compliances.map((badge, idx) => (
              <div
                key={badge.id || idx}
                className="p-4 sm:p-5 flex flex-col items-center justify-center text-center group hover:bg-white rounded-2xl transition-all duration-300"
              >
                {/* Logo Graphic */}
                {badge.type === 'iso' ? (
                  <div className="space-y-1 mb-2">
                    {/* SVG Globe ISO Emblem */}
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 2xl:w-20 2xl:h-20 mx-auto flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-[#18355E] group-hover:scale-105 transition-transform">
                        <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="4" />
                        <ellipse cx="50" cy="50" rx="22" ry="44" fill="none" stroke="currentColor" strokeWidth="3" />
                        <line x1="6" y1="50" x2="94" y2="50" stroke="currentColor" strokeWidth="3" />
                        <line x1="16" y1="28" x2="84" y2="28" stroke="currentColor" strokeWidth="2.5" />
                        <line x1="16" y1="72" x2="84" y2="72" stroke="currentColor" strokeWidth="2.5" />
                        <rect x="22" y="38" width="56" height="24" rx="4" fill="#18355E" />
                        <text x="50" y="55" textAnchor="middle" fill="white" fontSize="17" fontWeight="900" fontFamily="sans-serif">
                          ISO
                        </text>
                      </svg>
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold text-slate-500 tracking-wider">
                      {badge.code}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 mb-2">
                    {/* FDA Stylized Emblem */}
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 2xl:w-20 2xl:h-20 mx-auto flex items-center justify-center">
                      <div className="border-2 border-[#18355E] rounded-xl px-2.5 py-1.5 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                        <span className="font-black text-xl sm:text-2xl 2xl:text-3xl text-[#18355E] tracking-tight font-serif italic">
                          FDA
                        </span>
                      </div>
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-wider">
                      U.S. FDA
                    </div>
                  </div>
                )}

                {/* Subtitle / Label */}
                <div className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-[#96161B] transition-colors mt-1">
                  {badge.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================
            PART B: TWO PROMO ACTION CARDS (MATCHING SCREENSHOT 1 BOTTOM)
        ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 2xl:gap-10">
          
          {/* 1. LEFT CARD: CUSTOMIZED TOOLS (DARK SURGICAL IMAGERY) */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-800 group min-h-[340px] sm:min-h-[380px] 2xl:min-h-[440px] flex flex-col justify-end p-6 sm:p-10 2xl:p-14">
            {/* Background Medical Photo */}
            <Image
              src={data.left_card.bg_image || '/images/custom-tools-surgical.jpg'}
              alt={data.left_card.title}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-[0.55]"
            />

            {/* Gradient Overlays for rich contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 space-y-4 max-w-lg">
              {/* Badge */}
              <div className="flex items-center gap-2">
                <span className="w-6 h-[2px] bg-[#96161B] inline-block" />
                <span className="text-[11px] sm:text-xs font-black tracking-widest text-slate-300 uppercase">
                  {data.left_card.badge_text || 'OUR HEALTH CARE'}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black text-white leading-tight tracking-tight">
                <span>{data.left_card.title} </span>
                <span className="text-[#B92025]">{data.left_card.highlight_title}</span>
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm 2xl:text-base text-slate-300 font-medium leading-relaxed">
                {data.left_card.description}
              </p>

              {/* Button */}
              <div className="pt-2">
                <Link
                  href={data.left_card.button_url || '/contact'}
                  className="inline-flex items-center gap-2 bg-[#B92025] hover:bg-[#96161B] text-white font-black px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg shadow-red-950/40 hover:translate-y-[-2px] active:translate-y-0 group/btn"
                >
                  <span>{data.left_card.button_text || 'Contact Now'}</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* 2. RIGHT CARD: UPCOMING ACTIVITIES (RED CARDIAC PULSE CARD) */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-[#B92025] via-[#A6101C] to-[#800000] text-white min-h-[340px] sm:min-h-[380px] 2xl:min-h-[440px] flex flex-col justify-between p-6 sm:p-10 2xl:p-14 border border-red-900 group">
            {/* Background ECG Pulse Line in Bottom Right Corner (Matching Screenshot 1) */}
            <div className="absolute right-0 bottom-4 w-72 sm:w-96 h-28 opacity-25 pointer-events-none">
              <svg viewBox="0 0 400 120" className="w-full h-full stroke-white fill-none" strokeWidth="2.5" strokeLinecap="round">
                <path d="M0,60 L80,60 L95,60 L110,30 L125,95 L140,15 L155,105 L170,60 L240,60 L255,45 L270,75 L285,60 L400,60" />
              </svg>
            </div>

            {/* Top Left: Glowing Circular Bell Icon + White Accent Line */}
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 2xl:w-24 2xl:h-24 rounded-full bg-white text-[#B92025] flex items-center justify-center shadow-xl shrink-0 group-hover:scale-105 transition-transform duration-300">
                <div className="relative">
                  <Bell className="w-8 h-8 sm:w-10 sm:h-10 text-[#B92025] animate-pulse" />
                  {/* Subtle radio waves */}
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-ping" />
                </div>
              </div>
              <span className="w-10 h-[2px] bg-white/70 rounded-full hidden sm:block" />
            </div>

            {/* Center Content */}
            <div className="space-y-4 my-4 max-w-lg relative z-10">
              <h3 className="text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-black text-white leading-tight tracking-tight">
                <div>{data.right_card.title_line1}</div>
                <div>{data.right_card.title_line2}</div>
              </h3>

              <p className="text-xs sm:text-sm 2xl:text-base text-red-100/90 font-medium leading-relaxed">
                {data.right_card.description}
              </p>
            </div>

            {/* Bottom Button: Transparent White Outline Pill */}
            <div className="relative z-10">
              <Link
                href={data.right_card.button_url || '/news'}
                className="inline-flex items-center gap-2 border-2 border-white/80 hover:border-white bg-transparent hover:bg-white text-white hover:text-[#96161B] font-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md hover:translate-y-[-2px] active:translate-y-0 group/btn"
              >
                <span>{data.right_card.button_text || 'View Events'}</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
