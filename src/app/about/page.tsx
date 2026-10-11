'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import PublicHeader from '@/src/components/public/PublicHeader'
import PublicFooter from '@/src/components/public/PublicFooter'
import QualityTrustSection from '@/src/components/public/QualityTrustSection'
import PublicSearchModal from '@/src/components/public/PublicSearchModal'
import CartQuoteModal from '@/src/components/public/CartQuoteModal'
import { ProductItem } from '@/src/types/product'
import { ShieldCheck, Award, HeartPulse, Building2, CheckCircle2 } from 'lucide-react'

export default function AboutPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isQuoteOpen, setIsQuoteOpen] = useState(false)
  const [quoteItems, setQuoteItems] = useState<ProductItem[]>([])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PublicHeader
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenQuote={() => setIsQuoteOpen(true)}
        quoteCount={quoteItems.length}
      />

      <div className="bg-[#18355E] text-white py-14 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#B92025] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>About ALPHA Medical Supplies</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Empowering Modern Healthcare Facilities</h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            ALPHA Medical Supplies Store is a premier provider of certified medical equipment, Japanese & German steel surgical instruments, ICU life support devices, and electric hospital furniture.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 space-y-16 flex-1 w-full">
        {/* STORY SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18355E]">
              Precision Engineering & Certified Quality Standards
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Established to bridge the gap in hospital procurement, ALPHA Medical Supplies delivers ISO 13485:2016 and CE certified medical solutions. We partner with leading healthcare institutions across the country to equip ICUs, operating theaters, clinical diagnostic laboratories, and emergency care units.
            </p>
            <div className="space-y-2 pt-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% Quality Inspected before dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Japanese & German Surgical Grade Stainless Steel</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>24/7 Biomedical Support & Warranty Coverage</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
              <Image
                src="/images/extracted/image_6.png"
                alt="Alpha Quality Control"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <QualityTrustSection />

      <PublicFooter />

      <PublicSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartQuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        quoteItems={quoteItems}
        onRemoveItem={(id) => setQuoteItems((prev) => prev.filter((i) => i.id !== id))}
        onClearAll={() => setQuoteItems([])}
      />
    </div>
  )
}
