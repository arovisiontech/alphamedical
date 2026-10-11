import React from 'react'
import { ShieldCheck, Award, CheckCircle2, HeartPulse } from 'lucide-react'

export default function PartnerCalloutBanner() {
  return (
    <section className="bg-gradient-to-r from-[#B92025] via-[#A6101C] to-[#800000] text-white py-6 px-4 sm:px-8 border-y-4 border-[#7D1514] shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* TEXT BANNER */}
        <div className="flex items-center gap-3 text-center lg:text-left">
          <div className="w-12 h-12 rounded-full bg-white text-[#B92025] flex items-center justify-center font-bold shrink-0 shadow-md">
            <HeartPulse className="w-6 h-6 text-[#B92025]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wider">
              YOUR PARTNER IN HEALTHCARE.
            </h3>
            <p className="text-xs text-red-100 font-bold tracking-widest uppercase">
              QUALITY. RELIABILITY. EVERY TIME.
            </p>
          </div>
        </div>

        {/* CERTIFICATION LOGOS / BADGES */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-extrabold">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>FDA APPROVED</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-300" />
            <span>ISO 13485 CERTIFIED</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>USA BASED COMPANY</span>
          </div>
        </div>
      </div>
    </section>
  )
}
