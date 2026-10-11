import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck, Globe, Layers, Headphones, ArrowRight } from 'lucide-react'

export default function EntSurgeryBanner() {
  return (
    <section className="py-12 bg-gradient-to-r from-slate-100 via-white to-slate-100 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-bold text-[#B92025] uppercase tracking-wider">
              Home • Shop • ENT Surgery Instruments
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              ENT Surgery Instruments
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm max-w-lg font-medium leading-relaxed">
              Precision instruments for advanced ENT procedures engineered for better surgical outcomes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-slate-200 text-xs font-bold text-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B92025]" />
                <span>Premium Quality (AISI 420 Steel)</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#B92025]" />
                <span>Worldwide Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#B92025]" />
                <span>Wide Range (1000+ Tools)</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-[#B92025]" />
                <span>Expert Support</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white p-4">
              <Image
                src="/images/extracted/image_2.png"
                alt="ENT Surgery Instruments Tray"
                fill
                className="object-contain p-2"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
