'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Users,
  Shield,
  Globe,
} from 'lucide-react'
import {
  getStoredFaqBulkInquiry,
  INITIAL_FAQ_BULK_INQUIRY_SEED,
} from '@/src/lib/dataStore'
import { FaqBulkInquiryData } from '@/src/types/section'

export default function FaqBulkInquirySection() {
  const [data, setData] = useState<FaqBulkInquiryData>(INITIAL_FAQ_BULK_INQUIRY_SEED)
  const [openIndex, setOpenIndex] = useState<number | null>(0) // First question open by default like screenshot 1

  const loadData = () => {
    const stored = getStoredFaqBulkInquiry()
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

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  const renderBadgeIcon = (iconName: string) => {
    const cls = 'w-5 h-5 2xl:w-6 2xl:h-6 text-[#96161B]'
    switch (iconName) {
      case 'shield':
        return <Shield className={cls} />
      case 'globe':
        return <Globe className={cls} />
      case 'users':
      default:
        return <Users className={cls} />
    }
  }

  return (
    <section className="bg-[#0b0304] text-white py-16 sm:py-24 2xl:py-32 3xl:py-40 relative overflow-hidden font-sans border-b border-red-950/30">
      {/* Decorative Dark Maroon Glow & Curved Lines matching Screenshot 1 */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#96161B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#96161B]/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Subtle Curved Accent Lines in Bottom Right */}
      <div className="absolute bottom-0 right-0 w-full md:w-1/2 h-28 pointer-events-none opacity-20">
        <svg viewBox="0 0 500 100" fill="none" className="w-full h-full preserve-3d">
          <path d="M0 80 Q 250 20 500 70" stroke="#96161B" strokeWidth="2" />
          <path d="M50 90 Q 280 40 500 85" stroke="#96161B" strokeWidth="1" />
        </svg>
      </div>

      <div className="w-full max-w-7xl 2xl:max-w-[1900px] 3xl:max-w-[2400px] 4xl:max-w-[3000px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 3xl:px-20 relative z-10">
        
        {/* =========================================================
            TWO SIDE-BY-SIDE LUXURY CARDS (MATCHING SCREENSHOT 1)
        ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 2xl:gap-10">
          
          {/* =========================================================
              CARD 1: FAQ ACCORDION (LEFT CARD)
          ========================================================= */}
          <div className="bg-gradient-to-b from-[#18080b] via-[#140608] to-[#100406] rounded-3xl p-6 sm:p-8 2xl:p-12 border border-red-950/50 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col justify-between">
            <div>
              {/* Header Row: Title & Top Right Tag */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-[2px] bg-white rounded-full inline-block" />
                    <span className="text-[11px] sm:text-xs 2xl:text-sm font-bold text-white tracking-widest uppercase">
                      {data.faq_subtitle}
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-white tracking-tight uppercase">
                    {data.faq_title}
                  </h2>
                </div>

                {/* Top Right Tag */}
                <div className="text-right shrink-0">
                  <div className="text-[9px] 2xl:text-[11px] font-black text-slate-400 uppercase tracking-widest leading-tight">
                    <div>QUALITY</div>
                    <div>INSTRUMENTS</div>
                    <div>FOR A HEALTHIER</div>
                    <div>TOMORROW</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm 2xl:text-base text-slate-400 mb-6 leading-relaxed">
                {data.faq_description}
              </p>

              {/* Accordion Questions List */}
              <div className="space-y-3">
                {data.faqs.map((faq, idx) => {
                  const isOpen = openIndex === idx

                  return (
                    <div
                      key={faq.id || idx}
                      className={`rounded-2xl transition-all duration-300 overflow-hidden ${
                        isOpen
                          ? 'bg-[#220d11] border border-red-900/80 shadow-lg shadow-red-950/40'
                          : 'bg-[#19090c]/70 border border-red-950/40 hover:border-red-900/50 hover:bg-[#1f0b0f]'
                      }`}
                    >
                      {/* Accordion Trigger Header */}
                      <button
                        type="button"
                        onClick={() => toggleAccordion(idx)}
                        className="w-full p-4 sm:p-4.5 2xl:p-5 flex items-center justify-between text-left gap-3 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          {/* Red Circular Question Mark Icon */}
                          <div className="w-6 h-6 2xl:w-7 2xl:h-7 rounded-full bg-[#96161B] text-white flex items-center justify-center font-bold text-xs 2xl:text-sm shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                            ?
                          </div>
                          <span className="text-xs sm:text-sm 2xl:text-base font-bold text-white/95 group-hover:text-white transition-colors leading-snug">
                            {faq.question}
                          </span>
                        </div>

                        {/* Chevron Up/Down */}
                        <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white/80 shrink-0">
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-white" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {/* Accordion Answer Content */}
                      {isOpen && (
                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm 2xl:text-base text-slate-300 leading-relaxed pl-13 sm:pl-14 border-t border-red-950/40 mt-1 animate-fade-in">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* =========================================================
              CARD 2: BULK INQUIRY & BUSINESS SOLUTIONS (RIGHT CARD)
          ========================================================= */}
          <div className="bg-gradient-to-br from-[#18080b] via-[#120507] to-[#0f0305] rounded-3xl p-6 sm:p-8 2xl:p-12 border border-red-950/50 shadow-[0_12px_40px_rgba(0,0,0,0.6)] relative flex flex-col justify-between overflow-hidden">
            
            {/* Background Surgical Instruments Image with Gradient Overlay */}
            <div className="absolute top-0 right-0 w-full sm:w-[68%] h-full pointer-events-none opacity-45 sm:opacity-55 mix-blend-luminosity">
              <Image
                src={data.inquiry_image || '/images/bulk-inquiry-surgical.jpg'}
                alt="Bulk Inquiry Surgical Instruments"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-right"
              />
              {/* Dark Fade mask on left so text stays perfectly legible */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#18080b] via-[#18080b]/90 to-transparent" />
            </div>

            <div className="relative z-10">
              {/* Header Row: Title & Top Right Tag */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-[2px] bg-[#96161B] rounded-full inline-block" />
                    <span className="text-[11px] sm:text-xs 2xl:text-sm font-bold text-slate-300 tracking-widest uppercase">
                      {data.inquiry_subtitle}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                    <span className="text-white">{data.inquiry_title_p1} </span>
                    <span className="text-[#96161B]">{data.inquiry_title_p2}</span>
                  </h2>
                </div>

                {/* Top Right Tag (Matching Screenshot 1) */}
                <div className="text-right shrink-0">
                  <div className="text-[9px] 2xl:text-[11px] font-black text-slate-400 uppercase tracking-widest leading-tight">
                    <div>PRECISION</div>
                    <div>SAFETY</div>
                    <div>RELIABILITY</div>
                    <div>WORLDWIDE</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm 2xl:text-base text-slate-300 mb-8 max-w-sm leading-relaxed">
                {data.inquiry_description}
              </p>

              {/* Contact Us Today Button */}
              <div className="mb-12">
                <Link
                  href={data.inquiry_button_url || '/contact'}
                  className="inline-flex items-center gap-2.5 bg-[#96161B] hover:bg-[#7e1216] text-white font-black text-xs sm:text-sm 2xl:text-base px-7 sm:px-8 py-3.5 rounded-full shadow-lg shadow-red-950/60 hover:shadow-red-900/80 active:scale-95 transition-all cursor-pointer ring-2 ring-red-900/40"
                >
                  <span>{data.inquiry_button_text}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* 3 Bottom Badges (B2B Pricing, Trusted Supply Partner, Global Shipping) */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-red-950/40 mb-8">
                {data.inquiry_badges.map((badge, idx) => (
                  <div key={badge.id || idx} className="flex flex-col sm:flex-row items-center sm:items-center gap-2 text-center sm:text-left">
                    <div className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-full bg-[#200b0f] border border-red-950/80 flex items-center justify-center shrink-0 shadow-inner">
                      {renderBadgeIcon(badge.icon_name)}
                    </div>
                    <div className="text-[10px] 2xl:text-xs font-black text-slate-300 uppercase tracking-wider leading-tight">
                      {badge.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Tagline & Quote (Matching Screenshot 1) */}
            <div className="relative z-10 pt-4 border-t border-red-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] 2xl:text-xs text-slate-400 font-semibold uppercase tracking-wider">
              <div>— {data.bottom_quote}</div>
              <div className="text-right text-slate-500">
                {data.bottom_tag}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
