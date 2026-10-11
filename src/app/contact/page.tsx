'use client'

import React, { useState, use } from 'react'
import PublicHeader from '@/src/components/public/PublicHeader'
import PublicFooter from '@/src/components/public/PublicFooter'
import ContactForm from '@/src/components/public/ContactForm'
import PublicSearchModal from '@/src/components/public/PublicSearchModal'
import CartQuoteModal from '@/src/components/public/CartQuoteModal'
import { ProductItem } from '@/src/types/product'
import { Phone, Mail, MapPin, ShieldCheck, Clock } from 'lucide-react'

export default function ContactPage({ searchParams }: { searchParams?: Promise<{ product?: string; items?: string }> }) {
  const resolvedParams = searchParams ? use(searchParams) : {}
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isQuoteOpen, setIsQuoteOpen] = useState(false)
  const [quoteItems, setQuoteItems] = useState<ProductItem[]>([])

  const initialSubject = resolvedParams?.product
    ? `Inquiry for ${resolvedParams.product}`
    : resolvedParams?.items
    ? `Quotation Request for ${resolvedParams.items}`
    : ''

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PublicHeader
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenQuote={() => setIsQuoteOpen(true)}
        quoteCount={quoteItems.length}
      />

      <div className="bg-[#18355E] text-white py-12 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#B92025] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>24/7 Procurement Desk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Contact & Quotation Desk</h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Get official pricing, tech specs, and hospital bulk quotes directly from our sales engineers.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 flex-1 w-full space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-lg text-[#18355E]">Contact Details</h3>
              <div className="space-y-4 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-[#B92025] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Headquarters</div>
                    <div className="text-slate-500">Alpha Medical Complex, Healthcare Zone, Lahore, Pakistan</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-[#B92025] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Phone / WhatsApp</div>
                    <div className="text-slate-500">+92 300 1234567 / +92 42 3556677</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-[#B92025] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Email Address</div>
                    <div className="text-slate-500">info@alphamedical.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-[#B92025] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Operating Hours</div>
                    <div className="text-slate-500">Mon - Sat: 9:00 AM - 7:00 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ContactForm initialSubject={initialSubject} />
          </div>
        </div>
      </div>

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
